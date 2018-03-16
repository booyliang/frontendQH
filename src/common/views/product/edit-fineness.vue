<template>
	<div class="product-choose">
		<y-nav :title="$R( 'choose-fineness')"></y-nav>
		<y-check-group :data="foodList" textField="label" type="radio" ref="foodList" @clickItem="handlefoodClick"></y-check-group>
	</div>
</template>
<script>
import { YNav } from '@/components/nav';
import YCheckItem from '@/components/check-group/check-item'
import YCheckGroup from '@/components/check-group/check-group'
export default {
	components: {
		YNav, YCheckItem, YCheckGroup
	},
	data() {
		return {
			test: '',
			vm: '',
			type: '1',
			foodId: null,
			foodList: []
		}
	},
	methods: {
		handlefoodClick(item) {
			this.vm.damageStatus = item.id;
			this.vm.damageStatustext = item.label;
		}
	},
	mounted() {
		this.vm = this.$localStore.get('productMsg');
		let arr = [
			{ label: this.$R('product-fineness1'), id: 1 },
			{ label: this.$R('product-fineness2'), id: 2 },
			{ label: this.$R('product-fineness3'), id: 3 },
			{ label: this.$R('product-fineness4'), id: 4 },
			{ label: this.$R('product-fineness5'), id: 5 }
		]
		for (let item of arr) {
			if (this.vm.damageStatus === item.id) {
				item.checked = true
			}
		}
		this.foodList = arr
	}
}
</script>
<style>
.product-choose .check_item {
	padding: 0 0.3rem;
}
</style>