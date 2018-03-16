/**
*	Author: zhulin
*
*/
<template>
	<transition name="block">
		<div v-show="visible" class="block" >
			<y-mask ></y-mask>
			<div :class="contentClass" :style="contentStyle">
			<component  :is="component" v-bind="propsData"></component>
			</div>

		</div>
	</transition>
</template>

<script type="text/javascript">
	import Mask from '../mask';
	export default {
		name: 'y-blockUI',
		components: {
			[Mask.name]: Mask,
		},
		data() {
			return {visible: false}
		},
		props: {
			component: Object,
			target: Object,
			propsData: Object
		},
		computed: {
			contentClass() {
				return {'block-target': this.target}
			},
			contentStyle() {
				if (!this.target || !this.target.getBoundingClientRect)
					return null;
				let rect = this.target.getBoundingClientRect();
//				console.log('rect', rect)
				return { top: rect.bottom  + 'px', left: rect.left + 'px', right: rect.right + 'px', width: rect.width + 'px'};
			}
		},

	}

</script>

<style type="text/css">
	@import '#/css/var.css';
	:root {
		--block-duration: 0.2s;
	}
	.block {
		@apply --full;
		position: fixed;
		z-index: 2;
		display: flex;
		justify-content: center;
		align-items: center;
		width:100%;
	}
	.block-target{
		z-index: 3;
		position: absolute;
	}
</style>
