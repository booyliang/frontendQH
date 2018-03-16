/**
*	Author: zhulin
*
*/
<template>
  <button
          @click.stop="handleClick"
          class="link-button"
          :disabled="disabled"  >
    <slot>{{$R('publish')}}</slot>
  </button>
</template>
<script>

export default {
	name: 'y-publish-button',
	props: {},
	data() {
		return {
			disabled: false
		}
	},
	mounted() {
		this.$eventBus.$on('publish-button-disable', this.setButtonDisabled);
	},
	beforeDestroy() {
		this.$eventBus.$off('publish-button-disable', this.setButtonDisabled);
	},
	methods: {
		handleClick() {
			this.$eventBus.$emit('publish');
			this.disabled = true;
		},
		setButtonDisabled(disabled) {
            // console.log('disabled', disabled);
			this.$nextTick(() => {
				this.disabled = disabled;
			})

		}

	},

}
</script>

<style type="text/css">
	@import '#/css/var.css';
	.link-button {
		color: var(--theme-color);
		font-size: var(--default-font-size);
	}

	.link-button:disabled {
		color: var(--text-assist-color);
		font-size: var(--default-font-size);
	}
</style>
