<template>
	<div class="yryz_barrister">
		<y-nav :title="$R('lawyer-attestation')" :showSearch="true" :showMember="true" :beforeBack='beforeBack'>
			<span slot="nav-right">
				<y-button type="text" @click.native='submit'>{{$R('lawyer-publish')}}</y-button>
			</span>
		</y-nav>
		<!--基本信息-->
		<y-list>
			<y-item :title="$R('head-portrait')" :subtitle="$R('sub-headport-unchangeable')" clickable @click="headClick">
				<span slot='foot' :style="photoStyle" class="lsq-wrap_item--photo"></span>
			</y-item>
			<y-item :title="$R('attest-name')" v-model='vm.data.realName' clickable @click="NameClick"></y-item>
			<y-item :title="$R('attest-phone')" :to='PhoneLink' v-model='vm.data.cellPhone'></y-item>
			<y-item class='hhhh' :title="$R('attest-area')" clickable id='Citytrigger' v-model='areaName'></y-item>
	
			<y-item :title="$R('attest-certificate')" :subtitle="$R('sub-clear')" clickable @click="BarristerClick" class="lsq-wrap_item">
				<img v-if="vm.data.certificate" slot='foot' :src="vm.data.certificate" alt="" />
				<div v-else slot='foot' class="lsq-wrap_item--up">
					<span class="iconfont icon-plus-a"></span>{{$R('attest-certificate-pic')}}</div>
			</y-item>
			<y-item :title="$R('professional-field')" :to='FocusLink' v-model='vm.data.goodField'></y-item>
			<y-item :title="$R('professional-life')" clickable v-model='ageLimit' id="trigger" class="item-fake-select">
				<!-- <label slot="body" class="fake-select">
							<select v-model="vm.data.ageLimit">
								<option>1 年</option>
								<option>2 年</option>
								<option>4 年</option>
								<option>5 年</option>
								<option>6 年</option>
								<option>8 年</option>
								<option>9 年</option>
								<option>10年及以上</option>
							</select>
						</label> -->
			</y-item>
			<y-item class='hhhh' :title="$R('professional-office')" :to='OfficeLink' v-model='vm.data.office'></y-item>
	
			<y-item :title="$R('individual-resume')" :to='IntroLink' v-model='vm.data.personalProfile' class="personal-intro"></y-item>
			<y-item :title="$R('case-show')" :subtitle="$R('lawyer-optional')" :to='CaseLink' v-model='vm.data.caseShow'></y-item>
		</y-list>
	
		<div class="submit_button">
			<y-button block @click.native='preview'>{{$R('lawyer-preview')}}</y-button>
		</div>
	
		<y-picker v-model="value" :selects="selects" :options="options"></y-picker>
		<y-picker v-if="province.length>0 && city.length>0" v-model="cityValue" :selects="citySelects" :options="cityOptions" @changed="changed"></y-picker>
	</div>
</template>

