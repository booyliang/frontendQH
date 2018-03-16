<!-- Author: Boring -->

<template>
	<li class="auth_file_item">
		<div v-if="value" class="auth_file_item-preview">
			<img :src="value" alt="" class="auth_file_item-image">
			<y-button type="text" @click.native.stop="handleDelete" class="auth_file_item-delete">删除</y-button>
		</div>
		<y-button v-else tag="a" type="ghost" v-bind="routerLinkProps" @click.native.stop class="auth_file_item-entry"><span class="iconfont icon-plus"></span><br><slot name="title">{{title}}</slot></y-button>
	</li>
</template>

<script type="text/javascript">
	import routerLinkMixin from '@/mixins/router-link';

	export default {
		name: 'y-auth-file-item',

		mixins: [
			routerLinkMixin
		],

		props: {
			name: String,
			title: String,
			value: String
		},

		methods: {
			handleDelete() {
				this.$emit('input', '');
			}
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.auth_file_item {
		width: 23.2%;
		max-width: 80px;
		height: 80px;
		border-radius: 0.1rem;
		overflow: hidden;

		&:nth-child(n+2) {
			margin-left: 2.4%;
		}
	}
	.auth_file_item-entry {
		width: 100%;
		height: 100%;
		font-size: 13px;
		color: #999;
		padding: 0.6em 0.5em;
		border-color: #bfbfbf;
		border-radius: inherit;

		& .iconfont {
			font-size: 1.3em;
			margin-bottom: 0.3em;
		}
	}
	.auth_file_item-preview {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.auth_file_item-image {
		width: 100%;
		height: 100%;
	}
	.auth_file_item-delete {
		@apply --bg-alpha;
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		min-height: 0;
		font-size: 13px;
		padding: 0.1em;
		border-radius: 0;
	}
</style>