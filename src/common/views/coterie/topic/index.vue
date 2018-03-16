<template>
    <div class="topic_index">
		<y-flow-list :request="flowRequest" :item="topicItem" :end-tip="isMember"></y-flow-list>
		<y-message :icon="emptyIcon" :title="emptyTitle"></y-message>
	</div>
</template>
<script>
import TopicItem from '@/views/coterie/topic/components/topic-item'
import YFlowList from '@/components/flow-list'
import Message from '@/components/message'
export default {
	name: 'coterie-topic-index',
	components: {
		TopicItem,
		YFlowList,
		[Message.name]: Message,
	},
	data() {
		return {
			emptyIcon: '/assets/static/status-empty@2x.png',
			permission: this.$coterie.permission,
			topicItem: TopicItem,
			flowRequest: {
				url: `/services/app/v1/coterie/topic/list`
				// url: '/services/app/v1/topic/list'
			}
		}
	},
	created() {
		console.log('用户身份', this.permission)
	},
	computed: {
		emptyTitle() {
			return this.permission === 100 ? '您还没有发布过话题，赶紧去发布吧~' : '等待圈主发布热门话题~'
		},
		
		isMember() {
			return [100, 200].includes(this.permission)
		}
	}
}	
</script>
<style type="text/css">
	.topic_index {
		& .message {
			display: none;
			padding: 1.4rem 0 .2rem 0!important;
		}
		/*& .empty~.message {
			display: block;
		}*/
		
		& .load_more.empty {
			& .load_more-tip {
				display: none;
			}
			& + .message {
				display: block;
			}
		}
	}
</style>    