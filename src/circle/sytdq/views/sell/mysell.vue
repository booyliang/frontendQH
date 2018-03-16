<template>
	<div class="mysell-wrap">
		<y-nav :title="$R('my-merchant')"></y-nav>
		<y-load-more-remote :request="flowRequest" @loaded="handleLoaded">
			<div>
				<y-flow-item-mysell-list v-for="(item,index) of listData" :data="item" :key="index"></y-flow-item-mysell-list>
			</div>
		</y-load-more-remote>
	</div>
</template>	
<script>
import FlowList from '@/components/flow-list';
import LoadMoreRemote from '@/components/load-more-remote';
import MySellList from './components/mySellItem'

export default {
	components: {
		[FlowList.name]: FlowList,
		[LoadMoreRemote.name]: LoadMoreRemote,
		[MySellList.name]: MySellList,
	},

	data() {
		return {
			listData: [],
		}
	},

	created() {
		// this.$localStore.set('classifyData', this.classifyData);
		// console.log(this.$localStore.get('classifyData'));
	},

	computed: {
		flowRequest() {
			return {
				url: `/services/app/v1/business/list`,
				params: {
					createUserId: this.$circle.userId
				}
			}
		}
	},
	methods: {
		handleLoaded(list, res) {
			this.listData.push(...list);
		},
	}
};
</script>