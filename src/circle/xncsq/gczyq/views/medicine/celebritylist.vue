<template>
	<div class="">
		<!--顶部导航 begin-->
		<y-nav title="全部医生" :menuData="['index', 'copy-url', 'report']"></y-nav>
		<!--顶部导航end-->
		<y-flow-list :item="item" :request="flowRequest"></y-flow-list>
	</div>
</template>
<script>
import YNav from '@/components/nav/nav'
import YFlowList from '@/components/flow-list'
import YFlowItemCelebrity from '../components/flow-item-celebrity'

export default {
	components: {
		YNav,
		YFlowList
	},
	data() {
		return {
			item: YFlowItemCelebrity,
			userList: [],
			flowRequest: {
				method: 'GET',
				url: '/services/app/v1/doctorAuthentication/list',
			}
		}
	}
}
</script>
<style>
@import "#/css/var.css";
</style>