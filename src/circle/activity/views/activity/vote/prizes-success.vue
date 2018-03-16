<template>
	<div class="platform-activity-prizes-sucess-wrap">
		<y-nav :title="title" :showLeftArrow="false"></y-nav>
		<div class="guide-sucess">
			<div class="iconfont icon-check-circle"></div>
			<p>领取成功</p>
		</div>

		<div class="prize">
			<h2 class="prizes-sucess">奖品已发放至{{phone}}的账户<br>登录圈乎APP即可使用奖励</h2>
		</div>

		<y-button block @click.native="download" class="user_button">下载圈乎APP</y-button>
	</div>
</template>
<script>
import List from '@/components/list';
import Item from '@/components/item';
import Toast from '@/components/toast';
import Dialog from '@/components/dialog';
import VoucherItem from '../components/voucher-item';
import Mixin from '../mixins';
export default {
	components: {
		[List.name]: List,
		[Item.name]: Item,
		[VoucherItem.name]: VoucherItem,
	},
	mixins: [Mixin],
	data() {
		return {
			title: '',
			phone: '',
		}
	},
	
	async mounted() {
		if (!this.$yryz.isNative() && !this.$env.custId)
			this.$router.replace({ path: `/platform-activity/vote/${this.$route.params.activityId}` });

		// 标题 + 无奖励文案
		let params = { activityInfoId: this.$route.params.activityId }
		let resData = await this.$opusApi.get(`/yyl/v1/activity/info/getActivityTitle`, params);
		if (resData.data.ret === 1) {
			this.title = resData.data.data.activityTitle;
		}
		let custId = this.$env.custId;
		params = {
			custId: custId,
			fid: custId
		}
		resData = await this.$openApi.post(`/api/v3/user/find`, params);
		if (resData.data.ret === 1 && resData.data.data.custPhone)
			this.phone = resData.data.data.custPhone;
	},
	methods: {
		download() {
			this.downloadApp();
		}
	}
}
</script>
<style>
@import "#/css/var.css";
.platform-activity-prizes-sucess-wrap {
	padding: 0 .3rem;
	& .guide-sucess {
		text-align: center;
		color: #FFD460;
		margin-top: .3rem;
		& .iconfont {
			font-size: .64rem;
		}
		& p {
			font-size: .36rem;
			font-weight: bold;
		}
	}
	& .prize {
		margin-top: .2rem;
		& h2 {
			color: #666;
			font-size: .26rem;
		}
		& .prizes-sucess {
			text-align: center;
		}
		& .volume-container {
			margin-top: .4rem;
			& .volume {
				display: flex;
				justify-content: space-between;
				box-shadow: 0 0 0.1rem rgba(0, 0, 0, .1);
				& .ticket,
				& .ticket-other {
					color: #FFF;
					width: 2.3rem;
					height: 2rem;
					background-repeat: no-repeat;
					background-size: cover;
					& .ticket-type {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 1rem;
						height: .4rem;
						font-size: .24rem;
					}
					& div {
						text-align: center;
					}
					& .ticket-num {
						font-size: .8rem;
					}
					& .ticket-unit {
						font-size: .4rem;
					}
				}
				& .ticket {
					background-image: url("../../../assets/ticket_1.png");
				}
				& .ticket-other {
					background-image: url("../../../assets/ticket_2.png");
				}
				& .ticket-over {
					background-image: url("../../../assets/ticket_over.png");
				}
				& .ticket-text {
					@apply --border;
					border-left: none;
					width: 4.6rem;
					padding: 0 .2rem;
					display: flex;
					flex-direction: column;
					justify-content: space-around;

					& .prizes-name {
						@apply --text-cut-multi-line;
						-webkit-line-clamp: 2;
						font-size: .3rem;
					}
					& .prizes-time {
						position: relative;
						font-size: .22rem;
						color: #999;

						& .prizes-over {
							@apply --border;
							font-size: .24rem;
							padding: 0rem .2rem;
							border-radius: .4rem;
							position: absolute;
							right: 0;
							background: #FFF;
						}
					}
					& .show-more {
						font-size: .24rem;
						color: #999;
						display: flex;
						justify-content: space-between;
						& .iconfont {
							background: #bbb;
							border-radius: 100%;
							width: .36rem;
							height: .36rem;
							text-align: center;
							color: #FFF;
							line-height: .36rem;
							font-size: .20rem;
						}
					}
				}
			}
			& .shor-remark {
				@apply --border;
				padding: .1rem;
				font-size: .26rem;
				&.fade-enter-active,
				&.fade-leave-active {
					transition: all 0.5s ease;
				}
				&.fade-enter,
				&.fade-leave-active {
					opacity: 0;
				}
			}
		}
	}
	& .bind-phone {
		margin-top: .4rem;
	}
	& .button {
		margin-top: .4rem;
	}
	& .user_button {
		margin-bottom: .4rem;
	}
}
</style>


