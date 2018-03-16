<template>
	<div class="total-tool-wrap">
		<div class="total-tool">
			<dl class="total-price">
				<dt>{{ infoText }}：</dt>
				<dd>￥{{price | price }}</dd>
			</dl>
			<y-button @click.native="handleClickButton" class="pay-button" :disabled="buttonDisabled">{{ buttonText }}</y-button>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			infoText: {
				type: String,
				default: '总计'
			},
			buttonText: String,
			price: {
				type: [Number, String],
				default: 0
			},
			buttonDisabled: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			handleClickButton() {
				this.$emit('click-button')
			}
		}
	}
</script>
<style>
	.total-tool-wrap {
		width: 100%;
		height: 0%;
		padding-bottom: 1.05rem;
	}
	.total-tool {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 .3rem;
		height: 1.05rem;
		background: #fff;
		box-shadow: 0 5px 15px rgba(0, 0, 0, .3);
		& .total-price {
			display: flex;
			align-items: center;
			& dd {
				color: #ff5a00;
				font-size: 20px;
			}
		}
		& .pay-button {
			width: 2.5rem;
			height: 100%;
			margin-right: -.3rem;
			border-radius: 0;
			font-size: 19px;
		}
	}
</style>
