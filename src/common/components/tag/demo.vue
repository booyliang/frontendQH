<template>
	<div>
		<y-tag>Tag</y-tag>
		<y-tag to="/">Tag with Link</y-tag>
	</div>
</template>

<script type="text/javascript">
	import Tag from './';

	export default {
		components: {
			[Tag.name]: Tag
		},
	};
</script>