<template>
	<div>
		<y-nav :title="$route.query['name'] || $R('scenic-list')" :show-search="true" :menuData="['index']"></y-nav>
		<div class="layout">
			<y-place-list type="scenic" :fields="fields"></y-place-list>
			<y-message :icon="emptyIcon" title="暂无相关景点信息" fullscreen class="empty_message"></y-message>
		</div>
	</div>
</template>

<script type="text/javascript">
	import Message from '@/components/message';
	import PlaceList from '../../components/place-list';

	export default {
		components: {
			[Message.name]: Message,
			[PlaceList.name]: PlaceList,
		},

		data() {
			return {
				fields: {
					placeId: this.$route.params.placeId,
					name: this.$route.query['name']
				},
				emptyIcon: require('@/assets/no-data@2x.png')
			};
		}
	};
</script>

<style type="text/css" scoped>
	@import "#/css/var.css";

	.layout {
		padding-top: 0.4rem;
		padding-bottom: 0.4rem;
	}
</style>