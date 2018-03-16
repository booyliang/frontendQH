<template>
	<div class="snack-all">
		<y-nav :title="$R('snack-all')" :showSearch="true" :menuData="['refresh', 'copy-url', 'index']">
		</y-nav>
		<y-flow-list :request="flowRequest" :item="require('./flow-item-snack-all')"></y-flow-list>
		<!--<y-flow-item-snack-all></y-flow-item-snack-all>
		<y-flow-item-snack-all></y-flow-item-snack-all>-->
	</div>
</template>
<script>
import { YNav } from '@/components/nav'
import YFlowList from '@/components/flow-list'
import YFlowItemSnackAll from './flow-item-snack-all'
export default {
	components: {
		YNav,
		YFlowItemSnackAll
	},
	data() {
		return {
		}
	},
	created() {
		
	},
	computed: {
		flowRequest() {
			return {
				url: '/services/app/v1/refreshment/list',
				params: {
					shelveFlag: 0,
					pageSize: 20,
					// orderBy: 'time'
				}
			};
		},
	}
}
</script>
<style>
.snack-all {
	padding-bottom: 0.5rem;
}
</style>