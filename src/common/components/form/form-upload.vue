<template>
	<div class="form_upload" v-model="vm[field]">
		<div v-if="!vm[field]" class="upload_wrap" @click="uploadImg">
			<b class="iconfont icon-plus-a"></b>
			<div>上传封面图</div>
		</div>
		<!--<img v-if='vm[field]' :src="vm[field]" alt="" />-->
		<div @click="uploadImg" class="form_img-wrap" v-if="vm[field]">
			<img :src="vm[field] | imageResize(3)" class="form_img">
			<!-- <img v-if="vm.activityImg" :src="vm.activityImg | imageResize(3)" class="fm-img"> -->
			<span class="form_img-tips">更换封面图</span>
		</div>
	</div>
</template>
<script>
	import FormBase from './mixin'
	export default{
		name: 'y-form-upload',
		mixins: [FormBase],
		data() {
			return {}
		},
		methods: {
			async uploadImg() {
				let imageUrl = '';
				imageUrl = (await this.$yryz.uploadPics({
					picNum: 1
				})).picUrls[0];
				this.vm[this.field] = imageUrl;
				this.$emit('input', imageUrl);
			}
		},
	}
</script>
<style>
@import "#/css/var.css";
.form_upload{
	background: #fff;
	height: 4rem;
	display: flex;
	& .upload_wrap{
		background: #f8f8f8;
		height: 2.2rem;
		width: 4.2rem;
		margin: auto;
		padding: 0.2rem 0;
		text-align: center;
		color: var(--text-assist-color);
		& .iconfont{
			font-size: .8rem;
			color: var(--font-common-color);
		}
	}
	& .form_img-wrap{
		position: relative;
		& img{
			height: 100%;
			width: 100%;
		}
		& .form_img-tips{
			position: absolute;
			top: .4rem;
			right: .4rem;
			color: #fff;
			background: rgba(0, 0, 0, .5);
			border-radius: 20px;
			padding: .05rem .2rem;
			font-size: .26rem;
		}
	}
	
}
</style>

