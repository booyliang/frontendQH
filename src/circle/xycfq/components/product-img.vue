<template>
	<div class="product-img">
		<img :src="imgSrc">
	</div>
</template>
<script>
	export default {
		props: {
			imgSrc: {},
		}
	}
</script>
<style>
	.product-img {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 1.8rem;
		& img {
			width: 100%;
			height: 100%;
		}
	}
</style>


