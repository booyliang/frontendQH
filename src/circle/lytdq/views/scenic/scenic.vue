<template>
	<div class="scenic_page">
		<y-nav :title="$R('scenic-detail')" :menuData="['index', 'refresh', 'copy-url', 'report']"></y-nav>
		<header class="scenic_cover flow_detail">
			<y-slider :options="sliderOptions" class="scenic_images">
				<div v-for="(image, index) of images" :key="index" class="image--responsive">
					<img :src="image" alt="">
				</div>
			</y-slider>
			<div class="scenic_title">
				<h1 class="scenic_name" v-text="data.name"></h1>
				<div class="scenic_place">
					<span class="iconfont icon-addr"></span>{{data.placeName}}
				</div>
			</div>
		</header>
		<y-panel v-if="data.description" :title="$R('scenic-summary')" icon="house">
			<div v-text="data.description"></div>
		</y-panel>
		<y-panel v-if="data.address" :title="$R('scenic-location')" icon="addr-map">
			<div v-text="data.address"></div>
		</y-panel>
		<y-panel v-if="data.traffic" :title="$R('traffic')" icon="bus">
			<div v-text="data.traffic"></div>
		</y-panel>
		<y-panel v-if="data.openDate" :title="$R('open-time')" icon="open">
			<div v-text="data.openDate"></div>
		</y-panel>
		<y-comment :data="data"></y-comment>
	</div>
</template>

<script type="text/javascript">
	import Slider from '@/components/slider';
	import Panel from '@/components/panel';
	import Comment from '@/components/comment';

	export default {
		components: {
			[Slider.name]: Slider,
			[Panel.name]: Panel,
			[Comment.name]: Comment,
		},

		data() {
			return {
				data: {},
				sliderOptions: {
					autoplay: 3000
				}
			};
		},

		computed: {
			images() {
				return this.data.imgUrl ? this.data.imgUrl.split(',') : [];
			}
		},

		methods: {
			async initData() {
				this.data = (await this.$http({
					url: `/services/app/v1/spotscenic/single/${this.$route.params.scenicId}`
				})).data.data;
			}
		},

		created() {
			this.initData();
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.scenic_page {
		& .panel-title {
			color: var(--theme-color);
		}
		& .panel-head {
			line-height: 40px;
			padding-top: 0.5em;
			border-bottom: none;
		}
		& > .panel:nth-of-type(1) {
			& .panel-head {
				@apply --border-top;
			}
		}
		& .panel-body {
			font-size: 17px;
			padding-top: 0;
		}
	}
</style>

<style type="text/css" scoped>
	@import "#/css/var.css";

	.scenic_images {
		margin-bottom: 0.4rem;

		& .image--responsive {
			padding-bottom: 56.2%;
		}
	}
	.scenic_cover {
		@apply --layout;
		padding-top: 0.4rem;
		padding-bottom: 0.4rem;
		background: white;
	}
	.scenic_title {
		@apply --display-flex;
		justify-content: space-between;
		line-height: 1;
	}
	.scenic_name {
		font-size: 22px;
	}
	.scenic_place {
		color: var(--theme-color);

		& .iconfont {
			margin-right: 0.3em;
		}
	}
</style>