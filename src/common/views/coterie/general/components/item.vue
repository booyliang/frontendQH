<template>
	<component :is="item" :data="itemData" @stick="stick" @unstick="unstick">
	</component>
</template>
<script>
import QuestionItem from '../../question/components/item'
import ActivityItem from '../../activity/components/item'
import TopicItem from '../../topic/components/topic-item'
// import PublishItem from './publish-item'
import PublishItem from '../../components/flow-item'
import FlowItem from '@/views/publish/components/list-item';
export default {
	name: 'general-item',
	data() {
		return {
			itemList: {
				'm-0240': QuestionItem,	// 圈子首页的问答
				'm-0241': QuestionItem,	// 私圈问答
				'm-0221': ActivityItem,	// 私圈活动(圈子首页不显示)
				'm-0230': TopicItem,	// 私圈话题
				'm-0210': PublishItem,  // 私圈资源
				'm-0091': FlowItem  // 圈子资源
			}
		}
	},
	props: {
		data: Object
	},
	created() {

	},
	computed: {
		'item': function () {
			return this.itemList[`m-${this.data.moduleEnum}`];
		},
		'itemData': function () {
			if (this.data.extjson) {
				return Object.assign({}, this.data, JSON.parse(this.data.extjson))
			}

			return this.data
		}
	},
	methods: {
		stick(data) {
			this.$emit('stick', data)
		},
		unstick(data) {
			this.$emit('unstick', data)
		}
	}
}
</script>
