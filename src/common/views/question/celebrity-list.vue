<template>
	<div class="celebrity_list">
		<y-nav title="问答明星"></y-nav>
		<y-tab-bar v-model="tabId" :tabOption="menuData"></y-tab-bar>
		<y-flow-list :item="item" :request='likeRequest' :heat="[]" v-show="tabId === '赞同最多'" ></y-flow-list>
		<y-flow-list :item="item" :request="answerRequest" :heat="[]" v-show="tabId === '回答最多'" ></y-flow-list>
	</div>
</template>
<script>
	import YNav from '@/components/nav/nav'
	import YFlowList from '@/components/flow-list'
	import YFlowItemCelebrity from './components/flow-item-celebrity'
	let requestObject = {
		method: 'GET',
		url: '/services/app/v1/question/star',
	}
	export default {
		components: {
			YNav,
			YFlowList
		},
		data() {
			return {
				item: YFlowItemCelebrity,
				tabId: "赞同最多",
				menuData: ['赞同最多', '回答最多'],
				likeRequest: {
					...requestObject
				},
				answerRequest: {
					...requestObject,
					params: {
						orderBy: 'answer'
					}
				}
			}
		},
		mounted() {

		}
	}
</script>
<style>
@import "#/css/var.css";

</style>
