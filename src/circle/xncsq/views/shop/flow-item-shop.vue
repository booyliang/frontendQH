<template>
	<div class="flow-item-shop">
		<div class="food-item-wrap" @click="openOuterUrl(data.outsideUrl)">
			<div class="food-item-img">
				<img :src="data.productImgUrl | imageResize(6)" :alt="data.productName">
				<span class="food-item-source">{{data.productSource}}</span>
			</div>
			<div class="food-intro-wrap">
				<div class="food-item-name">{{data.productName}}</div>
				<div class="food-item-price">
					<span class="food-price-label">{{$R('ref-price')}}</span> 
					<span class="food-price-value">
						<i>{{data.currencyPairs}}</i>{{data.productPrice}}</span>
				</div>
				<div class="food-item-intro">
					{{data.productIntroduction}}
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			data: Object,
		},
		methods: {
			openOuterUrl(url) {
				this.$yryz.openUrl({ url })
			}
		},
		created() {
		}
	}
</script>
<style>
@import '../../css/var.css';

.food-item-wrap {
	display: block;
	padding: 0.4rem 0.16rem;
	
	@nest .flow-item-shop:not(:first-child) & {
		@apply --border-top;
	}
}

.flow-item-shop{
	background: #fff;
	padding: 0 0.14rem;

	& .food-item-img{
		position: relative;
		& img{
			width: 6.9rem;
			height: 3.9rem;
		}
	}
	& .food-item-source{
		padding: 0 0.1rem;
		color: #fff;
		background: color(#000 alpha(0.5));
		border-radius: 1rem;
		position: absolute;
		bottom: 0.2rem;
		right: 0.1rem;
		font-size: 13px;
	}
	& .food-item-name{
		font-size: 18px;
		line-height: 1.4;
	}
	& .food-item-price {
		margin-bottom: .05rem;
	}
	& .food-price-label{
		font-size: 12px;
		color: #333;
	}
	& .food-price-value{
		font-size: 18px;
		color: #ff5a00;
		& i{
			font-size:12px;
		}
	}
	& .food-item-intro{
		display: flex;
		justify-content: flex-start;
	}
}


</style>