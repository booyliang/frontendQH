<template>
  <div class="authentication" v-if="userData.authStatus && userData.authStatus === 1" >
		<router-link tag="div" class="authentication_item" :to="`/shoot/ad/${ userData.userId }`">
			<div class="authentication_item-title"><span class="iconfont icon-icon icon-badge"></span>悠然认证</div>
			<div class="authentication_item-info">
				{{authenticationInfo.authenticationSpecification }}
			</div>
		</router-link>
		<div class="authentication_tags">
			<div class="authentication_item-title"><span class="iconfont icon-icon icon-tag"></span>标签</div>
			<div class="authentication_item-con">
				<y-tag v-for="(tag, index) in tags" :key="index" :data="tag">{{tag}}</y-tag>
			</div>
		</div>
		
  </div>
</template>
<script>
import Ytag from '@/components/tag'
export default {
	name: "y-authentication",
	components: {
		[Ytag.name]: Ytag,
	},
	props: {
		userData: Object,
	},
	methods: {
		getData() {
			if (!this.userData || !this.userData.userId) 
				return;
			this.$http.get(`/services/app/v1/photographer/getAuthenticationInfoByPersonal/${this.userData.userId}`) 
		.then((res) => {
			this.authenticationInfo = res.data.data;
			this.tags = this.authenticationInfo.label.split(',');
		}).catch((err) => {
			console.log(this.$R("toast-request-error")); // 请求失败，请稍后重试
		});
		}
	},
	data() {
		return {
			authenticationInfo: {},
			tags: [],
		}
	},
	watch: {
		userData() {
			this.getData();
		}
	},
	created() {
		this.getData();
	}
}
</script>
<style>
	@import "#/css/var.css";
	.authentication {
		font-size: .32rem;
		padding: .3rem .3rem 0 .3rem;
		border-bottom: .2rem solid #f4f4f4;
		& .authentication_item {
			padding-bottom: .3rem;
			& .authentication_item-title {
				margin-bottom: .3rem;
				color: var(--text-primary-color);
				& span {
					margin-right: 0.2rem;
					color: #ffc63d;
				}
			}
			& .authentication_item-info {
				color: var(--text-primary-color);
				font-size: .3rem;
				background:url("../../assets/arrw_r02@2x.png") no-repeat right center;
				background-size: 10px;
				padding-right: 30px
			}
		}
		& .authentication_tags{
			padding: .3rem 0;
			border-top: 1px solid #f4f4f4;
			& .authentication_item-title {
				color: var(--text-primary-color);
				font-size: .32rem;
				margin-bottom: .3rem;
				& span{
					margin-right: 0.2rem;
					color: #6bd7a8;
				}
			}
			& .authentication_item-con {
				color: var(--text-primary-color);
				font-size: .28rem;
				& span {
					color: var(--theme-color);
					margin-right: .2rem;
					font-size: .28rem;
				}
			}
		}
	}
	.user-homepage .authentication + .tab-menu_list.tab_bar {
		   margin-top: 0;
	}
</style>

