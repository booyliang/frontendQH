<template>
	<div :class="classList"><span v-if="icon" :class="iconClassList"></span><slot></slot></div>
</template>

<script type="text/javascript">
	export default {
		name: 'y-form-tip',

		props: {
			situation: String,
			fixed: {
				type: Boolean,
				default: false
			},
			icon: Boolean
		},

		computed: {
			classList() {
				return [
					'form-tip',
					{
						[`form-tip--${this.situation}`]: this.situation,
						'form-tip--fixed': this.fixed
					}
				];
			},

			iconClassList() {
				return [
					'iconfont',
					`icon-tips`
				];
			}
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.form-tip {
		@apply --layout;
		display: flex;
		align-items: flex-start;
		font-size: 14px;
		color: var(--text-assist-color);
		margin: 0.7em 0;

		& a {
			text-decoration: underline;
		}
		& > .iconfont {
			margin-right: 0.5em;
		}
		&:not(.form-tip--error) {
			& > .iconfont {
				color: #bfbfbf;
			}
		}
	}
	.form-tip--error {
		color: var(--error-color);
	}
	.form-tip--fixed {
		position: sticky;
		top: 1.28rem;
		margin: 0;
		padding-top: 0.7em;
		padding-bottom: 0.7em;
		background: var(--bg-color);
	}
</style>