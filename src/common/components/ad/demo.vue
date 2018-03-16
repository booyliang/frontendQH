<template>
	<div class ="demo">
		<y-ad :type="1" keyword="首页轮播"></y-ad>
		<y-ad :type="2" keyword="首页图文"></y-ad>
		<y-ad :type="3" keyword="首页瀑布"></y-ad>
	</div>
</template>

<script type="text/javascript">
	import Ad from './';

	export default {
		components: {
			[Ad.name]: Ad
		}
	};
</script>

<style type="text/css" >
	@import "#/css/var.css";
	.demo {
	& .ad {
			@apply --offset-layout;
			@apply --margin-bottom;
		}
	}
	
</style>