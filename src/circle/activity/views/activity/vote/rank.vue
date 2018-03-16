<template>
	<div class="platform-activity-rank-wrap">
		<y-load-more-remote :request="request" @loaded="handleLoaded" :useOpusApi="true" :endTip="false">
			<div>
				<y-candidate-item :activityData="$attrs.activityData" v-for="(item, index) of list" :key="index" :data="item" :sort="index+1" :noVote="noVote" @change="changePosition" :status="status"></y-candidate-item>
			</div>
		</y-load-more-remote>
		<y-message v-if="!list.length" :icon="icon" :title="msgTitle">
			<span>现在参加赢得更多优势</span>
		</y-message>
	</div>
</template>
<script>
import LoadMoreRemote from '@/components/load-more-remote'
import YCandidateItem from '../components/work-item';
import YMessage from '@/components/message';
import icon from '@/assets/static/no-data@2x.png';
export default {
	name: 'vote-rank',
	components: {
		YCandidateItem, YMessage,
		[LoadMoreRemote.name]: LoadMoreRemote,
	},
	computed: {
		msgTitle() {
			return '还没有人参与活动';
		},
		status() {
			return this.$attrs.activityData.activityStatus;
		}
	},

	data() {
		return {
			icon,
			list: [],
			request: {
				url: `/yyl/v1/activity/candidate/rank`,
				params: {
					pageNo: 1,
					pageSize: 10,
					activityInfoId: this.$route.params.activityId,
				}
			},
			noVote: false,
		}
	},
	methods: {
		handleLoaded(list, item) {
			this.list.push(...list);
		},
		changePosition(index, vote) {
			if (vote > this.list[index - 1].totalCount) {
				let temp = this.list[index - 1];  
				this.$set(this.list, index - 1, this.list[index]);  
				this.$set(this.list, index, temp);  
				this.$set(this.list[index - 1], 'totalCount', vote);
			}
		},
		updataVoteStatus() {
			this.noVote = true;
		}
	},
	mounted() {
		this.$eventBus.$on('updateVoteStatus', this.updataVoteStatus);
	},
	beforeDestroy() {
		this.$eventBus.$off('updateVoteStatus');
	},
}
</script>
<style>
@import '#/css/var.css';
.platform-activity-rank-wrap {
	& .message {
		padding-top: .6rem;
		& .message-icon {
			width: 3.2rem;
			height: 3.2rem;
		}
		& .message-title {
			margin-top: -.5rem;
			font-size: 15px;
		}
		& span {
			color: var(--text-assist-color);
		}
	}
}
</style>

