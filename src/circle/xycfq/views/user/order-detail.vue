<template>
	<div class="order_detail">
		<y-nav title="订单详情"></y-nav>
		<div class="order_head">
			<div class="order_head-title">订单金额（元）</div>
			<div class="order_head-price">{{detailData.totalAmount | price}}</div>
		</div>
		<div class="order_infolist">
			<div class="detail">
				<div class="detail-title">商品详情:</div>
				<div class="detail-items">
					<y-item v-for="(item, index) of detailData.orderItems" :key="index" :to="`/user/goods-detail/${item.productId}?quantity=${item.quantity}&eq=${index}`">
						<div slot="head">
							<div class="detail-items--img">
								<img :src="item.productImg" alt="商品">
							</div>
							<span>{{item.productName}}</span>
						</div>
					</y-item>
				</div>
			</div>
			<y-item title="商品金额:" :value="detailData.totalAmount | price"></y-item>
			<!--<y-item title="支付方式:" :value="payType" v-if="detailData.orderStatus !== 1 && detailData.orderStatus !== 5"></y-item>-->
			<y-item title="订单号:"  :value="detailData.orderNumber"></y-item>
			<y-item title="创建时间:" :value="detailData.createDate | moment('YYYY-MM-DD HH:mm:ss')"></y-item>
			<y-item title="收货人姓名"  :value="detailData.receivingName"></y-item>
			<y-item title="收货人地址"  :value="detailData.receivingAddress"></y-item>
			<y-item title="收货人电话"  :value="detailData.receivingPhone"></y-item>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				detailData: {}
			}
		},
		created() {
			this.$http.get('/services/app/v1/order/single/' + this.$route.params.id).then(response => {
				if (response.data.code === '200') {
					this.detailData = response.data.data;
				}
			})
		},
		computed: {
			payType() {
				if (this.detailData.orderType === 2 || this.detailData.orderType === 4) {
					return '赊销付款'
				} else {
					switch (this.detailData.channel) 
					{
						case 3:
							return '支付宝';
						case 4:
							return '微信';
						case 5:
							return '苹果';
						case 12:
							return '银联商务';
					}
				}
			}
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.order_detail{
		& .order_head {
			background: #fff;
			text-align: center;
			line-height: 1;
			padding: 0.6rem 0;
			& .order_head-title {
				font-size: 18px;
			}
			& .order_head-price {
				margin-top: 15px;
				font-size: 30px;
				color: #ff5a00;
			}
		}
		& .order_infolist {
			margin-top: 0.2rem;
			& .detail{
				display: flex;
				background-color: #fff;
				& .detail-title {
					padding: 0.65rem 0 0 0.3rem;
					font-size: 17px;
				}
				& .detail-items {
					flex: 1;
					& .detail-items--img{
						display: inline-block;
						margin-right: 0.3rem;
						width: 1.3rem;
						height: 1.15rem;
						border: 1px solid #eee;
						vertical-align: middle;
						& img{
							width: 100%;
							height: 100%;
						}
					}
				}
			}
			& .item-value {
				font-size: 17px;
			}
		}
	}
</style>