<template>
	<div class="page-more">
		<div>
			<h6>无按钮</h6>
			<y-ellipsis-plus ref="moreDemo" :text="text" :line="2" :show-button="false">
			</y-ellipsis-plus>
		</div>
		<div>
			<h6>采用组件默认按钮</h6>
			<y-ellipsis-plus ref="moreDemo" :text="text" :line="2">
			</y-ellipsis-plus>
		</div>
		<div>
			<h6>自定义按钮文字</h6>
			<y-ellipsis-plus ref="noButton" expand-text='自定义按钮' :text="text" :line="2">
			</y-ellipsis-plus>
		</div>
		<div>
			<h6>在组件外部定义按钮</h6>
			<y-ellipsis-plus ref="noButton" :show-button="false" :text="text" :line="2" :imgUrl="imgUrl">
			</y-ellipsis-plus>
			<button class="outer-button" @click="expand">{{btnTxt}}</button>
		</div>
		<div>
			<h6>自定义省略符</h6>
			<y-ellipsis-plus ref="moreDemo" :ellipsis="'。。。'" :text="text" :line="2">
			</y-ellipsis-plus>
		</div>
		<div>
			<h6>不带省略符</h6>
			<y-ellipsis-plus ref="moreDemo" :ellipsis="''" :text="text" :line="2">
			</y-ellipsis-plus>
		</div>
	</div>
</template>

<script>
import YEllipsisPlus from '@/components/ellipsis-plus';
export default {
	components: {
		YEllipsisPlus
	},

	data() {
		return {
			text: '文本截断是我们前端经常会碰到的需求，有些字段文本比较长，设计师往往会在有限的空间内限制字符数量，以确保界面的美观性，设计师会在一些字符后面加上省略号来表示，这个时候我们前端往往就会使用sdjgsdgdsgsdkgksd2212564564654654641212',
			btnTxt: '',
			btnTxtExpand: '收起',
			btnTxtCollapse: '展开全部',
			imgUrl: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1516891756,2194615571&fm=27&gp=0.jpg'
		}
	},
	created() {
		this.btnTxt = this.btnTxtCollapse
	},
	methods: {
		expand() {
			this.$refs.noButton.handleClick()
			this.btnTxt = this.$refs.noButton.show ? this.btnTxtExpand : this.btnTxtCollapse
		}
	}
}
</script>

<style>
.page-more {
	padding: 15px;
	margin: 0 auto;
	& h6 {
		margin: 0;
		padding-bottom: 10px;
		text-align: center;
		font-size: 18px;
		color: #ff6400;
	}
	& .ellipsis-plus {
		font-size: 16px;
		color: black
	}
	& .outer-button {
		margin-top: 10px;
		padding-top: 0;
		padding-bottom: 0;
		border: 0;
		font-size: 16px;
		vertical-align: middle;
		color: #8590a6;
		outline: none;
		line-height: 1;
		background-color: transparent;
	}
}

.page-more>div {
	margin-bottom: 10px;
	border: 1px solid #26a2ff;
	padding: 5px;
	border-radius: 4px;
	box-shadow: 0 0 5px #aaa
}
</style>