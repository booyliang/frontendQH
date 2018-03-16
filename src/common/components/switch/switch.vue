<template>
	<button :disabled="disabled" :class="classList" @click="toggle"></button>
</template>

<script>
	import Switch from './';

	export default {
		name: 'y-switch',

		props: {
			value: {
				type: Boolean,
				required: true
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},

		computed: {
			classList() {
				return [
					'switch',
					{
						'switch--on': this.value,
						'disabled': this.disabled,
					}
				];
			}
		},

		methods: {
			toggle() {
				this.$emit('input', !this.value);
			}
		}
	};
</script>

<style>
	@import "#/css/var.css";

	:root {
		--switch-width: 45px;
		--switch-height: 25px;
		--switch-padding: 2px;
	}

	.switch {
		@apply --round;
		@apply --no-tap-highlight;
		width: var(--switch-width);
		height: var(--switch-height);
		padding: var(--switch-padding);
		background: #eee;
		transition: background-color 0.2s;

		&:--disabled {
			opacity: 0.5;
		}

		&::before {
			@apply --circle;
			content: "";
			display: block;
			width: calc(var(--switch-height) - var(--switch-padding) * 2);
			height: 100%;
			background: white;
			transition: transform 0.3s cubic-bezier(0.2, 0, 0.3, 1.3);
		}
	}

	.switch--on {
		background: #7fc2ff;

		&::before {
			transform: translate(calc(var(--switch-width) - var(--switch-height)));
		}
	}
</style>