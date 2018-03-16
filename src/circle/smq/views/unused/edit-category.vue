<template>
	<div class="unused-choose">
		<y-nav :title="$R('choose-category')"></y-nav>
		<y-check-group :data="columnList" textField="categoryName" type="radio" @clickItem="handleClick"></y-check-group>
	</div>
</template>
<script>
import { YNav } from '@/components/nav';
import YCheckGroup from '@/components/check-group'
export default {
	components: {
		YNav, YCheckGroup
	},
	data() {
		return {
			vm: '',
			columnList: []
		}
	},
	methods: {
		handleClick(item) {
			this.vm.classifyItemId = item.id;
			this.vm.classifyItemName = item.categoryName;
		},
	},
	mounted() {
		this.vm = this.$localStore.get('petDeta');
		let arr = [
			{ categoryName: this.$R('unuse-category1'), id: 1 },
			{ categoryName: this.$R('unuse-category2'), id: 2 },
			{ categoryName: this.$R('unuse-category3'), id: 3 },
			{ categoryName: this.$R('unuse-category4'), id: 4 },
			{ categoryName: this.$R('unuse-category5'), id: 5 },
			{ categoryName: this.$R('unuse-category6'), id: 6 }
		]
		for (let item of arr) {
			if (this.vm.classifyItemId === item.id) {
				item.checked = true
			}
		}
		this.columnList = arr
	}
}
</script>