<template>
	<div class="question_list">
		<y-flow-list :request="request" :item="item" :end-tip="isMember"></y-flow-list>
		<y-message :icon="emptyIcon" :title="emptyTitle"></y-message>
	</div>
</template>
<script>
import YFlowList from '@/components/flow-list'
import YQuestionItem from './components/item'
import Message from '@/components/message'
export default {
	name: 'coterie-question-index',
	components: {
		YFlowList,
		YQuestionItem,
		[Message.name]: Message,
	},
	data() {
		return {
			item: YQuestionItem,
			emptyIcon: '/assets/static/status-empty@2x.png',
			permission: this.$coterie.permission,
			request: {
				url: '/services/app/v1/coterie/question/list',
				params: {
					pageNo: 1,
					pageSize: 20
				}
			}
		}
	},
	computed: {
		emptyTitle() {
			return this.permission === 100 ? '当前还没有成员向你提问~' : '你有什么要问圈主的吗~'
		},
		
		isMember() {
			return [100, 200].includes(this.permission)
		}
	}
}	
</script>
<style type="text/css">
.question_list {
	& .message {
		display: none;
		padding: 1.4rem 0 0 0;
	}
	/*& .empty~.message {
			display: block;
		}*/
	& .load_more.empty {
		& .load_more-tip {
			display: none;
		}
		&+.message {
			display: block;
		}
	}
}
</style>