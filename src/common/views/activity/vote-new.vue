<template>
	<div class="activity-vote-new-wrap">
		<!--头部导航 Start-->
		<y-nav :title="$R('participate-activity')" :menuData="menuData">
			<span slot="nav-right">
				<y-publish-button>{{$R('publish')}}</y-publish-button>
			</span>
		</y-nav>
		<!--头部导航 End-->
	
		<div class="activity-new-content">
			<y-input v-model="vm.signupUserPhone" :maxlength="11" :show-text-length-info="false" :placeholder="$R('enter-telphone')" class="telphone"></y-input>
			<!--详情图文-->
			<y-editor v-model="contentSource" :textMaxLength="10000" :imageEnable="articleType===4" :imgMaxLength="20" :placeholder="$R('input-text')+'...'" ref="editor"></y-editor>
	
			<div class="show-upload">
				<!--详情音频-->
				<div v-if="articleType==3 && vm.audioUrl" class="upload-content audio-content">
					<y-audio-play :src="vm.audioUrl" :time="vm.times" :size="vm.size"></y-audio-play>
					<div class="upload-remove audio-remove iconfont icon-close" @click="removeUpload"></div>
				</div>
				<!--详情视频-->
				<div v-if="articleType==2 && vm.vidioUrl" class="upload-content video-content">
					<y-video :src="vm.vidioUrl" :poster="poster" ref="video"></y-video>
					<span v-text="coverTime" class="times"></span>
					<div class="upload-remove video-remove iconfont icon-close" @click="removeUpload"></div>
				</div>
			</div>
	
			<!--资源上传button-->
			<div class="activity-vote-content-type">
				<!--视频块Start-->
				<div v-if="articleType==2" @click="goVideo" class="show-icon">
					<i class="iconfont icon-video" :class="vm.vidioUrl?'video-disabled':''"></i>
					<span class="activity-vote-text" v-text="$R('video-upload-limit', 500)"></span>
				</div>
				<!--音频块Start-->
				<div v-else-if="articleType==3" @click="goAudio" class="show-icon">
					<i class="iconfont icon-voice" :class="vm.audioUrl?'audio-disabled':''"></i>
					<span class="activity-vote-text" v-text="$R('audio-upload-limit', 120)"></span>
				</div>
				<!--图文-->
				<div v-else-if="articleType==4" class="show-icon">
					<!--<i class="iconfont icon-picture" :class="imgs.length >= 20 ? 'img-disabled': '' "></i>-->
					<span class="activity-vote-text img-tip" v-text="$R( 'image-upload-limit', 20) "></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import YInput from '@/components/input';
import YEditor from '@/components/content-editor';
import Toast from '@/components/toast';
import YVideo from '@/components/video';
import YAudioPlay from '@/components/audio-player';
import { YPublishButton, PublishMixin } from "@/components/content-publish"
export default {
	mixins: [PublishMixin],
	components: {
		YEditor, YVideo, YAudioPlay, Toast, YNav, YInput, YPublishButton,
	},
	data() {
		return {
			menuData: ['index'],
			contentSource: '[]',
			vm: {
				signupUserPhone: '',
				signupContent: '',
				audioUrl: null,
				imgUrl: null,
				vidioUrl: null,
				times: 0,
				size: 0,
			},
			poster: null,
			articleType: null,
		}
	},

	computed: {
		// 转换视频时长格式  t: 毫秒
		coverTime() {
			if (!this.vm.times) return '00:00';
			let time = this.vm.times / 1000;
			let hour = Math.trunc(time / (60 * 60)) % 24 + '';
			if (hour.length === 1) hour = '0' + hour;

			let minute = Math.trunc(time / 60) % 60 + '';
			if (minute.length === 1) minute = '0' + minute;

			let second = Math.trunc(time) % 60 + '';
			if (second.length === 1) second = '0' + second;

			let t_str = hour > 0
				? hour + ':' + minute + ':' + second
				: minute + ':' + second;

			return t_str;
		},
	},

	created() {
		this.articleType = parseInt(this.$route.params.cateId);
	},

	methods: {
		// 原生视频
		goVideo() {
			if (this.vm.vidioUrl) return;

			this.$yryz.uploadVideo()
				.then(data => {
					this.vm.vidioUrl = data.url;
					this.poster = data.thumbnailImage;
					this.vm.times = parseInt(data.videoTime);
				});
		},
		// 原生音频
		goAudio() {
			if (this.vm.audioUrl) return;

			this.$yryz.uploadAudio()
				.then(data => {
					// alert(JSON.stringify(data));
					this.vm.audioUrl = data.url;
					this.vm.times = parseInt(data.audioTime);
					this.vm.size = data.size;
				});
		},

		/**
		 * 删除上传资源
		 */
		removeUpload() {
			switch (this.articleType) {
				case 2:
					this.vm.vidioUrl = null;
					break;
				case 3:
					this.vm.audioUrl = null;
					break;
			}
		},

		// 发布内容效验
		validate() {

			if (this.vm.signupUserPhone === '' || !/^1[3|4|5|7|8|9]\d{9}$/.test(this.vm.signupUserPhone)) {
				// console.log(this.vm.signupUserPhone);
				Toast(this.$R('toast-correct-phone'));
				return false;
			}
			var SummaryData = this.$refs.editor.getSummaryData();
			if (SummaryData.content === '' || SummaryData.content.length < 10) {
				Toast(this.$R('enter-activity-detail', 10));
				return false;
			}
			this.vm.signupContent = this.contentSource;

			if (this.articleType === 2) {
				if (this.vm.vidioUrl === null || this.vm.vidioUrl === '') {
					Toast(this.$R('upload-video'));
					return false;
				}
				if (this.poster) this.vm.imgUrl = this.poster;
			}
			if (this.articleType === 3) {
				if (this.vm.audioUrl === null || this.vm.audioUrl === '') {
					Toast(this.$R('upload-audio'));
					return false;
				}
			}
			if (this.articleType === 4) {
				if (SummaryData.imgUrl === null || SummaryData.imgUrl === '') {
					Toast(this.$R('upload-img'));
					return false;
				}
				this.vm.imgUrl = SummaryData.imgUrl;
			}

			this.postData = {
				...this.vm,
				activityId: this.$route.params.id
			}
		},

		// 活动发布
		publish() {
			this.$http.post(`/services/app/v1/activitysignup/single`, this.postData).then(res => {
				let data = res.data;
				if (data.code === '200') {
					Toast(this.$R('publish-success')).then(() => {
						this.publishSuccess(`/activity/homepage/${this.$route.params.id}`);
					});
				} else {
					this.publishError(data.msg);
				}
			}).catch(msg => {
				this.publishError(msg);
			})
		}
	}
}
</script>

