<template>
	<div>
		<y-nav :title="$R('unuse-detail')" :menuData="menuData"></y-nav>
		<!--话题详情-->
		<div class="unused_detail">
			<y-flow-detail :data="data"></y-flow-detail>
	
			<div class="unused_detail-info flow_detail">
				<div>
					<span class="unused_detail-info--left">
						<i class="iconfont icon-money-circle"></i>{{$R('transfer-price')}}</span>
					<div class="unused_detail-price">￥
						<span>{{data.price}}</span>.00</div>
				</div>
				<div>
					<span class="unused_detail-info--left">
						<i class="iconfont icon-addr-a"></i>{{$R('unuse-location')}}</span>
					<span class="unused_detail-info--right">{{data.address}}</span>
				</div>
				<div>
					<span class="unused_detail-info--left">
						<i class="iconfont icon-form"></i>{{$R('unuse-fineness')}}</span>
					<span class="unused_detail-info--right">{{data.damageStatus}}</span>
				</div>
				<div v-if="data. dealStatus === 0">
					<span class="unused_detail-info--left">
						<i class="iconfont icon-phone"></i>{{$R('contact-information')}}</span>
					<span class="unused_detail-info--right">{{data.contactInformation}}</span>
				</div>
			</div>
	
			<div v-if="data.dealStatus === 1" class="unused_detail-state">
				<span class="unused_detail-state--complete">{{$R('complete-transaction')}}</span>
			</div>
			<div v-if="data.createUserId === this.$env.userId && data.dealStatus === 0" class="unused_detail-state" @click="closeTar">
				<span class="unused_detail-state--close">{{$R('close-transaction')}}</span>
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
import YFlowDetail from '@/components/flow-detail'
import YComment from '@/components/comment/comment';
import YHot from '@/components/hot';
import Ad from '@/components/ad';
import Dialog from '@/components/dialog'

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
			menuData: ['index', 'refresh', 'copy-url', 'report'],
			data: {},
		}
	},
	async created() {
		let res = await this.$http.get(`/services/app/v1/idlemarket/detail/${this.$route.params.id}`);
		if (res.data.code === '200') {
			this.data = res.data.data;
		}
	},
	methods: {
		closeTar() {
			Dialog.confirm({
				title: this.$R("close-transaction"),
				message: this.$R("unuse-confimcontent"),
			},
				{
					okText: this.$R("unuse-yes"),
					cancleText: this.$R("unuse-no")
				}).then(() => {
					this.$http.put(`/services/app/v1/idlemarket/deal/finish/${this.$route.params.id}`).then(res => {
						if (res.data.code === '200') {
							this.$http.get(`/services/app/v1/idlemarket/detail/${this.$route.params.id}`).then(res => {
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
.unused_detail-info {
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
			& .unused_detail-info--left {
				flex: 0 0 auto;
			}
			& .unused_detail-info--right {
				flex: 1 1 auto;
				line-height: 1.5;
				text-align: right;
				padding: 15px 0;
			}
		}
	}
	& .unused_detail-info--left {
		font-size: 17px;
		& .iconfont {
			color: var(--text-tips-color);
			margin-right: 0.2rem;
			&.icon-addr-a {
				font-size: 19px;
			}
			&.icon-form,
			&.icon-phone {
				font-size: 18px;
			}
			&.icon-money-circle {
				font-size: 16px;
			}
		}
	}
	& .unused_detail-price {
		color: #ff5a00;
		font-size: 10px;
		& span {
			font-size: 18px;
		}
	}
	& .unused_detail-info--right {
		color: var(--text-assist-color);
		margin-left: .2rem;
	}
}

.unused_detail-state {
	background: #fff;
	text-align: center;
	padding: 0.4rem 0;
	& span {
		padding: 0 0.26rem;
		display: inline-block;
		line-height: 0.6rem;
		border-radius: 0.6rem;
		font-size: 16px;
		&.unused_detail-state--complete {
			background: #d7d7d7;
			color: #fff;
		}
		&.unused_detail-state--close {
			border: 1px solid #ffa0a0;
			background: #fff5f5;
			color: #ff6060;
		}
	}
}
</style>