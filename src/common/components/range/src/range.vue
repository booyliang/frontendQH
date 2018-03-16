/**
*	Author: yefan
*
*/
<template>
	<div class="range">
		<slot name="start"></slot>
		<div class="range-content" ref="content">
			<div class="range-line" :style="{ 'border-top-width': lineHeight + 'px' }"></div>
			<div class="range-progress" :style="{ width: progress + '%', height: lineHeight + 'px' }"></div>
			<div class="range-menu" ref="menu" :style="{ left: progress + '%' }"></div>
		</div>
		<slot name="end"></slot>
	</div>
</template>
<script>
	export default {
		props: {
			value: {
				type: Number
			},
			lineHeight: {
				type: Number,
				default: 1
			},
			min: {
				type: Number,
				default: 0,
			},
			max: {
				type: Number,
				default: 100
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				dragState: {}
			}
		},
		computed: {
			progress() {
				const value = this.value;
				if (typeof value === 'undefined' || value === null) return 0;
				return Math.floor((value - this.min) / (this.max - this.min) * 100);
			}
		},
		methods: {
			moveFn(event) {
				let content = this.$refs.content;
				const ePosition = event.changedTouches[0] || event.touches[0];
				let contentBox = content.getBoundingClientRect();
				const detalX = ePosition.pageX - contentBox.left - this.dragState.menuStartLeft - this.dragState.menuClickDetalX;
				let newPosition = (this.dragState.menuStartLeft + detalX) / contentBox.width;
				if (newPosition < 0) {
					newPosition = 0
				} else if (newPosition > 1) {
					newPosition = 1;
				}
				this.$emit('input', this.min + Math.round(newPosition * (this.max - this.min)));
			},
			endFn() {
				this.dragState = {};
				document.removeEventListener('touchmove', this.moveFn);
				this.$emit('change', this.value);
			}
		},
		mounted() {
			let menu = this.$refs.menu;
			let content = this.$refs.content;

			const getMenuPosition = () => {
				const contentBox = content.getBoundingClientRect();
				const menuBox = menu.getBoundingClientRect();
				return {
					left: menuBox.left - contentBox.left,
					top: menuBox.top - contentBox.top,
					menuBoxLeft: menuBox.left
				};
			};
			menu.addEventListener('touchstart', (event) => {
				if (this.disabled) return;
				const ePosition = event.changedTouches[0] || event.touches[0];
				const position = getMenuPosition();
				const menuClickDetalX = ePosition.pageX - position.menuBoxLeft;
				this.dragState = {
					menuStartLeft: position.left,
					menuClickDetalX: menuClickDetalX
				};
				this.$emit('drag-start');
				menu.addEventListener('touchmove', this.moveFn);
				menu.addEventListener('touchend', this.endFn);
				menu.addEventListener('touchcancel', this.endFn);
			});
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.range {
		display: flex;
		align-items: center;
		width: 100%;
		height: 0.3rem;
	}
	.range-content {
		flex: 1;
		position: relative;
		margin-right: 0.3rem;
	}
	.range-line, .range-progress {
		position: absolute;
		top: 50%;
		left: 0;
		right: -0.3rem;
		transform: translateY(-50%);
	}
	.range-line {
		border-top-style: solid;
		border-top-color: var(--border-color);
	}
	.range-progress {
		background: var(--theme-color);
	}
	.range-menu {
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		width: 0.3rem;
		height: 0.3rem;
		border-radius: 100%;
		background: var(--theme-color);
	}
</style>