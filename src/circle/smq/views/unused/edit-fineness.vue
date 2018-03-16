<template>
	<div class="unused-choose">
		<y-nav title="选择成色"></y-nav>
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
		this.vm = this.$localStore.get('petDeta');
		let arr = [
			{ label: this.$R('unuse-fineness1'), id: 1 },
			{ label: this.$R('unuse-fineness2'), id: 2 },
			{ label: this.$R('unuse-fineness3'), id: 3 },
			{ label: this.$R('unuse-fineness4'), id: 4 },
			{ label: this.$R('unuse-fineness5'), id: 5 }
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
	.unused-choose .check_item {
		padding: 0 0.3rem;
	}
</style>