<template>
	<div class="want_pay">		
		<y-nav  :title="payAll ? '待还详情' : '还款计划'"></y-nav>
		<div class="want_pay-order">
			<y-item :value="order.orderDate | moment" >
				<span slot="head">订单号: <span class="want-pay-data">{{order.orderNo}}</span></span>
			</y-item>
			<y-item v-for="prod in order.items" key="prod.id" >
				<span slot="head" class="goods">
					<span class="order_img"><img alt="" :src="prod.productImg"></span>
					<div class="order_info">
						<h4 class="name">{{prod.productName}}</h4>
						<span class="numb">数量：{{prod.quantity}}盒</span>
					</div>
				</span>
			</y-item>
		</div>

		<div class="want_pay-price" v-if='!payAll'>
			<div class="want_pay-price_item"><div class="price">{{report.originalMoney | price}}</div>赊销货款总额(元)</div>
			<div class="want_pay-price_item"><div class="price">{{report.serviceMoney | price}}	</div>服务费(元)</div>
			<div class="want_pay-price_item"><div class="price cur">{{report.repaymentMoney | price}}</div>应还款总额(元)</div>
		</div>

		<y-panel title="分期账单" colorful class="want_pay-bill" v-if='!payAll'>
			<y-item>
				<span solt="head">待还款：<span class="price">{{report.waitMoney | price}}元</span></span>
				<span solt="foot">已还款：<span>{{report.alreadyMoney | price}}元</span></span>
			</y-item>
		</y-panel>
		<div class="want_pay-periods">
			<div class="check_item" v-show="cyclePlans.length" :class="[ {'checkedItem': checkAll}]" @click="handleCheckAll">
				<i :class="[' iconfont ', checkAll ? ['icon-check-circle', 'checked']: 'icon-check-b']"></i>
				<div class="check_item-content" >一次性付清</div>
			</div>

			<y-check-group ref="checkGroup" type="checkbox" :data="cyclePlans"
				disabledField='repaymentFlag' v-model= "selectedCycleIds"
			   :class='{"payall_check-group" : payAll}'>
				<template scope="item">
				<span v-if="payAll">
					<span class="payall" ><span class="price">{{item.repaymentMoney | price}}元</span>{{item.number}}/{{report.count}}期</span>
					<span class="remainDays" v-if="item.remainDays >= 0">剩余 <b class="num">{{item.remainDays}}</b> 天</span>
					<span class="remainDays" v-else>逾期 <b class="num">{{Math.abs(item.remainDays)}}</b> 天</span>
				</span>
				<span v-else>
					<span class="price " >【第{{item.number}}期】{{item.repaymentMoney | price}}元</span>
					<span class="date" v-if="item.remainDays >=0">{{item.repaymentDate | moment('MM-DD') }} {{RepaymentFlags[item.repaymentFlag]}}</span>
					<span class="remainDays" v-else>逾期 <b class="num">{{Math.abs(item.remainDays)}}</b> 天</span>
				</span>
				</template>
			</y-check-group>
		</div>
		
		<y-total-tool @click-button="handlePay" button-text="确认" :price="totalPrice" :buttonDisabled="buttonDisabled" ></y-total-tool>

	</div>
