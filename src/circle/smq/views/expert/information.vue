<template>
	<div class="infor_list">
		<!--顶部导航 S-->
		<y-nav title="资讯" :show-search="true" :menuData="menuData"></y-nav>
		<!--顶部导航 E-->
		<y-tab-bar v-model="tabId" :tabOption="unuseData" textField="categoryName" v-if="loaded"></y-tab-bar>
		<y-flow-list :item="item" :request='unuseRequese'></y-flow-list>
	</div>
</template>
<script>
import YFlowItemInformation from '../components/flow-item-information';
import YList from '@/components/list'
import YItem from '@/components/item'
export default {
	components: {
		[YFlowItemInformation.name]: YFlowItemInformation,
		YItem,
	},
	data() {
		return {
			loaded: false,
			item: YFlowItemInformation,
			menuData: ['index'],
			tabId: this.$route.params.tabId || '',
			unuseData: [
				{
					categoryName: "全部",
					id: ''
				}],
		}
	},
	computed: {
		unuseRequese() {
			return {
				method: 'GET',
				url: '/services/app/v1/release/info/list',
				params: {
					classifyItemId: '' || this.tabId,
					classifyId: ''
				}
			}
		}
	},
	created() {
		this.$http.get(`/services/app/v1/classify/categoryAndItems/35`).then(res => {
			if (res.data.code === "200") {
				this.unuseData = this.unuseData.concat(res.data.data.categoryItems);
				this.loaded = true;
			}
		})
	}
}
</script>
<style>
@import "#/css/var.css";
</style>
