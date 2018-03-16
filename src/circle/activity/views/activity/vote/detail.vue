<template>
	<div class="platform_activity-detail" v-if="detailData">
		<y-nav :title="detailData.activityTitle" :showLeftArrow="inApp"></y-nav>
		<div class="platform_activity-content">
			<div class="platform_activity-spec">
				<p class="platform_activity-name">
					<span>{{ detailData.nickName }}</span>
					<label>{{ detailData.createDate | recentTime }}</label>
				</p>
				<p class="platform_activity-count">
					<label>票数：
						<i>{{ detailData.voteCount }}</i>
					</label>
					<span>编号：{{ detailData.voteNo }}</span>
				</p>
			</div>
			<p class="platform_activity-intro" v-if="detailData.text" v-text="detailData.text"></p>
			<p class="platform_activity-intro" v-if="detailData.text1" v-text="detailData.text1"></p>
			<p class="platform_activity-intro" v-if="detailData.text2" v-text="detailData.text2"></p>
			<p class="platform_activity-img" v-if="imgs.length">
				<img v-for="(img, index) in imgs" :src="img | imageResize(6)" :key="index">
			</p>
			<div v-if="detailData.videoUrl">
				<y-video :src="detailData.videoUrl" :poster="detailData.videoThumbnailUrl"></y-video>
				<!-- <video v-else width="100%" height="10rem" :src="detailData.videoUrl" :poster="detailData.videoThumbnailUrl" controls></video> -->
			</div>

			<div class="platform_activity-vote" :class="{'platform_activity-vote-noApp': !inApp}">
				<div class="platform_activity-vote-container" :class="{'platform_activity-vote-comment': !inApp || detailData.commentFlag !== 1}">
					<div class="tip-text" v-if="!inApp">
						<y-button @click.native="goVoteIndex">浏览更多</y-button>
						<div v-html="voteDiff" class="vote-diff"></div>
						<div>
							马上给
							<span class="tip-nickname" v-text="detailData.nickName"></span>拉票
						</div>
					</div>
					<div class="buttons">
						<y-button type="ghost" class="help_btn" @click.native="onShare">帮TA拉票</y-button>
						<y-button class="join_btn" :disabled="voteFlag" @click.native="voted">{{voteFlag ? '票已投完' : '投TA一票'}}</y-button>
					</div>
				</div>
			</div>
		</div>

		<y-comment v-if="inApp && detailData.commentFlag === 1" :data="detailData" :useOpusApi="true"></y-comment>
		<y-share ref="share" :useOpusApi="true"></y-share>
		<div class="wx-qq-share-tips" v-if="showWxQqShareTips" @click="showWxQqShareTips = false">
			<div class="tips_main">
				<img src="../../../assets/share-tips@2x.png">
			</div>
		</div>
	</div>
