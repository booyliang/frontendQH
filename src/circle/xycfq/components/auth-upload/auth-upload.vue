<template>
	<div class="auth_upload">
		<y-panel :title="field.rules.title" class="auth_upload-rules">
			<div v-for="(paragraph, index) of field.rules.paragraphs" :key="index" v-text="paragraph"></div>
		</y-panel>
		<div class="auth_upload-example image--responsive">
			<img :src="field.example" alt="">
		</div>
		<y-button size="l" block @click.native="handleUpload" class="auth_upload-trigger">上传图片</y-button>
	</div>
</template>

<script type="text/javascript">
	export default {
		name: 'y-auth-upload',

		props: {
			name: String,
			value: String
		},

		data() {
			return {
				fields: {
					'handling-id': {
						rules: {
							title: '身份证照片要求：',
							paragraphs: [
								'1. 拍摄时手持本人身份证，露出手臂，拍出整个上半身，脸部清晰不被遮挡；',
								'2. 确保身份证上的所有信息清晰可见，完整无遮挡；',
								'3. 照片内容要求真实有效，不做任何修改；',
								'4. 仅支持 jpg、jpeg、png、gif 图片格式，图片大小不超过 300 KB。',
							]
						},
						example: require('../../assets/handling-id@2x.png')
					},
					'id-front': {
						rules: {
							title: '身份证照片要求：',
							paragraphs: [
								'1. 确保身份证上的所有信息清晰可见，完整无遮挡；',
								'2. 照片内容要求真实有效，不做任何修改；',
								'3. 仅支持 jpg、jpeg、png、gif 图片格式，图片大小不超过 300 KB。',
							]
						},
						example: require('../../assets/id-front@2x.png')
					},
					'id-back': {
						rules: {
							title: '身份证照片要求：',
							paragraphs: [
								'1. 确保身份证上的所有信息清晰可见，完整无遮挡；',
								'2. 照片内容要求真实有效，不做任何修改；',
								'3. 仅支持 jpg、jpeg、png、gif 图片格式，图片大小不超过 300 KB。',
							]
						},
						example: require('../../assets/id-back@2x.png')
					},
					'student-card': {
						rules: {
							title: '学生证照片要求：',
							paragraphs: [
								'1. 确保学生证上的所有信息清晰可见，完整无遮挡；',
								'2. 照片内容要求真实有效，不做任何修改；',
								'3. 仅支持 jpg、jpeg、png、gif 图片格式，图片大小不超过 300 KB。',
							]
						},
						example: require('../../assets/student-card@2x.png')
					},
					'house-1': {
						rules: {
							title: '房产证明照片要求：',
							paragraphs: [
								'1. 房屋产权证、土地证或是不动产证；',
								'2. 照片内容要求真实有效，不做任何修改；',
								'3. 仅支持 jpg、jpeg、png、gif 图片格式，图片大小不超过 300 KB。',
							]
						},
						example: require('../../assets/house-1@2x.png')
					},
					'house-2': {
						rules: {
							title: '房产证明照片要求：',
							paragraphs: [
								'1. 房屋产权证、土地证或是不动产证；',
								'2. 照片内容要求真实有效，不做任何修改；',
								'3. 仅支持 jpg、jpeg、png、gif 图片格式，图片大小不超过 300 KB。',
							]
						},
						example: require('../../assets/house-2@2x.png')
					},
					'car-1': {
						rules: {
							title: '车辆证明照片要求：',
							paragraphs: [
								'1. 请上传您所购买车辆行驶证原件的照片；',
								'2. 请确认您上传的资料是清晰的、未经修改的数码照片或扫描图片；',
								'3. 仅支持 jpg、jpeg、png、gif 图片格式，图片大小不超过 300 KB。',
							]
						},
						example: require('../../assets/car-1@2x.png')
					},
					'car-2': {
						rules: {
							title: '车辆证明照片要求：',
							paragraphs: [
								'1.	请上传您所购买车辆登记证的照片；',
								'2.	请确认您上传的资料是清晰的、未经修改的数码照片或扫描图片；',
								'3. 仅支持 jpg、jpeg、png、gif 图片格式，图片大小不超过 300 KB。',
							]
						},
						example: require('../../assets/car-2@2x.png')
					},
				}
			};
		},

		computed: {
			field() {
				return this.fields[this.name];
			},
		},

		methods: {
			async handleUpload() {
				const imageUrl = (await this.$yryz.uploadPics({
					picNum: 1
				})).picUrls[0];
				this.$emit('input', imageUrl);
			}
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.auth_upload {
		@apply --layout;
	}

	.auth_upload-rules {
		color: var(--text-assist-color);
		line-height: 1.6;
		padding: 0.5em 0.2rem;
		border: 1px dashed #d0c765;
		background: #fffef2;
		border-radius: 0.1rem;
		margin-bottom: 0.3rem;

		& .panel-head,
		& .panel-body {
			padding: 0;
		}
		& .panel-head {
			line-height: inherit;
			border-bottom: 0;
		}
		& .panel-body {
			font-size: 13px;
		}
	}

	.auth_upload-example {
		padding-bottom: 58%;

		& img {
			border-radius: 0.1rem;
		}
	}

	.auth_upload-trigger {
		margin-top: 1rem;
	}
</style>