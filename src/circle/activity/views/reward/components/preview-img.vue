// 九宫格图片样式 点击图片放大预览
<template>
	<ul class="nine_images_preview">
		<li v-for="(item, index) of data" :key="index" class="image--responsive"  @click="showPreview(index)">
			<img :src="item | imageResize(data.length > 1 ? 2 : 3)" alt="">
		</li>
	</ul>
</template>


<script type="text/javascript">
import ImageResize from '@/filters/imageResize'
import album from '@/components/album'
export default {
	name: 'y-reward-item-images',
	data() {
		return {
			swiperOptions: {
				initialSlide: 1,
				autoHeight: false,
				height: window.innerHeight,
				zoom: true,
				zoomMax: 4,
				zoomMin: 1,
				zoomToggle: false,
			},
		}
	},
	props: {
		data: {
			type: Array,
			required: true
		}
	},
	methods: {
		showPreview(index) {
			album.init(this.data, this.swiperOptions);
			album.show(index);
			this.$yryz.on('nativeBack', this.handleAlbum);
		},
		handleAlbum() {
			album.hide();
			this.$yryz.off('nativeBack', this.handleAlbum);
		}
	},
	beforeDestroy() {
		this.handleAlbum();
		
	}
	
};
</script>

<style type="text/css">
@import "#/css/var.css";

.nine_images_preview {
	margin-top: 0.3rem;
}

.nine_images_preview {
	@apply --clearfix;

	&>.image--responsive {
		float: left;
		width: 32.2%;
		padding-bottom: 32.2%;
		margin-bottom: 1.7%;
		&:nth-child(n+2) {
			margin-left: 1.7%;
		}
		&:nth-child(3n+1) {
			margin-left: 0;
		}
		&:only-child {
			float: none;
			width: 100%;
			padding-bottom: 44.92%;
		}
		&> img{
			border-radius: .12rem;
		}
	}
}
</style>