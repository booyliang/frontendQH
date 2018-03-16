/**
*	Author: yefan
*
*/
<template>
	<div class="audio_player">
		<div class="audio_player-button" @click="playAudio">
			<transition name="fade" mode="out-in">
				<i class="iconfont icon-stop" v-if="isPlay"></i>
				<i class="iconfont icon-voice-a" v-else></i>
			</transition>
		</div>
		<div class="audio_player-info">
			<h5 class="audio_player-title">{{ title }}</h5>
			<p class="audio_player-assist">{{ size > 1024 ? (size / 1024).toFixed(1) + 'MB' : size + 'KB' }}</p>
		</div>
		<div class="audio_player-progress">
			<y-range @change="setPlayTime" @drag-start="dragProgress = true" v-model="playTime" :max="time"></y-range>
		</div>
		<div class="audio_player-time">{{ time | audioTime }}</div>
	</div>
</template>
<script>
	let doubleNum = function (value) {
		return value > 9 ? value : '0' + String(value);
	}
	import YRange from '@/components/range'
	export default {
		components: {
			YRange
		},
		props: {
			title: String,
			src: String,
			time: Number,
			size: {
				type: Number,
				default: 0
			}			
		},
		data() {
			return {
				audio: null,
				isPlay: false,
				currentTime: 0,
				playTime: 0,
				dragProgress: false,
				oldSrc: ''
			}
		},
		filters: {
			audioTime(value) {
				let sec  = value / 1000;
				let m = parseInt(sec / 60);
				let s =  Math.round(sec % 60);
				return m + ':' + doubleNum(s);
			},
		},
		methods: {
			setPlayTime(value) {
				this.audio.currentTime = value / 1000;
				this.dragProgress = false;
				if (!this.isPlay) {
					this.playHandle();
				}
			},
			playAudio() {
				if (this.isPlay) {
					this.audio.pause();
				} else  {
					this.playHandle();
				}
			},
			playHandle() {
				if (this.oldSrc !== this.src) {
					this.audio.src = this.src;
					this.oldSrc = this.src;
				}
				this.audio.play();
				this.isPlay = true;
				this.$emit('play');
			},
			addEvent() {
				this.audio.addEventListener('timeupdate', this.timeupdateFn);
				this.audio.addEventListener('pause', this.pauseHandle);
				this.audio.addEventListener('ended', this.playEnd);
			},
			timeupdateFn() {
				if (!this.dragProgress) {
					this.playTime = this.audio.currentTime * 1000;
				}
			},
			pauseHandle() {
				this.isPlay = false;
				this.currentTime = this.audio.currentTime;
				this.$emit('pause', this.curretnTime);
			},
			playEnd() {
				this.isPlay = false;
				this.playTime = 0;
				this.$emit('ended');
			}
		},
		mounted() {
			this.audio = new Audio();
			this.addEvent();
		},
		beforeDestroy() {
			this.audio.pause();
			this.audio.removeEventListener('timeupdate', this.timeupdateFn);
			this.audio.removeEventListener('pause', this.pauseHandle);
			this.audio.removeEventListener('ended', this.playEnd);
			this.audio = null;
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.audio_player {
		display: flex;
		align-items: center;
		width: 100%;
		height: 1.1rem;
		padding: 0 0.2rem;
		background-color: var(--bg-color);
	}
	.audio_player-button {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: 0.7rem;
		height: 0.7rem;
		overflow: hidden;
		background: var(--theme-color);
		border-radius: 100%;
		& i {
			color: #fff;
			font-size: .4rem;
		}
		& .icon-stop {
			font-size: .28rem;
		}
	}
	.audio_player-info {
		margin-left: 0.15rem;
	}
	.audio_player-title {
		flex: 1;
		margin: 0;
		padding: 0;
		line-height: 1;
		font-size: .28rem;
	}
	.audio_player-assist {
		line-height: 1;
		margin: 0;
		padding: 0;
		margin-top: 0.1rem;
		font-size: .24rem;
		color: var(--text-assist-color);
	}
	.audio_player-progress {
		flex: 1 0 3.25rem;
		width: 3.25rem;
		margin: 0 0.3rem;
	}
	.audio_player-time {
		color: var(--theme-color);
		font-size: .24rem;
	}
</style>

