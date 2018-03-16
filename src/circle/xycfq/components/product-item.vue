<template>
	<div class="product-item" @click="onSelect">
		<div class="product-radio" :class="{'selected': selected}">
			<i v-show="selected" class="iconfont icon-check-circle"></i>
			<i v-show="!selected" class="iconfont icon-check-b"></i>
		</div>
		<y-product-img @click.native="toProductDetail" :img-src="data.firstImg"></y-product-img>
		<div class="product-content">
			<h5 class="product-title"><span @click="toProductDetail">{{ data.goodsName }}</span></h5>
			<dl class="product-price">
				<dt>代理商价格:</dt>
				<dd>￥{{ data.goodsPrice | price }}/{{ data.unitFlag }}</dd>
			</dl>
			<dl class="product-count" v-if="!showMarketPrice">
				<dt>数量：</dt>
				<dd>
					<y-number :min="1" @change="handleChangeQuantity" v-model="data.quantity"></y-number>
				</dd>
			</dl>
			<dl class="product-market-price" v-else>
				<dt>市场统一零售价:</dt>
				<dd>￥{{ data.marketPrice | price }}/{{ data.unitFlag }}</dd>
			</dl>
		</div>
	</div>
</template>
<script>
	import YNumber from '@/components/number'
	import YProductImg from './product-img'
	export default {
		components: {
			YNumber,
			YProductImg
		},
		props: {
			data: Object,
			showMarketPrice: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				selected: false,
			}
		},
		methods: {
			handleChangeQuantity() {
				if (!this.selected) {
					this.onSelect();
				}
			},
			onSelect() {
				this.selected = !this.selected;
				this.$emit('select', this.selected, this.data);
			},
			toProductDetail() {
				this.$router.push({name: 'product-detail', params: {id: this.data.id}});
			}
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.product-item {
		@apply --no-tap-highlight;
		display: flex;
		padding: .4rem 0;
		background: #fff;
		& .product-radio {
			display: flex;
			align-items: center;
			justify-content: center;
			flex: 0 0 1rem;
			& i {
				font-size: 22px;
				color: #bfbfbf;
			}
			&.selected i {
				color: var(--theme-color);
			}
		}
		& .product-img {
			flex: 0 0 2rem;
		}
		& .product-content {
			display: flex;
			flex: auto;
			flex-direction: column;
			justify-content: space-between;
			margin-left: .4rem;
			font-size: 14px;
		}

		& .product-title {
			font-size: 18px;
			line-height: 1;
		}

		& .product-price, & .product-count{
			display: flex;
			align-items: center;
		}
		& .product-price {
			margin-top: 12px;
			font-size: var(--default-font-size);
			& dd {
				color: #ff5a00;
			}
		}

		& .product-market-price {
			font-size: var(--default-font-size);
			margin-top: 10px;

			& dt {
				display: inline;
			}
			& dd {
				color: var(--text-assist-color);
				display: inline;
			}
		}

		& + .product-item {
			@apply --border-top;
		}
	}
</style>
