<template>
	<div class="set">
		<y-nav title="我的" :showLeftArrow="false"></y-nav>
		<y-list>
			<y-item :title="fields['userImg'].title" clickable @click="headClick">
				<span slot='foot' :style="photoStyle" class="set_item--photo"></span>
			</y-item>
			<y-item :title="fields['nickName'].title" :to="fields['nickName'].path" v-model="userInfo.nickName"></y-item>
			<y-item :title="fields['gender'].title" :to="fields['gender'].path" v-model="sex"></y-item>
			<y-item :title="fields['area'].title" clickable id="Citytrigger" v-model="areaName"></y-item>
			<y-item :title="fields['intro'].title" :to="fields['intro'].path" clickable v-model="userInfo.userDesc"></y-item>
		</y-list>
		<y-picker v-if="province.length>0 && city.length>0" v-model="cityValue" :selects="citySelects" :options="cityOptions" @changed="changed"></y-picker>
	</div>
</template>
<script>
import YList from '@/components/list'
import YPicker from '@/components/picker'
import CityData from '@/js/citydata'
export default {
	components: {
		YList,
		YPicker
	},
	data() {
		return {
			fields: {
				userImg: {
					title: '头像',
				},
				nickName: {
					title: '昵称',
					path: '/mine/set-name'
				},
				gender: {
					title: '性别',
					path: '/mine/set-gender'
				},
				area: {
					title: '地区'
				},
				intro: {
					title: '个人简介',
					path: '/mine/set-intro'
				} 
			},
			userInfo: {
				userImg: '',
				nickName: '',
				sex: '',
				addr: '',
				userDesc: ''
			},
			// 选择城市
			cityData: [],
			province: [],
			city: [],
			selectValue: {
				p: '',
				c: ''
			},	
			cityValue: {
				p: '',
				c: ''
			},
			cityOptions: {
				trigger: '#Citytrigger'
			}
		}
	},
	created() {
		this.cityData = CityData;
		for (let item of this.cityData) {
			this.province.push(item.text);
		}
		this.city = this.getCityList(this.province[0]);
		let request = {
			method: 'GET',
			url: '/services/app/v1/user/info/' + this.$env.userId
		}
		this.$localStore.getOrSet('userData', request, this.userInfo).then(data => {
			console.log('data', data);
			this.userInfo = data.data;
			if (this.userInfo.addr) {
				let arr = this.userInfo.addr.split(' ');
				this.cityValue = {
					p: arr[0],
					c: arr[1]
				};
				this.city = this.getCityList(arr[0]);
			}
		})
	},
	computed: {
		sex() {
			if (this.userInfo.sex === '1') {
				return '男'
			} else if (this.userInfo.sex === '0') {
				return '女'
			}
		},
		areaName() {
			if (this.cityValue.p) {
				return this.cityValue.p + ' ' + this.cityValue.c;
			} else {
				// return this.userInfo.addr;
				return ''
			}
		},
		citySelects() {
			let arr = [
				{
					name: 'p',
					options: this.province
				},
				{
					name: 'c',
					options: this.city
				}]
			return arr;
		},
		photoStyle() {
			return this.userInfo.userImg ? {
				backgroundImage: `url(${this.userInfo.userImg})`
			} : null;
		}
	},
	watch: {
		cityValue(newValue, oldValue) {
			if (!oldValue.p) return false;
			this.$nextTick(() => {
				if (this.selectValue.c) {
					this.cityValue.c = this.selectValue.c;
				}
			})
		},
		areaName(newValue) {
			if (newValue === this.userInfo.addr) {
				return;
			}
			let custInfo = {
				custInfo: {
					custId: this.$env.custId,
					custLocation: newValue
				}
			}
			this.$http.put('/services/app/v1/user/single', custInfo).then(response => {
				if (response.data.code === '200') {
					this.userInfo.addr = newValue;
				} else {
					this.$toast(response.data.msg)
				}
			})
		}
	},
	methods: {
		headClick() {
			this.$yryz.uploadPics({ picNum: 1})
			.then(data => {
				let custInfo = {
					custInfo: {
						custId: this.$env.custId,
						custImg: data.picUrls[0]
					}
				}
				this.$http.put('/services/app/v1/user/single', custInfo).then(response => {
					if (response.data.code === '200') {
						this.userInfo.userImg = data.picUrls[0];
					} else {
						this.$toast(response.data.msg)
					}
				})
			})
		},
		// 城市选择
		getCityList(key) {
			let arr = [];
			for (let item of this.cityData) {
				if (item.text === key) {
					for (let subItem of item.children) {
						arr.push(subItem.text);
					}
				}
			}
			return arr;
		},
		changed(newValue) {
			this.selectValue = newValue;
			if (!newValue.p) {
				this.autData();
				return false;
			}
			this.city = this.getCityList(newValue.p);
			
		},
		autData() {
			this.provinces = [];
			for (let item of this.cityData) {
				this.provinces.push(item.text);
			}
			this.citys = this.getCityList(this.provinces[0]);
		}
	}
}
</script>
<style>
.set{
    & .set_item--photo {
       width: .9rem;
       height: .9rem;
       background: url(../../assets/default_photo@2x.png) no-repeat center;
	   background-size: cover;
	   border-radius: 50%;
    }
    & .item-value{
    	display: -webkit-box;
    	-webkit-line-clamp: 1;
    	-webkit-box-orient: vertical;
    	padding-left: 0.2rem;
    	overflow: hidden;
	    text-overflow: ellipsis;
	}
}
</style>