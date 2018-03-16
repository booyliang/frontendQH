<!-- Author: Boring -->

<template>
	<y-link :url="data.targetUrl" class="large_image_text_ad">
		<div class="large_image_text_ad-title" v-text="data.title"></div>
		<div class="image--responsive">
			<img :src="data.imgUrl" alt="data.title">
		</div>
	</y-link>
</template>

<script type="text/javascript">
	import mixin from './mixin';

	export default {
		name: 'y-large-image-text-ad',

		mixins: [
			mixin
		],

		data() {
			return {
				data: this.list[0]
			};
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.large_image_text_ad {
		display: block;

		& .image--responsive {
			padding-bottom: 27%;
		}
	}
	.large_image_text_ad-title {
		margin-bottom: 0.5em;
	}

	.flow_list,
	.dynamic_list {
		& .large_image_text_ad {
			@apply --layout;
			@apply --border-top;
			padding-top: 0.4rem;
			padding-bottom: 0.4rem;
		}
		& .large_image_text_ad-title {
			font-size: .36rem;
		}
	}
</style>