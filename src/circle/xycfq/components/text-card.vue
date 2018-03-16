<template>
	<div class="text_card">
		<h4 class="text_card-title" v-if="title">
			<i class="title-line"></i> {{ title }}
			<b class="title-line"></b>
		</h4>
		<div class="text_card-content">
			<slot></slot>
		</div>
		<button v-if="!hideButton" @click="toMore" class="text_card-button">查看全文</button>
	</div>
</template>
<script>
	export default {
		props: {
			moreLink: [String, Object],
			title: String,
			hideButton: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			toMore() {
				if (this.moreLink) {
					this.$router.push(this.moreLink);
				} else {
					this.$emit('more')
				}
			}
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.text_card {
		position: relative;
		width: 100%;
		padding: .25rem .3rem .4rem;
		border: 1px dashed var(--theme-color);
		border-radius: .1rem;
		text-align: center;
		&:before {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			top: 0;
			background: var(--theme-color);
			opacity: .1;
		}
		
	}
	.text_card-title {
		position: relative;
		margin-top: .2rem;
		margin-bottom: .4rem;
		text-align: center;
		font-size: 17px;
		color: var(--theme-color);
		line-height: 1;
		& .title-line{
			display: inline-block;
			margin-right: 0.22rem;
			width: 1rem;
			height: 0.02rem;
			background: -webkit-linear-gradient(left, transparent, var(--theme-color));
			position: relative;
			top: -0.1rem;
			&:after {
				content: '';
				position: absolute;
				top: -0.02rem;
				right: 0;
				width: 0.06rem;
				height: 0.06rem;
				border-radius: 0.1rem;
				background: var(--theme-color);
			}
			&:last-child {
				margin-left: .22rem;
				background: linear-gradient(to right, var(--theme-color), transparent);
				&:after {
					right: none;
					left: 0;
				}
			}
		}
	}
	.text_card-button {
		position: relative;
		z-index: 2;
		display: inline-block;
		margin-top: .15rem;
		width: 2rem;
		color: var(--theme-color);
		font-weight: 300;
		font-size: 13px;
		&:after {
			content: "";
			display: inline-block;
			width: .15rem;
			height: .15rem;
			border: 1px solid var(--theme-color);
			border-bottom-color: transparent;
			border-left-color: transparent;
			transform: rotate(45deg);
		}
	}
	.text_card-content {
		font-size: 14px;
		line-height: 1.5;
		text-align: left;
	}
</style>