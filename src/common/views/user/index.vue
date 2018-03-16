<template>
	<div :class="classList">

		<div class="user-cover">
			<y-nav :title= "$R('user-index')" :transparent="true"  :menuData="navMenu"></y-nav>
			<components :is="coverItem"  v-bind="{userData}" @click-img="handleClickImg"></components>
			<span class="iconfont icon-arrow-right goPersonInfo" @click="goPersonInfo"></span>
		</div>
		
		<components :is="setHeadInfo"  v-bind="{userData}"></components>

		<!--头像预览大图-->
		<div class="preview-wrap" v-if="showAvatarPreview">
			<img class="preview-img" :src="userData.userImg" @click.self="showAvatarPreview = false">
			<div class="preview-mask" @click.self="showAvatarPreview = false" ></div>
		</div>

		<!--个人主页 动态/各栏目列表-->
		<y-tab-bar class="tab-menu_list" v-model="cateId"  @click="handleTabClick"
			  textField="alias"
			 :tabOption="menuData" :enableRouter="false"></y-tab-bar>
		
		
		<router-view :cust-id="custId" v-bind="{userData}"></router-view>
			
		<div class="user-action-btn" v-if="!myself">
			<y-button v-if="isFriend" size="l" block @click.native="chat">{{$R('chat')}}</y-button>
			<y-button v-else size="l" block @click.native="addFriend">{{$R('add-friend')}}</y-button>
		</div>

	</div>

</template>
<script>
	import YNav from '@/components/nav/nav';
	import YCard from '@/components/card';
	import Button from '@/components/button';
	import TabBar from '@/components/tab';
	import YCover from "./cover.vue"
	import YGoodAt from "./good-at"

	export default {
		components: {
			'y-card': YCard,
			[Button.name]: Button,
			[YNav.name]: YNav,
			[TabBar.name]: TabBar,
			[YCover.name]: YCover,
			[YGoodAt.name]: YGoodAt,
		},
		props: {
			activityData: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			console.log('cateId', this.$route.params.cateId)
			return {
				id: this.$route.params.id, // 当前主页用户id
				myself: "true",
				isFriend: '',
				gender: '',
				userData: {},	// 用戶的信息		
				menuData: [{ moduleEnum: '000', id: 0, categoryName: this.$R("user-dynamic"), alias: this.$R("user-dynamic") }], // 默认 000 动态
				moduleEnum: this.$route.params.moduleEnum || '000',
				showAvatarPreview: false, // 是否显示头像预览大图
				cateId: this.$route.params.cateId || 0,
				custId: '', // custId 动态列表传参
			}
		},
		created() {
			// 获取tab栏目
			this.$http({
				method: 'GET',
				url: '/services/app/v1/category/list',
			}).then(response => {
				this.menuData = this.menuData.concat( response.data.data);
			}).catch(err => console.log(err));

			// 获取用户信息 
			this.$http({
				method: 'GET',
				url: `/services/app/v1/user/info/${this.$route.params.id}`,
			}).then(response => {
				this.userData = response.data.data;
				this.custId = this.userData.custId;
				
				if (this.userData.friendFlag === 0) { // friendFlag 自己/好友标记: 0非好友，1好友，2自己
					this.isFriend = false;
					this.myself = false;
				} else if (this.userData.friendFlag === 1) {
					this.isFriend = true;
					this.myself = false;
				} else if (this.userData.friendFlag === 2) {
					this.myself = true; 
				}
						
				if (parseInt(this.userData.sex) === 0) {  // sex性别  0 男 1 女 用户不设置是数据为空 不显示性别图标
					this.gender = 'male';
				} else if (parseInt(this.userData.sex) === 1) {
					this.gender = 'female';
				} else {
					this.gender = '';
				}
				
			});

		},
		computed: {
			navMenu() {
				let navMenu =  ['index', 'copy-url'];
				if (this.myself) {
					let module = this.$utils.getModule("0021");
					if ( module.addMenu) {
						return navMenu.concat({
							text: '申请认证',
							icon: 'vcard-o',
							action: () => {
								this.$router.push(`/shoot/ad/${ this.userData.userId }`)
							}
						});
					}
					return navMenu;

				} else {
					return navMenu.concat('report')
				}
			},
			classList() {
				return [
					'user-homepage',
					{
						'user-home-myself': this.myself,
						'user-home-identity': this.goodAt,
					}
				];
			},
			goodAt() {
				let module = this.$utils.getModule("0021");
				if (module.coverItem && this.userData.authStatus === 1) {
					return true;
				} else {
					return false;
				}
			},
			coverItem() { // 头像底部 达人认证，擅长~
				let module = this.$utils.getModule("0021");
				return module.coverItem || 'y-cover';
			},
			setHeadInfo() { // 悠然认证
				let module = this.$utils.getModule("0021");
				return module.setHeadInfo || null;
			}
			
		},
		methods: {
			handleClickImg() { // 点击头像预览大图
				this.showAvatarPreview = true;
			},

			chat() { // 聊天 调IM
				this.$yryz.sessionP2P({
					custId: this.custId
				})
			},

			addFriend() { // 添加好友
				let addUser = {
					require: {
						bCustId: this.custId
					},
					type: "2"
				};
				this.$http.post('/services/app/v1/user/relation', addUser)
				.then((req) => {
					if (req.data.msg === "success") {
						this.$toast(this.$R("toast-add-friend"), {autoClose: 3000}) // 好友申请已发送
					}
				}).catch((err) => {
					console.log(this.$R("toast-request-error")); // 请求失败，请稍后重试
				});
				
				
			},
			
			goPersonInfo() { // 跳转到平台个人用户主页
				this.$yryz.toPersonalInfo({
					userId: this.custId
				})
			},
			handleTabClick(cateId, item) {				
				let routeName = 'user-module';
				if (item.classifyItemId)
					routeName = 'user-module-classify-classifyItem'
				else if (item.classifyId)
					routeName = 'user-module-classify'
					
				// console.log(routeName, cateId, item);
				
				this.$router.replace({name: routeName, params: Object.assign({}, item, {id: this.id, cateId})  })
			}

		},

	}
