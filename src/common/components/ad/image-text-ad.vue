<!-- Author: Boring -->

<template>
	<div class="image_text_ad">
		<y-link @click="track(item)" v-for="(item, index) of list" :key="index" :url="item.targetUrl" class="image_text_ad-item">
			<img :src="item.imgUrl" :alt="item.title" class="image_text_ad-item_image">
			<span class="image_text_ad-item_title" v-text="item.title"></span>
		</y-link>
	</div>
</template>

<script type="text/javascript">
	import mixin from './mixin';
	import zhuge from '@/js/zhuge';
	export default {
		name: 'y-image-text-ad',

		mixins: [
			mixin
		],
		computed: {
			devType() {  // 机型
				let devType = this.$env.devType;
				if (devType === 0) { 
					return 'Andriod';
				} else if ( devType === 1) {
					return 'iOS ';
				} else {
					return 'PC';
				}
				
			}
		},
		methods: {
			track(item) {
				zhuge.track(`[${this.$circle.circleName}]--推广`, {
					'用户id': this.$env.custId,  // 用户id
					'机型': this.devType,  // 设备类型 Andriod ios
					'话题文字': item.title // 话题文字
				}, function () {
					// console.log('track succeed', item.title);
				});
			}
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.image_text_ad {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		padding: 0.15rem 0;
		background: white;

		&::before {
			@apply --full;
			content: "";
			width: 1px;
			background: var(--border-color);
			margin: 0.3rem auto;
		}
	}
	.image_text_ad-item {
		@apply --display-flex;
		@apply --layout;
		width: 50%;
		padding-top: 0.15rem;
		padding-bottom: 0.15rem;
	}
	.image_text_ad-item_image {
		@apply --circle;
		width: 0.48rem;
		height: 0.48rem;
		margin-right: 0.2rem;
	}
	.image_text_ad-item_title {
		@apply --text-cut;
	}
</style>