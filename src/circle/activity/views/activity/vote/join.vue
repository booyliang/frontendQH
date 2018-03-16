<template>
	<div class="platform-activity-new-wrap">
		<y-nav title="参与活动" :showLeftArrow="inApp ? true : false">
			<span slot="nav-right">
				<y-publish-button>确认报名</y-publish-button>
			</span>
		</y-nav>

		<div v-if="configInfo">
			<div class="upload-fm-img">
				<div class="fm-img-container" v-if="vm.coverPlan">
					<div class="fm-imgWrap">
						<img :src="vm.coverPlan | imageResize('250_250')" class="fm-img" @click="nativeUploadCoverImg">
						<input class="select_file" @change="uploadCover" accept="image/*" type="file" v-if="!inApp">
					</div>
					<div class="upload-right">
						<p class="text-tips">封面图用于参与本活动的形象展示，请选择清晰的美图。</p>
						<div class="fm-img-tips">
							<div v-text="$R('change-fm-img')" @click="nativeUploadCoverImg"></div>
							<input class="select_file" @change="uploadCover" accept="image/*" type="file" v-if="!inApp">
						</div>
					</div>
				</div>
				<div class="containerWrap" v-else>
					<div class="container">
						<div class="select_file" @click="nativeUploadCoverImg" v-if="inApp"></div>
						<input class="select_file" v-else @change="uploadCover" accept="image/*" type="file">
						<div class="iconfont icon-plus"></div>
						<p>添加封面图</p>
					</div>
					<div class="upload-right">
						<p class="text-tips">封面图用于参与本活动的形象展示， 请选择清晰的美图。</p>
						<div class="fm-img-tips" v-text="$R('change-fm-img')"></div>
					</div>
				</div>
			</div>

			<y-input type="textarea" v-if="configInfo.text" v-model="vm.text" :placeholder="configInfo.text.inputPrompt" :maxlength="parseInt(configInfo.text.upperLimit)"></y-input>
			<y-input type="textarea" v-if="configInfo.text1" v-model="vm.text1" :placeholder="configInfo.text1.inputPrompt" :maxlength="parseInt(configInfo.text1.upperLimit)"></y-input>
			<y-input type="textarea" v-if="configInfo.text2" v-model="vm.text2" :placeholder="configInfo.text2.inputPrompt" :maxlength="parseInt(configInfo.text2.upperLimit)"></y-input>

			<transition-group name="list" tag="div" class="content_editor-img_list" v-if="imgs.length || video.url">
				<div class="content_editor-img_item" v-for="(item, index) in imgs" :key="item">
					<img :src="item | imageResize(2)" @click="showPreview(index)">
					<div class="remove" @click="removeImg(index)">删除</div>
				</div>
				<div v-if="videoEnabeld && video.url" class="content_editor-img_item" :key="video.url">
					<img :src="video.thumbnailImage | imageResize(3)" @click="showPreview(imgs.length)">
					<div class="iconfont  icon-play-big"></div>
					<div class="remove" @click="removeVideo">删除</div>
				</div>
			</transition-group>

			<div class="placeholder"></div>

			<div class="upload_content_img" v-if="imageEnabeld || videoEnabeld">
				<span class="button_container">
					<button class="tool-item-image" :disabled="!imageEnabeld || imgs.length >= imgMaxLength" @click="nativeUploadContentImg" v-if="imageEnabeld">
						<i class="iconfont icon-picture"></i>
						<em>图片</em>
					</button>

					<button class="tool-item-video" :disabled="!videoEnabeld || video.url" @click="uploadVideo" v-if="videoEnabeld">
						<i class="iconfont icon-video-a"></i>
						<em>视频</em>
					</button>

					<input class="select_file" @change="uploadContentImg" accept="image/*" type="file" multiple="multiple" v-if="!inApp && imageEnabeld && !videoEnabeld">
				</span>
				<span class="upload_tips" v-text="uploadTips"></span>
			</div>
		</div>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import YInput from '@/components/input'
