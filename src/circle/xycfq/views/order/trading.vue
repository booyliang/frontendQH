<template>
	<div class="trading">
		<template>
			<y-message title="恭喜您，已签订成功!" class="trad--succ"></y-message>
			<y-panel class="trading-order">
				<dl slot="title" class="order-info">
					<dt>订单号:</dt>
					<dd>{{ orderData.orderNumber }}</dd>
				</dl>
				<y-order-good :data="item" v-for="item in orderData.orderItems" :key="item.id">
					<p class="good-quantity" slot="assist">数量:{{ item.quantity }}</p>
				</y-order-good>
				<div class="trading-links">
					<y-button :to="`/user/repayment/wantpay/${orderData.orderNumber}`" type="ghost">还款计划</y-button>
					<y-button to="/user/order/tab/2" type="ghost">查看订单</y-button>
				</div>
			</y-panel>
			<y-button block class="approve-button" :to="buttonData.link" replace>{{ buttonData.text }}</y-button>
		</template>
	</div>
</template>
<script>
	import YMessage from '@/components/message'
	import YPanel from '@/components/panel'
	import YOrderGood from '../../components/order-good'
	export default {
		components: {
			YMessage,
			YPanel,
			YOrderGood
		},
		data() {
			return {
				orderData: {
					orderItems: []
				},
				buttonListData: {
					1: { link: '/xyzx/auth', text: '申请信用赊销额度'},
					2: { link: '/user', text: '个人中心'},
					3: { link: '/xysx/auth', text: '申请信用赊销额度'},
					4: { link: '/user', text: '个人中心'}
				}
			}
		},
		computed: {
			buttonData() {
				return this.buttonListData[this.orderData.orderType] || {};
			}
		},
		mounted() {
			this.$http.get(`/services/app/v1/order/status/${this.$route.params.orderId}`).then(response => {
				let resData = response.data;
				if (resData.code === '200') {
					resData = resData.data;
					if (parseInt(resData.payStatus) === 1) {
						return this.$http.get(`/services/app/v1/order/single/${this.$route.params.orderId}`)
					} else {
						this.$router.replace('/user/order');
					}
				} else {
					this.$toast(resData.msg);
				}
			}).then(response => {
				let orderResData = response.data;
				if (orderResData.code === '200') {
					this.orderData = orderResData.data;
				} else {
					this.$toast(orderResData.msg);
				}
			})
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.trading {
		min-height: calc(100vh - 1.28rem);
		padding-bottom: var(--layout-space);
		background: #fff;
		& .trading-order {
			background: var(--bg-color);
			& .order-info {
				font-size: 12px;
			}
		}
		& .approve-button {
			font-size: 17px;
			margin-top: .7rem;
		}

		& .good-name {
			font-size: 17px;
		}

		& .panel-title dl {
			display: flex;
			& dd {
				padding-left: .1rem;
			}
		}
		& .panel-body .order-good {
			& .good-quantity {
				color: var(--text-assist-color);
			}
			&:not(:first-child) {
				margin-top: .2rem;
			}
		}

		& .trading-links {
			text-align: right;

			& .button {
				padding: 0.2em 0.3em;
				margin-left: 0.5em;

				&:nth-child(1) {
					color: #ed652b;
				}
			}
		}
	}

	.trad--succ.message {
		padding-top: 4rem;

		background: url(../../assets/succeed@2x.png) no-repeat center 1.18rem;
		background-size: 2.4rem auto;

		& .message-title {
			font-size: 22px;
			color: #ffb446;
		}
	}
</style>

