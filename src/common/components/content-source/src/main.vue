/**
*	Author: yefan
*
*/
<template>
	<div class="content_source">
		<template v-for="item in metaData">
			<p class="content_source-text" v-if="Object.keys(item)[0] == 'text'" v-html="translateText(item.text)"></p>
			<div v-else-if="Object.keys(item)[0] == 'image'" class="image-box">
				<img max-width="100%" :src="item.image | imageResize(6)">
			</div>
			<div v-else-if="Object.keys(item)[0] == 'video'" class="video-box">
				<y-video width="100%" :src="item.video.url" :poster="item.video.thumbnailImage | imageResize(3)"></y-video>
			</div>
			<div v-else-if="Object.keys(item)[0] == 'audio'" class="audio-box">
				<y-audio :src="item.audio.url" :time="item.audio.time"></y-audio>
			</div>
		</template>
	</div>
</template>
<script>
import YVideo from '@/components/video'
import YAudio from '@/components/audio'
import ImageResize from '@/filters/imageResize'
export default {
	name: 'y-content-source',
	props: {
		contentSource: {
			type: String,
			default: '[]'
		},
	},
	components: {
		YVideo,
		YAudio
	},
	data() {
		return {
			metaData: []
		}
	},
	watch: {
		'contentSource': 'initData'
	},
	methods: {
		translateText(value) {
			return value.replace(/\s/g, '&nbsp;');
		},
		getTranslateString(value) {
			return value.replace(/\\n/g, "<br>").replace(/\\r/g, "<br>");
		},
		initData() {
			try {
				let metaData = JSON.parse(this.getTranslateString(this.contentSource));

				if (!Array.isArray(metaData)) {
					throw new Error(`${metaData} is not an array.`);
				}

				this.metaData = metaData;
			} catch (error) {
				console.error(error);
				console.error('组件content-source：请传入正确的contentSource格式')
			}
		}
	},
	mounted() {
		this.initData();
	}
}
</script>
<style>
.content_source {
	& .image-box,
	& .audio-box,
	& .video-box {
		margin: 0.15rem 0;
	}
	& .image-box {
		& img {
			vertical-align: top;
			border-radius: .12rem;
		}
	}
}
.content_source-text {
	margin: 0.15rem 0;
	font-size: .34rem;
	line-height: .56rem;
	min-height: .56rem;
}
</style>


