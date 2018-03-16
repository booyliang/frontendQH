<template>
	<y-flow-item v-bind="$props" :heat="['view', 'anwser']" :remove="remove"></y-flow-item>
</template>
<script>
	import YFlowItem from '@/components/flow-item'
	export default {
		components: {
			YFlowItem
		},
		props: {
			data: Object
		},
		computed: {
			remove() {
				if (this.data.imgUrl) {
					return ['content']
				}
				return [];
			}
		}
	}
</script>