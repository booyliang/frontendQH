<template>
	<div class="good-item">
		<y-product-img :img-src="data.firstImg || data.productImg"></y-product-img>
		<div class="good-content">
			<h5 class="good-name">{{ data.productName }}</h5>
			<dl class="good-count">
				<dt>数量:&nbsp;</dt>
				<dd>{{ data.quantity }}</dd>
			</dl>
			<dl class="good-price">
				<dt>代理商价格:</dt>
				<dd class="price">￥{{ data.price | price }}/{{ data.unitFlag }}</dd>
			</dl>
			<dl class="good-subtotal">
				<dt>订单金额:</dt>
				<dd class="price">￥{{ data.subtotal | price }} 
					<!--<span class="good-freight">(免运费)</span>-->
					</dd>
			</dl>
		</div>
	</div>
</template>
<script>
	import YProductImg from './product-img'
	export default {
		components: {
			YProductImg
		},
		props: {
			data: {
				type: Object,
				default: () => { return {} }
			}
		}
	}
</script>

<style>
	@import '#/css/var.css';
	.good-item {
		display: flex;
		padding: .4rem 0.3rem 0.3rem;
		background: #fff;
		&:not(:last-child) {
			border-bottom: 1px solid var(--border-color);
		}

		& .product-img {
			flex: 0 0 2rem;
		}

		& .good-content {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: .4rem;
			line-height: 1.7;

			& .price {
				color: #ff5a00;
			}
			& .good-freight {
				color: var(--text-assist-color);
			}

		}

		& .good-name {
			margin: 0;
			padding: 0;
			font-size: 18px;

		}

		& dl {
			display: flex;
		}
	}

	.good-count {
		color: var(--text-assist-color);
	}
</style>