</template>
<script>
import YComment from '@/components/comment/comment';
import YVideo from '@/components/video';
import YShare from '@/components/comment/share'
import Mixin from '../mixins';
import moment from 'moment';
export default {
	components: {
		YShare, YComment, YVideo
	},
	mixins: [Mixin],
	data() {
		return {
			fromSelf: true,
			refreshVoteList: false,
			detailData: null,
			voteDisabled: false,
			showWxQqShareTips: false,
			inApp: !!this.$yryz.isNative(),

			hasVotes: 0,
			configVotes: 0,
			voteType: 1,
		}
	},
	computed: {
		imgs() {
			if (!this.detailData.imgUrl) return [];
			return this.detailData.imgUrl.split(',');
		},
		voteFlag() {
			return this.hasVotes >= this.configVotes && this.detailData.userRollFlag === 0;
		},
		voteDiff() {
			let count = 0;
			if (this.detailData.frontVoteDiffer) {
				count = this.detailData.frontVoteDiffer;
				return `只差<span class="vote-count">${count}票</span>就能超过前一名`
			} else if (this.detailData.afterVoteDiffer) {
				count = this.detailData.afterVoteDiffer;
				return `只差<span class="vote-count">${count}票</span>就会被后一名超过了`
			} else {
				return `趁还没有其他人参与活动`
			}
		}		
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.refreshVoteList = from.name === 'voteShareO';
			vm.fromSelf = from.path === '/';
		});
	},
	methods: {
		goVoteIndex() {
			if (this.refreshVoteList) {
				this.$utils.refreshOnBack();
				this.$eventBus.$emit('refreshVoteList');
			}
			if (this.fromSelf) {
				this.$router.push({ name: 'voteIndex' });
			} else {
				this.$router.back();
			}
		},
		onShare() {
			if (this.inApp) {
				let content = this.detailData.text || this.detailData.text1 || this.detailData.text2 || '';
				this.$refs.share.open({
					id: this.detailData.id,
					moduleEnum: this.detailData.moduleEnum,
					createUserId: this.detailData.createUserId,
					title: this.detailData.activityTitle ? this.detailData.activityTitle.substring(0, 20) : '',
					content: content ? content.substring(0, 70) : '',
					resourceId: this.detailData.resourceId,
					coverPlanUrl: this.detailData.coverPlan,
				});
			} else if (this.isWx || this.isQq) {
				this.showWxQqShareTips = true;
			} else {
				this.$toast('请使用浏览器的分享，分享给您的好友', {
					autoClose: false
				});
			}
		},
		getActivityStatus() {
			let activityData = this.$attrs['activity-data'];
			if (activityData.activityStatus === 2) {
				let start = moment(activityData.activityVoteBegin).valueOf();
				let end = moment(activityData.activityVoteEnd).valueOf();
				let current = moment(activityData.currentDate).valueOf();
				if (current >= end) return 'activityVoteEnd';
				if (current < start) return 'activityVoteBegin';
				return 'activityIng';
			} else if (activityData.activityStatus === 1)
				return 'activityBegin';
			else return 'activityEnd'
		},
		voted() {
			if (!this.$env.custId) {
				this.$eventBus.$emit('login');
				return;
			}
			
			if (this.getActivityStatus() === 'activityBegin') {
				this.$toast('活动未开始');
				return false;
			} else if (this.getActivityStatus() === 'activityEnd') {
				this.$toast('活动已结束');
				return false;
			} else if (this.getActivityStatus() === 'activityVoteBegin') {
				this.$toast('投票尚未开始，暂时不能投票');
				return false;
			} else if (this.getActivityStatus() === 'activityVoteEnd') {
				this.$toast('投票已结束，无法继续投票');
				return false;
			}


			this.$indicator.open('投票中...');
			let params = {
				activityInfoId: this.detailData.activityInfoId,
				candidateId: this.detailData.id,
				otherFlag: this.inApp ? 0 : 1,
				voteNo: this.detailData.voteNo,
			}
			this.$opusApi.post(`/yyl/v1/activity/vote/single`, params).then(response => {
				this.$indicator.close();
				let resData = response.data;
				if (resData.msg === 'success') {
					this.detailData.voteCount++;
					this.hasVotes = resData.data.haveFreeVote;
					if (this.hasVotes >= this.configVotes && resData.data.userRollFlag === 0) {
						this.$eventBus.$emit('updateVoteStatus');
					}
					if (this.inApp) {
						this.$toast('投票成功');
					} else {
						this.$router.push({ name: 'prizes' });
					}
				} else {
					this.$toast(resData.msg);
				}
			})
		}
	},
	mounted() {
		if (!this.inApp && !this.$env.custId && this.isWeiXin()) {
			this.isWeiXinLogin();
		}

		this.$opusApi.get(`/yyl/v1/activity/candidate/detail/${this.$route.params.id}`).then(response => {
			let resData = response.data;
			if (resData.msg !== 'success') return false;
			this.detailData = resData.data;
			this.detailData.content = this.detailData.text;
			this.hasVotes = this.inApp ? this.detailData.inAppVoteCount : this.detailData.otherAppVoteCount;
			this.configVotes = this.inApp ? this.detailData.inAppVoteConfigCount : this.detailData.otherAppVoteConfigCount;
			this.voteType = this.inApp ? this.detailData.inAppVoteType : this.detailData.otherAppVoteType;
			if (!this.inApp) {
				let content = this.detailData.text || this.detailData.text1 || this.detailData.text2 || '';
				this.$utils.setBrowserShareInfo(this.detailData.activityTitle, content);
			}
		})
	}
}
</script>

<style>
@import '#/css/var.css';
.platform_activity-detail {
	padding-bottom: 1.1rem;
	& .platform_activity-content {
		padding: .3rem;
		/* padding-bottom: 3rem; */
		& .platform_activity-count {
			color: var(--text-assist-color);
			margin-bottom: .3rem;
			font-size: .3rem;
			& label i {
				color: #f8bc1a;
			}
			& span {
				margin-left: .2rem;
			}
		}
		& .platform_activity-spec {
			display: flex;
			justify-content: space-between;
			font-size: .24rem;
			& p {
				font-size: .24rem;
			}
		}
		& .platform_activity-name {
			margin-bottom: .3rem;
			& span {
				color: #0185ff;
			}

			& label {
				font-size: .24rem;
				color: var(--text-assist-color);
				margin-left: .2rem;
			}
		}

		& .platform_activity-intro {
			margin-bottom: .3rem;
			font-size: .34rem;
			color: var(--text-primary-color);
			line-height: 1.65;
		}

		& .platform_activity-img {
			width: 100%;

			& img {
				width: 100%;
				border-radius: .12rem;
			}
		}

		& .platform_activity-vote {

			& .platform_activity-vote-container {
				padding: .3rem 0;
			}
			& .buttons {
				display: flex;
				align-items: center;
				justify-content: space-around;
				font-size: .32rem;
			}

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
				background-color: #66b6ff;
			}
			& .disabled {
				background-color: #d7d7d7;
			}
			& .tip-text {
				text-align: center;
				color: var(--text-assist-color);
				font-size: .3rem;
				/* margin-top: .3rem; */
				margin-bottom: .3rem;
				/* border-top: 1px solid #ededed; */
				/* box-shadow: 0 -1px 3px #f3f3f3; */
				& .button {
					border-radius: 1rem;
					padding: 0.2em 1em;
					background: #f5cd45;
					font-size: .26rem;
					margin-bottom: .3rem;
				}
				& div:first-child {
					font-size: .36rem;
				}
				& .vote-count {
					color: var(--theme-color);
					font-weight: bold;
				}
				& .tip-nickname {
					color: var(--text-primary-color);
				}
				& .vote-diff {
					font-size: .36rem;
					margin-bottom: .1rem;
				}
			}
		}

		& .platform_activity-vote-noApp {
			padding-bottom: 2.4rem;
		}

		& .platform_activity-vote-comment {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #fff;
			box-shadow: 0 0 15px rgba(0, 0, 0, .1);
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
	& .icon-Sina {
		display: none;
	}
}
</style>