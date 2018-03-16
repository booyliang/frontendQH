<template>
	<div class="repayment_list">
		<y-nav title="全部待还"></y-nav>
		<y-list>
			<y-panel v-for="item in repaymentData" key="index" :more="`/user/repayment/payall/${item.order.orderNo}`" class="repayment_list-panel">
				<div slot="title">
					<p>订单号: <span class="text-assist">{{item.order.orderNo}}</span></p>
					<p>订单时间: <span class="text-assist">{{item.order.orderDate | moment}}</span></p>
				</div>
				<y-item v-for="sell in item.order.items" key="index">
					<span slot="head" class="goods">
						<span class="order_img"><img alt="" :src="sell.productImg"></span>
						<div class="order_info">
							<h4 class="name">{{sell.productName}}</h4>
							<span class="numb">数量：{{sell.quantity}}盒</span>
						</div>
					</span>
				</y-item>
			</y-panel>
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
			repaymentData: {}
		};
	},
	async created() {
		let res = await this.$http.get('/services/app/v1/cyclePlan/bill')
		if (!res.data.data || res.data.data.length <= 0) {				
			this.$eventBus.$emit('global-message', (app) => app.currentView = NoData)
			return;
		}
		this.repaymentData = res.data.data;
	}
}
</script>
<style>
@import '#/css/var.css';
.repayment_list{
	& .panel:first-child{
		margin-top: 0.2rem;
	}
	& .repayment_list-panel{
		& .panel-head{
			align-items: flex-start;
			padding-top: 0.3rem;
			padding-bottom: 0.3rem;
			line-height: 1;
			& .panel-title{
				font-size: 14px;
				color: var(--text-primary-color);
				& p + p {
					margin-top: 0.2rem;
				}
				& .text-assist{
					color: var(--text-assist-color);
				}
			}
			& .panel-more{
				font-size: 14px;
			}
		}
		& .panel-body{
			padding: 0 0.3rem;
			& .item {
				padding: 0;
			}
			& .item-wrap {
				padding: 0.3rem 0;
			}
			& .goods{
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
		}
	}
}
</style>