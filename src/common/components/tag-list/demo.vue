<template>
	<div class="demo">
		<y-tag-list :tags="tags"></y-tag-list>
		<y-tag-list>
			<y-tag>Tag</y-tag>
			<y-tag to="/">Tag with Link</y-tag>
		</y-tag-list>
	</div>
</template>

<script type="text/javascript">
	import Tag from '@/components/tag';
	import TagList from './';

	export default {
		components: {
			[Tag.name]: Tag,
			[TagList.name]: TagList,
		},

		data() {
			return {
				tags: [
					'Tags',
					'Created by Prop',
					'Can Only Have',
					'Plain Text',
				]
			};
		}
	};
</script>

<style type="text/css" >
.demo{
	.tag_list {
		margin-bottom: 10px;
	}
}

</style>