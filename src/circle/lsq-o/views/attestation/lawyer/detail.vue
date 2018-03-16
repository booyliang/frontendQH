<template>
	<div class="lawyer_detail">
		<y-nav :title="$R('lawyer-detail')" :transparent="true" class="banner-lawyer--height"></y-nav>
		<y-card :title="ListData.realName" :src='ListData.portrait' img-size="large" position="vertical" class="lawyer_top-card">
			<p slot='assist' v-html='assist'></p>
		</y-card>
		<y-panel :title="$R('individual-resume')" icon="intr" v-if='this.ListData.personalProfile'>
			<p v-text="this.ListData.personalProfile"></p>
		</y-panel>
		<y-panel :title="$R('professional-field')" icon="tasks-check" v-if='this.ListData.goodField'>
			<y-tag v-for="(tag, index) in tags" :key="index" :data="tag">{{tag}}</y-tag>
		</y-panel>
		<y-panel :title="$R('practice-office')" icon="build" v-if='this.ListData.office'>
			<p v-text="this.ListData.office"></p>
		</y-panel>
		<div class="info_details--show">
			<y-panel :title="$R('case-show')" icon="case" v-if='this.ListData.caseShow'>
				<p v-text="this.ListData.caseShow"></p>
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
import YTag from '@/components/tag';
export default {
	components: {
		YNav,
		YCard,
		YPanel,
		YTag
	},
	data() {
		return {
			vm: {
				data: {}
			},
			myself: true,
			isFriend: '',
			assist: '',
			tags: [],
			ListData: {},
			masTaxt: "",
			amFriend: "",
			disabled: false
		}
	},
	mounted() {
		// 获取页面信息
		this.interactionData();
		this.userName();
		// 获取用户信息
		this.userId();
	},
	methods: {
		interactionData() {
			this.$http.get('/services/app/v1/lawyer/authentication/singleInfo/' + this.$route.params.id).then(res => {
				this.ListData = res.data.data
				if (res.data.code === '200') {
					this.assist = this.ListData.merageLabel.replace(new RegExp(/\//g), '<span class="lable-seper">/</span>');
					if (this.ListData.goodField) {
						let idArray = this.ListData.goodField.split(',');
						this.tags = idArray;
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
			this.$router.push({ path: '/lawyer/edit/' + "1" })
		},
		userName() {
			if (this.$route.params.id === this.$env.userId) {
				this.myself = false;
			}
			// 查询认证状态
			this.$http.get("/services/app/v1/lawyer/authentication/authstatus/" + this.$route.params.id).then(res => {
				this.headData = res.data.data
				if (res.data.code === "200") {
					console.log(this.headData.authstatus);
					if (this.headData.authstatus === 0) {
						this.disabled = true;
						this.masTaxt = this.$R('Submitted-wait-review')
					} else if (this.headData.authstatus === 1) {
						this.disabled = false;
						this.masTaxt = this.$R('approved')
					} else if (this.headData.authstatus === 2 || this.headData.authstatus === 3) {
						this.disabled = false;
						this.masTaxt = this.$R('failed-resubmit')
					}
				}
			});
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
.lawyer_detail {
	& .lawyer_top-card {
		position: relative;
		height: 2.47rem;
		margin-top: -2.47rem;

		& .y_card-title {
			font-size: 16px;
			color: #fff;
			margin-bottom: .1rem;
		}

		& p {
			font-size: 13px;
			color: #fff;
		}
	}

	& .tag {
		font-size: 14px;
	}
	& .tag:not(:last-child) {
		margin-right: .3rem;
		margin-bottom: .3rem;
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
		margin-bottom: 1.08rem;
	}
}
</style>