<template>
	<div class="tips">
		<div class="icon"><i class="iconfont icon-tips"></i></div>
		<div class="content">
			<slot></slot>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			type: String,
		}
	}
</script>
<style>
	.tips {
		display: flex;
		padding: .25rem .3rem;
		background: #f8f8f8;
		color: #666;
		& .icon {
			flex: 0 0 auto;
			& i {
				color: #bfbfbf;
				font-size: 14px;
			}
		}
		& .content {
			flex: 0 1 auto;
			padding-left: .1rem;
			color: #666;
			font-size: 14px;
		}
	}
</style>

