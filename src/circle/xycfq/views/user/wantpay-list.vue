<template>
	<div class="wantpay_list">
		<y-nav title="我要还款"></y-nav>
			<y-list>
				<div class="wantpay_list-panel" v-for="item in wantpayData" key="index">
					<div class="panel-title">
						<y-item clickable>
							<span slot="head">
								<p>订单号: <span class="text-assist">{{item.order.orderNo}}</span></p>
								<p>订单时间: <span class="text-assist">{{item.order.orderDate  | moment}}</span></p>
							</span>
							<span slot="foot">
								<router-link :to="`/user/repayment/wantpay/${item.order.orderNo}`">查看详情</router-link>
							</span>
						</y-item>
					</div>
					<div class="panel-content">
						<div class="up">
							<div class="subtitle">
								<span>分期账单</span>
							</div>
							<div class="detail">
								<div>
									<p>待还款金额&nbsp;&nbsp;(元)</p>
									<p class="price">{{item.report.waitMoney | price}}</p>
								</div>
								<div>
									<p>已还款金额&nbsp;&nbsp;(元)</p>
									<p class="price">{{item.report.alreadyMoney | price}}</p>
								</div>
							</div>
						</div>
						<div class="down">
							<div>
								<p class="text-assist">赊销贷款总额&nbsp;&nbsp;(元)</p>
								<p class="price">{{item.report.originalMoney | price}}</p>
							</div>
							<div>
								<p class="text-assist">服务费&nbsp;&nbsp;(元)</p>
								<p class="price">{{item.report.serviceMoney | price}}</p>
							</div>
							<div>
								<p class="text-assist">应还款金额&nbsp;&nbsp;(元)</p>
								<p class="price">{{item.report.repaymentMoney | price}}</p>
							</div>
						</div>
					</div>
				</div>
			</y-list>
	</div>
</template>
<script>
import YList from '@/components/list'
import NoData from '../no-data.vue'
export default{
	components: {
		YList
	},
	data() {
		return {
			wantpayData: {}
		}
	},
	async created() {
		let res = await this.$http.get('/services/app/v1/cyclePlan/bill')
		if (!res.data.data || res.data.data.length <= 0) {				
			this.$eventBus.$emit('global-message', (app) => app.currentView = NoData)
			return;
		}
		this.wantpayData = res.data.data;
	}
}
</script>
<style>
@import '#/css/var.css';

.wantpay_list {
	& .text-assist {
		color: var(--text-assist-color);
	}
	& .item{
		padding: 0;
		background-color: #f8f8f8;
		& .item-wrap {
			padding: 0;
			& .item-head{
				font-size: 13px;

				& p + p {
					margin-top: 10px;
				}
			}
			& .item-foot{
				font-size: 15px;
				color: var(--theme-color);
				& .icon-arrow-right{
					color: var(--theme-color);
					padding-top: 3px;
				}
			}
		}
	}
	& .wantpay_list-panel{
		padding: 0.3rem;
	}
	& .panel-content{
		& .up{
			padding: 0.4rem 0.3rem;
			border-top-right-radius: 0.18rem;
			border-top-left-radius: 0.18rem;
			color: #fff;
			background-color: var(--theme-color);
			font-size: 14px;
			& .subtitle::before{
			    border-radius: 999px;
			    content: "";
			    display: inline-block;
			    width: 3px;
			    height: 1em;
			    vertical-align: -0.15em;
			    background: #fff;
			    margin-right: 0.3em;
			}
			& .detail{
				display: flex;
				justify-content: space-between;
				margin-top: 0.28rem;
				font-size: 15px;
				& .price{
					font-size: 25px;
				}
			}
		}
		& .down{
			position: relative;
			z-index: 2;
			padding: 0.4rem 0.3rem;
			display: flex;
			justify-content: space-between;
			border-bottom-left-radius: 0.18rem;
			border-bottom-right-radius: 0.18rem;
			box-shadow: 0.01rem 0 0.05rem #f0f1f3;
			font-size: 13px;
			& .price{
				font-size: 16px;
			}
		}
	}
}
</style>