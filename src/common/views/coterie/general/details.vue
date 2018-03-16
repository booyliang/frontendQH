<template>
	<div class="coterie-publish_detail">
		<div :class="{ 'blur-wrapper': showBuyModal }">
			<y-nav title="详情">
				<y-button @click.native.stop="onAction" slot="nav-right" type="text" class="iconfont icon-more" v-if="permission !== 300"></y-button>
			</y-nav>
			<div class="publish_detail-content flow_detail">
				<h1 class="title">{{ detailData.title }}</h1>
				<div class="content-info">
					<strong class="nickname" @click="clickName(detailData.createUserId)">{{ detailData.nickName }}</strong>
					<span class="create_time">{{ detailData.createDate | recentTime }}</span>
					<y-tag v-if="detailData.contentPrice > 0" type="warning" class="price">{{ detailData.contentPrice | priceUnit}}悠然币</y-tag>
				</div>
				<y-content-source v-if="!showBuyModal" class="content-source" :content-source="detailData.contentSource"></y-content-source>
				<div class="unpurchased_tips" v-if="showBuyModal">
					<div class="unpurchased_tips-logo"></div>
					<div class="unpurchased_tips-content">
						<!-- <template v-if="isNative">
															该资源付费可读，请付费阅读
														</template> -->
						<template>
							该资源付费可读，赶紧下载app查看吧
						</template>
					</div>
				</div>
			</div>
			<y-hot :hots="hots" :data="detailData"></y-hot>
			<y-comment class="bannerbottomShut" :data="detailData"></y-comment>
			<y-bottombanner v-if="$coterie.permission === 300"></y-bottombanner>
		</div>
		<div class="buy_modal-wrapper" v-if="showBuyModal">
			<div class="buy_modal-container">
				<span @click="closeBuyModal" class="iconfont icon-close1"></span>
				<div class="buy_modal-body">
					<h2>该资源详情付费可读，请先完成支付</h2>
					<h3>
						<span>待支付总额</span><br>
						<span class="price">{{ contentPrice | priceUnit}}</span>
						<span class="unit">悠然币</span>
					</h3>
				</div>
				<div class="buy_modal-footer">
					<div>
						<y-button :disabled="disabledPayButton" block @click.native="toPay(detailData.id)">支付</y-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Bottombanner from '../components/bottombanner'
