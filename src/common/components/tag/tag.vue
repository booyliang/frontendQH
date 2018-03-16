/**
*	Author: wangboning
*
*/
<template>
	<component :is="tagName" v-bind="routerLinkProps" class="tag"><slot></slot></component>
</template>

<script type="text/javascript">
	import routerLinkMixin from '@/mixins/router-link';

	export default {
		name: 'y-tag',

		mixins: [
			routerLinkMixin
		],

		data() {
			return {
				tagName: this.to ? 'router-link' : 'span',
			};
		},
	};
</script>

<style type="text/css">
	@import '#/css/var.css';

	.tag {
		display: inline-block;
		font-size: .26rem;
		line-height: 2.31;
		color: var(--theme-color);
		background: #f4f4f4;
		border-radius: 0.4em;
		padding: 0 0.93em;
	}
</style>