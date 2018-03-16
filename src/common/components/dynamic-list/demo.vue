<template>
	<y-dynamic-list good></y-dynamic-list>
</template>

<script type="text/javascript">
	import DynamicList from './';

	export default {
		components: {
			[DynamicList.name]: DynamicList
		}
	};
</script>