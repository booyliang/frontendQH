<template>
	<div class="question" :class="className">
		<y-user-info :data="data.question" :stick="data.stickFlag === 1"></y-user-info>
		<p class="question-content"><span>Q:</span> {{ data.question.content }}</p>
	</div>
</template>
<script>
	import YUserInfo from './user-info'
	export default {
		name: 'question',
		components: {
			YUserInfo
		},
		props: {
			data: {
				type: Object,
				default: () => {}
			},
			brief: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			'className': function () {
				return this.brief ? 'question--brief' : "";
			}
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.question {
		color: var(--text-secondary-color);
		line-height: 22px;
		& .question-content {
			margin-top: .2rem;
			& span {
				font-weight: bold;
				margin-right: .1rem;
			}
		}
		& .nickname {
			color: #5db1ff;
		}
		&.question--brief {
			& .question-content {
				@apply --text-cut-multi-line;
				-webkit-line-clamp: 2;
			}
		}
	}
</style>

