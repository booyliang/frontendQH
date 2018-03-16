<template>
	<div class="order_group">
		<y-load-more-remote  v-bind="{request, endTip, maxPage}" @loaded="handleLoaded">
			<y-list>
				<y-item v-for="item in groupData" key="item.id" clickable @click="handleClick(item.id)" class="order_item">
					<div slot="head"> 
						<div class="order_item--name">订单号:  {{item.orderNumber}}</div>
						<div class="order_item--info">
							<span class="order_item--price">{{item.totalAmount | price}}元</span><span class="order_item--time">{{item.createDate | moment('YYYY-MM-DD HH:mm:ss')}}</span>
						</div>
					</div>
					<div slot="addon">
						<!-- 1.0 flowStatus 4审核中；5审核不通过； 6退回 ；7认证成功
						orderStatus 1,未付款订单;2,已付款订单;3,待发货订单;4,已发货订单;5,已作废订单;6,申请退款;7,已退款订单;
						orderType 1,学生门槛;2,学生赊销;3,社会人士门槛;4,社会人士赊销;5,借款 
						<div class="order_item--button" v-if="item.orderStatus === 1 || item.orderStatus === 5">	
							<y-button type="ghost" class="cancel" v-if="item.orderStatus === 1" @click.native="cancelOrder(item)">取消订单</y-button>
							<span v-if="item.orderStatus === 5" class="order_item--status">已取消</span>
							<y-button type="ghost"  v-if="item.orderStatus === 1 && item.orderType !== 2 && item.orderType !== 4" @click.native="pay(item.id)">去付款</y-button>
							<y-button type="ghost"  v-if="item.orderStatus === 1 && (item.orderType === 2 || item.orderType === 4)" @click.native="pay(item.id)">确认</y-button>
						</div>
						<div class="order_item--button"  v-if="item.orderStatus !== 1 && item.orderStatus !== 5">		
							<y-button type="ghost" class="cancel" @click.native="refund(item)" v-if="item.orderStatus === 2 && (item.orderType === 1 || item.orderType === 3) && !item.parentOrderId && item.flowStatus !==7  && item.flowStatus !== 4">我要退款</y-button>
							<span v-if="item.orderStatus === 6" class="order_item--status">退款中</span>
							<span v-if="item.orderStatus === 7" class="order_item--status">已退款</span>
							<y-button type="ghost" @click.native="delivery(item)" v-if="item.orderStatus === 2">我要提货</y-button>
							<span v-if="item.orderStatus === 3" class="order_item--status">待发货</span>
							<div v-if="item.orderStatus === 4" class="order_item--express">
								<p>快递公司： {{item.expressName}}</p>
								<p>快递单号： {{item.expressNum}}</p>
							</div>
						</div> -->
						<!-- 2.0 orderStatus订单状态(1,未付款订单;3,待发货订单;4,已发货订单;5,已作废订单;)
						orderType订单类型(2,学生赊销;4,社会人士赊销;5,借款) -->
						<div class="order_item--button" v-if="item.orderStatus === 1 || item.orderStatus === 5">	
							<y-button type="ghost" class="cancel" v-if="item.orderStatus === 1" @click.native="cancelOrder(item)">取消订单</y-button>
							<span v-if="item.orderStatus === 5" class="order_item--status">已取消</span>
							<y-button type="ghost"  v-if="item.orderStatus === 1" @click.native="pay(item)">支付赊销服务费</y-button>
						</div>
						<div class="order_item--button"  v-else>
							<span v-if="item.orderStatus === 3" class="order_item--status">待发货</span>
							<div v-if="item.orderStatus === 4" class="order_item--express">
								<p>快递公司： {{item.expressName}}</p>
								<p>快递单号： {{item.expressNum}}</p>
							</div>
						</div>
					</div>
				</y-item>
			</y-list>
		</y-load-more-remote>
	</div>
