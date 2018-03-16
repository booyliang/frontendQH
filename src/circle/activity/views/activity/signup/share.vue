<template>
	<div class="activity-share">
		<y-nav :title="activityInfo.title" class="nav-demo-b">
		</y-nav>
		<!-- <nav class="nav nav-bg">
					<span class="iconfont icon-arrow-left left-icon" @click="backHome"></span>
					{{activityInfo.title}}
				</nav> -->
		<div class="banner" v-if="activityInfo.coverPlan">
			<img :src="activityInfo.coverPlan | imageResize('600_600')">
		</div>
		<section>
			<div class="content">
				<div class="iconfont icon-check-circle success-box"></div>
				<p>报名成功</p>
			</div>
			<div class="status">
				<p>您已参加</p>
				<h3>{{activityInfo.title}}</h3>
			</div>
		</section>
		<div class="share" v-if="inApp">
			<p>赶快分享给更多的朋友加入进来</p>
			<y-share :data="shareData" v-if="shareData"></y-share>
		</div>
		<div class="wx-qq-share-tips" v-if="showWxQqShareTips" @click="showWxQqShareTips = false">
			<div class="tips_main">
				<img src="../../../assets/share-tips@2x.png">
			</div>
		</div>
	</div>
</template>
<script>
import Share from "./../components/share";
import Toast from '@/components/toast';
import Mixin from '../mixins';
const NORMAL = 1; // 正常状态
export default {
	mixins: [Mixin],
	components: {
		[Share.name]: Share
	},
	data() {
		return {
			activityInfo: {},
			shareData: null,
			inApp: this.$yryz.isNative(),
			showWxQqShareTips: false
		}
	},
	created() {
		if (!this.$yryz.isNative() && !this.$env.custId) {
			// 如果页面分享了不是原生的页面
			this.$router.replace(`/platform-activity/signup/${this.$route.params.activityId}`);
		}
	},
	mounted() {
		this.getActivityInfo();
		let pay = this.$localStore.get("pay");
		if (this.inApp) return false;
		if (this.isWx || this.isQq) {
			this.showWxQqShareTips = true;
		} else {
			this.$toast('请使用浏览器的分享，分享给您的好友', {
				autoClose: false
			});
		}
		if (!pay) return;
		if (pay.type === 1) {
			Toast(`报名成功,报名所需${pay.amount}悠然币已扣除`);
		} else if (pay.type === 2) {
			Toast(`报名成功,报名所需积分已扣除`);
		}

	},
	methods: {
		setData() {
			if (this.inApp) {
				const options = {
					content: this.activityInfo.content,
					coverPlanUrl: this.activityInfo.coverPlan,
					title: this.activityInfo.title,
					id: this.activityInfo.id
				};
				this.shareData = Object.assign({}, this.activityInfo, options);
			} else {
				this.$utils.setBrowserShareInfo(this.activityInfo.title, this.activityInfo.content);
			}

		},
		async getActivityInfo() {
			const id = this.$route.params.activityId;
			const res = await this.$opusApi({ url: `/yyl/v1/activity/signUp/activitySignUpHome?id=${id}` });
			if (res.data.ret === NORMAL) {
				this.activityInfo = res.data.data;
				this.setData();
			} else {
				new Error(res.data.msg);
			}
		},
		// backHome() {
		// 	this.$router.replace(`/platform-activity/signup/${this.$route.params.activityId}`);
		// }
	}
}
</script>
<style>
@import '#/css/var.css';
.activity-share {
	/* & .nav {
		height: 1.28rem;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		line-height: .88rem;
		text-align: center;
		font-size: .36rem;
		color: #fff;
		z-index: 20;
		padding: .4rem .3rem 0;
		border-bottom: 1px solid #e5e5e5;
		& .left-icon {
			position: absolute;
			left: .3rem;
			top: .4rem;
			text-align: left;
			color: var(--text-assist-color);
		}
	} */
	& .nav-bg {
		background: #f9f9f9;
		color: var(--text-secondary-color);
		border-bottom: 1px solid #e5e5e5;
	}
	& .banner {
		margin-top: 0.3rem;
		margin-bottom: .3rem;
		& img {
			display: block;
			width: 100%;
			height: 100%;
		}
	}
	& .content {
		margin-bottom: .4rem;
		&>div {
			text-align: center;
			font-size: .7rem;
			color: #ffd460;
		}
		& p {
			text-align: center;
			font-size: .36rem;
			font-weight: 600;
			color: #f5cd45;
		}
	}
	& .status {
		position: relative;
		& p:first-of-type {
			margin-bottom: .2rem;
			text-align: center;
			font-size: .28rem;
			color: var(--text-assist-color);
		}
		& h3 {
			text-align: center;
			height: .9rem;
			line-height: .9rem;
			margin: 0 .64rem;
			position: relative;
			margin-bottom: .64rem;
			border-radius: .45rem;
			font-size: .38rem;
			font-weight: 600;
			color: var(--text-primary-color);
			background-color: #f4f4f4;
		}
		& h3:after {
			width: 0;
			height: 0;
			content: "";
			position: absolute;
			bottom: 100%;
			left: 50%;
			margin-left: -.2rem;
			border-left: solid .2rem transparent;
			border-right: solid .2rem transparent;
			border-bottom: solid .2rem #f4f4f4;
		}
		& .desc {
			text-align: center;
			font-size: .28rem;
			color: var(--text-assist-color);
		}
	}
	& .share {
		margin: 0 0 .42rem;
		position: relative;
		& p {
			text-align: center;
			margin-bottom: .32rem;
			color: var(--text-assist-color);
		}
	}
	& .wx-qq-share-tips {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		z-index: 9999;
		background: rgba(0, 0, 0, .8);
		& .tips_main {
			padding: .2rem 30px 0 0;
			text-align: right;
			& img {
				width: 5.72rem
			}
		}
	}
}
</style>

