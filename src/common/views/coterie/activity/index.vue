<template>
	<div class="activity-wrap">
		<y-flow-list :request="flowRequest" :item="Item" :endTip="false"></y-flow-list>
		<y-message :icon="icon" :title="msgTitle"></y-message>
	</div>
</template>

<script>
import YMessage from '@/components/message'
import ActivityItem from '@/views/coterie/activity/components/item'
export default {
	name: 'activty',
	components: {
		YMessage, ActivityItem,
	},
	data() {
		return {
			icon: '/assets/static/status-empty@2x.png',
			Item: ActivityItem,
		}
	},
	computed: {
		flowRequest() {
			return {
				url: `/services/app/v1/coterie/activity/list`,
				params: {
					pageNo: 1,
					pageSize: 20
				}
			}
		},
		msgTitle() {
			return this.$coterie.permission === 100 ? '您还没有发起过活动，赶紧去发布吧~' : '等待圈主发起精彩活动~';
		}
	}
}
</script>

<style>
.activity-wrap {
	& .message {
		display: none;
		padding: 1.4rem 0 0 0;
	}
	& .empty~.message {
		display: block;
	}
}
</style>
