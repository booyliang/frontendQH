<template>
	<div class="coterie-index">
		<y-nav class="nav-demo-c" :title="navTitle" ref="homeNav" :beforeBack="handleBack">
			<span slot="nav-right">
				<router-link class="iconfont icon-set-up" to="edit/index" v-if="permission === 100"></router-link>
				<y-button @click.native.stop="onAction" type="text" class="iconfont icon-more" v-else-if="permission === 200"></y-button>
			</span>
		</y-nav>
		<header class="header-wrapper">
			<div class="header-cover">
				<img :src="coterieInfo.icon" class="header-thumb" @click="showAlbum" alt="">
				<div class="header-title">{{coterieInfo.name}}</div>
				<div>
					<span :class="['btn-pill', {'newmember-tip': permission===100 && coterieInfo.newMemberNum}]" @click="goToCoterieList">{{coterieInfo.memberNum}}人加入</span>
					<y-card @click-img="toPersonalInfo" :src="coterieInfo.custIcon" :badge=true>
						<div class="coterieInfo" name="assist">
							<span @click="toPersonalInfo">圈主: {{coterieInfo.ownerName}}</span>
						</div>
					</y-card>
				</div>
			</div>
			<div class="coterie_info">
				<y-expand-text v-if="coterieInfo.intro" :lineNum=4 :btnIcons="['icon-arrow-u', 'icon-arrow-d']">
					私圈简介：{{coterieInfo.intro}}
				</y-expand-text>
			</div>
		</header>
		<!-- /header -->
		<div :class="['coterie-body', {'has_buttom': !isMember}]">
			<y-tab-bar v-if="isMember" class="tab-menu_list" @click="handleTabClick" :tabOption="menuData" v-model="tabId" :enableRouter="false"></y-tab-bar>
			<component :is="listComponent" class="tab-content"></component>
			<div class="view_rules-button" @click="openModalOfRules" v-if="!isMember">《私圈加入协议》</div>
		</div>
		<y-mask :class="maskClassList"></y-mask>
		<y-publish-entry :class="publishEntryClassList" @button-clicked="handlePublishEntryButtonClicked" v-if="permission===100">
			<span class="iconfont icon-plus"></span>
			<div slot="add-on" class="publish_entry-branches">
				<y-button class="publish_entry-branch" @click.native="handlePublish">
					<span class="icon icon-article"></span><br>资源</y-button>
				<y-button class="publish_entry-branch" @click.native="goTopic">
					<span class="icon icon-bubble"></span><br>话题</y-button>
				<y-button class="publish_entry-branch" @click.native="goActivity">
					<span class="icon icon-star"></span><br>活动</y-button>
			</div>
		</y-publish-entry>
		<y-publish-entry :class="publishEntryClassList" @button-clicked="handleAsk" v-if="permission===200 && tabId === 'question'">提问</y-publish-entry>

		<div class="coterie-action_btn" v-if="!isMember">
			<y-button block @click.native="handleJoin" v-if="!isPendingApproval" :disabled="disabled.joinButton">{{btnText}}</y-button>
			<y-button disabled block v-else>等待圈主的审核</y-button>
		</div>
		<y-modal ref="modal">
			<div class="modal-container">
				<div class="modal-body">
					<y-input type="textarea" :maxlength="30" placeholder="请填写您申请加入此私圈的理由" v-model="applyReason"></y-input>
				</div>
				<div class="modal-footer">
					<div type="text" @click="handleCancel" class="modal-button">取消</div>
					<div type="text" @click="handleOk" class="modal-button">确定</div>
				</div>
			</div>
		</y-modal>
	</div>
