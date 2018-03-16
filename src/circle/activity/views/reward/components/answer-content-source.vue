
<template>
	<div class="content_source ">
		
			<div class="content_source-text " :class="textClass"
			:style = "textstyle"  v-if="textData" ref="textNode"
			  v-html="translateText(textData.text)"></div>
			<div v-if="audioData" class="audio-box">
				<y-audio :src="audioData.audio.url" :time="audioData.audio.time"></y-audio>
			</div>
		
	</div>
</template>
<script>
import YVideo from '@/components/video'
import YAudio from '@/components/audio'
import ImageResize from '@/filters/imageResize'
export default {
	name: 'y-answer-content-source',
	props: {
		contentSource: {
			type: String,
			default: '[]',
			
		},
		clamp: {
			type: Number,
			default: 0,
			
		},
	},
	components: {
		YVideo,
		YAudio
	},
	data() {
		return {
			textData: null,
			audioData: null
		}
	},
	computed: {
		textstyle() {
			if (this.clamp)
				return {'-webkit-line-clamp': this.clamp}
		},
		textClass() {
			if (this.clamp)
				return {'content_source-text_clamp': this.clamp}
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
		hasClamp() {
			let textNode = this.$refs.textNode;
			if (!textNode)
				return false;		
			return textNode.getBoundingClientRect().height + 1  < textNode.scrollHeight;	
		},

		initData() {
			try {
				
				let contentSource = JSON.parse(this.getTranslateString(this.contentSource));
				if (!Array.isArray(contentSource)) {
					throw new Error(`${contentSource} is not an array.`);
				}
				// console.log(contentSource)
				let texts = [];
				for (let item of  contentSource) {
					if (typeof item.text !== undefined ) {
						item.text && texts.push(item.text)
					}  
					if (item.audio) {
						this.audioData = item;
						// console.log(this.audioData)
						
					}
				}
				
				if (texts.length) {
					this.textData = {text: texts.join('<br/>')}
				
				}
			
				// this.metaData = contentSource;
			} catch (error) {
				console.error(error);
				console.error('组件content-source：请传入正确的contentSource格式')
			}
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.initData();
			
		})
		
	}
}
</script>
<style>
	@import '#/css/var.css';
.content_source-text_clamp{
	@apply --text-cut-multi-line;
}
</style>