</script>
<style>
	@import "#/css/var.css";
	.user-homepage {
		background-color: #fff;
		padding: 0;
    	margin-bottom: 1.4rem;
		min-height: 100vh;
		& .user-cover {
			position: relative;
			background-position: center bottom;
			background-repeat: no-repeat;
			background-size: cover;
			padding-bottom: 0.4rem;
			text-align: center;
			height: 3.54rem;
			/*margin-bottom:0.3rem;*/

			& .goPersonInfo{
				position: absolute;
				color: #fff;
				right: .3rem;
				top: 45%;
				@apply --bg-alpha;
				@apply --circle;
				width: .7rem;
				height: .7rem;
				display: inline-block; 
				line-height: .7rem;
				z-index: 9;
			}
		}
		& .preview-wrap {
				display: flex;
				align-items: center;
				justify-content: center;
			& .preview-img {
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
		& .user-content {
			& .tab_bar {

				height: 1.2rem;
				& .tab_bar-item {
					height: 1.18rem;
					padding: 0.4rem 0.15rem 0;
				}
			}
		}
		& .user-action-btn {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			background: #fff;
			padding: 0.2rem 0;
			box-shadow: 0px -3px 0.03rem #f6f6f6;

			& button {
				padding: 0;
				height: .68rem;
			}
		}
		& .tab-menu_list.tab_bar {
			height: 65px;
			line-height: 37px;
			border: none;
			margin: 0;
			padding-top: .3rem; 
			background-color: #fff;

			& a {
				color: var(--text-secondary-color); 
				margin: 0;
				border: none;
				&:first-child {
						padding-left: 0;
				}
				& .tab_bar-item {
					padding: 0 .2rem;
					border-radius: .08rem; 
					background-color: #fff;
					box-shadow: 0 0 5px -.5px color(var(--theme-color) alpha(.68));  
					margin-left: .1rem;
				}
				& .active {
					background-color: var(--theme-color);
					border: none;
					color: #fff;
					position: relative; 

					&::after {
						content: "";
						width: 0;
						height: 0;
						border-left: .15rem solid transparent;
						border-right: .15rem solid transparent;
						border-top: .15rem solid var(--theme-color);
						position: absolute;
						bottom: -.13rem;
						left: 50%;
						margin-left: -.15rem;
						z-index: 2;
					} 
				}
			}
		}
		& .user_list-conent {
			margin-top: .4rem;
		} 
	}
	.user-homepage .unshelved{
		display: none;
	}
	.user-homepage.user-home-myself{
		margin-bottom: 0;
		& .flow_list .unshelved{
			display: block;
		}
	}
	.user-homepage.user-home-identity .user-cover{
		height: 4rem;
		
	}
</style>