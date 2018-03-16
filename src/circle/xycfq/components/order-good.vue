<template>
	<div class="order-good">
		<div class="good-img">
			<img :src="data.productImg">
		</div>
		<div class="good-content">
			<h5 class="good-name">{{ data.productName }}</h5>
			<slot name="assist"></slot>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			data: Object,
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.order-good {
		display: flex;
		height: 1.2rem;
		& .good-img {
			flex: 0 0 1.3rem;
			height: 1.2rem;
			margin-right: .2rem;
			border: 1px solid var(--border-color);
		}
		& .good-content {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
	}
</style>