import YContentSource from '@/components/content-source'
import YComment from '@/components/comment/comment'
import YHot from '@/components/hot'
import YTag from '../components/tag'
import Toast from '@/components/toast'
import actiontMixin from '../mixins/action-methods';
import shareInfo from '../mixins/shareInfo';
export default {
	name: 'publish-detail',
	mixins: [
		actiontMixin,
		shareInfo
	],
	components: {
		YContentSource,
		YTag,
		YComment,
		YHot,
		Toast,
		[Bottombanner.name]: Bottombanner,
	},
	data() {
		return {
			hots: ['forward'],
			detailData: {},
			isNative: this.$yryz.isNative(),
			contentPrice: 0,
			disabledPayButton: false
		}
	},
	computed: {
		permission() {
			return this.$coterie.permission;
		},
		isOwner() {
			return parseInt(this.detailData.identityFlag) === 100;
		},
		showBuyModal() {
			return !this.isOwner && !this.detailData.boughtFlag && !!this.contentPrice;
		},
		menuData() {
			let menu = [{
				text: '收藏',
				handler: () => this.handleCollect(this.detailData)
			},
			{
				text: '取消收藏',
				handler: () => this.handleUncollect(this.detailData)
			},
			{
				text: '删除',
				handler: () => this.handleDelete(this.$route.params.detailId, '/services/app/v1/coterie/release/info/single/', 'detail')
			},
			{
				text: '举报',
				handler: () => this.handleReport(this.$route.params.detailId)
			}
			]
			let newMenu = [];
			if (this.permission === 100) {
				if (this.detailData.contentPrice) {
					if (this.hasCollected) {
						newMenu.push(menu[1])
					} else {
						newMenu.push(menu[0])
					}
				} else {
					if (this.hasCollected) {
						newMenu.push(menu[1], menu[2])
					} else {
						newMenu.push(menu[0], menu[2])
					}
				}
			} else {
				if (this.hasCollected) {
					newMenu.push(menu[1], menu[3])
				} else {
					newMenu.push(menu[0], menu[3])
				}
			}
			return newMenu
		}
	},
	methods: {
		async toPay(id) {
			this.disabledPayButton = true;
			try {
				let data = await this.$http.get(`/services/app/v1/coterie/release/info/order/${id}`);
				this.disabledPayButton = true;
				let orderId = data.data.data.orderNo;
				await this.$yryz.pay({
					payMoney: this.detailData.contentPrice,
					orderId: orderId
				});
				let res = await this.$http.get(`/services/app/v1/order/getOrderInfo/${orderId}`);
				if (res.data.data.orderState === 1) {
					this.disabledPayButton = false;
					this.detailData.boughtFlag = 1;
					this.$toast('支付成功');
				}
			} catch (error) {
				this.disabledPayButton = false;
				this.$toast(error.data);
			}
		},
		closeBuyModal() {
			this.$router.back();
		},
		onAction() {
			// if (!this.isNative) return;
			this.$actionsheet(this.menuData);
		},
		clickName(userId) {
			this.$yryz.toPersonalInfo({
				userId: userId
			});
		},
	},
	async created() {
		let res = await this.$http.get(`/services/app/v1/coterie/release/info/detail/${this.$route.params.detailId}`);
		let resData = res.data;
		this.detailData = resData.data;
		this.contentPrice = this.detailData.contentPrice;
		this.$nextTick(() => {
			this.shareInfo({
				title: this.detailData.title,
				desc: this.detailData.content,
				imgUrl: this.detailData.imgUrl.split(',')[0].toString()
			});
		})
		
		// 查询收藏状态
		if (this.isNative && this.$env.custId) {
			let checkCollectRes = await this.$http.post(`/services/app/v1/store/check`, {
				moduleEnum: this.detailData.moduleEnum,
				infoId: this.detailData.id,
				resourceId: this.detailData.resourceId
			})
			if (checkCollectRes.data.code === '200') {
				this.hasCollected = checkCollectRes.data.data
			} else {
				this.$toast(checkCollectRes.data.msg);
			}
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.publish_detail-content {
	padding: 0 .3rem;
	background-color: #fff;
	overflow: hidden;
	
	& .comment-tool .comment-tool-wrap {
		position: fixed;
		z-index: 99;
		bottom: 2rem;
	}
	
	& .title {
		margin-top: .2rem;
		line-height: 28px;
		font-size: .44rem;
		color: var(--text-primary-color);
	}
	& .content-info {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-top: .2rem;
		font-size: .28rem;
		position: relative;

		& .icon-tag-b {
			position: absolute;
			right: 0;
		}
	}
	& .nickname {
		color: #349dff;
	}
	& .price {
		margin-left: .3rem;
	}
	& .create_time {
		margin-left: .2rem;
		font-size: .24rem;
		color: var(--text-assist-color);
	}
	& .content-source {
		margin-top: .4rem;
	}
	& .unpurchased_tips {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		min-height: 3.1rem;
		margin-top: .4rem;
		border-radius: .1rem;
		background: #e5f3ff;
		color: var(--theme-color);
		font-size: .32rem;
	}
	& .unpurchased_tips-logo {
		width: .8rem;
		height: 1.35rem;
		background: url("/assets/static/logo-quanhu.png") no-repeat center center;
		background-size: cover;
	}
	& .unpurchased_tips-content {
		margin-top: .44rem;
	}
}

.coterie-publish_detail {
	& .blur-wrapper {
		filter: blur(3px);
	}
	& .buy_modal-wrapper {
		@apply --full;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
		background-color: rgba(0, 0, 0, .5);
		& .buy_modal-container {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			background-color: white;
			& .icon-close1 {
				position: absolute;
				top: -.8rem;
				right: .2rem;
				color: white;
				font-size: .66rem;
			}
			& .buy_modal-body {
				text-align: center;
				padding: .4rem .3rem .3rem;
				& h2 {
					@apply --border-bottom;
					padding-bottom: .4rem;
					font-size: .34rem;
					color: var(--text-secondary-color);
				}
				& h3 {
					padding-top: .3rem;
					font-size: .33rem;
					color: var(--text-assist-color);
					& .price {
						padding-left: .1rem;
						padding-right: .1rem;
						font-size: .72rem;
						color: var(--secondary-color);
					}
					& .unit {
						font-size: .24rem;
						color: #999;
					}
				}
			}
			& .buy_modal-footer {
				padding: .2rem;
				text-align: center;
				@apply --border-top;
			}
		}
	}
	& .comment_panel.panel--rich {
		margin-top: 0;
	}
}
</style>