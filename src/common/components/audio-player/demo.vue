<template>
	<div class="audio_player-demo">
		<y-audio-player :src="demo.src" :time="8972" :size="2048"></y-audio-player>
	</div>
</template>
<script>
	import YAudioPlayer from '@/components/audio-player'
	export default {
		components: {
			YAudioPlayer
		},
		data() {
			return {
				demo: {
					src: 'http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg'
				}
			}
		}
	}
</script>
<style>
	.audio_player-demo {
		background: #fff;
		min-height: 10rem;
	}
</style>

