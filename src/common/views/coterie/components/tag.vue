<template>
	<div class="item-tag" :class="typeClass">
		<slot></slot>
	</div>
</template>
<script>
	export default {
		name: 'y-tag',
		props: {
			type: String
		},
		computed: {
			'typeClass': function () {
				return this.type || ''
			}
		}
	}
</script>

<style>
	.item-tag {
		min-width: 1.1rem;
		padding: 0 .2rem;
		line-height: .42rem;
		color: #fff;
		font-size: .26rem;
		text-align: center;
		border-radius: 4px;
		background: #d7d7d7;
		& + .item-tag{
			margin-left: .1rem;
		}
		&.warning {
			background-color: #f5cd45;
		}
		&.info {
			background-color: #99ceff;
		}
	}
</style>

