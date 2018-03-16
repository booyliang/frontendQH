<template>
	<div class="signup">
		<y-nav title="活动主页" class="nav-demo-b" :showLeftArrow="inApp ? true : false">
			<span v-if="inApp" slot="nav-right" class="iconfont icon-more" @click="actionShare"></span>
		</y-nav>
		<section class="notice">
			<div class="count-down">
				<img :src="activity.coverPlan" alt="">
				<div class="timer">
					<div>
						<span class="iconfont icon-clock"></span>
						<span class="title_status">{{ titleStatus }}</span>
					</div>
					<y-count-down v-if="timer && activity.currentDate" :now-date="activity.currentDate" :end-date="timer"></y-count-down>
				</div>
			</div>
			<h2 class="activity-title" v-if="activity.title">{{activity.title}}</h2>
		</section>
		<section class="activity-rule">
			<h4>
				<span class="iconfont icon-article rule-icon"></span>活动规则</h4>
			<y-content-source :content-source="activity.contentSources"></y-content-source>
		</section>
		<div class="activity-btn-wrapper">
			<y-button block @click.native="partActivity" :disabled="btnDisable">{{btnStatus}}</y-button>
		</div>
	</div>
</template>

<script>
const Not_STARTED = 1;  // 活动未开始
const STARTING = 2;		// 活动已开始-未结束
const END = 3;			// 活动已经结束
const ALREADY_SIGN_UP = 2; // 已经报名
const SIGN_UP = 1; // 可以参与
const NORMAL = 1;  // 正常码
const INIT_TIME = "00-00-00 00:00:00";
import Action from '@/components/comment/action';
import Toast from '@/components/toast';
import ConentSource from '@/components/content-source';
import CountDown from './../components/count-down';
import Share from './../components/share';
import ActionSheet from "@/components/actionsheet";
import Mask from '@/components/mask';
import Dialog from '@/components/dialog';
import Mixin from '../mixins'
export default {
	mixins: [Mixin],
	components: {
		[ConentSource.name]: ConentSource,
		[CountDown.name]: CountDown,
		[Share.name]: Share,
		[Mask.name]: Mask,
		"y-action-sheet": ActionSheet
	},
	data() {
		return {
			inApp: this.$yryz.isNative(),
			activity: {},
			btnStatus: "参加活动",
			titleStatus: "距离活动还有",
			actions: ['YRIM', 'WeChat', 'WeChatLine', 'QQ', 'QQZone', 'Sina'],
			shareData: null,
			timer: null,
			btnDisable: true,
			visible: {
				share: false
			}
		};
	},
	methods: {
		async getActivity() {
			let id = this.$route.params.activityId;
			const res = await this.$opusApi({ url: `/yyl/v1/activity/signUp/activitySignUpHome?id=${id}` });
			if (res.data.ret === NORMAL) {
				this.activity = res.data.data;
				this.setData();
				this.setActivityStatus(this.activity.activityStatus);
				this.$eventBus.$emit('activityDataRefresh', this.activity);
			} else {
				throw new Error(res.data.msg);
			}
		},
		setData() {
			this.shareData = Object.assign({}, this.activity, {
				coverPlanUrl: this.activity.coverPlan,
			});
		},
		setActivityStatus(status) {
			// 设置当前倒计时状态
			if (status === Not_STARTED) {
				this.timer = this.activity.beginTime;
				this.titleStatus = "距离活动开始还有";
			} else if (status === STARTING) {
				this.timer = this.activity.endTime;
				this.titleStatus = "距离活动结束还有";
			}
			// 设置参加活动按钮状态
			if (status === END) {
				this.btnStatus = "已结束";
				this.titleStatus = "活动已结束";
				this.activity.currentDate = INIT_TIME;
				this.timer = INIT_TIME;
			} else if (status === Not_STARTED) {
				this.btnStatus = "未开始";
			}
			// 如果活动名额已经满
			if (this.activity.enrolCount >= this.activity.enrolUpper) {
				this.btnStatus = "名额已满";
			}
			// 如果已经报名
			if (this.activity.enrolStatus === ALREADY_SIGN_UP) {
				this.btnStatus = "已报名";
			}
			if (this.activity.enrolStatus === SIGN_UP && this.activity.activityStatus === 2 && this.activity.enrolCount < this.activity.enrolUpper) {
				this.btnDisable = false;
			}
		},
		actionShare() {
			this.visible.action = true;
			let actions = [
				{
					text: '复制链接',
					handler: () => {
						this.$yryz.pasteboard({
							text: this.$utils.getShareUrl()
						}).then(() => {
							this.$toast(this.$R('copy-success'));
						});
					}
				}
			]
			if (this.activity.amount === 0) {
				actions.unshift({
					text: '分享',
					handler: () => {
						Action["share"].call(this, this.shareData, true, this.actions);
					}
				})
			}
			this.$actionsheet(actions);

		},
		async partActivity() {
			// 如果是第三方
			if (this.inApp) {
				await this.$user.login();
			} else if (!this.$env.custId) {
				this.$eventBus.$emit('login');
				return;
			}
			this.$router.push(`/platform-activity/signup/${this.activity.id}/new`);
		}
	},
	mounted() {
		// if (!this.inApp) this.isWeiXinLogin();
		this.getActivity();
	}
}
</script>

<style>
@import "#/css/var.css";
.signup {
	background-color: #f4f4f4;
	& .notice {
		& .count-down {
			background-color: #fff;
			position: relative;
			&>img {
				width: 100%;
				height: 3.36rem;
				display: block;
			}
			&>.timer {
				width: 100%;
				display: flex;
				justify-content: space-between;
				height: .84rem;
				line-height: 0.84rem;
				position: absolute;
				bottom: 0;
				padding: 0 0.3rem;
				color: #fff;
				font-size: .26rem;
				background: rgba(0, 0, 0, .5);
				&>:first-child>first-child {
					padding-right: .12rem;
				}

				& .title_status {
					font-size: .3rem;
				}
			}
		}
	}
	& .activity-rule {
		/*@apply --border-top;*/
		margin-top: .2rem;
		margin-bottom: 1rem;
		padding: .44rem .3rem .14rem;
		background-color: #fff;
		&>h4 {
			color: var(--text-assist-color);
			font-size: .28rem;
			margin-bottom: .2rem;
		}
		& .rule-icon {
			padding-right: .18rem;
			font-size: .3rem;
			color: #00AFF7;
		}
	}
	& .activity-title {
		height: 1.18rem;
		line-height: 1.18rem;
		padding-left: .3rem;
		font-size: .38rem;
		font-weight: 600;
		background-color: #fff;
	}
	& .activity-btn-wrapper {
		padding: .2rem 0;
		text-align: center;
		background-color: #fff;
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 0;
		border-top: #f3f3f3 solid 1px;
		& .button--block {
			padding: 0;
			height: .68rem;
			border-radius: .16rem;
		}
	}
}
</style>
