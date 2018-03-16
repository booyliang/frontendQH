<template>
	<div class="shop">
		<y-nav :title="$R('shop')" :showSearch="true" :menuData="['refresh', 'copy-url', 'index']">
		</y-nav>
		<y-tab-bar v-model="tabId" :tabOption="tabOption"></y-tab-bar>
		<y-flow-list :request="flowRequest" :item="require('./flow-item-shop')"></y-flow-list>
		
	</div>
</template>
<script>
import { YNav } from '@/components/nav'
import YFlowList from '@/components/flow-list'
import YFlowItemShop from './flow-item-shop'
import YTabBar from '@/components/tab';
export default {
	components: {
		YNav,
		YFlowItemShop,
		YTabBar
	},
	data() {
		return {
			tabId: this.$route.params.tabId || 1,
			tabOption: []
		}
	},
	created() {
		this.getShopList();
	},
	methods: {
		getShopList() {
			this.$http.get('/services/app/v1/shopclassify/list').then((res) => {
				if (res.data.code === '200') {
					let _res = res.data.data;
					for (let item of _res) {
						this.tabOption.push({id: item.id, text: item.className});
					}
					this.tabId = this.tabOption[0].id;
				}
			})
		}
	},
	computed: {
		flowRequest() {
			return {
				url: `/services/app/v1/shop/list/${this.tabId}`,
				params: {
					pageNo: 1,
					pageSize: 20
				}
			}
		}
	}
}
</script>