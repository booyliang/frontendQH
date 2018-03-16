<template>
	<div class="user_cover">
		<y-card v-bind="props"
			:title="userData.nickName" 
			@click-img="handleClickImg" 
			img-size="large" 
			position="vertical"  
			:badge="this.userData.authStatus === 1" 
			:src="userData.userImg">
		<span slot="assist" v-if="userData.sex"  class="gender" :class="`gender-${ gender }`"></span>
		</y-card>
		<slot></slot>
	</div>
</template>
<script>
import YCard from '@/components/card';
import routerLinkMixin from '@/mixins/router-link'
export default {
	name: "y-cover",
	components: {
		[YCard.name]: YCard,
	},
	data() {
		return {

		}
	},
	mixins: [routerLinkMixin],
	props: {
		userData: {
			required: true
		},
	},
	computed: {
		"props": function () {
			var result = {};
			for (var key in this.$options.props) {
				result[key] = this[key];
			}
			return result;
		},
		gender() {
			if (parseInt(this.userData.sex) === 0) {  // sex性别  0 男 1 女 用户不设置是数据为空 不显示性别图标
				return 'male';
			} else if (parseInt(this.userData.sex) === 1) {
				return 'female';
			} else {
				return '';
			}
		}
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
	.user_cover .y_card-text {
			@apply --display-flex;
			justify-content: center;
			& .y_card-title{
				color: #fff;
				margin-bottom: 0; 
			}
			& .gender {
				display: block;
				margin-left: .14rem;
				width: .3rem;
				height: .3rem;
				
				}
			& .gender.gender-male {
				background: url("../../assets/male@2x.png") no-repeat center center;
				background-size: cover;
				
			}
			& .gender.gender-female {
				background: url("../../assets/female@2x.png") no-repeat center center;
				background-size: cover;
				
			}
		}


</style>


