<template>
	<div class="platform-activity-prizes-wrap">
		<y-nav :title="title" :showLeftArrow="false"></y-nav>
		<div class="guide-sucess">
			<div class="iconfont icon-check-circle"></div>
			<p>投票成功</p>
		</div>

		<div class="prize" v-if="prizes">
			<h2 v-html="showTitleTips"></h2>
			<div v-for="(item, index) of prizes" :key="index" class="volume-container">
				<template v-if="item.prizesType === 1">
					<div class="volume">
						<div class="ticket" :class="{'ticket-over': item.issueNum === 0}" :style="{'background-image': ''}">
							<span class="ticket-type" v-text="item.prizesName"></span>
							<div>
								<span v-text="item.canNum" class="ticket-num"></span>
								<span class="ticket-unit">票</span>
							</div>
						</div>
						<div class="ticket-text">
							<div v-text="item.remark" class="prizes-name"></div>
							<div class="prizes-time">
								<span v-text="prizesTime(item)"></span>
								<span v-if="item.issueNum === 0" class="prizes-over">已领完</span>
							</div>
						</div>
					</div>
				</template>
				<template v-else>
					<voucher-item :data="item"></voucher-item>
				</template>
			</div>
		</div>

		<div class="bind-phone" v-if="!isBindPhone && !noHasPrizes">
			<y-verification-phone :value='value'></y-verification-phone>
		</div>

		<div v-if="prizes">
			<y-button v-if="noHasPrizes || isBindPhone" block @click.native="download" class="get-button">下载圈乎APP</y-button>
			<y-button v-else block @click.native="submit" class="get-button">领取奖励</y-button>
		</div>
	</div>
</template>
<script>
import List from '@/components/list';
import Item from '@/components/item';
import Phone from '../components/verification-phone';
import VoucherItem from '../components/voucher-item';
import Toast from '@/components/toast';
import Dialog from '@/components/dialog';
import Mixin from '../mixins';
export default {
	components: {
		[List.name]: List,
		[Item.name]: Item,
		[Phone.name]: Phone,
		VoucherItem,
	},
	mixins: [Mixin],
	data() {
		return {
			title: '',
			prizesText: '',
			prizes: null,
			value: {
				phone: '',
				verifyCode: ''
			},
			noHasPrizes: false,
			isBindPhone: true,
		}
	},

	computed: {
		showTitleTips() {
			return this.noHasPrizes
				? this.prizesText
				: this.isBindPhone
					? `奖品已发放至${this.value.phone}的账户<br>登录圈乎APP即可使用奖励`
					: '为了感谢您对参赛选手的支持，您已获得如下奖励：';
		}
	},
	async mounted() {
		// 标题 + 无奖励文案
		let resData = await this.$opusApi.get(`/yyl/v1/activity/info/getActivityTitle?id=${this.$route.params.activityId}`);
		if (resData.data.ret === 1) {
			this.title = resData.data.data.activityTitle;
			this.prizesText = resData.data.data.noRewardContent;
		}
		// 奖品列表信息
		resData = await this.$opusApi.get(`/yyl/v1/activity/vote/prizeslist?activityInfoId=${this.$route.params.activityId}`)
		if (resData.data.ret === 1) {
			this.prizes = resData.data.data;
			this.noHasPrizes = this.prizes.filter(item => item.issueNum > 0).length === 0;
		}
		if (this.noHasPrizes) return;

		// 获取用户信息
		let params = { custId: this.$env.custId }
		if (!this.$yryz.isNative()) {
			resData = await this.$openApi.post(`/api/v3/user/loginMethod`, params);
			if (resData.data.ret === 1) {
				let _data = resData.data.data.filter(item => item.type === 4);
				this.isBindPhone = !!_data[0].thirdId;
				if (_data.length && this.isBindPhone) {
					this.value.phone = _data[0].thirdId;
					this.submit();
					return false;
				}
			}
		}
	},
	methods: {
		prizesTime(item) {
			return item.beginTime.split(' ')[0].replace(/-/g, '.') + '-' + item.endTime.split(' ')[0].replace(/-/g, '.');
		},
		async validation() {
			if (this.value.verifyCode === '') {
				Toast('请输入验证码');
				return;
			}
			let params = {
				code: '8',
				phone: parseInt(this.value.phone),
				veriCode: this.value.verifyCode,
				custId: this.$env.custId,
			}
			let res = await this.$opusApi.post(`/yyl/v1/activity/vote/checkVerifyCode`, params);
			if (res.data.ret === 3) {
				Toast(res.data.msg);
				return;
			}
			if (res.data.data.check === '0') {
				Toast('手机号码或验证码不正确');
				return false;
			}
			return true;
		},
		async submit() {
			if (this.value.phone === '') {
				Toast('请输入手机号');
				return false;
			}
			if (!this.isBindPhone)
				if (!await this.validation()) return false;

			let params = {
				activityInfoId: parseInt(this.$route.params.activityId),
				phone: this.value.phone,
			}
			let res = await this.$opusApi.post(`/yyl/v1/activity/vote/getPrize`, params)
			if (res.data.msg === 'success') {
				if (res.data.data.freeVoteFlag === 0) {
					this.$router.replace({ name: 'voteIndex' });
					return false;
				}
				if (!this.isBindPhone) {
					this.$router.replace({ name: 'prizesSuccess' });
				}
			} else {
				Toast(res.data.msg);
			}
		},
		download() {
			this.downloadApp();
		}
	}
}
</script>
<style>
@import "#/css/var.css";
.platform-activity-prizes-wrap {
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
			text-align: center;
		}

		& .volume-container {
			margin-top: .4rem;
			& .volume {
				display: flex;
				justify-content: space-between;
				& .ticket,
				& .ticket-other {
					color: #FFF;
					width: 2.3rem;
					height: 2rem;
					background-repeat: no-repeat;
					background-size: cover;
					& .ticket-type {
						display: inline-block;
						font-size: .24rem;
						background-color: rgba(255, 255, 255, .4);
						padding: .06rem .15rem;
						border-top-left-radius: .1rem;
						border-bottom-right-radius: .1rem;
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
					border-radius: .1rem;

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
				border-radius: .1rem;
				border-top: none;
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
		& .phone,
		& .verifyCode {
			overflow: hidden;
		}
	}

	& .get-button {
		margin-top: .4rem;
		margin-bottom: .4rem;
	}
}
</style>


