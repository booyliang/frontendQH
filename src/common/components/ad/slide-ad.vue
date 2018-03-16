<!-- Author: Boring -->

<template>
	<div class="slide_ad">
		<y-slider :options="sliderOptions">
			<y-link @click="track(item)" v-for="(item, index) of list" :key="index" :url="item.targetUrl" class="image--responsive">
				<img :src="item.imgUrl" :alt="item.title">
			</y-link>
		</y-slider>
	</div>
</template>

<script type="text/javascript">
import Slider from '@/components/slider';
import mixin from './mixin';
import zhuge from '@/js/zhuge';
export default {
	name: 'y-slide-ad',

	mixins: [
		mixin
	],

	components: {
		[Slider.name]: Slider,
	},
	data() {
		return {
			sliderOptions: {
				autoplay: 3000,
				loop: true
			}
		};
	},
	computed: {
		devType() {  // 机型
			let devType = this.$env.devType;
			if (devType === 0) {
				return 'Andriod';
			} else if (devType === 1) {
				return 'iOS ';
			} else {
				return 'PC';
			}

		}
	},
	methods: {
		track(item) {
			window.zhuge.track('广告页点击', {
				'用户id': this.$env.custId,  // 用户id
				'机型': this.devType,  // 设备类型 Andriod ios
				'图片url': item.imgUrl, // 图片url
				'圈子名称': this.$circle.circleName, // 圈子名称
			}, function () {
				// console.log('track succeed', item.imgUrl);
			});
		}
	},
};
</script>

<style type="text/css">
@import "#/css/var.css";

.slide_ad {
	& .image--responsive {
		display: block;
		padding-bottom: 27%;
	}
}
</style>