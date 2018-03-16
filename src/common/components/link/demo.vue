<template>
	<div class="demo">
		<y-link url="/">Internal Link</y-link>
		<y-link url="http://boring.wang">External Link</y-link>
		<y-link url="http://boring.wang/mv.mp4">Video Link</y-link>
	</div>
</template>

<script type="text/javascript">
	import Link from './';

	export default {
		components: {
			[Link.name]: Link
		}
	};
</script>

<style type="text/css" >
	.demo { 
		a {
		color: deepskyblue;
		margin-right: 1em;
	}
	}
</style>