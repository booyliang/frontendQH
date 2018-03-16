<template>
    <div class="topic_index">
    	<y-nav :title="$R('topic-index')" :showSearch="true" :menuData="['index', 'refresh']">
    	</y-nav>
    	<y-tab-bar v-model="tabId" :tabOption="tabOption"></y-tab-bar>
		<y-flow-list :request="flowRequest"></y-flow-list>
		<router-link to="/topic/new" class="add_idea"></router-link>
	</div>
</template>
<script>
import {YNav, YNavToggle, YNavSearch} from '@/components/nav'
import YTabBar from '@/components/tab'
import YFlowList from '@/components/flow-list'
export default {
	components: {
		YNav,
		YNavToggle,
		YTabBar,
		YFlowList,
		YNavSearch
	},
	name: 'topic',
	data() {
		return {
			tabId: this.$route.params.tabId || 'hot',
			tabOption: [{id: 'hot', text: this.$R('hot')}, {id: 'time', text: this.$R('time')}]  
		}
	},
	computed: {
		flowRequest() {
			let module = this.$utils.getModule('0041');
			return {
				url: module.apiUrl,
				params: {
					pageSize: 10,
					orderBy: this.tabId
				}
			}
		}
	}
}	
</script>
    