</template>
<script>
	// import NoData from '../no-data.vue'
	import Constants from '../../config/constants'
	import YTotalTool from '../../components/total-tool'
	export default {
		components: {
			YTotalTool
		},
		data() {
			return {
				payAll: this.$route.params.payType === 'payall',				
				RepaymentFlags: Constants.repaymentFlag,
				cyclePlans: [					
				],
				report: {					
				},
				order: {},
				
				selectedCycleIds: [],
			}
		},
		computed: {
			checkAll() {
				return this.selectedCycleIds.length === this.cyclePlans.length
			},
			totalPrice() {
				let items = this.cyclePlans.filter(item => item.repaymentFlag === 0 && this.selectedCycleIds.includes(item.id))
				let totalPrice = items.reduce((total, item) => total + item.repaymentMoney, 0);	
				return totalPrice;			
			},
			buttonDisabled() {
				// console.log('this.totalPrice', this.totalPrice)
				return this.totalPrice === 0;
			}
		},
		watch: {
			selectedCycleIds(newVal, oldVal) {				
				let selectedCycleIds = [];	
				if (newVal.length < oldVal.length) {
					for (let i = 0; i < newVal.length; i++) {
						if (newVal[i] === oldVal[i])
							selectedCycleIds.push(newVal[i])
						else
							break;
					}					
								
				} else if (newVal.length > 0) {
					for (let plan of this.cyclePlans) {
						selectedCycleIds.push(plan.id);
						if (plan.id === newVal[newVal.length - 1])
							break;
					}

				}
				if (selectedCycleIds.length !== newVal.length)
					this.selectedCycleIds = selectedCycleIds	
			}
		},
		methods: {
			handleCheckAll() {					
				if (this.checkAll)
					this.selectedCycleIds = this.cyclePlans.filter(plan => plan.repaymentFlag === 1).map((plan) => plan.id);					
				else {
					this.selectedCycleIds = this.cyclePlans.map((plan) => plan.id);		
				}		
				
				
			},

			async handlePay() {

				let items = this.$refs.checkGroup.getSelectedActiveItems();
				// console.log('items', items)
				let numbers = items.map((item) => item.number);
				let res = await this.$http.get(`/services/app/v1/repayment/generateRepay?numbers=${numbers.join(',')}&orderNo=${this.order.orderNo}`);
				// console.log(res.data)
				if (res.data.code !== '200') {
					this.$toast(res.data.msg);
					return;
				}
				let repaymentNo = res.data.data.repaymentNo;
				let orderId = this.order.orderId;

				this.$router.replace(`/user/pay/${orderId}?type=1002&repaymentNo=${repaymentNo}&totalPrice=${this.totalPrice}`)
			},
			
			
		},
		async created() {			
			
			let res = await this.$http.get(`/services/app/v1/cyclePlan/bill/${this.$route.params.orderNo}`);
			
			// if (!res.data.data || !res.data.data.order ) {				
			// 	this.$eventBus.$emit('global-message', (app) => app.currentView = NoData)
			// 	return;
			// }				
			this.order = res.data.data.order;			
			let cyclePlans = res.data.data.bill
			this.report = res.data.data.report;

			if (this.payAll) {
				cyclePlans = cyclePlans.filter((plan) => plan.repaymentFlag === 0)
			} else {

				this.selectedCycleIds = cyclePlans.filter((plan) =>  plan.repaymentFlag === 1).map((plan) => plan.id)
			}				
			this.cyclePlans = cyclePlans;			

		}
	}
</script>
<style>
@import '#/css/var.css';

.item .goods{
	display: flex;
	align-items: center;
	line-height: 1;

	& .order_img {
		width: 1.3rem;
		height:1.18rem;
		border: 1px solid #eee;
		background: #fff;
		margin-right: 0.3rem;


		& img {
			max-width: 1.3rem;
			max-height: 1.18rem;
		} 
	}
	& .name {
		color: var(--text-primary-color);
		font-size: 17px;
	}
	& .numb {
		font-size: 14px;
		color: var(--text-assist-color);
		display: inline-block;
		margin-top: 16px;
	}
}

.want_pay-order .item {
	background: 0;

	&:last-of-type .item-wrap{
		border-bottom: 0;
	}

	& .item-wrap {
		color: var(--text-assist-color);		
		font-size: 14px;
		border-top: 0;
		@apply --border-bottom;


	}
	& .item-head {
		color: var(--text-secondary-color);
		font-size: 14px;

		& .want-pay-data {
			color: var(--text-assist-color);					
		}
	}
	& .item-value {
		color: var(--text-assist-color);		
	}
}

.want_pay-price {
	background: #fff;
	display: flex;
	justify-content: space-around;
	align-items: center;
	line-height: 1;
	padding: 0.4rem 0.3rem;
	@apply --margin-bottom;
}

.want_pay-price_item {
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 14px;
	color: var(--text-assist-color);
	& .price {
		font-size: 22px;
		color: var(--text-secondary-color);
		margin-bottom: 10px;
		&.cur {
			color: #ff5a00;
		}
	}
}

.want_pay-bill {
	margin-bottom: 0;
	@apply --border-bottom;
	& .panel-head {
		line-height: 56px;
	}
	& .panel-body {
		padding: 0;
		font-size: 14px;
		color: var(--text-assist-color);
	}
	& .price{
		color: #ff5a00;
	}
}

.want_pay-periods {
	background: #fff;
	padding: 0 0.3rem;
	& .item-wrap {
		padding: 0.3rem 0;
		font-size: 14px;
		color: var(--text-assist-color);
	}

	& .price{
		color: #ff5a00;
	}

	& .check_item:last-of-type {
		border-bottom: 0;
	}
	& .check_item-content {
		font-size: 16px;
		& .date {
			flex: 0 1 auto;
			font-size: 14px;
			color: var(--text-assist-color);
		}

		& .payall {
			line-height: 1;

			& .price {
				margin-bottom: 10px;
			}

		}
	}
	& .remainDays {
		flex: 0 1 auto;
		font-size: 14px;
		color: var(--text-assist-color);
		& .num {
			color: var(--theme-color);
		}
	}
}

.payall {
	display: inline-block;
	font-size: 14px;
	color: var(--text-assist-color);
	text-align: left;

	& .price {
		display: block;
		font-size: 18px;
	}
}

.want_pay .check_group {
	& .check_item-content > span {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
}

.payall_check-group .check_item {
	min-height: 1.6rem;
}
</style>