</template>
<script>
import Button from '@/components/button';
import YCard from '@/components/card';
import TabBar from '@/components/tab';
import Mask from '@/components/mask';
import PublishEntry from '@/components/publish-entry';
import YAvatar from '@/components/avatar';
import YModal from '@/components/modal';
import Dialog from '@/components/dialog';
import PublishMixin from "@/views/publish/mixin";
import TopicList from "./topic";
import QuestionList from "./question";
import DynamicList from "./general";
import ActivityList from "./activity";
import album from '@/components/album'
import YExpandText from '@/components/expand-text'
export default {
	mixins: [PublishMixin],
	components: {
		[Button.name]: Button,
		YCard,
		[TabBar.name]: TabBar,
		[Mask.name]: Mask,
		[PublishEntry.name]: PublishEntry,
		[YExpandText.name]: YExpandText,
		YAvatar,
		YModal
	},
	name: 'coterie',
	data() {
		return {
			tabId: "all",
			navTitle: "私圈",
			showMoreInfo: false,
			showMoreBtn: false,
			permission: null,
			classifyId: 0, // 私圈发布模板默认传0
			coterieInfo: {},
			userList: ['/assets/static/user01@2x.png', '/assets/static/user02@2x.png', '/assets/static/user03@2x.png'],
			menuData: [
				{ id: 'all', text: '全部' }
			],
			navMenu: [
				{text: "查看私圈信息", handler: () => {
					this.$router.push({name: 'coterieEdit'})
				}},
				{text: "我的购买", handler: () => {
					this.$router.push({name: 'purchase-list'})
				}}
			],
			config: {},
			publishEntryOpened: false,
			applyReason: "",
			isPendingApproval: false,
			disabled: {
				joinButton: false
			},
			listComponents: {
				'all': DynamicList,
				'topic': TopicList,
				'question': QuestionList,
				'activity': ActivityList
			},
			isShutUp: false
		}
	},
	computed: {
		btnText() {
			if (this.coterieInfo.maxMemberNum === this.coterieInfo.memberNum) {
				return "私圈人数已达上限";
			} else {
				return this.coterieInfo.joinFee ? `付费加入私圈(${this.coterieInfo.joinFee / 100}悠然币/永久)` : '免费加入私圈';
			}
		},
		listComponent() {
			return this.listComponents[this.tabId];
		},
		publishEntryClassList() {
			return {
				'publish_entry--opened': this.publishEntryOpened
			};
		},
		maskClassList() {
			return [
				'publish_entry-mask',
				{
					'mask--opened': this.publishEntryOpened
				}
			];
		},
		isMember() {
			return this.permission === 100 || this.permission === 200;
		},
		coterieIntro() {
			return this.coterieInfo.ownerIntro && this.coterieInfo.ownerIntro.substring(0, 10);
		},
		devType() {  // 机型
			let devType = this.$env.devType;
			if (devType === 0) {
				return 'Andriod';
			} else if (devType === 1) {
				return 'iOS ';
			} else {
				return 'PC';
			}
		}
	},
	async mounted() {
		let isRefresh = this.$localStore.get('refresh');
		if (isRefresh) {
			this.$coterie.getCoterieInfo(this.$coterie.coterieId);
			this.$localStore.remove('refresh');
		}
		// let permission = await this.$coterie.getPermission(this.$route.params.coterieId, this.$env.custId);
		// this.$coterie.permission = permission;
		if (!this.$env.userId) {
			this.tabId = 'all'
		} else {
			this.tabId = window.sessionStorage.getItem('tabId') || 'all';
			if (!this.$coterie.permission) {
				await this.$coterie.getPermission(this.$route.params.coterieId, this.$env.custId);
			}
		}
		this.permission = this.$coterie.permission;
		
		this.coterieInfo = this.$coterie;
		this.coterieInfo.ownerName = this.$coterie.ownerName.substring(0, 10);
		if (this.permission !== 100 && this.permission !== 200)
			this.$router.replace('all');
		
		if (this.coterieInfo.maxMemberNum === this.coterieInfo.memberNum) {
			this.disabled.joinButton = true;
		}
		await this.getMenuData();
		await this.getMemberStatus();
		this.$nextTick(() => {
			this.navControl();
			if (!this.$coterie.masterLastViewTime && this.permission === 100) {
				this.$coterie.masterLastViewTime = new Date().toLocaleDateString();
				this.showDialog();
			}
		})
	},
	methods: {
		goToCoterieList() {
			if (!this.isMember) {
				return;
			}
			this.$router.push({path: 'edit/member'});
		},
		onAction() {
			this.$actionsheet(this.navMenu);
		},
		showAlbum() {
			// 头像预览icon
			album.init([this.coterieInfo.icon]);
			album.show();
		},
		handleBack() {
			window.sessionStorage.removeItem('tabId');
		},
		async checkShutUp(obj) {
			let checkShutUpRes = await this.$http.get('/services/app/v1/coterie/user/checkPlatformShutup')
			let checkShutUpCode = checkShutUpRes.data.code
			if (checkShutUpCode === '1023' || checkShutUpCode === '1024') {
				this.isShutUp = true
			}
			this.publishEntryOpened = false;
			if (this.isShutUp) {
				this.$toast('您已被禁言！')
			} else {
				if (obj.isNative) {
					this.start(this.classifyId);
					return
				}
				this.$router.push({ name: obj.name });
			}
		},
		handlePublish() {
			this.checkShutUp({ isNative: true })
		},
		goTopic() {
			this.checkShutUp({ name: 'topicNew' })
		},
		goActivity() {
			this.checkShutUp({ name: 'activityNew' })
		},
		async handleAsk() {
			let checkInCoterieRes = await this.$http.get(`/services/app/v1/coterie/member/permission`)
			if (checkInCoterieRes.data.data === 300) {
				this.$toast('您已被踢出私圈，不可发布提问！')
			} else {
				this.checkShutUp({ name: 'coterieQuestionNew' })
			}
		},
		navControl() {
			window.addEventListener('scroll', this.showNavControl);
		},
		handleTabClick(tabId, item) {
			this.tabId = tabId;
			window.sessionStorage.setItem('tabId', tabId);
		},
		handlePublishEntryButtonClicked() {
			this.publishEntryOpened = !this.publishEntryOpened;
		},
		chagePublishData(publishData) {
			this.config.auth = {
				enabled: 1,
				data: {
					"allowGeneralizeFlag": 1,
					"allowShareFlag": 1,
					"contentPrice": 0, // 付费开关默认关闭，大于0 付费开关为打开状态
					"coterieId": this.$route.params.coterieId,
					"contentPriceData": {
						unit: "悠然币",
						data: [100, 500, 1000, 5000]
					},
					"isCoterieMaster": this.permission === 300
				}
			};
			publishData.config.auth = this.config.auth;
			publishData.request.url = this.$http.baseUrl + '/services/app/v1/coterie/release/info/single';
			publishData.dataSource.moduleEnum = "0210";
		},
		afterPublish(dataSource) {
			let authConfig = this.config.auth.data;
			authConfig.allowGeneralizeFlag = dataSource.allowGeneralizeFlag;
			authConfig.allowShareFlag = dataSource.allowShareFlag;
			authConfig.contentPrice = dataSource.contentPrice;
			window.sessionStorage.setItem('tabId', 'all');
			this.tabId = 'all';
			this.$utils.refresh();
		},
		toPersonalInfo() {
			let custId = this.$coterie.ownerId;
			this.$yryz.toPersonalInfo({ userId: custId });
		},
		showDialog() {
			Dialog.confirm({
				title: '恭喜您',
				message: '私圈已创建成功，赶紧去发布内容吧。',
			},
				{
					okText: '去发布'
				}).then(() => {
					this.handlePublish();
				}).catch(() => {
					console.log('cancel');
				});
		},
		async handleJoin() {
			await this.$user.login();
			this.disabled.joinButton = true;
			try {
				let res = await this.$http.post('/services/app/v1/coterie/member/join', { reason: "" });
				let resData = res.data;
				if (parseInt(resData.code) !== 200) {
					this.disabled.joinButton = true;
					this.$toast(resData.msg);
					return false;
				}
				this.disabled.joinButton = false;
				if (resData.data && resData.data.length > 1) {
					// 私圈需付费
					this.joinWithMoney(resData.data);
				} else if (parseInt(resData.data) === 1) {
					// 私圈免费需审核
					this.$refs['modal'].open();
				} else {
					// 私圈免费且无需审核
					this.$toast(resData.data)
					this.$coterie.permission = this.permission = 200;
					this.$coterie.memberNum = this.$coterie.memberNum + 1;
					window.sessionStorage.setItem('tabId', 'all');
					this.$utils.refresh();
				}
			} catch (error) {
				this.disabled.joinButton = false;
			}
		},
		async joinWithMoney(orderId) {
			try {
				await this.toPay(orderId);
				this.disabled.joinButton = false;
			} catch (err) {
				this.disabled.joinButton = false;
				if (err.data) {
					this.$toast(err.data.msg || err.data);
				}
			};
		},
		async toPay(orderId) {
			await this.$yryz.pay({
				payMoney: this.$coterie.joinFee,
				orderId: orderId
			});
			let res = await this.$http.get(`/services/app/v1/order/getOrderInfo/${orderId}`);
			if (res.data.data.orderState === 1) {
				// 埋点
				window.zhuge.track('加入私圈', {
					'用户id': this.$env.custId, // 用户id
					'机型': this.devType, // 设备类型 Andriod ios
					'圈子名称': this.$circle.circleName, // 圈子名称
				});
				this.$toast('加入私圈成功');
				this.$coterie.permission = this.permission = 200;
				this.$coterie.memberNum = this.$coterie.memberNum + 1;
				this.$utils.refresh();
			} else {
				throw res;
			};
		},
		openModalOfRules(item) {
			let url = 'https://static.yryz.com/quanhu/doc/private_join_rule/index.html';
			this.$yryz.openUrl({ url: url });
		},
		handleOk() {
			if (!this.applyReason.trim()) {
				this.$toast("请填写加入私圈的理由！");
				return;
			} else if (this.applyReason.length < 4) {
				this.$toast("加入理由不能少于4个字！");
				return;
			} else {
				this.$http.post('/services/app/v1/coterie/member/join', { reason: this.applyReason }).then(() => {
					this.$toast("申请已发送！");
					this.$refs['modal'].close();
					this.$nextTick(() => {
						this.isPendingApproval = !this.isPendingApproval;
					})
				});
			}
			
		},
		handleCancel() {
			this.$refs['modal'].close();
		},
		async getMenuData() {
			if (this.permission === 300 || !this.permission) return;
			let res = await this.$http.get('/services/app/v1/column/list');
			let columnList = res.data.data;
			columnList.forEach(item => {
				this.menuData.push({
					id: item.columnPath,
					text: item.columnName
				});
			});
		},
		async getMemberStatus() {
			if (this.permission === 100 || this.permission === 200) {
				return;
			}
			if (!this.$env.custId || !this.$env.userId) {
				this.isPendingApproval = false;
				return;
			}
			let res = await this.$http.get('/services/app/v1/coterie/member/isApply');
			this.isPendingApproval = res.data.data === 1;
		},
		showNavControl() {
			let top = document.body.getBoundingClientRect().top;
			this.navTitle = Math.abs(top) > 200 ? this.coterieInfo.name : '私圈';
		}
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.showNavControl);
		// 预览头像隐藏
		album.hide();

	}
}
</script>
<style>
@import "#/css/var.css";

