<template>
	<div class="order-service-charge">
		<y-tips>
			<template v-if="userType === 1">您应支付{{ poundage | price }}元信用助学服务费，详情请查看《信用助学申请须知》</template>
			<template v-if="userType === 2">您应支付{{ poundage | price }}元信用赊销服务费，详情请查看《信用赊销申请须知》</template>
		</y-tips>
		<dl class="amount">
			<dt>应付金额(元)</dt>
			<dd>{{ poundage | price }}</dd>
		</dl>
		<y-item title="订单编号:" class="order-number">
			<span slot="body">456789412346498798</span>
		</y-item>
		<y-payment-type v-model="postData.channel">

		</y-payment-type>

		<y-total-tool @click-button="payOrder" :price="poundage" info-text="赊销服务费" button-text="确认"></y-total-tool>
	</div>
</template>
<script>
	import YTips from '../../components/tips'
	import YPaymentType from '../../components/payment-type'
	import YTotalTool from '../../components/total-tool'
	import wapPay from '../../mixins/wap-pay.js'
	export default {
		mixins: [wapPay],
		components: {
			YTips,
			YPaymentType,
			YTotalTool
		},
		data() {
			return {
				userType: '',
				postData: {
					channel: 3
				},
				poundage: ''
			}
		},
		methods: {
			payOrder() {
				let orderId = parseInt(this.$route.params.orderId);
				this.$http.put('/services/app/v1/order/pay', {orderId: orderId, channel: this.postData.channel, paymentSource: 4}).then(response => {
					let resData = response.data;
					if (resData.code === '200') {
						if (parseInt(resData.data.payStatus) === 1) {
							this.$router.replace(`/order/trading/${orderId}`);
						} else {
							this.wapPay(resData.data.orderId, this.postData.channel).then(() => {
								this.$http.get(`/services/app/v1/order/status/${this.$route.params.orderId}`).then(response => {
									let resData = response.data;
									if (resData.code === '200') {
										resData = resData.data;
										if (parseInt(resData.payStatus) === 1) {
											this.$router.replace(`/order/trading/${orderId}`);
										} else {
											this.$router.replace('/user/order');
										}
									} else {
										this.$toast(resData.msg);
									}
								})
							}).catch(() => {
								this.$toast('请重新支付订单');
							})
						}
					}
				})
			},
		},
		mounted() {
			this.userType = parseInt(this.$route.params.userType);
			this.$http.get(`/services/app/v1/order/poundage/${this.userType}`).then(response => {
				let resData = response.data;
				if (resData.code === '200') {
					this.poundage = parseInt(resData.data.poundage);
				} else {
					this.$toast(resData.msg);
				}
			})
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.order-service-charge {
		min-height: calc(100vh - 1.28rem);
		background: #fff;
		& .amount {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 2.35rem;
			background: #fff;
			border-bottom: .2rem solid var(--bg-color);
			& dt {
				margin: 0;
				padding: 0;
				font-size: 18px;
			}
			& dd {
				margin: 0;
				padding: 0;
				font-size: 30px;
				color: #ff5a00;
			}
		}
		& .order-number {
			border-bottom: .2rem solid var(--bg-color);
			& .item-wrap {
				border-top: none;
			}
			& .item-body {
				margin-left: .2rem;
			}
		}
		& .payment-type {
			border-bottom: .2rem solid var(--bg-color);
			& .check_group .check_item:last-child {
				border-bottom: none;
			}
		}
	}
</style>

