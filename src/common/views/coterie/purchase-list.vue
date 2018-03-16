<template>
	<div class="purchase-list-wrap">
		<y-nav title="我购买的"></y-nav>
		<y-flow-list :request="flowRequest" :item="listItem" :endTip="false"></y-flow-list>
		<y-message :icon="icon" title="还没有购买哦~"></y-message>
	</div>
</template>
<script>
import YMessage from '@/components/message'
import ListItem from '@/views/coterie/components/flow-item'
import YFlowList from '@/components/flow-list'

export default {
	name: 'coterie-mylist',
	components: {
		YMessage, YFlowList
	},
	data() {
		return {
			icon: '/assets/static/status-empty@2x.png',
			listItem: ListItem,
			flowRequest: {
				url: `/services/app/v1/coterie/user/buyedList`,
			}
		}
	}
}	
</script>
<style>
.purchase-list-wrap {
	min-height: 100vh;
	background-color: #FFF;
	& .message {
		display: none;
	}
	& .empty~.message {
		display: block;
	}
	& .article_item .article_item-footer .article_item-info {
		visibility: hidden;
	}
}
</style>
    