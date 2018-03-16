<template>
	<div class="repayment_detail">
		<y-nav title="还款详情"></y-nav>
		<div class="repayment_detail-head">
			<div class="repayment_detail--title">还款金额（元）<span class="repayment_detail--status">{{gitRepaymentFlag(repaymentDetail.repaymentFlag)}}</span></div>
			<div class="repayment_detail--price">{{repaymentDetail.repaymentMoney | price}}</div>
			<div class="repayment_detail--info">
				<div>{{repaymentDetail.originalMoney| price}} <span>当期应还赊销货款</span></div>
				<b class="iconfont icon-plus"></b>
				<div>{{repaymentDetail.serviceMoney | price}}<span>分期服务费</span></div>
				<b class="iconfont icon-plus"></b>
				<div>{{repaymentDetail.penaltyMoney| price}} <span>违约金</span></div></div>
		</div>
		<y-item title="还款方式" :value="repaymentDetail.repaymentType"></y-item>
		<y-item title="支付方式">
			<div slot="foot" v-text="getPayType(repaymentDetail.payType)"></div>
					
		</y-item>
		<y-item title="还款订单" :value="repaymentDetail.orderNo"></y-item>
		<y-item title="还款时间" :value="repaymentDetail.repaymentDate"></y-item>
	</div>
</template>
<script>
	import constants from '../../config/constants'
	export default {
		data() {
			return {
				repaymentDetail: {},			
			}
		},
		async created() {
			let res = await this.$http.get(`/services/app/v1/repayment/single/${this.$route.params.id}`);
			this.repaymentDetail = res.data.data;
		},
		methods: {
			// 支付方式
			getPayType(payType) {
				return constants.payType[payType]
			},

			// // 还款方式
			// getRepaymentType(repaymentType) {
			// 	return constants.repaymentType[repaymentType]
			// },

			// 	还款状态
			gitRepaymentFlag(repaymentFlag) {
				return constants.repaymentFlag[repaymentFlag]
			}
		}
	}
</script>
<style>
@import '#/css/var.css';

.repayment_detail-head {
	background: #fff;
	padding: 0.4rem 0.3rem;
	@apply --margin-bottom;
}
.repayment_detail--status {
	line-height: 20px;
	border: 1px solid var(--theme-color);
	padding: 0 5px;
	border-radius: 5px;
	color: var(--theme-color);
	float: right;
	font-size: var(--default-font-size);
}

.repayment_detail--title {
	font-size: 18px;

}

.repayment_detail--price {
	font-size: 30px;
	color: #ff5a00;
}
.repayment_detail--info {
	padding: 0.3rem 0.2rem;
	background: #f8f8f8;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: var(--text-assist-color);
	text-align: center;
	font-size: 16px;

	& > div > span {
		display: block;
		font-size: 14px;
	}
	& .icon-plus {
		color: #bfbfbf;
		font-size: 13px;
	}
}

.repayment_detail-head + .item .item-wrap {
		border-top: 0;
}
</style>