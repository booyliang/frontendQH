<template>
	<div class="reward_join">
		<y-nav title="参与悬赏">
			<y-publish-button slot="nav-right">发布</y-publish-button>
		</y-nav>
		<div class="audio-tips" v-if="hasAudio">为保障回答质量，添加语音内容后不能再添加图文内容</div>
		<y-editor :class="['join-content',{'notxt':hasAudio}]" v-model="joinData.contentSource" :img-disable = "imgDisable" :audio-disable="audioDisable" :audio-enable="audioEnable" :text-max-length="1000" :img-max-length="9" placeholder="请输入回答" ref="nativeEditor" ></y-editor>
		<div class="audio-tilte" v-if="hasAudio">已录入的语音</div>
		<div class="tips" @click="openRule"><span class="iconfont icon-tips-b"></span> 悬赏规则说明</div>
	</div>
</template>
<script>
import {YPublishButton, PublishMixin} from '@/components/content-publish'
import YEditor from '@/components/content-editor'
import zhuge from '@/js/zhuge';
export default {
	name: "reward-join",
	components: {
		YPublishButton,
		YEditor,
	},
	mixins: [PublishMixin],
	data() {
		return {
			hasAudio: false,
			audioEnable: true,
			audioDisable: false,
			imgDisable: false,
			joinData: {
				contentSource: '[]',
				custId: this.$env.custId,
				offerId: this.$router.currentRoute.params.id,
				audio_duration: '',
				
			}
		}
	},
	watch: {		
		'joinData.contentSource': function (newVal) { 
			let summary = this.$refs.nativeEditor.getSummaryData();
			// console.log(summary)
			if (summary.content || summary.imgUrl) {  // 视频 与 文字图片互斥
				this.audioDisable = true;
			} else {
				this.audioDisable = false;
			}
			if (summary.audioUrl) {
				this.hasAudio = true;
				this.imgDisable = true;
				this.audioDisable = true;
			} else {
				this.hasAudio = false;
				this.imgDisable = false;
			}
		}
	},
	computed: {
		devType() { // 机型
			let devType = this.$env.devType;
			if (devType === 0) {
				return 'Andriod';
			} else if (devType === 1) {
				return 'iOS ';
			} else {
				return 'PC';
			}

		},
		content() {
			return this.$refs.nativeEditor.getSummaryData().content;
		}
		
	},
	methods: {
		openRule() { // 跳转到悬赏规则
			let url = 'https://static.yryz.com/quanhu/doc/reward_rule/index.html';
			if (this.$yryz.isNative()) {
				this.$yryz.openUrl({url: url});
				return false;
			}
			window.location.href = url;
			
		},
		// 发布时校验
		async validate() {
			var summaryData = this.$refs.nativeEditor.getSummaryData();
			if (this.content.trim() && this.content.trim().length < 10) {
				this.$toast("为保证回答质量，请输入至少10个字的答案");
				return false;
			}
			if (!summaryData.imgUrl && !summaryData.audioUrl && !summaryData.content ) {
				this.$toast("无法发布，请添加回答");
				return false;
			}
			
			// 发布二次确认 弹框
			await this.$dialog.confirm('是否确认发布')
			this.postData = {
				...this.joinData,
				...summaryData,
				moduleEnum: '',
			}
			this.postData.imgUrl = summaryData.imgUrl;
			this.postData.content = summaryData.content;
			this.postData.audioDuration = summaryData.audioTime;
			this.postData.audio = summaryData.audioUrl;
		},
		// 发布按钮
		publish() {
			console.log(this.postData)
			this.$openApi.post(`/api/v3/offer/replay`, this.postData)
			.then(res => {
				let data = res.data;
				if (data.ret === 1) {
					this.publishSuccess(`/reward/detail/${this.joinData.offerId}`);
					// 参与悬赏成功 添加埋点
					window.zhuge.track(`参与悬赏`, {
						'用户id': this.$env.custId, // 用户id
						'机型': this.devType, // 设备类型 Andriod ios
					});
				} else {
					this.publishError(data.msg);
				}
			})
			.catch(msg => {
				this.publishError(msg);
			})
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.reward_join{
	background: #f8f8f8;
	min-height: 100vh;
	& .audio-tips{
		padding: .3rem;
		color: var(--text-tips-color);
		font-size: .26rem;
	}
	& .content_editor-audio {
		margin-top: 0;
		position: relative;
		top: .3rem;
	    padding-bottom: .5rem;
	}
	& .notxt {
		padding-top: .7rem;
	}
	& .notxt .y-input-wrap.y-textarea{
		display:none;
	}
	& .audio-tilte {
		position: absolute;
		left: .3rem;
		top: 2.6rem;
		border-left: .04rem solid var(--theme-color);
		font-size: .32rem;
		padding-left: .1rem;
		line-height: 1;
	}
	& .tips{
		padding: .3rem;
		font-size: .26rem;
		color: var(--theme-color);
		& span{
			font-size: .26rem;
			color: #999;
		}
	}
	& .content_editor-tool{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #fff;

		& button {
			background-color: #67b6ff;

			& i {
				font-size: .4rem;
			}
		}
	}
	& .rule-content{
		padding: .5rem 0 0;
		& .rule-title{
			font-size: .38rem;
			line-height: .5rem;
			color: #f5cd45;
			text-align: center;
		}
		& .rule-des{
			padding: .3rem .45rem 0;
			font-size: .32rem;
			color: #333;
			font-weight: 700;
		}
		& .rule-list{
			padding: .3rem .45rem;
			& li{
				font-size: .32rem;
				line-height: .5rem;
				color: #333;
			}
		}
		& .rule-btn{
			display: block;
			text-align: center;
			height: .9rem;
			line-height:.9rem;
			color: #333;
			font-size: .32rem;
			background: #f8f8f8;
		}
	}
	& .content_editor-view {
       margin: 0;
       @apply --border-bottom;
       padding-bottom: .2rem;
	}
	& .y-input-wrap .text-length-info 
	{
		& .current-text-length {
			color: var(--text-assist-dark);
		}
		& .text-max-length {
           color: var(--text-assist-light);
		}
	}
		
}
</style>


