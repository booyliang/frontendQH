<template>
	<div class="temporary_activity-rank">
		<div class="cover">
			<img src="../assets/rank.png" alt="">
		</div>
		<y-load-more-remote :request="request" @loaded="handleLoaded" :endTip="false">
			<div class="candidate_list">
				<y-candidate-item v-for="(item, index) of list" :index="index" :key="index" :data="item"></y-candidate-item>
			</div>
		</y-load-more-remote>
	</div>
</template>
<script>
	import YLoadMoreRemote from '@/components/load-more-remote'
	import YCandidateItem from './components/candidate-item'
	export default {
		name: 'activityRank',
		components: {
			YLoadMoreRemote,
			YCandidateItem
		},
		data() {
			return {
				list: [],
				request: {
					url: '/services/app/v1/temp/activity/opus/list/2',
					params: {
						voteNo: ''
					}
				},
				voteDisabled: false
			}
		},
		methods: {
			handleLoaded(list, item) {
				this.list.push(...list);
			}
		}
	}
</script>
<style>
	.temporary_activity-rank {
		& .cover {
			padding: 0.2rem 0 0;
			text-align: center;
			& img {
				width: 3.28rem;
			}
		}
	}
</style>
