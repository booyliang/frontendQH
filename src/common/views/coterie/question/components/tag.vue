<template>
	<div class="question_tag" :class="typeClass">
		<slot></slot>
	</div>
</template>
<script>
	export default {
		name: 'question-tag',
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
    @import '#/css/var.css';
	.question_tag {
		margin-right: .25rem;
		min-width: 1.1rem;
		padding: 0 .2rem;
		line-height: 21px;
		color: #fff;
		font-size: .26rem;
		text-align: center;
		border-radius: 3px;
		background: #ccc;
		&.waring {
			background: var(--secondary-color);
		}
	}
</style>

