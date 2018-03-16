<template>
	<div class="label_search" ref='search_div' >
		<div class="label_search-input"><input maxlength="15" type="text" ref="input"
		 @focus="handleFocus" @blur="hideSearch" @change="handleChange" :placeholder="$R('please-enter-key-word')" />
			<i @click.stop="emptyInput" v-show="value" class="iconfont icon-close-a"></i></div>
		<y-button @click.native="handleSearch">{{$R('label-search')}}</y-button>
	</div>
</template>
<script type="text/javascript">
	import Block from '@/components/block'
	import HotLabelPanel from './hot-label-panel'
	export default {
		props: {
			value: String,
			labels: Array,
		},
		data() {
			return { }
		},
		watch: {
			value() {
				this.$refs.input.value = this.value
			}
		},
		beforeDestroy() {
			this.$eventBus.$off('hot-label-click', this.clickHotLabel);
		},
		mounted() {
			this.$eventBus.$on('hot-label-click', this.clickHotLabel);
		},
		methods: {
			clickHotLabel(labelName) {
				this.$refs.input.value = labelName;
				this.$emit('input', labelName);				
				this.$refs.input.focus();
			},
			handleChange() {
				this.$emit('input', this.$refs.input.value);		
			},
			emptyInput() {	
				this.$refs.input.value = '';			
				this.$emit('input', '');
			},
			handleSearch() {
				this.$emit('search', this.label);
				this.$nextTick(() => {
					this.hideSearch();
				})
			},
			hideSearch() {
				Block.close(function () {
					document.body.removeAttribute('style');
					window.removeEventListener('resize', function (e) {
						e.preventDefault();
					})
				});
			},
			handleFocus() {
				Block.open({component: HotLabelPanel, target: this.$refs.search_div, props: {labels: this.labels, value: this.$refs.input.value}}, function () {
					window.scrollTo(0, 0)
					document.body.style.overflow = "hidden";
					document.body.style.height = "100%";
					window.addEventListener('resize', function (e) {
						e.preventDefault();
					})
				})
			}
		}
	}
</script>
<style>
	@import "#/css/var.css";
	.label_search{
		display: flex;
		background-color: var(--bg-color);
		padding: 0 0.3rem;
		height: 0.86rem;
		line-height: 0.86rem;
		align-items: center;
		position: relative;
		z-index:11;
		& .label_search-input {
			position: relative;
			flex: 1 1 100%;
			height: 0.54rem;
			border: 1px solid #f4f4f4;
			border-radius: 0.54rem;
			background-color: #fff;
			color: var(--text-assist-color);
			margin-right: 0.3rem;
			display: flex;
			align-items: center;

			& input {
				width: 100%;
				padding: 0 0.7rem 0 0.3rem;
				height: 0.5rem;
				line-height: 0.5rem;
			}

			& .icon-fork {
				position: absolute;
				width: 0.32rem;
				height: 0.32rem;
				@apply --round;
				background: color(#000 alpha(0.3));
				right: 0.2rem;
				top: 0.08rem;
				text-align: center;
				line-height: 0.32rem;
				font-size: .12rem;
				color: #fff;
			}

			& .icon-close-a {
				position: absolute;
				right: 0.2rem;
				top: -.17rem;
				color: #bfbfbf;
			}
		}

		
		& .button {
			flex: 1 0 auto;
			background-color: transparent;
			color: var(--theme-color);
			padding: 0;
		}
	}

	.mask{position: fixed;}
	.block.block-enter-to {
		z-index: 9;
	}
</style>
