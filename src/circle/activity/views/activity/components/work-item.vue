<template>
	<div class="platform-activity-work-item">
		<router-link :to="link" class="flow_item-body">
			<div class="flow_item-cover">
				<img :src="data.coverPlan | imageResize(2)" class="flow_item-thumb">
				<div class="work_item-title" v-text="data.text || data.nickName"></div>
				<div class="flow_item-content" v-text="content"></div>
				<div class="flow_item-content work_item-footer">
					<span>票数 :
						<i v-text="totalCount"></i>
					</span>
					<span v-text="voteNo"></span>
				</div>
			</div>
		</router-link>

		<div class="foot_button">
			<y-button type="text" @click.native.stop="toDetail">帮TA拉票</y-button>
			<span></span>
			<y-button type="text" :disabled="noHasVote" @click.native.stop="voted">{{noHasVote ? '票已投完' : '投TA一票'}}</y-button>
		</div>

		<state-label v-if="!!sort" :sort="sort"></state-label>
		<y-share ref="share"></y-share>
	</div>
</template>

 <script type="text/javascript">
import Dialog from '@/components/dialog';
import Action from '@/components/comment/action';
import StateLabel from '../components/state-label';
import YShare from '@/components/comment/share'
import Mixin from '../mixins'
export default {
	name: 'work-item',
	components: {
		YShare,
		StateLabel,
	},
	mixins: [Mixin],
	props: {
		data: {
			type: Object,
			required: true
		},
		sort: Number,
		noVote: Boolean,
		activityStatus: {
			type: String,
		}
	},
	watch: {
		data(val) {
			// console.log(this.sort, '-->', val.nickName, '-------', val.voteCount);
			this.totalCount = this.data.totalCount;
		},
		noVote(val) {
			this.noHasVote = val;
		}
	},
	data() {
		return {
			inApp: !!this.$yryz.isNative(),
			totalCount: this.data.totalCount,
			noHasVote: this.noVote,
			hasVotes: 0,
			configVotes: 0,
			voteType: 1,
		}
	},
	computed: {
		content() {
			return this.data.text1 || this.data.text2;
		},
		voteNo() {
			return `编号 : ${this.data.voteNo}`
		},
		link() {
			return { name: 'voteDetail', params: { id: this.data.id } };
		}
	},
	mounted() {
		this.hasVotes = this.inApp ? this.data.inAppVoteCount : this.data.otherAppVoteCount;
		this.configVotes = this.inApp ? this.data.inAppVoteConfigCount : this.data.otherAppVoteConfigCount;
		this.voteType = this.inApp ? this.data.inAppVoteType : this.data.otherAppVoteType;
		this.noHasVote = this.hasVotes >= this.configVotes && this.data.userRollFlag === 0;
	},
	methods: {
		toDetail() {
			if (this.$yryz.isNative()) {
				let content = this.data.text || this.data.text1 || this.data.text2 || '';
				this.$refs.share.open({
					title: this.$attrs.activityData.title,
					content: content,
					coverPlanUrl: this.data.coverPlan
				});
			} else {
				this.$router.push({
					name: 'voteDetail',
					params: {
						id: this.data.id
					}
				});
			}
		},
		async voted() {
			if (this.$yryz.isNative()) {
				await this.$user.login();
			}
			if (!this.$env.custId) {
				this.$eventBus.$emit('login');
				return;
			}

			if (this.activityStatus === 'activityBegin') {
				this.$toast('活动未开始');
				return false;
			} else if (this.activityStatus === 'activityEnd') {
				this.$toast('活动已结束');
				return false;
			} else if (this.activityStatus === 'activityVoteBegin') {
				this.$toast('投票尚未开始，暂时不能投票');
				return false;
			} else if (this.activityStatus === 'activityVoteEnd') {
				this.$toast('投票已结束，无法继续投票');
				return false;
			}
			let params = {
				activityInfoId: this.$route.params.activityId,
				candidateId: this.data.id,
				otherFlag: this.inApp ? 0 : 1,
				voteNo: this.data.voteNo,
			}
			this.$indicator.open('投票中...');
			let response = await this.$opusApi.post(`/yyl/v1/activity/vote/single`, params)
			this.$indicator.close();
			let resData = response.data;
			if (resData.ret === 1 || resData.msg === "success") {
				this.totalCount++;
				this.hasVotes = resData.data.haveFreeVote;
				if (this.hasVotes >= this.configVotes && resData.data.userRollFlag === 0) {
					this.noHasVote = true;
					this.$eventBus.$emit('updateVoteStatus');					
				} 
				if (this.inApp) {
					this.$toast('投票成功');
					// this.$toast('您的投票券已用完，无法继续投票');
				} else {
					this.$router.push({ name: 'prizes' });
				}
				if (this.sort) {
					if (this.sort === 1) return;
					this.$emit('change', this.sort - 1, this.totalCount);
				}
				return false;
			}
			this.$toast(resData.msg);
		}
	}
};
</script>

<style>
@import '#/css/var.css';
.platform-activity-work-item {
	position: relative;
	margin: .3rem .2rem;
	box-shadow: 0 0 .12rem rgba(51, 51, 51, .3);
	border-radius: .12rem;
	background-color: #FFF;
	& .flow_item-cover {
		padding: .3rem;
		position: relative;
		& .work_item-title {
			@apply --text-cut;
			font-size: .36rem;
			line-height: 1.39;
			margin-bottom: 0.05rem;
			font-weight: bold;
		}
		&>img {
			border-radius: .1rem;
			width: 1.9rem;
			height: 1.9rem;
		}

		& .flow_item-content {
			@apply --text-cut-multi-line;
			font-size: var(--default-font-size);
			line-height: 1.34;
			-webkit-line-clamp: 2;
			color: var(--text-tips-color);
		}

		& .work_item-footer {
			position: absolute;
			bottom: .25rem;
			left: 2.6rem;
			margin-top: .4rem;
			font-size: .28rem;
			color: var(--text-assist-color);
			& :first-child {
				margin-right: .2rem;
			}
			& i {
				color: #F8BC1A;
			}
		}
	}
	& .foot_button {
		display: flex;
		justify-content: space-around;
		color: var(--theme-color);
		background-color: #F8F8F8;
		& .button {
			flex: 1;

			&:last-child {
				font-weight: bold;
			}
		}
		& .disabled {
			color: var(--text-tips-color);
		}
		& span {
			display: inline-block;
			margin: .15rem 0;
			border-right: 1px solid var(--border-color);
		}
	}
}

.dialog {
	& .dialog-title {
		margin-top: .3rem;
	}
	& .dialog-title,
	& .dialog-message {
		font-size: .38rem;
		color: var(--text-secondary-color);
	}
	& .dialog-message {
		padding: 0;
	}
}
</style>
