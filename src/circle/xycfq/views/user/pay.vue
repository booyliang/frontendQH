<template>
	<div class="order_detail pay">
		<y-nav title="在线支付"></y-nav>
		<div class="order_head pay-head">
			<div class="order_head-title">应付金额(元)</div>
			<div class="order_head-price">{{ totalPrice || orderData.payAmount | price}}</div>
		</div>
		<y-item title="商品总金额(元):" :value="orderData.totalAmount | price" class="pay-price"></y-item>
		<y-item title="订单号:"  :value="orderData.orderNumber" class="pay-ordernum"></y-item>
		<y-payment-type v-model="orderData.channel"></y-payment-type>
		<div class="total-tool">
			<dl class="total-price">
				<dt v-if="orderData.orderType === 4 && !type">首付</dt>
				<dt v-else>总计</dt>
				<dd>￥{{totalPrice || orderData.payAmount | price}}</dd>
			</dl>
			<y-button class="pay-button" @click.native="pay">确认支付</y-button>
		</div>
	</div>
</template>
<script>
	import YPaymentType from '../../components/payment-type'
	import wapPay from '../../mixins/wap-pay'
	export default {
		components: {
			YPaymentType
		},
		mixins: [wapPay],
		data() {
			return {
				orderData: {},
				totalPrice: this.$route.query.totalPrice, // 还款总金额
				type: this.$route.query.type, // 产品类型 1002为还款
				repaymentNo: this.$route.query.repaymentNo, // 还款单号
			}
		},
		methods: {
			async repayment() {
				let orderData = {
					currency: '156',
					orderAmount: parseInt(this.totalPrice),
					repaymentNo: this.repaymentNo,
					orderSrc: '4',
					payWay: this.orderData.channel,
					productType: this.type,
				}
				let res = await this.$http.get(`/services/app/v1/repayment/pay`, {params: orderData});
				if (res.data.code !== '200') {
					this.$toast(res.data.msg);
					return;
				}
				try {
					let data = await this.wapPay(res.data.data.orderId, this.orderData.channel);
					let res1 = await this.$http.get('/services/app/v1/repayment/getRepaymentFlag/' + this.repaymentNo);
					if (res1.data.data.repaymentFlag === 1) {
						this.$router.replace('/user/repayment-log')
					} else {
						this.$router.back()
					}
				} catch (err) {
					// 跳转支付宝回来后点击“遇到问题”后的操作
					// this.$toast('请重新支付')
					let res1 = await this.$http.get('/services/app/v1/repayment/getRepaymentFlag/' + this.repaymentNo);
					if (res1.data.data.repaymentFlag === 1) {
						this.$router.replace('/user/repayment-log')
					} else {
						this.$router.back()
					}
				}
			},
			async payOrder() {
				let res = await this.$http.put('/services/app/v1/order/pay', {orderId: this.orderData.id, channel: this.orderData.channel});
				if (res.data.code !== '200')
					return;
				if (res.data.data.payStatus === 1)
					this.$router.replace('/user/order/tab/2')
				try {
					let payData = await this.wapPay(res.data.data.orderId, this.orderData.channel);
					let res1 = await this.$http.get('/services/app/v1/order/status/' + this.orderData.id)
					if (res1.data.data.payStatus === 1) {
						this.$router.replace('/user/order/tab/2')
					} else {
						this.$router.replace('/user/order/tab/1')
					}
				} catch (err) {
					// 跳转支付宝回来后点击“遇到问题”后的操作
					// this.$toast('请重新支付')
					let res1 = await this.$http.get('/services/app/v1/order/status/' + this.orderData.id)
					if (res1.data.data.payStatus === 1) {
						this.$router.replace('/user/order/tab/2')
					} else {
						this.$router.replace('/user/order/tab/1')
					}
				}
			},
			async pay() {
				if (!this.orderData.channel) {
					this.$toast('请选择支付方式');
				}

				if (this.repaymentNo) {
					await this.repayment();
				} else {
					await this.payOrder();
				}
			},
		},
		created() {
			this.$http.get('/services/app/v1/order/single/' + this.$route.params.id).then(response => {
				if (response.data.code === '200') {
					this.orderData = response.data.data;
				}
			})
		}
	}
</script>
<style>
	.pay{
		& .pay-head{
			margin-bottom: 0.2rem;
		}
		& .pay-price{
			& .item-wrap{
				border: 0;
				& .item-value{
					color: #ff5a00;
				}
			}
		}
		& .pay-ordernum{
			margin-bottom: 0.2rem;
		}
	}
</style>