<script>
import { YNav } from '@/components/nav'
import { YPublishButton, PublishMixin } from '@/components/content-publish'
import List from '@/components/list';
import Item from '@/components/item';
import Button from '@/components/button';
import Toast from '@/components/toast';
import Picker from '@/components/picker';
import Dialog from '@/components/dialog'
export default {
	components: {
		YNav,
		YPublishButton,
		[List.name]: List,
		[Item.name]: Item,
		[Button.name]: Button,
		[Picker.name]: Picker
	},
	mixins: [PublishMixin],
	data() {
		return {
			headImg: '',
			BarristerImg: '',
			NameLink: { name: 'LawyerName' }, 	// 姓名
			PhoneLink: { name: 'LawyerPhone' },	// 手机号
			CityLink: { name: 'LawyerCity' },	// 所在地
			FocusLink: { name: 'LawyerFocus' },	// 专业领域
			OfficeLink: { name: 'LawyerOffice' }, // 职业律所
			IntroLink: { name: 'LawyerIntro' },	// 个人简介
			CaseLink: { name: 'LawyerCase' },	// 案例展示
			vm: {
				data: {
					ageLimit: "",
					caseShow: "",
					cellPhone: "",
					certificate: "",
					goodField: "",
					location: "",
					office: "",
					personalProfile: "",
					portrait: "",
					realName: "",
					id: "",
					createUserId: this.$env.userId,
					moduleEnum: '10121'
				},
				someData: {}
			},
			listData: {
				ageLimit: "",
				caseShow: "",
				cellPhone: "",
				certificate: "",
				goodField: "",
				location: "",
				office: "",
				personalProfile: "",
				portrait: "",
				realName: "",
				id: "",
				createUserId: this.$env.userId,
				moduleEnum: '10121'
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
			},
			// 选择年限
			value: {
				name: ''
			},
			selects: [
				{
					name: 'name',
					options: [
						this.$R('year', 1),
						this.$R('year', 2),
						this.$R('year', 3),
						this.$R('year', 4),
						this.$R('year', 5),
						this.$R('year', 6),
						this.$R('year', 7),
						this.$R('year', 8),
						this.$R('year', 9),
						this.$R('year-plus', 10)
					]
				}
			],
			options: {
				trigger: '#trigger'
			}
		}
	},
	created() {
		this.initData();
		// 地区列表
		this.$http.get("/services/app/v1/lawyer/authentication/classify/forcefields/1")
			.then(res => {
				if (res.data.code === '200') {
					this.cityData = res.data.data;
					for (let item of this.cityData) {
						this.province.push(item.classification);
					}
					this.city = this.getCityList(this.province[0]);
				}
			})
	},
	watch: {
		'cityValue'(val) {
			this.$nextTick(() => {
				if (this.selectValue.c) {
					this.cityValue.c = this.selectValue.c;
				}
			})
		}
	},
	computed: {
		areaName() {
			if (this.cityValue.p) {
				this.vm.data.location = this.cityValue.p + ' ' + this.cityValue.c;
				return this.cityValue.p + ' ' + this.cityValue.c;
			} else {
				return '';
			}
		},
		ageLimit() {
			// console.log(this.value.name)
			if (this.value.name) {
				this.vm.data.ageLimit = this.value.name;
				return this.value.name
			} else {
				return '';
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
			return this.vm.data.portrait ? {
				backgroundImage: `url(${this.vm.data.portrait})`
			} : null;
		}
	},
	methods: {
		// 自定义后退返回
		beforeBack() {
			this.$localStore.remove('petDeta');
			this.$router.replace('/lawyer/index');
		},
		initcity() {
			this.provinces = [];
			for (let item of this.cityData)
				this.provinces.push(item.text);

			this.citys = this.getCityList(this.provinces[0]);
		},
		// 城市选择
		getCityList(key) {
			let arr = [];
			for (let item of this.cityData) {
				if (item.classification === key) {
					for (let subItem of item.child) {
						arr.push(subItem.designation);
					}
				}
			}
			return arr;
		},

		changed(newValue) {
			if (!newValue.p) {
				this.initcity();
				return false;
			}
			this.city = this.getCityList(newValue.p);
			this.selectValue = newValue;
		},

		// 调用原生上传头像
		headClick() {
			if (this.$route.params.id !== "0") {
				Toast(this.$R('headport-unchangeable'))
				return false;
			} else {
				this.$yryz.uploadPics({ picNum: 1 })
					.then((data) => {
						this.vm.data.portrait = data.picUrls[0];
					})
			}

		},
		// 姓名设置
		NameClick() {
			if (this.$route.params.id !== "0") {
				Toast(this.$R('name-unchangeable'))
				return false;
			} else {
				this.$router.push({ name: 'LawyerName' });
			}
		},
		// 上传律师证
		BarristerClick() {
			this.$yryz.uploadPics({ picNum: 1 })
				.then((data) => {
					this.vm.data.certificate = data.picUrls[0];
				})
		},
		// 通过id判断用户是首次认证还是再次编辑
		initData() {
			// alert(this.$route.params.id);
			// console.log(this.$route.params.id !== "0")
			let request = this.$route.params.id === "0" ? null : { method: 'GET', url: '/services/app/v1/lawyer/authentication/singleInfo/' + this.$env.userId };
			this.$localStore.getOrSet('petDeta', request, this.vm).then(data => {
				this.vm = data;
				// 城市加载显示
				if (this.vm.data.location) {
					let arr = this.vm.data.location.split(' ');
					this.cityValue = {
						p: arr[0],
						c: arr[1]
					};
					this.city = this.getCityList(arr[0]);
				}
				// 年限显示
				this.value = {
					name: this.vm.data.ageLimit
				}
			})
		},
		// 提交认证
		submit() {
			this.vm.data.location = this.areaName;
			this.vm.data.ageLimit = this.value.name;

			var postData = {
				...this.vm.data
			}
			const listObj = this.listData;
			const vmObj = this.vm.data;
			listObj.ageLimit = vmObj.ageLimit,
				listObj.caseShow = vmObj.caseShow,
				listObj.cellPhone = vmObj.cellPhone,
				listObj.certificate = vmObj.certificate,
				listObj.goodField = vmObj.goodField,
				listObj.location = vmObj.location,
				listObj.office = vmObj.office,
				listObj.personalProfile = vmObj.personalProfile,
				listObj.portrait = vmObj.portrait,
				listObj.realName = vmObj.realName,
				listObj.id = vmObj.id,
				listObj.moduleEnum = vmObj.moduleEnum

			var putData = {
				...this.listData
			}

			console.log(putData);
			if (!postData.portrait) {
				Toast(this.$R('head-portrait') + this.$R('not-empty'))
				return false;
			} else if (!postData.realName) {
				Toast(this.$R('attest-name') + this.$R('not-empty'))
				return false;
			} else if (!postData.cellPhone) {
				Toast(this.$R('attest-phone') + this.$R('not-empty'))
				return false;
			} else if (!postData.location) {
				Toast(this.$R('attest-area') + this.$R('not-empty'))
				return false;
			} else if (!postData.certificate) {
				Toast(this.$R('attest-certificate') + this.$R('not-empty'))
				return false;
			} else if (!postData.goodField) {
				Toast(this.$R('professional-field') + this.$R('not-empty'))
				return false;
			} else if (!postData.ageLimit) {
				Toast(this.$R('professional-life') + this.$R('not-empty'))
				return false;
			} else if (!postData.office) {
				Toast(this.$R('professional-office') + this.$R('not-empty'))
				return false;
			} else if (!postData.personalProfile) {
				Toast(this.$R('individual-resume') + this.$R('not-empty'))
				return false;
			}

			Dialog.confirm({
				title: this.$R('submit-approve'),
				message: this.$R('submit-confirm')
			},
				{
					okText: this.$R('yes'),
					cancleText: this.$R('look-again')
				}).then(() => {
					let methods = postData.id ? 'put' : 'post';
					let Murl = postData.id ? '/services/app/v1/lawyer/authentication/editor' : '/services/app/v1/lawyer/authentication/accretion'
					this.$http[methods](Murl, putData).then((res) => {
						let message = postData.id ? this.$R('modified-authentication') : this.$R('finish-authentication');
						if (res.data.code === "200") {
							Toast(message);
							this.$router.replace('/lawyer/detail/' + this.$env.userId);
							this.$localStore.remove('petDeta');
						} else {
							Toast('认证失败！');
						}
					}).catch(err => {
						Toast(err)
					});
				}).catch(() => {
					return false;
				})
			return false;
		},
		// 预览
		preview() {
			this.$router.push({ name: 'LawyerPreview' })
		}
	}
}
</script>

<style>
@import '#/css/var.css';
.yryz_barrister {
	& .list {
		& .lsq-wrap_item--photo {
			width: .9rem;
			height: .9rem;
			background: url(../../../assets/default_photo@2x.png) no-repeat center;
			background-size: cover;
			border-radius: 50%;
		}
		& .personal-intro .item-wrap {
			border: none;
		}
	}
}
</style>