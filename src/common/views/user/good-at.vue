<template>
  <div >
	  <y-cover v-bind="props" @click-img="handleClickImg">
		  <div class="good-at" v-if="userData.authStatus && userData.authStatus === 1"><span class="iconfont icon-star-circle"></span>达人认证：擅长{{goodField}}</div>
	  </y-cover>
  </div>
</template>
<script>
import YCover from "./cover"
import routerLinkMixin from '@/mixins/router-link'
export default {
	name: "y-good-at",
	components: {
		[YCover.name]: YCover,
	},
	data() {
		return {
			goodField: ""
		}
	},
	mixins: [routerLinkMixin],
	props: {
		...YCover.props,
	},
	computed: {
		"props": function () {
			var result = {};
			for (var key in this.$options.props) {
				result[key] = this[key];
			}
			// console.log('good-at', result)
			return result;
		},
		
	},
	created() {
		
		let module = this.$utils.getModule("0021");
		let requestUrl = module.coverApiUrl + '/' + this.$route.params.id; 
		
		this.$http.get(requestUrl) 
		.then((res) => {
			this.goodField = res.data.data.goodField;
		}).catch((err) => {
			console.log(this.$R("toast-request-error")); // 请求失败，请稍后重试
		});


	},
	methods: {
		handleClickImg(data) { // 点击头像预览大图
			this.$emit('click-img', data);
		},
	}

	
}
</script>

<style>
@import "#/css/var.css";
.good-at {
	color: #fff;
	font-size: .28rem;
	text-align: center;
	& span{
		margin-right: 0.2rem;
	}
}
</style>

