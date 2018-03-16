<template>
	<div class="lsq_main">
		<y-nav :title="$R('office-detail')"></y-nav>
		<div class="lsq_user_info">
			<!--<y-card v-if='vm.lawFirmLogo' :title="vm.lawFirmTitle" :src='vm.lawFirmLogo' img-size="large"></y-card>-->
	
			<div class="flow_item-body">
				<div class="flow_item-cover y_card-text">
					<img v-if='vm.lawFirmLogo' class="flow_item-thumb" :src="vm.lawFirmLogo | imageResize(1)" />
					<div class='flow_item-right' v-if='vm.lawFirmTitle'>
						<div class="flow_item-title" v-text="vm.lawFirmTitle"></div>
					</div>
				</div>
			</div>
	
			<div v-if='vm.lawFirmTel' class="lsq_user_info--con">
				<i class="iconfont icon-phone-b"></i>
				<span>{{$R('telephone')}} </span>
				<label>{{vm.lawFirmTel}}</label>
			</div>
			<div v-if='vm.lawFirmAddress' class="lsq_user_info--con">
				<i class="iconfont icon-addr"></i>
				<span>{{$R('area')}} </span>
				<label>{{vm.lawFirmAddress}}</label>
			</div>
			<div v-if='vm.lawFirmUrl' class="lsq_user_info--con">
				<i class="iconfont icon-website"></i>
				<span>{{$R('website')}} </span>
				<label>{{vm.lawFirmUrl}}</label>
			</div>
		</div>
		<y-panel :title="$R('intro')" icon="intr" v-if='vm.introduction'>
			<p v-text="vm.introduction"></p>
		</y-panel>
		<y-panel :title="$R('case-show')" icon="case" v-if='vm.caseShow'>
			<p v-text="vm.caseShow"></p>
		</y-panel>
		<div class="info_details--show">
			<y-panel :title="$R('recruitment-information')" icon="users-b" v-if='vm.recruitmentInformation'>
				<p v-text="vm.recruitmentInformation"></p>
			</y-panel>
		</div>
	
		<div class="user-action-btn" v-if="myself">
			<y-button v-if="isFriend" block @click.native="chat">{{$R('chat')}}</y-button>
			<y-button v-else :disabled='disabled' block @click.native="addFriend">{{amFriend}}</y-button>
		</div>
		<div class="user-action-btn" v-else>
			<y-button block @click.native="addEdit" :disabled="disabled">{{masTaxt}}</y-button>
		</div>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import YCard from '@/components/card';
import YPanel from '@/components/panel';
export default {
	components: {
		YNav,
		YCard,
		YPanel
	},
	data() {
		return {
			vm: {
				data: {}
			},
			myself: true,
			isFriend: '',
			masTaxt: "",
			amFriend: "",
			disabled: false
		}
	},
	mounted() {
		this.initData();
		// 获取用户信息
		this.userId();
	},
	methods: {
		initData() {
			console.log(this.$route.params.id + this.$env.userId);
			if (this.$route.params.id === this.$env.userId) {
				this.myself = false;
			}
			this.$http.get("/services/app/v1/lawyerFirm/getLawyerFirmInfoByUserId/" + this.$route.params.id).then(res => {
				this.vm = res.data.data
				if (res.data.code === "200") {
					if (this.vm.isAuthentication === 0) {
						this.disabled = true;
						this.masTaxt = this.$R('Submitted-wait-review')
					} else if (this.vm.isAuthentication === 1) {
						this.disabled = false;
						this.masTaxt = this.$R('approved')
					} else if (this.vm.isAuthentication === 2 || this.vm.isAuthentication === 3) {
						this.disabled = false;
						this.masTaxt = this.$R('failed-resubmit')
					}
				}
			})
		},
		userId() {
			this.$http({
				method: 'GET',
				url: `/services/app/v1/user/info/${this.$route.params.id}`,
			}).then(response => {
				this.userData = response.data.data;
				this.custId = this.userData.custId;

				if (this.userData.friendFlag === 0) { // friendFlag 自己/好友标记: 0非好友，1好友，2自己
					this.isFriend = false;
					this.amFriend = this.$R('add-friend')
					//						this.myself = false;
				} else if (this.userData.friendFlag === 1) {
					this.isFriend = true;
					//						this.myself = false;
				} else if (this.userData.friendFlag === 2) {
					this.myself = false;
				}
			});
		},
		addEdit() {
			this.$router.push({ path: '/office/edit/' + "1" })
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
						this.$toast(this.$R("toast-add-friend"), { autoClose: 3000 }) // 好友申请已发送
						this.disabled = true;
						this.amFriend = this.$R('wait-approval');
					}
				}).catch((err) => {
					console.log(this.$R("toast-request-error")); // 请求失败，请稍后重试
				});
		}

	}
}
</script>

<style>
@import '#/css/var.css';
.lsq_main {
	& .lsq_user_info {
		background-color: #fff;
		padding: .3rem .14rem 0;
		margin-bottom: .2rem;

		& .lsq_user_info--con {
			@apply --border-bottom;
			padding: .3rem 0;
			@apply --display-flex;

			&:last-child {
				border: none;
			}

			& span {
				color: var(--text-primary-color);
				font-size: 16px;
				margin-left: .15rem;
			}

			& .iconfont {
				color: var(--theme-color);
				margin-left: .15rem;
			}

			& label {
				flex: 1;
				text-align: right;
				margin-left: .2rem;
				padding-right: .16rem;
			}
		}
	}
	& .y_card {
		margin-left: .16rem;
		align-items: flex-start;
		& .y_avatar {
			margin-right: .4rem;
			&.y_card-img__large {
				width: 2rem;
				height: 1.62rem;
				min-width: 2rem;
				height: 1.62rem;
			}
		}
		& .y_card-title {
			font-size: 18px;
			color: var(--text-primary-color)
		}
	}
	& .y_avatar-img {
		border-radius: 0;
	}

	& .user-action-btn {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: #fff;
		padding: 0.2rem 0;
		box-shadow: 0px 0 0.03rem #ccc;
		& .button--block {
			padding: 0;
			height: .68rem;
		}
	}

	& .info_details--show {
		margin-bottom: 1.5rem;
	}

	& .flow_item-body {
		padding: 0 .16rem;

		& .flow_item-right {
			flex: 1;
			word-wrap: break-word;
		}
	}
}
</style>