<template>
	<div class="product_list">
		<!--顶部导航 S-->
		<y-nav title="闲置" :show-search="true" :menuData="menuData"></y-nav>
		<!--顶部导航 E-->
		<!--列表 S-->
		<y-tab-bar v-model="tabId" :tabOption="productData" textField="classifyName" v-if="loaded"></y-tab-bar>
		<y-flow-list :item="item" :request='productRequese'></y-flow-list>
		<!--列表 E-->
	
		<!--发布 S-->
		<router-link to="/product/edit" class="publish-button"></router-link>
		<!--发布 E-->
	</div>
</template>
<script>
import YFlowItemProduct from './components/flow-item-product';
import YList from '@/components/list'
import YItem from '@/components/item'
export default {
	components: {
		[YFlowItemProduct.name]: YFlowItemProduct,
		YItem,
	},
	data() {
		return {
			loaded: false,
			item: YFlowItemProduct,
			title: '',
			menuData: ['index', 'refresh'],
			tabId: this.$route.params.tabId || '',
			productData: [
				{
					classifyName: "全部",
					id: ""
				}],
		}
	},
	computed: {
		productRequese() {
			return {
				method: 'GET',
				// url: '/services/app/v1/goods/context/list',
				url: this.$utils.getModule('0100').apiUrl,
				params: {
					classifyItemId: '' || this.tabId,
					orderType: 1
				}
			}
		}
	},
	created() {
		this.$http.get("/services/app/v1/goods/classify/list").then(res => {
			if (res.data.code === "200" && res.data.data) {
				this.productData = this.productData.concat(res.data.data);
				this.loaded = true;
			}
		})
	}
}
</script>
<style>
@import "#/css/var.css";
/*商品 S*/
.flow_item-product {
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
			font-size: .2rem;
			text-align: center;
			color: #fff;
			background: color(#000 alpha(0.5));
		}
	}
}

.flow_item-product--right {

	& .flow_item-class {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	& .flow_item-classfiy {
		font-size: .26rem;
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
		font-size: .26rem;
		@apply --text-cut;
	}

	& .flow_item-price {
		margin-top: 0.16rem;
		line-height: 1;
		color: #ff5a00;
		font-size: .2rem;
		& span {
			font-size: .36rem;
		}
	}
}

.produce_list .item-wrap>a {
	width: 100%;
}
</style>
