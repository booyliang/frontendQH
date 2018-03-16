<template>
	<div>
		<y-nav title="我的订单"></y-nav>
		<y-tab-bar :tabOption="tabOption" v-model="tabId"></y-tab-bar>
		<y-order-list :request="request" groupField=""></y-order-list>
	</div>

</template>
<script>
	import YOrderList from '../../components/my-order-list'
	export default {
		components: {
			YOrderList
		},
		data() {
			return {
				tabId: 1,
				tabOption: [{'text': '待确认', 'id': 1}, {'text': '已确认', 'id': 2}]
			}
		},
		computed: {
			request() {
				return {
					url: '/services/app/v1/order/list',
					params: {
						orderStatus: this.tabId
					}
				}
			}
		}
	}
</script>