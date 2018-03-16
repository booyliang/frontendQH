<template>
	<div class="repayments">
		<y-nav title="还款记录"></y-nav>
		<y-panel  :title="group.yearMonth" colorful  v-for="group in repayments" key="group.id">
			<y-item v-for="item in  group.repayments" key="item.id" :to="`/user/repayment-log/detail/${item.id}`" :value=" getRepaymentFlag(item.repaymentFlag)">
				<div slot="head">
					<div><span class="repayments--price">{{item.repaymentMoney | price}}元</span><span class="repayments--time">{{item.repaymentDate | moment }}</span></div>
					<div class="repayments--info"><span class="repayments--num">订单号：{{item.repaymentNo}}</span></div>
				</div>
			</y-item>
		</y-panel>
	</div>
</template>
<script>
	import constants from '../../config/constants.js'
	import NoData from '../no-data.vue'
	export default {
		data() {
			return {
				repayments: []
			}
		},
		async created() {
			let res = await this.$http.get('/services/app/v1/repayment/list')
			if (!res.data.data || res.data.data.length <= 0) {				
				this.$eventBus.$emit('global-message', (app) => app.currentView = NoData)
				return;
			}	
			this.repayments = res.data.data;
		},
		methods: {
			getRepaymentFlag(repaymentFlag) {
				return constants.repaymentFlag[repaymentFlag];
			}
		}
	}
</script>
<style>
@import '#/css/var.css';
.repayments {
	& .panel:first-of-type{
		margin-top: 0.2rem;
	}
	& .panel-head {
		padding: 0;
	}
	& .panel-title {
		padding-left: 0.2rem;
		line-height: 33px;
		border-left: 0.1rem solid var(--theme-color);
		color: var(--text-assist-color);
		font-size: 14px;
	}
	& .panel--colorful .panel-title::before {
		display: none;
	}
	& .panel-body {
		padding: 0;
	}
	& .item-value {
		font-size: var(--default-font-size);
		color: var(--text-assist-color);
	}
}
.repayments--price {
	font-size: 18px;
	color: #ff5a00;
}
.repayments--info {
	color: var(--text-primary-color);
	font-size: var(--default-font-size);
}
.repayments--time {
	color: var(--text-assist-color);
	font-size: var(--default-font-size);
	margin-left: 0.2rem;
	display: inline-block;
}
/*.repayments--num {
	padding-right: 0.3rem;	
}*/
</style>