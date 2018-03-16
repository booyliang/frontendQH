<template>
	<div class="unuse_list">
		<!--顶部导航 S-->
		<y-nav :title="$R('unuse-title')" :show-search="true" :menuData="menuData"></y-nav>
		<!--顶部导航 E-->
		<!--闲置物品列表 S-->
		<y-tab-bar v-model="tabId" :tabOption="unuseData" textField="classifyItemName"></y-tab-bar>
		<y-flow-list :item="item" :request='unuseRequese'></y-flow-list>
		<!--闲置物品列表 E-->
	
		<!--发布闲置物品 S-->
		<router-link to="/unused/edit" class="publish-button"></router-link>
		<!--发布闲置物品 E-->
	</div>
</template>
<script>
import YFlowItemUnuse from '../components/flow-item-unuse';
import YList from '@/components/list'
import YItem from '@/components/item'
export default {
	components: {
		[YFlowItemUnuse.name]: YFlowItemUnuse,
		YItem,
	},
	data() {
		return {

			item: YFlowItemUnuse,
			menuData: ['index'],
			tabId: this.$route.params.tabId || 0,
			unuseData: [

				{
					classifyItemName: "全部",
					id: 0
				},
				{
					classifyItemName: "手机",
					id: 1
				},
				{
					classifyItemName: "电脑",
					id: 2
				},
				{
					classifyItemName: "影音",
					id: 3
				},
				{
					classifyItemName: "硬件外设",
					id: 4
				},
				{
					classifyItemName: "家电",
					id: 5
				},
				{
					classifyItemName: "其他",
					id: 6
				}],
		}
	},
	computed: {
		unuseRequese() {
			return {
				method: 'GET',
				url: '/services/app/v1/idlemarket/list',
				params: { classifyItemName: this.tabId === 0 ? '' : this.unuseData[this.tabId].classifyItemName }
			}
		}
	}
}
</script>
<style>
@import "#/css/var.css";










































/*闲置 S*/

.flow_item-unuse {
	display: flex;
	& .flow_item-img {
		width: 2rem;
		height: 1.62rem;
		position: relative;
		flex: 0 0 2rem;
		margin-right: 0.4rem;

		& img {
			width: 2rem;
			height: 1.62rem;
		}

		& span {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			height: 0.4rem;
			line-height: 0.4rem;
			font-size: 10px;
			text-align: center;
			color: #fff;
			background: color(#000 alpha(0.5));
		}
	}
}

.flow_item-unuse--right {

	& .flow_item-class {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	& .flow_item-classfiy {
		font-size: 13px;
		color: var(--theme-color);
		background: #eef5ff;
		line-height: 16px;
		padding: 0 0.15rem;
		border-radius: 0.15rem;
		margin-right: 0.2rem;
		flex: 0 0 auto;
	}

	& .flow_item-location {
		color: var(--text-assist-color);
		font-size: 13px;
		@apply --text-cut;
	}

	& .flow_item-price {
		margin-top: 0.16rem;
		line-height: 1;
		color: #ff5a00;
		font-size: 10px;
		& span {
			font-size: 18px;
		}
	}
}

.unuse_list .item-wrap>a {
	width: 100%;
}
</style>