<style>
@import "#/css/var.css";
.activity-vote-new-wrap {
	& .activity-new-content {
		display: flex;
		flex-direction: column;
		min-height: calc(100vh - 1.28rem);

		& .telphone {
			margin: .2rem 0;
		}

		& .show-upload {
			background: #fff;
			display: flex;
			-webkit-box-orient: vertical;
			flex-direction: column;
			flex: 1;
			padding-bottom: 1.2rem;

			& .video-content {
				position: relative;
				& .times {
					position: absolute;
					bottom: 0.1rem;
					right: 0.1rem;
					background: rgba(0, 0, 0, 0.6);
					border-radius: 1rem;
					padding: 0.05rem 0.2rem;
					color: #fff;
				}
			}

			& .img-content {
				display: flex;
				flex-wrap: wrap;
				padding: 0 10px;

				& li {
					position: relative;
					width: 25%;
					padding: 0.06rem;
					& div {
						position: relative;
						height: 1.5rem;
						& img {
							width: 100%;
							height: 100%;
						}
						& .img-remove {
							position: absolute;
							background: rgba(0, 0, 0, 0.6);
							bottom: 0;
							right: 0;
							color: #fff;
							width: 100%;
							height: 0.5rem;
							;
							text-align: center;
							line-height: 0.5rem;
							;
						}
					}
				}
			}

			& .audio-content {
				position: relative;
				padding: 0 .2rem;
			}

			& div {
				& .upload-remove {
					position: absolute;
					top: 0;
					right: 0;
				}
				& .video-remove {
					font-size: 18px;
					color: #fff;
					background: rgba(0, 0, 0, 0.5);
					padding: 0.04rem 0.1rem;
				}
				& .audio-remove {
					right: .2rem;
					padding: .04rem .06rem .06rem .12rem;
					border-bottom-left-radius: .25rem;
					color: #fff;
					background-color: #939393;
					font-size: 10px;
				}
				& .audio-info {
					width: 200px;
					height: 40px;
					border: 1px solid #00aff7;
					border-radius: 20px;
					margin-left: 10px;
					& i {
						background-repeat: no-repeat;
						background-size: contain;
						display: inline-block;
						position: relative;
						width: 20px;
						height: 20px;
						top: 10px;
						margin-left: 20px;
					}

					& .audio-icon {
						background-image: url(../../assets/audio_icon@2x.png);
					}

					& .audio-play-icon {
						background-image: url(../../assets/audio_play_cion@2x.gif);
					}

					& span {
						float: right;
						padding-right: 15px;
						line-height: 40px;
					}
				}
			}
		}

		& .activity-vote-content-type {
			background: #fff;
			position: fixed;
			bottom: 0;
			width: 100%;
			border-top: 1px solid #eee;

			& .show-icon {
				display: flex;
				align-items: center;
				height: 1rem;

				& i {
					display: inline-block;
					background-color: var(--theme-color);
					width: 1rem;
					height: 0.7rem;
					line-height: 0.7rem;
					border-radius: .1rem;
					color: #fff;
					text-align: center;
					margin-left: 0.2rem;

					&.icon-video {
						font-size: 28px;
					}
					&.icon-voice {
						font-size: 21px;
					}
					&.icon-picture {
						font-size: 22px;
					}
				}
				& .activity-vote-text {
					margin-left: .2rem;
				}

				& .img-tip {
					margin-left: 1.4rem;
				}
				& .video-disabled {
					background-color: rgba(0, 0, 0, 0.1);
				}
				& .audio-disabled {
					background-color: rgba(0, 0, 0, 0.1);
				}
				& .img-disabled {
					background-color: rgba(0, 0, 0, 0.1);
				}
			}
		}


		& .y-input-wrap {
			& input {
				width: 100%;
			}

			& .input-bottom-txt {
				display: none;
			}

			& .text-length-info {
				border-bottom: 1px solid #f4f4f4;
				padding-bottom: .2rem;
			}
		}

		& .content_editor {

			& .content_editor-view {
				padding-bottom: .3rem;
			}
			& .content_editor-view {
				& .y-textarea {
					& textarea {
						min-height: 4.2rem;
					}
				}
			}
		}

		& .content_editor-tool {
			border: none;
			padding: 0;
		}
		& .tool-item-image {
			position: fixed;
			bottom: 0.15rem;
			left: 0.2rem;
			z-index: 99
		}

		& .activity-vote-text {
			font-size: 14px;
			color: var(--text-assist-color);
		}
	}
}
</style>
