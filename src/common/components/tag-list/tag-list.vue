/**
*	Author: wangboning
*
*/
<template>
	<div class="tag_list">
		<slot>
			<y-tag v-for="(tag, index) of tags" :key="index">{{tag}}</y-tag>
		</slot>
	</div>
</template>

<script type="text/javascript">
	import Tag from '@/components/tag';

	export default {
		name: 'y-tag-list',

		components: {
			[Tag.name]: Tag
		},

		props: {
			tags: Array
		}
	};
</script>

<style type="text/css">
	.tag_list {
		font-size: 0;

		& .tag {
			margin: 0 1em 1em 0;
		}
	}
</style>