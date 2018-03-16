<template>
  <y-flow-item :data="data">
  	<p class="publish_item-label" v-if="data.label" slot="left-bottom">{{ data.label }}</p>
  </y-flow-item>
</template>
<script>
	import YFlowItem from '@/components/flow-item'
	export default {
		components: {
			YFlowItem
		},
		props: {
			data: Object
		}
	}
</script>
<style>
@import '#/css/var.css';

	.publish_item-label {
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: .26rem;
		color: var(--text-assist-color);
	}
</style>

