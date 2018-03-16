/**
*	Author: wangboning
*
*/
<template>
	<section class="panel" :class="classList">
		<component :is="headTag" tag="header" v-bind="routerLinkProps" class="panel-head">
			<h1 class="panel-title">
				<slot name="title">
					<span v-if="icon" class="iconfont" :class="`icon-${ icon }`"></span>{{ title }}
				</slot>
			</h1>
			<router-link v-if="more" :to="moreLink" class="panel-more">{{ more.text || '查看全部' }}
				<span class="iconfont icon-arrow-right"></span>
			</router-link>
			<span v-if="this.to" class="iconfont icon-arrow-right"></span>
		</component>
		<div class="panel-body">
			<slot></slot>
		</div>
	</section>
</template>

<script type="text/javascript">
	import routerLinkMixin from '@/mixins/router-link';

	export default {
		name: 'y-panel',

		mixins: [
			routerLinkMixin
		],

		props: {
			colorful: Boolean,
			title: String,
			icon: String,
			more: [
				String,
				Object
			]
		},

		data() {
			return {
				defaultHeadTag: 'header'
			};
		},

		computed: {
			classList() {
				return {
					'panel--colorful': this.colorful,
					'panel--rich': this.icon,
				}
			},

			headTag() {
				return this.to ? 'router-link' : this.defaultHeadTag;
			},

			moreLink() {
				if (typeof this.more === 'object') {
					return this.more.link || this.more;
				} else {
					return this.more;
				}
			}
		}
	};
</script>

<style type="text/css">
	@import '#/css/var.css';

	.panel {
		@apply --box;
	}

	.panel-head,
	.panel-body {
		@apply --layout;
	}

	.panel-head {
		@apply --border-bottom;
		display: flex;
		justify-content: space-between;
		align-items: center;
		line-height: 44px;
		color: var(--text-assist-color);
		border-bottom-width: 1px;
	}
	.panel-title {
		font-size: .32rem;
	}

	.panel-more {
		font-size: .26rem;
		color: var(--theme-color);
	}

	.panel-body {
		padding-top: 0.4rem;
		padding-bottom: 0.4rem;

		& .list {
			@apply --offset-layout;
			background: var(--bg-color);
			margin-top: -0.4rem;
			margin-bottom: -0.4rem;
		}
	}

	.panel--colorful {
		& .panel-title {
			font-size: .32rem;
			color: var(--text-primary-color);

			&::before {
				@apply --round;
				content: "";
				display: inline-block;
				width: 2px;
				height: 1em;
				vertical-align: -0.15em;
				background: var(--theme-color);
				margin-right: 0.5em;
			}
		}
	}

	.panel--rich {
		padding: 0 0.14rem;

		& .panel-head,
		& .panel-body {
			padding-left: 0.16rem;
			padding-right: 0.16rem;
		}

		& .panel-title {
			font-size: .32rem;
			color: var(--text-primary-color);
			display: flex;
			align-items: center;

			& .iconfont {
				margin: 0 0.25rem 0 0;
			}
		}
	}
</style>
