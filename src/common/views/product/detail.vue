<template>
	<div class="product">
		<y-nav title="详情" :menuData="menuData"></y-nav>
		<!--话题详情-->
		<div class="product_detail">
			<y-flow-detail :data="data"></y-flow-detail>
	
			<div class="product_detail-info flow_detail">
				<div>
					<span class="product_detail-info--left">
						<i class="iconfont icon-money-circle"></i>{{$R('transfer-price')}}</span>
					<div class="product_detail-price">￥
						<span>{{data.price}}</span>.00</div>
				</div>
				<div>
					<span class="product_detail-info--left">
						<i class="iconfont icon-addr-a"></i>{{$R('product-location')}}</span>
					<span class="product_detail-info--right">{{data.address}}</span>
				</div>
				<div>
					<span class="product_detail-info--left">
						<i class="iconfont icon-form"></i>{{$R('product-fineness')}}</span>
					<span class="product_detail-info--right">{{data.damageStatus}}</span>
				</div>
				<div v-if="data. dealStatus === 0">
					<span class="product_detail-info--left">
						<i class="iconfont icon-phone"></i>{{$R('contact-information')}}</span>
					<span class="product_detail-info--right">{{data.contactInformation}}</span>
				</div>
			</div>
	
			<div v-if="data.dealStatus === 1" class="product_detail-state">
				<span class="product_detail-state--complete">{{$R('complete-transaction')}}</span>
			</div>
			<div v-if="data.createUserId === this.$env.userId && data.dealStatus === 0" class="product_detail-state">
				<span class="product_detail-state--close" @click="closeTar">{{$R('close-transaction')}}</span>
			</div>
	
			<y-hot :hots="['like', 'forward']" :data="data">
				<div slot="foot">
					<y-ad :type="1" keyword="圈子内容"></y-ad>
				</div>
			</y-hot>
		</div>
	
		<!--评论-->
		<y-comment :data="data"></y-comment>
	
	</div>
</template>
<script>
import YFlowDetail from '@/components/flow-detail';
import YComment from '@/components/comment/comment';
import YHot from '@/components/hot';
import Ad from '@/components/ad';
import Dialog from '@/components/dialog';

export default {
	components: {
		YFlowDetail,
		YHot,
		YComment,
		[Ad.name]: Ad

	},
	data() {
		return {
			title: '',
			menuData: ['index', 'copy-url', 'report'],
			data: {},
		}
	},
	async created() {
		let res = await this.$http.get(`/services/app/v1/goods/context/detail/${this.$route.params.id}`);
		if (res.data.code === '200') {
			this.data = res.data.data;
		}
	},
	methods: {
		closeTar() {
			Dialog.confirm({
				title: this.$R("close-transaction"),
				message: this.$R("product-confimcontent"),
			},
				{
					okText: this.$R("product-yes"),
					cancleText: this.$R("product-no")
				}).then(() => {
					this.$http.put(`/services/app/v1/goods/context/deal/finish/${this.$route.params.id}`).then(res => {
						if (res.data.code === '200') {
							this.$http.get(`/services/app/v1/goods/context/detail/${this.$route.params.id}`).then(res => {
								this.data = res.data.data;
							})
						}
					})
				})
		}
	}
}
</script>
<style>
@import "#/css/var.css";
.product_detail {
	& .content_source {
		display: flex;
		flex-direction: column;

		&>* {
			margin-top: 0;
		}
		& .content_source-text {
			order: 1;
			margin-bottom: 0;
		}
	}
    & .hot-button {
        padding-top: .7rem;
    }	
    & .flow_detail-title {
    	display: block;
    }
}

.product_detail-info {
	background: #fff;
	padding: 0 0.3rem;
	&>div {
		@apply --border-top;
		line-height: 0.96rem;
		display: flex;
		justify-content: space-between;
		padding: 0 0.16rem;
		&:last-child {
			@apply --border-bottom;
			display: flex;
			align-items: center;
			& .product_detail-info--left {
				flex: 0 0 auto;
			}
			& .product_detail-info--right {
				flex: 1 1 auto;
				line-height: 1.5;
				text-align: right;
				padding: 15px 0;
			}
		}
	}
	& .product_detail-info--left {
		font-size: .34rem;
		& .iconfont {
			color: var(--text-tips-color);
			margin-right: 0.2rem;
			&.icon-addr-a {
				font-size: .38rem;
			}
			&.icon-form,
			&.icon-phone {
				font-size: .36rem;
			}
			&.icon-money-circle {
				font-size: .32rem;
			}
		}
	}
	& .product_detail-price {
		color: #ff5a00;
		font-size: .2rem;
		& span {
			font-size: .36rem;
		}
	}
	& .product_detail-info--right {
		color: var(--text-assist-color);
		margin-left: .2rem;
	}
}

.product_detail-state {
	background: #fff;
	text-align: center;
	padding-top: .4rem;
	& span {
		padding: 0 0.26rem;
		display: inline-block;
		line-height: 0.6rem;
		border-radius: 0.6rem;
		font-size: .32rem;
		&.product_detail-state--complete {
			background: #d7d7d7;
			color: #fff;
		}
		&.product_detail-state--close {
			border: 1px solid #ffa0a0;
			background: #fff5f5;
			color: #ff6060;
		}
	}
}
</style>