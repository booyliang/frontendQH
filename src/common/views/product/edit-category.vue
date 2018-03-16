<template>
	<div class="product-choose">
		<y-nav :title="$R('choose-category')"></y-nav>
		<y-check-group :data="columnList" textField="classifyName" type="radio" @clickItem="handleClick"></y-check-group>
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
			this.vm.classifyItemName = item.classifyName;
		},
	},
	mounted() {
		this.vm = this.$localStore.get('productMsg');
		this.$http.get("/services/app/v1/goods/classify/list").then(res => {
			if (res.data.code === "200") {
				this.columnList = res.data.data;
				for (let item of this.columnList) {
					if (this.vm.classifyItemId === item.id) {
						item.checked = true
					}
				}

			}
		})
	}
}
</script>