<!-- Author: Boring -->

<template>
	<y-slider :options="sliderOptions" ref="slider" class="picker-select">
		<div v-for="(option, index) of options" :key="index" :data-value="option" class="picker-option" v-text="option"></div>
	</y-slider>
</template>

<script type="text/javascript">
	import Slider from '@/components/slider';

	export default {
		name: 'y-picker-select',

		components: {
			[Slider.name]: Slider
		},

		props: {
			name: String,
			options: Array,
			value: {
				type: String,
			}
		},

		computed: {
			sliderOptions() {
				return {
					initialSlide: this.getIndex(this.value),
					pagination: false,
					direction: 'vertical',
					slidesPerView: 5,
					freeMode: true,
					freeModeSticky: true,
					centeredSlides: true,
					slideToClickedSlide: true,
					speed: 300,

					onInit: (swiper) => {
						this.updateValue(this.getCurrentSlideValue(swiper));
					},

					onTransitionStart: (swiper) => {
						this.$emit('transition-start', this.name);
					},

					onTransitionEnd: (swiper) => {
						this.$emit('transition-end', this.name);
						this.updateValue(this.getCurrentSlideValue(swiper));
					}
				};
			}
		},

		watch: {
			value(newValue) {
				this.select(newValue);
			},

			options(newValue) {
				const index = newValue.indexOf(this.value);
				this.select(Math.max(index, 0));
			}
		},

		methods: {
			/**
			 * 手动选择某一项。
			 *
			 * @param {Number | String} target 类型为 Number 时，值为索引；类型为 String 时，值为 option 值。
			 */
			select(target) {
				let swiper = this.$refs['slider'].getInstance();
				let {
					index,
					value
				} = typeof target === 'number' ? {
					index: target,
					value: this.options[target]
				} : {
					index: this.getIndex(target),
					value: target
				}

				if (index < 0) {
					({
						index,
						value
					} = {
						index: 0,
						value: this.options[0]
					});
				}

				swiper.slideTo(index);
				this.updateValue(value);
			},

			updateValue(value) {
				this.$emit('input', value);
			},

			getIndex(option) {
				return this.options.indexOf(option);
			},

			getCurrentSlideValue(swiper) {
				return this.options[swiper.activeIndex];
			}
		},
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.picker-select {
		@apply --no-tap-highlight;
		flex: 1;
	}
	.picker-option {
		@apply --display-flex;
		justify-content: center;
	}
</style>