<template>
	<div class="question_list" :showBackground="true">
		<!--顶部导航 begin-->
		<y-nav :title="$R('user-question')" :show-search="parseInt(this.$route.params.type) === 2" :menuData="['index', 'refresh']"></y-nav>
		<!--顶部导航 end-->
		<!--问题列表 begin-->
		<y-tab-bar v-model="tabId" :tabOption="menuData"></y-tab-bar>
		<y-flow-list :request='hotRequest' :heat="heat" v-show="tabId === 'hot'" ></y-flow-list>
		<y-flow-list :request="timeRequest" :heat="heat" v-show="tabId === 'new'" ></y-flow-list>

		<!--问题列表 end-->
		<!-- 发布 begin-->
        <router-link v-if="parseInt(this.$route.params.type) === 2" class="publish-button" to="/question/new/0"></router-link>
		<!-- 发布 end-->
	</div>
</template>
<script>
	import YFlowList from '@/components/flow-list'
	import YNav from '@/components/nav/nav'
	import YNavToggle from '@/components/nav/nav-toggle'
	import YTabBar from '@/components/tab'
	export default {
		components: {
			YFlowList, YNav, YNavToggle, YTabBar,
		},
		data() {
			return {
				tabId: 'new',
				menuData: [{'id': 'new', 'text': this.$R('time')}, { 'id': 'hot', 'text': this.$R('hot')}],
				hotRequest: {
					method: 'GET',
					url: `/services/app/v1/question/list/${this.$route.params.type}`,
					params: {
						orderBy: 'hot',
						contain: parseInt(this.$route.params.type) === 1 ? 1 : ''
					}
				},
				timeRequest: {
					method: 'GET',
					url: `/services/app/v1/question/list/${this.$route.params.type}`,
					params: {
						type: this.$route.params.type,
						orderBy: 'time',
						contain: parseInt(this.$route.params.type) === 1 ? 1 : ''
					}
				},
				heat: ['view', 'answer']
			}
		},
		mounted() {
			this.heat = parseInt(this.$route.params.type) === 1 ? ['comment', 'like'] : ['view', 'answer'];
		}
	}
</script>