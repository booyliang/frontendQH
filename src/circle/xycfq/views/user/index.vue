<template>
	<div class="xycf-user">
		<div class="user-cover" @click="jumpUrl('/mine/index')">
			<y-card
				v-bind="{userData}"
				:title="userData.nickName"
				@click-img="handleClickImg"
				img-size="large"
				position="vertical"
				:src="userData.userImg"
				:badge="this.userData.authStatus === 1"
				class="user_cover">
				<div slot="assist" class="y_card-title" v-if="!$env.custId">点击登录</div>
			</y-card>
			<span class="iconfont icon-arrow-right goPersonInfo"></span>
		</div>
		<!-- 头像预览大图 -->
		<div class="preview-wrap" v-if="showAvatarPreview">
			<img class="preview-img" :src="userData.userImg" @click.self="showAvatarPreview = false;">
			<div class="preview-mask"></div>
		</div>
		<div class="user-column">
			<div class="user-column-item" @click="jumpUrl('/user/order')">
				<img src="../../static/images/icon-user-order@2x.png">
				<p>我的订单</p>
			</div>
			<div class="user-column-item" @click="jumpUrl('/user/wantpay-list')">
				<img src="../../static/images/icon-user-payment@2x.png">
				<p>我要还款</p>
			</div>
			<div class="user-column-item" @click="jumpUrl('/user/wantpay-list')">
				<img src="../../static/images/icon-user-limit@2x.png">
				<p>赊销额度</p>
			</div>
		</div>
		<!-- 用戶信息列表 S--> 
		<div class="user-list">
			<y-item @click="jumpUrl('/user/bank-card')" clickable>
				<span slot="head" class="icon-img icon-bankcard">银行卡</span>
			</y-item>
		</div>
		<div class="user-list" v-if="flowStatus >= 2">
			<y-item @click="jumpUrl('/user/profile')" clickable>
				<span slot="head" class="icon-img icon-attestation">认证资料</span>
			</y-item>
			<y-item v-if="flowStatus >= 5" @click="jumpUrl('/user/additional-profile')" clickable >
				<span slot="head" class="icon-img icon-basicinfo">补充征信资料</span>
			</y-item>
		</div>
		<div class="user-list">
			<y-item @click="jumpUrl('/user/contact')" clickable>
				<span slot="head" class="icon-img icon-contact">联系我们</span>
			</y-item>
			<y-item @click.native="toLink" clickable>
				<span slot="head" class="icon-img icon-setting">设置</span>
			</y-item>
		</div>
	</div>
</template>
<script>
import Card from '@/components/card';
import List from '@/components/list';
import Item from '@/components/item';

export default {
	components: {
		'y-card': Card,
		[List.name]: List,
		[Item.name]: Item
	},
	data() {
		return {
			id: this.$env.userId, // 当前主页用户id
			userData: {},	// 用戶的信息
			showAvatarPreview: false,	// 是否显示头像预览大图
			flowStatus: ''
		};
	},
	created() {
		// 获取用户信息
		if (this.$env.userId) {
			this.$http({
				method: 'GET',
				url: `/services/app/v1/user/info/${this.$env.userId}`,
			}).then(response => {
				this.userData = response.data.data;
			});
			this.$http.get('/services/app/v1/flowInfo/status').then(response => {
				this.flowStatus = response.data.data.flowStatus;
			})
		}
	},
	watch: {
		$env: {
			handler(newVal, oldVal) {
				this.$http({
					method: 'GET',
					url: `/services/app/v1/user/info/${this.$env.userId}`,
				}).then(response => {
					this.userData = response.data.data;
				});
				this.$http.get('/services/app/v1/flowInfo/status').then(response => {
					this.flowStatus = response.data.data.flowStatus;
				})
			},
			deep: true
		}
	},
	methods: {
		handleClickImg() {
			if (!this.$env.custId) {
				return;
			}
			this.showAvatarPreview = true;
		},
		toLink() {
			this.$yryz.openSetting()
		},
		async jumpUrl(url) {
			
			await this.$user.login();
			let index = window.location.href.indexOf('xycfq');
			let jumpurl = window.location.href.substring(0, index) + 'xycfq' + url;
			this.$yryz.jumpUrl({
				url: jumpurl
			})
		}
	}
};
</script>
<style>
	@import '#/css/var.css';
	.xycf-user {
		background-color: #fff;
		& .user-cover {
			position: relative;
			padding-top: 0.8rem;
			height: auto;
			& .goPersonInfo{
				position: absolute;
				color: #c1c1c1;
				right: .3rem;
				top: 45%;
				display: inline-block; 
				line-height: .7rem;
				z-index: 9;
			}
			& .y_card-title {
				font-size: 22px;
				color: #000;
				padding-bottom: 0.5rem
			}
			& .y_card-text {
				flex-direction: column;
				line-height: 1;
			}
		}
		
		& .preview-wrap {
			display: flex;
			align-items: center;
			justify-content: center;
			& .preview-img{
				position: absolute;
			    z-index: 1001;
			    width: 100vw;
			    top: 50%;
			    left: 0;
			    transform: translateY(-50%);
			}
			& .preview-mask {
			    position: fixed;
			    top: 0;
			    right: 0;
			    width: 100vw;
			    height: 100vh;
			    background: rgba(0, 0, 0, 1);
			    z-index: 999;
			}
		}

		& .user-column {
			display: flex;
			margin: 0 0.25rem;
			padding: 0.3rem 0 0.4rem;
			justify-content: space-around;
			@apply --border-top;
			& .user-column-item {
				text-align: center;
				font-size: 17px;
				& img{
					width: 1rem;
					height: 1rem;
				}
			}
		}

		& .user-list {
			border-top: 0.2rem solid #f8f8f8;
		}

		& .item-wrap {
			padding: 0 0.16rem;
			height: 57px;
			line-height: 57px;
		}
		
		& .icon-img {
			display: inline-block;
			padding-left: 0.64rem;
			background-repeat: no-repeat;
			background-position: left center;
			background-size: 0.5rem auto;
		}
		& .icon-bankcard {
			background-image: url(../../assets/icon-bankcard@2x.png);
		}
		& .icon-mylimit {
			background-image: url(../../assets/icon-mylimit@2x.png);
		}
		& .icon-myorder {
			background-image: url(../../assets/icon-myorder@2x.png);
		}
		& .icon-repayment {
			background-image: url(../../assets/icon-repayment@2x.png);
		}
		& .icon-attestation {
			background-image: url(../../assets/icon-attestation@2x.png);
		}
		& .icon-basicinfo {
			background-image: url(../../assets/icon-basic_info@2x.png);
		}
		& .icon-xg {
			background-image: url(../../assets/icon-xg@2x.png);
		}
		& .icon-contact {
			background-image: url(../../assets/icon-contact@2x.png);
		}
		& .icon-setting{
			background-image: url(../../assets/icon-setting@2x.png);
		}
	}

</style>
