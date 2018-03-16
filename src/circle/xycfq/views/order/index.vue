<template>
	<div class="order-index">
		<router-link tag="div" to="/address" class="address">
			<div class="icon"></div>
			<div class="content">
				<p>{{ orderData.receivingAddress }}</p>
				<div class="consignee-info">
					<dl class="consignee">
						<dt>收货人:</dt>
						<dd>{{ orderData.receivingName }}</dd>
					</dl>
					<span class="phone">{{ orderData.receivingPhone }}</span>
				</div>
			</div>
		</router-link>
		<y-panel class="good-list" title="商品详情" :colorful="true">
			<y-good-item v-for="item in orderData.orderItems" :key="item.id"></y-good-item>
		</y-panel>

		<y-payment-type v-model="payPostData.channel"></y-payment-type>

		<y-total-tool button-text="确认支付" :price="orderData.totalAmount"></y-total-tool>
	</div>
</template>
<script>
	import YPaymentType from '../../components/payment-type'
	import YProductImg from '../../components/product-img'
	import YTotalTool from '../../components/total-tool'
	import YGoodItem from '../../components/good-item'
	export default {
		components: {
			YPaymentType,
			YProductImg,
			YTotalTool,
			YGoodItem
		},
		data() {
			return {
				orderData: {},
				payPostData: {
					channel: 3,
					orderId: this.$route.params.orderId,
					paymentSource: this.$env.devType
				}
			}
		},
		methods: {
			onPayOrder() {
				this.$http.put('/services/app/v1/order/pay', this.payPostData).then(response => {
					let resData = response.data;
					if (resData.code === '200') {
						resData = resData.data;
						console.log(resData);
					} else {
						this.$toast(resData.msg);
					}
				})
			},
			getOrderData() {
				this.$http.get(`/services/app/v1/order/${this.$route.params.orderId}`).then(response => {
					let resData = response.data;
					if (resData.code === '200') {
						resData = resData.data;
						console.log(resData);
					} else {
						this.$toast(resData.msg);
					}
				})
			}
		},
		mounted() {
			this.getOrderData();
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.order-index {
		& .panel-body {
			padding-top: 0;
			padding-bottom: 0;
		}
		& .address {
			display: flex;
			padding: .3rem;
			margin-bottom: .2rem;
			background: #fff;
			& .icon {
				flex: 0 0 .4rem;
			}
			& .content {
				position: relative;
				flex: 1;
				padding-right: .8rem;
				&:after {
					content: "";
					position: absolute;
					right: 0;
					top: 50%;
					width: .25rem;
					height: .25rem;
					border: 2px solid var(--border-color);
					border-left-color: transparent;
					border-bottom-color: transparent;
					transform: translateY(-50%) rotate(45deg);
				}
			}
			& .consignee-info {
				display: flex;
				& .consignee {
					display: flex;
				}
			}
		}
		& .good-list {
			& .panel-body {
				padding: .1rem 0;
			}
		}
		& .check_item:last-child {
			border-bottom: none;
		}
		
	}
</style>
