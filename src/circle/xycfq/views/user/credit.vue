<template>
	<div class="credit">
		<y-nav title="我的额度"></y-nav>
		<div class="credit-head">
			<div class="credit-price_ky">
				<div class="credit-price_kyed"><h2 class="credit-price size_l">{{credit.availableQuota | price}}</h2>可用赊销额度(元)</div>
				<div><h4 class="credit-price size_m">{{credit.totalQuota | price}}</h4>总赊销额度(元)</div>
			</div>
		</div>
		<div class="credit-body">
			<y-item to="/user/repayment-list">
				<div slot="head" class="icon-allrepayment">
					<span class="credit-price">{{repayment.waitMoney | price}}</span>
					<p class="credit-text">全部待还</p>
				</div>
			</y-item>
			<y-item to="/user/repayment-log">
				<div slot="head" class="icon-repaymentlog">
					<span class="credit-price">{{repayment.alreadyMoney | price}}</span>
					<p class="credit-text">还款记录</p>
				</div>
			</y-item>
			<!-- A:信用申请 1：提交资料 2：审核中 3：审核不通过 4：提交资料（检验不合格） 5：审核通过 B:赊销过程 6:生成订单，没有支付200 7:取消订单 8:首次支付200，扣除额度 9:循环的生成订单，扣除额度(不需要支付手续费) C:冻结 10:逾期没有还款，冻结 11:解冻 30:流程结束 -->
			<button class="credit-btn" v-if="statusData.flowStatus === 6" @click="toUrl">支付赊销服务费</button>
			<button class="credit-btn" :class="{disabled: credit.availableQuota < 0 || !credit.availableQuota || statusData.flowStatus === 10}"  v-else @click="toUrl">选择赊销商品</button>
		</div>
	</div>
</template>
<script>
	import YItem from '@/components/item'
	import flowStatusMixin from '../../mixins/flow-status.js'
	export default {
		mixins: [flowStatusMixin],
		components: {
			YItem
		},
		data() {
			return {
				credit: {},
				repayment: {},
				statusData: {flowStatus: 0}
			}
		},
		async created() {
			let res = await this.$http.get('/services/app/v1/flowInfo/quotainfo')
			this.credit = res.data.data || {};
			let res1 = await this.$http.get('/services/app/v1/cyclePlan/repatmentMoneyByUser')
			this.repayment = res1.data.data || {};
		},
		methods: {
			toUrl() {
				if (this.statusData.flowStatus === 6) {
					this.$router.push('/user/order');
					return;
				}
				this.$router.push('/product/list/user-type/' + this.credit.applyEntry);
			}
		}
	}
</script>
<style>
@import '#/css/var.css';
.credit {
	height: 100vh;
	background-color: #fff;
	& .item:first-of-type .item-wrap{
		border-top: 0;
	}
	& .item:last-of-type .item-wrap{
		border-bottom: 1px solid #eee;
	}
	& .item-head > div {
		background-repeat: no-repeat;
		background-size: 0.6rem auto;
		background-position: left center;
		padding-left: 0.78rem;

		& .credit-price {
			color: #ff5a00;
		}
	}
	& .credit-text {
		color: var(--text-assist-color);
		font-size: var(--default-font-size);
	}
	& .credit-head {
		background: #fff;
		padding: 0.4rem 0 0.5rem;
		border-bottom: 0.2rem solid #f8f8f8;
		line-height: 1;
		text-align: center;
		& .credit-price_ky {
			margin:  0 0.3rem 0;
			color: #fff;
			border-radius: 0.15rem;
			background: linear-gradient( to right, #2f52a8, #406cda);
			background: -webkit-linear-gradient( to right, #2f52a8, #406cda);
			font-size: 18px;
			padding: 0.44rem 0 0.46rem;
			& .credit-price_kyed {
				margin: 0 0.3rem 0.35rem;
				padding-bottom: 0.45rem;
				border-bottom: 1px solid color(#fff alpha(0.3));
			}
			& .size_l {
				font-size: 30px;
				margin-bottom: 15px;
			}
			& .size_m {
				font-size: 25px;
				margin-bottom: 10px;
			}
		}
	}
	& .credit-body{
		& .credit-btn {
			display: block;
		    width: 100%;
		    max-width: 5.2rem;
		    margin: 1rem auto 0;
		    vertical-align: middle;
	        font-size: 17px;
	        line-height: 1.5;
	        text-align: center;
	        color: white;
	        padding: 0.45em 1em;
	        border: 1px solid transparent;
	        background: #315ac1;
	        border-radius: 0.4em;
	        outline: none;
		}
		& .disabled {
			background: #d7d7d7;
			pointer-events: none;
		}
	}

}
.icon-allrepayment {
	background-image: url(../../assets/icon-all_repayment@2x.png);
}
.icon-repaymentlog {
	background-image: url(../../assets/icon-repayment_log@2x.png);
}

/*.credit-foot {
	display: flex;
	justify-content: space-around;
	position: relative;
	margin-top: 0.5rem;

	&:after {
		content: '';
		display: inline-block;
		width: 1px;
		position: absolute;
		left: 50%;
		background: #e7e7e7;
		top: 5px;
		bottom: 7px;
	}
}

.credit-foot_item {
	color: var(--text-assist-color);

	& .credit-price {
		font-size: 25px;
		color: var(--text-secondary-color);
		margin-bottom: 10px;
	}
}*/
</style>