import YEditor from '@/components/content-editor'
import Toast from '@/components/toast'
import Dialog from '@/components/dialog'
import { YPublishButton, PublishMixin } from "@/components/content-publish"
import album from '@/components/album'
export default {
	mixins: [PublishMixin],
	components: {
		Toast, YNav, YEditor, YInput, YPublishButton,
	},
	computed: {
		imageEnabeld() {
			return this.configInfo.imgUrl !== undefined;
		},
		videoEnabeld() {
			return this.configInfo.videoUrl !== undefined;
		},
		imgMaxLength() {
			return this.configInfo.imgUrl ? parseInt(this.configInfo.imgUrl.upperLimit) : 0;
		},
		uploadTips() {
			if (this.configInfo.imgUrl) return '你还可以在宣言中插入图片哦！';
			if (this.configInfo.videoUrl) return '你还可以在宣言中插入视频哦！';
			return '';
		}
	},
	data() {
		return {
			inApp: !!this.$yryz.isNative(),
			vm: {
				activityInfoId: this.$route.params.activityId,
				coverPlan: '',
				imgUrl: '',
				text: '',
				text1: '',
				text2: '',
				videoThumbnailUrl: '',
				videoUrl: '',
				moduleEnum: '1007',
			},
			imgs: [],
			uploadBaseUrl: '',
			video: {},
			configInfo: null,
		}
	},

	mounted() {
		if (!this.$env.custId) {
			this.$router.replace({ name: 'voteIndex' });
			return;
		}
		this.$opusApi.get(`/yyl/v1/activity/candidate/config/${this.$route.params.activityId}`).then(res => {
			let resData = res.data;
			if (parseInt(resData.ret) === 6 || parseInt(resData.ret) === 4) {
				this.$eventBus.$emit('login');
			} else {
				this.configInfo = JSON.parse(res.data.data.configSources);
			}
		})

		let baseUrls = {
			dev: "http://upload-dev.yryz.com",
			mo: "https://upload-mo.yryz.com",
			m: "https://upload.yryz.com"
		};
		let baseUrl = "";
		let match = window.location.href.match(/([A-Za-z]+)?\./);

		if (match && match.length > 1) {
			baseUrl = baseUrls[match[1].toLowerCase()];
		} else {
			baseUrl = baseUrls["localhost"] || baseUrls["dev"];
		}
		this.uploadBaseUrl = baseUrl;
	},
	beforeDestroy() {
		album.hide();
	},

	methods: {
		nativeUploadCoverImg() {
			this.$yryz.uploadPics({ picNum: 1, isCrop: true, scaleY: 1 }).then(data => {
				this.vm.coverPlan = data.picUrls[0];
			})
		},
		nativeUploadContentImg() {
			this.$yryz.uploadPics({ picNum: this.imgMaxLength - this.imgs.length }).then(data => {
				this.imgs.push(...data.picUrls);
			})
		},
		uploadVideo() {
			if (!this.inApp) {
				this.$toast('请下载圈乎APP参加活动')
				return false;
			}
			// try {
			// 	this.$refs.audioInst && this.$refs.audioInst.stopAudio();
			// } catch (error) {
			// 	console.log(error)
			// }
			this.$yryz.uploadVideo().then(data => {
				this.video = data;
			})
		},
		removeImg(index) {
			this.imgs.splice(index, 1);
		},
		removeVideo() {
			this.video = {};
		},
		async uploadFile(file) {
			var formData = new FormData();
			formData.append('fileUpload', file);
			this.$indicator.open('上传中...');
			let fileRes = await this.$http.post(`${this.uploadBaseUrl}/uploadResource/oss/uploadImage?loc=quanhu&ossUnzip=true`, formData);
			this.$indicator.close();
			let resData = fileRes.data;
			if (resData.msg === 'success') {
				return resData.resouceUrl
			} else {
				this.$toast(resData.msg);
			}
		},
		getFile(e) {
			let file = e.target.files[0];
			e.target.value = '';
			return file;
		},
		async uploadCover(e) {
			if (this.videoEnabeld) {
				this.$toast('请下载圈乎APP参加活动')
				return false;
			}
			let file = this.getFile(e);
			let url = await this.uploadFile(file);
			this.vm.coverPlan = url;
		},
		async uploadContentImg(e) {
			let files = e.target.files;
			let diff = this.imgMaxLength - this.imgs.length;
			let len = files.length > diff ? diff : files.length;
			for (let i = 0; i < len; i++) {
				let url = await this.uploadFile(files[i]);
				this.imgs.push(url);
			}
			e.target.value = '';
		},

		showPreview(index) {
			let listData = JSON.parse(JSON.stringify(this.imgs));
			if (this.video.url) {
				listData.push(this.video);
			}
			album.init(listData);
			album.show(index);
		},

		/**
		 * 发布内容效验
		 */
		validate() {
			if (!this.vm.coverPlan) {
				Toast('请上传封面图');
				return false;
			}
			if (this.configInfo.text && this.configInfo.text.required === '1' && (this.vm.text.length < this.configInfo.text.lowerLimit || this.vm.text.length > this.configInfo.text.upperLimit)) {
				Toast(this.configInfo.text.errorPrompt);
				return false;
			}
			if (this.configInfo.text1 && this.configInfo.text1.required === '1' && (this.vm.text1.length < this.configInfo.text1.lowerLimit || this.vm.text1.length > this.configInfo.text1.upperLimit)) {
				Toast(this.configInfo.text1.errorPrompt);
				return false;
			}
			if (this.configInfo.text2 && this.configInfo.text2.required === '1' && (this.vm.text2.length < this.configInfo.text2.lowerLimit || this.vm.text2.length > this.configInfo.text2.upperLimit)) {
				Toast(this.configInfo.text2.errorPrompt);
				return false;
			}
			if (this.configInfo.imgUrl && this.configInfo.imgUrl.required === '1' && !this.imgs.length) {
				Toast(this.configInfo.imgUrl.errorPrompt);
				return false;
			}
			if (this.configInfo.videoUrl && this.configInfo.videoUrl.required === '1' && !this.video.url) {
				Toast(this.configInfo.videoUrl.errorPrompt);
				return false;
			}

			this.vm.imgUrl = this.imgs.join(',');
			this.vm.videoThumbnailUrl = this.video.thumbnailImage;
			this.vm.videoUrl = this.video.url;

			this.postData = {
				...this.vm,
			}
		},

		/**
		 * 活动发布
		 */
		publish() {
			this.$opusApi.post(`/yyl/v1/activity/candidate/join`, this.postData).then(res => {
				let data = res.data;
				if (data.msg === 'success') {
					// this.$router.back();
					Toast('发布成功').then(res => {
						// if (!this.inApp) this.$localStore.set('web_success', 'success');
						// this.$eventBus.$emit('global-message', { type: 'refresh' });
						sessionStorage.setItem('publishSuccess', 'publishSuccess');
						this.publishSuccess(`/platform-activity/vote/${this.$route.params.activityId}/share/${data.data}`);
					})
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
@import '#css/var.css';

.platform-activity-new-wrap {
	& .upload-fm-img {
		height: 3.2rem;
		background: #F8F8F8;
		padding: 0.3rem 0.3rem 0.4rem;

		& .containerWrap {
			display: flex;
			/* align-items: flex-end; */
		}

		& .upload-right {
			margin-left: 0.3rem;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: flex-start;
		}

		& .container {
			position: relative;
			flex: 0 0 2.5rem;
			border: 1px solid #BFBFBF;
			background: #fff;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			width: 2.5rem;
			height: 2.5rem;
			border-radius: 0.1rem;
			overflow: hidden;
			& .iconfont {
				font-size: .8rem;
				color: #BFBFBF;
			}

			& p {
				color: #666;
			}
		}

		& .fm-img-tips {
			position: relative;
			display: block;
			height: 0.58rem;
			line-height: 0.58rem;
			color: #fff;
			background: #ccc;
			border-radius: .1rem;
			padding-left: 0.2rem;
			padding-right: 0.2rem;
			font-size: .26rem;
			/* flex: 0; */
		}

		& .text-tips {
			font-size: 0.26rem;
			color: var(--text-tips-color);
			margin-bottom: 0.5rem;
			text-align: justify;
		}

		& .fm-img-container {
			display: flex;
			align-items: flex-end;

			& .fm-imgWrap {
				position: relative;
				flex: 0 0 2.5rem;
				width: 2.5rem;
				height: 2.5rem;
				border-radius: 0.1rem;
				overflow: hidden;
			}

			& .fm-img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			& .fm-img-tips {
				background: var(--theme-color);
			}
		}
	}


	& .select_file {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}


	& .y-textarea {
		@apply --border-top;
		& textarea {
			min-height: 2.4rem;
		}
		& .text-length-info {
			padding-bottom: .2rem;
		}
	}

	& .content_editor-img_list {
		/* padding-bottom: 1.4rem; */
		padding: .2rem .14rem;
		;
		background-color: #F8F8F8;
		& .content_editor-img_item {
			margin: .08rem 0.08rem 0;
		}
		& .list-enter,
		& .list-leave-active {
			opacity: 0;
			transform: translateY(1.6rem);
		}

		& .list-leave-active {
			position: absolute;
		}
	}

	& .placeholder {
		height: 1.1rem;
		background-color: #fff;
	}

	& .upload_content_img {
		@apply --border-top;
		position: fixed;
		bottom: 0;
		padding: .2rem;
		width: 100%;
		background-color: #FFF;
		& .button_container {
			position: relative;
			display: inline-block;
			/* width: .7rem; */
			height: .7rem;
		}
		& .tool-item-image,
		& .tool-item-video {
			height: .7rem;
			line-height: .7rem;
			background-color: #66b6ff;
			border-radius: 0.1rem;
			color: #fff;
			text-align: center;
			padding: 0 .15rem;
			display: flex;
			justify-content: center;
			align-items: center;
			&:not(:first-child) {
				margin-left: 0.2rem;
			}

			&[disabled] {
				background: var(--disabled-color);
				pointer-events: none;
			}
			& .iconfont {
				font-size: .4rem;
				margin-right: .1rem;
			}
		}
		& .upload_tips {
			font-size: 0.26rem;
			color: #aaa;
			line-height: 0.7rem;
			margin-left: 0.22rem;
		}
	}
}
</style>


