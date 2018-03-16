<template>
	<div class="trade_complete">
		<template v-if="orderData.orderType">
			<y-nav title="交易详情"></y-nav>			
			<div class="awaiting">
				<h3 class="title">恭喜您!</h3>
				<p>您申请的{{ tipsText }}已<span>办理完成</span><br/>请等待发货</p>
			</div>
			<y-button to="/user/repayment-list" size="l" block>交易完成</y-button>
		</template>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				orderData: {}
			}
		},
		computed: {
			tipsText() {
				let orderType = parseInt(this.orderData.orderType);
				if (orderType === 2) {
					return '信用助学'
				} else if (orderType === 4) {
					return '信用赊销'
				} else {
					return '';
				}
			}
		},
		mounted() {
			this.$http.get(`/services/app/v1/order/status/${this.$route.params.orderId}`).then(response => {
				let resData = response.data;
				if (resData.code === '200') {
					resData = resData.data;
					if (parseInt(resData.payStatus) === 1) {
						return this.$http.get(`/services/app/v1/order/undelivery/${this.$route.params.orderId}`);
					} else {
						this.$router.replace('/user/order');
					}
				} else {
					this.$toast(resData.msg);
				}
			}).then(response => {
				let resData = response.data;
				if (resData.code === '200') {
					this.orderData = resData.data;
				} else {
					this.$toast(resData.msg);
				}
			});
			// this.$http.get(`/services/app/v1/order/undelivery/${this.$route.params.orderId}`).then(response => {
			// 	let resData = response.data;
			// 	if (resData.code === '200') {
			// 		this.orderData = resData.data;
			// 	} else {
			// 		this.$toast(resData.msg);
			// 	}
			// }).catch(error => {
			// 	this.$toast('可能出现了一点小问题');
			// 	console.log(error);
			// })
		}

	}
</script>
<style>
	@import '#/css/var.css';
	.trade_complete {
		& .title {
			font-size: 22px;
			color: #ffb446;
		}
	}
	.awaiting {
		margin-top: 1.2rem;
		padding-top: 2.6rem;
		padding-bottom: .8rem;
		background: url(../assets/succeed@2x.png) no-repeat center top;
		background-size: 2.45rem auto;
		color: var(--text-assist-color);
		text-align: center;
		& span {
			color: #ff0000;
		}
	}
	.awaiting_num {
		margin-top: 20px;
		margin-bottom: 50px;
		font-size: 16px;
		line-height: 20px;
		text-align: center;
		color: var(--text-assist-color);

		& .count {
			color: #ff0000;
		}
	}

.trade_complete-p {
	margin-top: 20px;
	margin-bottom: 1rem;
}
</style>