/**
*	Author: wangboning
*
*/
<template>
	<div class="video" :class="{'video--playing': isPlaying}" @click="handleClick" :style="style">
		<video :src="src" v-if="!isNative" ref="video"></video>
		<div class="video-control">
			<span class="iconfont icon-play"></span>
		</div>
	</div>
</template>

<script type="text/javascript">
export default {
	name: 'y-video',

	props: {
		src: String,
		poster: String,
		preview: Boolean
	},

	data() {
		return {
			style: {
				'background-image': `url("${this.poster}")`
			},
			isNative: this.$yryz.isNative(),
			isPlaying: false
		}
	},

	methods: {
		handleClick(event) {
			if (this.preview) {
				return false;
			}

			this.play();
		},

		play() {
			if (this.isNative) {
				this.$yryz.playVideo({
					videoUrl: this.src
				});
			} else {
				this.isPlaying = true;
				this.$refs.video.play();
			}
		}
	}
};
</script>

<style type="text/css">
@import '#/css/var.css';

.video {
	@apply --no-tap-highlight;
	position: relative;
	background: black;
	padding-bottom: 44.92%;
	background-size: cover;
	overflow: hidden;
	& video {
		@apply --full;
		height: 100%;
		width: 100%;
		opacity: 0;
	}
	& .video--playing {
		& .video-control {
			opacity: 0
		}
		& video {
			opacity: 1
		}
	}
}

.video-control {
	@apply --full;
	@apply --display-flex;
	@apply --bg-alpha;
	@apply --circle;
	content: "";
	justify-content: center;
	width: 0.88rem;
	height: 0.88rem;
	margin: auto;

	& .iconfont {
		position: relative;
		left: 5%;
		font-size: 0.4rem;
	}
}
</style>