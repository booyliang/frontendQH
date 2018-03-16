<template>
	<div :class="classList">
		<y-button v-bind="$attrs" :data-slogan="slogan" class="publish_entry-button" @click.native="handleClickButton">
			<slot>
				<template v-if="text">{{text}}</template>
				<span v-else></span>
			</slot>
		</y-button>
		<slot name="add-on"></slot>
	</div>
</template>

<script>
	export default {
		name: 'y-publish-entry',

		props: {
			text: String,
			slogan: String
		},

		computed: {
			classList() {
				return [
					'publish_entry',
					{
						'publish_entry--with_slogan': this.slogan
					}
				];
			}
		},

		methods: {
			handleClickButton() {
				this.$emit('button-clicked');
			}
		}
	};
</script>

<style>
	@import "#/css/var.css";

	.publish_entry {
		position: fixed;
		right: 0.2rem;
		bottom: var(--layout-space);
	}
	.publish_entry-button {
		@apply --circle;
		width:1rem;
		height:1rem;
		font-size: 0.34rem;
		border: none;
		padding: 0;
		background: var(--theme-color);;
		/* box-shadow:0 0 0.15rem color(var(--theme-color) a(0.5)); */
		line-height: 1.4;

		&:active {
			background: color(var(--theme-color) shade(10%));
		}
		
		& span {
			display: block;
			margin:auto;
			width:0.5rem;
			height: 0.5rem;
			background:url(../../assets/publish_ico.png);
			background-size:cover;
		}
		& .icon-plus:before{
			content: '';
		}
/* 
		& .iconfont:only-child {
			font-size: 0.46rem;

			&.icon-plus {
				font-weight: bold;
			}
		} */
	}

	.publish_entry--with_slogan {
		right: 0.1rem;
		margin-right: 1rem;

		& .publish_entry-button {
			width: 0.82rem;
			height: 0.82rem;

			&::before {
				@apply --display-flex;
				content: attr(data-slogan);
				position: absolute;
				left: 50%;
				top: 0;
				bottom: 0;
				z-index: -1;
				width: 1.4rem;
				font-size: 0.24rem;
				color: color(white a(0.7));
				padding-left: 0.3rem;
				background: inherit;
				border-radius: 0.41rem 0.04rem 0.04rem 0.41rem;
				box-shadow: inherit;
			}
			& .iconfont:only-child {
				font-size: 0.38rem;
			}
		}
	}
</style>