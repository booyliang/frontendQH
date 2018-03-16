<template>
	<div class="coterid-activity-address-wrap">
		<y-nav :title="$R('activity-address')">
			<span slot="nav-right">
				<y-button type="text" @click.native="select">{{$R('complete')}}</y-button>
			</span>
		</y-nav>

		<y-item :title="areaName" id="trigger" clickable></y-item>
		<y-input type="textarea" v-model="address" :placeholder="$R('enter-address') + '...'" :maxlength="30"></y-input>

		<y-picker v-if="hasVal" v-model="cityValue" :selects="citySelects" :options="options" @changed="changed" ref="picker"></y-picker>
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
			vm: null,
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
			options: {
				trigger: '#trigger'
			},
		}
	},
	created() {
		this.initData();
		this.vm = this.$localStore.get('vm');
		if (this.vm && this.vm.address) {
			let _arr = this.vm.address.split(',');
			this.cityValue.p = _arr[0];
			this.cityValue.c = _arr[1];
			this.address = _arr[2];
		}
	},
	watch: {
		selectValue(newVal, oldVal) {
			if (!oldVal.p) return false;
			if (!newVal.p) this.cityValue = { p: '', c: '' }
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
		hasVal() {
			return this.provinces.length > 0 && this.citys.length > 0
		}
	},
	methods: {
		initData() {
			this.provinces = [];
			this.cityData.map(item => this.provinces.push(item.text));
			this.citys = this.getCityList(this.provinces[0]);
		},
		getCityList(key) {
			let arr = [];
			let childs = this.cityData.find(item => item.text === key);
			childs.children.map(item => arr.push(item.text));
			return arr;
		},
		changed(data) {
			// console.log('changed', JSON.stringify(data));
			this.selectValue = data;
			if (!data.p) {
				this.initData();
				return false;
			}
			this.citys = this.getCityList(data.p);
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
			this.vm.address = this.province + ',' + this.city + ',' + this.address;
			this.$localStore.set('vm', this.vm);
			this.$router.back();
		}
	}
}
</script>
<style>
@import '#css/var.css';
.coterid-activity-address-wrap {
	& #navigator {
		& .nav-right {
			color: var(--theme-color);
		}
	}
	& .item {
		@apply --border-top;
		@apply --border-bottom;
		margin: .2rem 0;

		& .item-wrap {
			border-top: none;
		}
	}
	& .y-textarea {
		@apply --border-top;
		@apply --border-bottom;
	}
	& .text-length-info {
		padding-bottom: .15rem;
	}
}
</style>
