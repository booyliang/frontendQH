<template>
	<div class="temporary_activity-join">
		<y-nav title="参与活动">
			<span slot="nav-right">
				<y-publish-button>确认报名</y-publish-button>
			</span>
		</y-nav>
		<div class="join-cover_wrap">
			<div class="join_cover">
				<div class="select_file" @click="nativeUploadCoverImg" v-if="this.isNative"></div>
				<input class="select_file" v-else @change="uploadCover" accept="image/*" type="file">
				<template v-if="!joinVm.coverPlan">
					<i class="iconfont icon-plus"></i>
					<span>添加战队封面图</span>
				</template>
				<img v-else :src="joinVm.coverPlan | imageResize(6)">
			</div>
		</div>
		<div>
			<y-item>
				<y-input v-model="joinVm.schoolName" placeholder="请输入所属学校" :maxlength="10"></y-input>
			</y-item>
			<y-item>
				<y-input v-model="joinVm.title" placeholder="请输入战队名称" :maxlength="8"></y-input>
			</y-item>
			<y-item>
				<y-input type="textarea" v-model="joinVm.content" placeholder="请输入三十字以内的队伍口号" :maxlength="30"></y-input>
			</y-item>
		</div>
	</div>
</template>
<script>
	const ImgMaxLength = 20;
	import { YPublishButton, PublishMixin } from "@/components/content-publish"
	export default {
		mixins: [PublishMixin],
		components: {
			YPublishButton
		},
		data() {
			return {
				imgMaxLength: ImgMaxLength,
				postData: {},
				joinVm: {
					title: '',
					content: '',
					schoolName: '',
					imgUrl: '',
					coverPlan: ''
				},
				imgs: [],
				uploadBaseUrl: '',
			}
		},
		computed: {
			isNative() {
				return this.$yryz.isNative();
			}
		},
		methods: {
			nativeUploadCoverImg() {
				this.$yryz.uploadPics({ picNum: 1, isCrop: true, scaleY: 0.565}).then(data => {
					this.joinVm.coverPlan = data.picUrls[0];
				})
			},
			nativeUploadContentImg() {
				this.$yryz.uploadPics({ picNum: ImgMaxLength - this.imgs.length}).then(data => {
					this.imgs.push(...data.picUrls);
				})
			},
			removeImg(index) {
				this.imgs.splice(index, 1);
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
				let file = this.getFile(e);
				let url = await this.uploadFile(file);
				this.joinVm.coverPlan = url;
			},
			async uploadContentImg(e) {
				let files = e.target.files;
				for (let i = 0; i < files.length; i++) {
					let url = await this.uploadFile(files[i]);
					this.imgs.push(url);
				}
				e.target.value = '';
			},
			validate() {
				if (!this.joinVm.title) {
					this.$toast('请输入战队名称');
					return false;
				}
				if (!this.joinVm.schoolName) {
					this.$toast('请输入所属学校');
					return false;
				}
				if (!this.joinVm.content) {
					this.$toast('请输入队伍口号');
					return false;
				}
				if (!this.joinVm.coverPlan) {
					this.$toast('请添加战队封面图');
					return false;
				}
				this.postData = {
					...this.joinVm,
					imgUrl: this.imgs.join(',')
				}
			},
			publish() {
				this.$http.post(`/services/app/v1/temp/activity/opus/join/single`, this.postData).then(response => {
					let resData = response.data;
					if (resData.code === '200') {
						this.$toast('提交成功！');
						this.publishSuccess({
							name: 'detail',
							params: {
								id: resData.data.id
							}
						});						
					} else {
						this.publishError(resData.msg);
					}
				})
			}
		},
		mounted() {
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
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.temporary_activity-join {
		padding-bottom: 1.2rem;
		& .y-input-wrap.y-textarea textarea {
			height: 1.4rem;
			min-height: 1.4rem;
		}
		& .y-input-wrap .text-length-info .current-text-length {
			color: var(--theme-color);
		}
		& .join-cover_wrap {
			overflow: hidden;
			background: #f8f8f8;
		}
		& .join_cover {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin: 1.07rem auto;
			width: 4.2rem;
			height: 2.08rem;
			border: 1px solid #bfbfbf;
			border-radius: 0.2rem;
			overflow: hidden;
			& i {
				color: #bfbfbf;
				font-size: .72rem;
			}
			& span {
				color: #666;
			}
			& .select_file {
				position: absolute;
				top: 0;
				left: 0;
				width: 4.2rem;
				height: 2.08rem;
				opacity: 0;
			}
			& img {
				width: 100%;
				min-height: 100%;
			}
		}
		& .content_editor-img_list {
			border-top: 1px solid #e7e7e7;
			padding: 0 .14rem;
			/* margin: 0 -0.12rem; */
			/*display: flex;
				flex-wrap: wrap;*/
		}
		& .content_editor-img_item {
			display: inline-block;
			transition: all 1s;
			position: relative;
			width: 1.6rem;
			height: 1.6rem;
			margin: .16rem 0.08rem 0;
			border-radius: .12rem;
			overflow: hidden;
			& .remove {
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				line-height: 0.46rem;
				background: rgba(0, 0, 0, .5);
				color: #fff;
				text-align: center;
				font-size: .28rem;
			}
			& img {
				width: 100%;
				height: 100%;
			}
		}
		& .content_editor-tool {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			padding: 0.2rem;
			border-top: 1px solid #f4f4f4;
			color: #fff;
			font-size: .48rem;
			background: #fff;
			box-shadow: 0 0 10px rgba(0, 0, 0, .3);
			& .tool-item-image {
				position: relative;
				text-align: center;
				& input, & span {
					position: absolute;
					opacity: 0;
					left: 0;
					top: 0;
					width: .7rem;
					height: .7rem;
				}
			}
		}
	}
	
</style>

