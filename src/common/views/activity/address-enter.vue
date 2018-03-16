<template>
	<div class="activity-address-wrap">
		<y-nav :title="$R('activity-address')">
			<span slot="nav-right" @click="select"> {{$R('complete')}} </span>
		</y-nav>
	
		<y-item :title="areaName" @click.native="open"></y-item>
		<y-input type="textarea" v-model="address" :placeholder="$R('enter-address') + '...'" :maxlength="50"></y-input>
	
		<y-picker v-if="provinces.length>0 && citys.length>0" v-model="cityValue" :selects="citySelects" @changed="changed" @input="input" ref="picker"></y-picker>
	</div>
</template>
<script>
import YItem from '@/components/item'
import Picker from '@/components/picker';
import cityData from '@/js/citydata'
import Toast from '@/components/toast'

export default {
	components: {
		YItem, Toast,
		[Picker.name]: Picker
	},
	data() {
		return {
			province: '',
			city: '',
			address: '',

			cityData: cityData,
			provinces: [],
			citys: [],
			selectValue: {
				p: '',
				c: ''
			},
			cityValue: {
				p: '',
				c: ''
			},
			cityOptions: {
				trigger: '#trigger'
			},
		}
	},
	created() {
		this.initData();
		let _vm = this.$localStore.get('vm');
		if (_vm) {
			let _arr = _vm.address.split(',');
			this.cityValue.p = _arr[0];
			this.cityValue.c = _arr[1];
			this.address = _arr[2];
		}
	},
	watch: {
		selectValue(newVal, oldVal) {
			if (!oldVal.p) return false;
			this.$nextTick(() => {
				if (newVal.c) this.cityValue.c = newVal.c;
			})
		}
	},

	computed: {
		areaName() {
			if (this.cityValue.p) {
				this.province = this.cityValue.p;
				this.city = this.cityValue.c;
				return this.cityValue.p + '，' + this.cityValue.c;
			} else {
				return this.$R('p-city');
			}
		},
		citySelects() {
			let arr = [
				{
					name: 'p',
					options: this.provinces
				},
				{
					name: 'c',
					options: this.citys
				}]
			return arr;
		},
	},
	methods: {
		initData() {
			this.provinces = [];
			for (let item of this.cityData)
				this.provinces.push(item.text);

			this.citys = this.getCityList(this.provinces[0]);
		},
		open() {
			this.$refs.picker.open();
		},
		input(data) {
			if (!data.p) {
				this.cityValue = {
					p: '',
					c: ''
				}
			}
		},
		getCityList(key) {
			let arr = [];
			for (let item of this.cityData) {
				if (item.text === key) {
					for (let subItem of item.children)
						arr.push(subItem.text);
				}
			}
			return arr;
		},

		changed(newValue) {
			// console.log('changed', newValue);
			this.selectValue = newValue;

			if (!newValue.p) {
				this.initData();
				return false;
			}
			this.citys = this.getCityList(newValue.p);
		},
		select() {
			if (this.areaName === this.$R('p-city')) {
				Toast(this.$R('city-address'));
				return false;
			}
			if (!this.address) {
				Toast(this.$R('enter-address'));
				return false;
			}
			// alert(this.province + ',' + this.city + ',' + this.address);
			this.$localStore.set('address', this.province + ',' + this.city + ',' + this.address);
			this.$router.back();
		}
	}
}
</script>
<style>
@import '#css/var.css';
.activity-address-wrap {
	& #navigator {
		& .nav-right {
			color: var(--theme-color);
		}
	}
	& .y-textarea {
		margin-top: .2rem;
	}
	& .text-length-info {
		display: none;
	}
}
</style>