</template>
<script>
import YLoadMoreRemote from '@/components/load-more-remote'
import YList from '@/components/list'
import DateFmt from '@/filters/moment'
import Dialog from '@/components/dialog'
import Toast from '@/components/toast'
export default {
	components: {
		YLoadMoreRemote,
		YList
	},
	props: {
		request: Object,
		groupField: String,
		endTip: {
			type: Boolean,
			default: true
		},
		maxPage: {
			type: Number,
			default: Infinity
		},
		dateFmt: String
	},
	data() {
		return {
			groupData: []
		}
	},
	watch: {
		request: {
			deep: true,
			handler() {
				// console.log('request', this.request)
				this.groupData = [];
			}
		}
	},
	methods: {
		handleClick(id) {
			this.$router.push('/user/order/detail/' + id);
		},
		async getData() {
			let res = await this.$http(this.request);
			let data = res.data.data;				
			this.groupData = data.entities;
		},
		handleLoaded(list, res) {
			this.$emit('loaded', list);
			this.groupData.push(...list);
			// 解决浏览器不重新渲染页面的问题
			
		},
		cancelOrder(item) {
			Dialog.confirm({
				message: '确认取消订单？'                                    
			}).then(() => {
				this.$http.put('/services/app/v1/order/cancel', {orderId: item.id}).then(response => {
					if (response.data.code === '200') {
						item.orderStatus = 5;
						Toast('取消成功');
					} else {
						Toast(response.data.msg)
					}
				})
			})
		},
		pay(item) {
			this.$router.push(`/order/service-charge/user-type/${item.orderType / 2}/order-id/${item.id}`);
		},
		// async refund(item) { 退款
		// 	let res = await this.$http('/services/app/v1/bankCard/list/1/10');
		// 	if (res.data.data.entities.length) {
		// 		Dialog.confirm({
		// 			message: '确认申请？'
		// 		}).then(() => {
		// 			this.$http.put('/services/app/v1/order/refund', {orderId: item.id}).then(response => {
		// 				if (response.data.code === '200') {
		//					item.orderStatus = 6;
		// 					Toast('申请成功');
		// 				} else {
		// 					Toast(response.data.msg)
		// 				}
		// 			})
		// 		})
		// 	} else {
		// 		Toast('请先绑定银行卡');
		// 	}
			
		// },
		// delivery(item) { 提货
		// 	Dialog.confirm({
		// 		message: '确认申请？'
		// 	}).then(() => {
		// 		this.$http.put('/services/app/v1/order/delivery', {orderId: item.id}).then(response => {
		// 			if (response.data.code === '200') {
		//				item.orderStatus = 3
		// 				Toast('申请成功');
		// 			} else {
		// 				Toast(response.data.msg)
		// 			}
		// 		})
		// 	})
		// }
	}
}
</script>
<style>
@import '#/css/var.css';
.order_group {
	& .order_item {
		margin-top: 0.2rem;
		& .item-wrap {
		    border-top: 0;
		    padding-top: 0.4rem;
		    padding-bottom: 0.4rem;
		}
		& .order_item--time{
			font-size: 13px;
			color: var(--text-assist-color);
		}
		& .order_item--price{
			margin-right: 0.16rem;
			font-size: 16px;
			color: #ff5a00;
		}
		& .order_item--button{
			padding: 0.3rem 0;
			text-align: right;
			@apply --border-top;
			font-size: 0;
			& .button{
				padding: 0.16rem 0.14rem;
				line-height: 1;
			}
			& .cancel{
				margin-right: 0.3rem;
				color: #999;
			}
		}
		& .order_item--status{
			display: inline-block;
			text-align: center;
			/*height: 30px;*/
		    width: 75px;
		    /*line-height: 30px;*/
		    font-size: var(--default-font-size);
		    color: #959595;
		}
		& .order_item--express{
			text-align: left;
			font-size: 15px;
			color: var(--text-assist-color);
		}
	}
}
</style>