:root {
	--coterie-publish-entry-transition-duration: 0.3s;
	--coterie-publish-entry-branch-transition-duration: 0.25s;
}

.coterie-index {
	min-height: 100vh;
	background: #fff;
	& .header-wrapper {
		background-color: white;
	}
	& .coterie-body {
		&.has_buttom {
			padding-bottom: 1.18rem;
		}
		&::before {
			content: '';
			position: absolute;
			left: var(--layout-space);
			right: var(--layout-space);
		}
		& .message {
			padding-bottom: 1rem;
		}
	}
	& .view_rules-button {
		padding-top: .25rem;
		padding-bottom: .3rem;
		text-align: center;
		color: var(--theme-color);
	}
	& .header-cover {
		padding: var(--layout-space);
		overflow: hidden;
		& .y_card{
			margin-top: .25rem;
			& .y_avatar{
				width: 0.45rem;
				height: 0.45rem;
				min-width: 0.45rem;
				min-height: 0.45rem;
				flex: 0 0 0.45rem;
				margin-right: 0.15rem;
				& .y_avatar-badge {
					width: 0.2rem;
					height: 0.2rem;
				}
			}
		}
		& .header-thumb {
			float: left;
			margin-right: var(--layout-space);
			background-color: var(--bg-color);
			display: flex;
			width: 2rem;
			height: 2rem;
			border-radius: .06rem;
		}
		& .header-title {
			@apply --text-cut;
			margin-bottom: .25rem;
			font-size: .52rem;
			line-height: 1.2;
		}
		& .header-assist {
			color: var(--text-assist-color);
			font-size: .26rem;
		}
	}
	& .coterie_spec {
		@apply --round;
		@apply --border;
		padding: .2rem;
		margin-left: var(--layout-space);
		margin-right: var(--layout-space);
		background-color: var(--bg-color);
		display: flex;
		align-items: center;
		& .coterieInfo {
			display: flex;
			flex-direction: column;
			color: #000;
			font-size: .32rem;
			& span:last-child {
				color: #999;
				font-size: .26rem;
			}
		}
		& .coterie_spec-left {
			position: relative;
			padding-right: .2rem;
			flex: 1;
			& .y_avatar-badge__vip {
				width: .34rem;
				height: .34rem;
				bottom: -.1rem;
				background-image: url(../../assets/badge@2x.png);
				background-size: contain;
				background-color: transparent;
			}
			&:after {
				content: '';
				position: absolute;
				right: 0;
				top: 0;
				height: 100%;
				border-right: 1px solid var(--border-color);
			}
			& .y_card-title {
				width: 3rem;
				margin-bottom: 5px;
				@apply --text-cut;
			}
			& .y_card-assist {
				font-size: .26rem;
				line-height: 1;
				color: var(--text-tips-color);
			}
		}
		& .coterie_spec-right {
			padding-left: .2rem;
			flex: 0 0 auto;
			& .y_avatar {
				width: 0.6rem;
				height: 0.6rem;
				margin-right: 0;
				&+.y_avatar {
					margin-left: -0.3rem;
				}
			}
			& .y_card-title {
				font-size: .28rem;
				color: var(--text-assist-dark);
			}
		}
		& .y_card-title {
			font-size: .32rem;
			color: var(--text-primary-color);
		}
	}
	& .tab-menu_list {
		&>a {
			@apply --border-top;
			& .tab_bar-item {
				height: 30px;
				padding: 10px 0 0;
			}
		}
	}
	& .btn-pill {
		@apply --round;
		display: inline-block;
		text-align: center;
		font-size: .26rem;
		background-color: #ffe455;
		width: 1.56rem;
		height: .48rem; 
		line-height: .48rem;
	}
	& .coterie_info {
		padding: var(--layout-space) 0;
		padding-top: 0;
		margin: 0 var(--layout-space);
		color: var(--text-tips-color);
		font-size: .28rem;
		border-bottom: 1px solid #f1f1f1;
		display: flex;
		flex-direction: column;
		& > .coterie_info-text{
			&.text-clamp {
				@apply --text-cut-multi-line;
				-webkit-line-clamp: 4;
			}
		}
		& > .fold-btn {
			display: inline-block;
			padding: .2rem .3rem 0;
			align-self: center;
			& > .iconfont {
				font-size: .3em;
				display: inline-block;
			}
			&.fold-btn--folded {
				& > .iconfont {
					transform: rotate(0.25turn);
				}
			}
			&.fold-btn--unfolded {
				& > .iconfont {
					transform: rotate(0.75turn);
				}
			}
		}
	}

	& .publish_entry-mask,
	& .publish_entry,
	& .publish_entry-button {
		transition: var(--coterie-publish-entry-transition-duration) var(--coterie-publish-entry-branch-transition-duration) ease-in-out;
	}
	& .publish_entry-mask,
	& .publish_entry {
		z-index: 20;
	}

	& .publish_entry-mask {
		@apply --hidden;
	}
	& .publish_entry-mask.mask--opened {
		@apply --visible;
		transition-delay: 0s;
	}
	& .publish_entry-button {
		&::before {
			transform-origin: left;
			transition: 0.15s calc(var(--coterie-publish-entry-transition-duration) + var(--coterie-publish-entry-branch-transition-duration));
			transition-property: opacity, transform;
		}
	}
	& .publish_entry-branches {
		position: absolute;
		bottom: 180%;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		width: 0;
		margin: auto;
	}
	& .publish_entry-branch {
		@apply --hidden;
		@apply --circle;
		flex-shrink: 0;
		width: 1.5rem;
		height: 1.5rem;
		font-size: 0.34rem;
		color: var(--text-primary-color);
		background: white;
		margin: 0 0.3rem;
		transition: var(--coterie-publish-entry-branch-transition-duration) cubic-bezier(0.55, 0.055, 0.675, 0.19);

		&:nth-child(1) {
			transform: translate(150%, 150%) scale(0.5);
		}
		&:nth-child(2) {
			transform: translate(0, 150%) scale(0.5);
		}
		&:nth-child(3) {
			transform: translate(-150%, 150%) scale(0.5);
		}

		& .icon {
			width: 0.5rem;
			height: 0.44rem;

			&::before {
				content: none;
			}
		}
		& .icon-article {
			background-image: url(../../assets/article-1.png);
		}
		& .icon-bubble {
			background-image: url(../../assets/bubble-1.png);
		}
		& .icon-star {
			background-image: url(../../assets/star-1.png);
		}
	}
	& .publish_entry--opened {
		transform: translate(-3.04rem);

		&,
		& .publish_entry-button,
		& .publish_entry-button::before {
			transition-delay: 0s;
		}
		& .publish_entry-button {
			background: #5db1ff;
			box-shadow: none;
			transform: rotate(-0.875turn) scale(0.85);

			&:active {
				background: #42a4fe;
			}

			&::before {
				opacity: 0;
				transform: scale(0);
			}
		}
		& .publish_entry-branch {
			@apply --visible;
			transform: none;
			transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
			transition-delay: var(--coterie-publish-entry-transition-duration);
		}
	}
	& .coterie-action_btn {
		@apply --border-top;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		padding: .2rem .1rem;
		background-color: white;

		& .button {
			padding: 0;
			height: .68rem;
			border-radius: .16rem;
		}
	}
	& .modal-container {
		width: 6rem;
		height: 3.5rem;
		& .modal-body {
			margin: var(--layout-space);
			& .y-input-wrap {
				@apply --border;
				border-radius: .1rem;
			}
		}
		& .modal-footer {
			background-color: var(--bg-color);
			height: 1rem;
			display: flex;
			text-align: center;
			line-height: 1rem;
			& .modal-button {
				flex: 1;
				color: var(--text-secondary-color);
				&:first-child {
					position: relative;
					&::after {
						content: '';
						position: absolute;
						right: 0;
						top: .2rem;
						bottom: .2rem;
						border-right: 1px solid var(--border-color);
					}
				}
			}
		}
	}
	& .article_item-title {
		line-height: 25px;
	}
	& .y-input-wrap.y-textarea textarea {
		min-height: 1.77rem;
	}
	& .newmember-tip {
		position: relative;
		&:after {
			content: '';
			width: 0.2rem;
			height: 0.2rem;
			background: red;
			position: absolute;
			border-radius: 50%;
			border: 1px solid #fff;
			right: 0;
			top: -0.05rem;
		}
	}
}
</style>