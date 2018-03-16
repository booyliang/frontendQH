<template>
	<div class="broadcast">
		<y-nav :title="$R('broadcast-title')" :showSearch="true" :menuData="menuData"></y-nav>
		<y-flow-list :request="flowRequest" :item="broadcastItem"></y-flow-list>
	</div>
</template>

<script>
	import BroadcastItem from './flow-item-broadcast'
	export default {
		components: {
			BroadcastItem
		},
		data() {
			return {
				broadcastItem: BroadcastItem,
				menuData: [ 'index', 'refresh' ],
				flowRequest: {
					url: '/services/app/v1/broadcast/info/list'
				}
			}
		}
	}
</script>