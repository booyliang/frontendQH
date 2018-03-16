<template>
	<div class="goods_detail">
		<y-nav title="商品详情"></y-nav>
		<y-panel :title="detailData.goodsBrand" colorful class="goods_detail-panel">
			<y-good-item :data="detailData"></y-good-item>
		</y-panel>
	</div>
</template>
<script>
import YGoodItem from '../../components/good-item'
export default{
	components: {
		YGoodItem
	},
	data() {
		return {
			detailData: {}
		};
	},
	created() {
		this.$http.get('/services/app/v1/goods/getById/' + this.$route.params.productId).then(response => {
			if (response.data.code === '200') {
				let detailData = response.data.data;
				detailData.productName = detailData.goodsName;
				detailData.quantity = this.$route.query.quantity;
				detailData.price = detailData.goodsPrice;
				detailData.subtotal = detailData.price * this.$route.query.quantity;
				this.detailData = detailData;
			}
		})
	}
}
</script>
<style>
@import '#/css/var.css';
	.goods_detail{
		& .goods_detail-panel{
			margin-top:  0.2rem;
			& .panel-head {
				padding: 0;
			}
			& .panel-title {
				padding-left: 0.2rem;
				line-height: 33px;
				border-left: 0.1rem solid var(--theme-color);
				color: var(--text-assist-color);
				font-size: 14px;
			}
			& .panel-title::before {
				display: none;
			}
			& .panel-body {
				padding: 0;
			}
			& .item-value {
				font-size: var(--default-font-size);
				color: var(--text-assist-color);
			}
		}
	}
</style>