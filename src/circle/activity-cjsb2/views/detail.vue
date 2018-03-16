<template>
	<div class="temporary_activity-detail">
		<y-nav title="长江商报·红牛2017武汉大学生艺术创业" :showLeftArrow="showLeftArrow"></y-nav>
		<div class="temporary_activity-content">
			<p class="temporary_activity-count">
				<span>编号：{{ detailData.voteNo }}</span>
				<label>票数：
					<i>{{ detailData.voteCount }}</i>
				</label>
			</p>
			<p class="temporary_activity-name">
				<span>{{ detailData.title }}</span>
				<label>{{ detailData.createDate | recentTime }}</label>
			</p>
			<p class="temporary_activity-school">
				<span>{{ detailData.schoolName }}</span>
			</p>
			<p class="temporary_activity-intro">{{ detailData.content }}</p>
			<p class="temporary_activity-img" v-if="imgs.length">
				<img v-for="(img, index) of imgs" :src="img | imageResize(6)" :key="index">
			</p>

			<div class="temporary_activity-vote">
				<y-button type="ghost" class="help_btn" @click.native="onShare">帮TA拉票</y-button>
				<y-button class="join_btn" @click.native="voted">投TA一票</y-button>
				<div class="go_index_button" @click="toList" v-if="!showLeftArrow">
					投票<br>列表
				</div>
			</div>
		</div>
		<y-share ref="share"></y-share>
		<div class="wx-qq-share-tips" v-if="showWxQqShareTips" @click="showWxQqShareTips = false">
			<div class="tips_main">
				<img src="../assets/share-tips.png">
			</div>
		</div>
	</div>
</template>
<script>
import YShare from '@/components/comment/share'
export default {
	components: {
		YShare
	},
	data() {
		return {
			showLeftArrow: false,
			inApp: this.$yryz.isNative(),
			detailData: {},
			voteDisabled: false,
			showWxQqShareTips: false
		}
	},
	computed: {
		imgs() {
			if (!this.detailData.imgUrl) return [];
			return this.detailData.imgUrl.split(',');
		},
		isWx() {
			return navigator.userAgent.match(/micromessenger/i) ? true : false;
		},
		isQq() {
			return navigator.userAgent.indexOf('MQQBrowser') !== -1;
		}
	},
	methods: {
		onShare() {
			if (this.$yryz.isNative()) {
				this.$refs.share.open({
					title: this.detailData.title,
					content: this.detailData.content,
					coverPlanUrl: this.detailData.coverPlan,
					url: `${window.location.origin}/activity-temporary/detail/${this.detailData.id}`
				});
			} else if (this.isWx || this.isQq) {
				this.showWxQqShareTips = true;
			} else {
				this.$toast('请使用浏览器的分享，分享给您的好友', {
					autoClose: false
				});
			}
		},
		async voted() {
			if (this.inApp) await this.$user.login();
			if (!this.$env.custId) {
				this.$eventBus.$emit('login');
				return;
			}
			this.$indicator.open('投票中...');
			let response = await this.$http.post(`/services/app/v1/temp/activity/vote/opus`, { candidateId: this.detailData.id })
			this.$indicator.close();
			let resData = response.data;
			if (resData.code === '200') {
				this.$eventBus.$emit('voteToast', 'success');
				this.detailData.voteCount++;
			} else if (resData.code === '1078') {
				this.$eventBus.$emit('voteToast', 'error');
			} else {
				this.$toast(resData.msg);
			}
		},
		toList() {
			window.location.href = `/activity-cjsb2/index`;
		}
	},
	mounted() {
		this.$http.get(`/services/app/v1/temp/activity/opus/single/${this.$route.params.id}`).then(response => {
			let resData = response.data;
			if (resData.code === '200') {
				this.detailData = resData.data;
				if (!this.$yryz.isNative()) {
					this.$utils.setBrowserShareInfo(this.detailData.title, this.detailData.content);
				}
			}
		})
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			if (from.path !== '/') {
				vm.showLeftArrow = true;
			}
		});
	}
}
</script>

<style>
@import '#/css/var.css';
.temporary_activity-detail {
	padding-bottom: 1.1rem;
	& .temporary_activity-content {
		padding: .3rem;

		& .temporary_activity-count {
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: var(--text-assist-color);
			margin-bottom: .3rem;
			& label i {
				color: #f8bc1a;
				margin-left: .1rem;
			}
		}

		& .temporary_activity-name {
			display: flex;
			align-items: center;
			margin-bottom: .3rem;
			& span {
				font-size: .36rem;
				color: #0185ff;
			}

			& label {
				font-size: .24rem;
				color: var(--text-assist-color);
				margin-left: .3rem;
			}
		}

		& .temporary_activity-school {
			margin-bottom: .3rem;
			font-size: .34rem;
			color: var(--text-tips-color);
		}

		& .temporary_activity-intro {
			margin-bottom: .3rem;
			font-size: .34rem;
			color: var(--text-primary-color);
			line-height: 1.65;
		}

		& .temporary_activity-img {
			width: 100%;

			& img {
				width: 100%;
				border-radius: .12rem;
			}
		}

		& .temporary_activity-vote {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: .3rem 0;
			margin-top: .3rem;
			display: flex;
			align-items: center;
			justify-content: space-around;
			font-size: .32rem;
			background-color: #fff;
			box-shadow: 0 0 15px rgba(0, 0, 0, .1);

			& button {
				display: inline-block;
				width: 2.2rem;
				height: .6rem;
				border-radius: .1rem;
			}

			& .help_btn {
				border: .03rem solid #67b6ff;
				color: #67b6ff;
				line-height: 1;
			}

			& .join_btn {
				line-height: 1;
				color: #fff;
			}
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
	& .go_index_button {
		position: fixed;
		left: 0;
		top: 50%;
		display: flex;
		align-items: center;
		padding-left: .1rem;
		width: 1rem;
		height: 1rem;
		color: #fff;
		background: var(--theme-color);
		font-size: .24rem;
		transform: translateY(-50%);
		border-top-right-radius: 50%;
		border-bottom-right-radius: 50%;
		box-shadow: 0 0 15px rgba(0, 0, 0, .5);
	}
}
</style>