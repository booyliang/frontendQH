<template>
	<div class="topic-detail post-details">
		<y-nav title="帖子详情">
			<y-button @click.native.stop="onAction" slot="nav-right" type="text" class="iconfont icon-more" v-if="permission !== 300"></y-button>
		</y-nav>
		<div class="topic_home-img">
			<img :src="topicData.imgUrl" v-if="topicData.imgUrl"/>
		</div>
		<div class="topic-info topic-info-invitation">
			<div class="topic-info-title" v-if="topicData.title">
				 <span class="iconfont icon-topic"></span><span class="fontbold">#{{topicData.title}}#</span>
			</div>
			<div class="topic-info-content" v-text="topicData.content"></div>
		</div>
		<!--话题详情-->
		<div class="topic-user_msg">
			<y-flow-detail :data="invitationData">
			</y-flow-detail>
		</div>
		<y-hot :hots="['forward']" :data="invitationData"></y-hot>
		<!--评论-->
		<y-comment :data="invitationData"></y-comment>
		<y-bottombanner v-if="$coterie.permission === 300"></y-bottombanner>
	</div>
</template>
<script>
import Bottombanner from '../components/bottombanner'
import actiontMixin from '../mixins/action-methods';
import YCard from '@/components/card';
import YNav from '@/components/nav/nav';
import YNavSearch from '@/components/nav/nav-search';
import YNavToggle from '@/components/nav/nav-toggle';
import YFlowDetail from './components/flow-detail';
import Comment from '@/components/comment/comment';
import YHot from '@/components/hot';
import Ad from '@/components/ad';
import defaultImg from '@/assets/default-thumb@2x.png'
import shareInfo from '../mixins/shareInfo';
export default {
	name: 'coterie-topic-detail',
	mixins: [
		actiontMixin,
		shareInfo
	],
	
	components: {
		YCard,
		YNav,
		YNavSearch,
		YNavToggle,
		YFlowDetail,
		YHot,
		[Ad.name]: Ad,
		[Comment.name]: Comment,
		[Bottombanner.name]: Bottombanner,
	},
	data() {
		return {
			permission: this.$coterie.permission,
			topicData: {},
			invitationData: {},
			defaultImg: defaultImg,
			userId: '',
			isNative: this.$yryz.isNative()
		}
	},
	computed: {
		menuData() {
			let menu = [
				{ text: '收藏', handler: () => this.handleCollect(this.invitationData) },
				{ text: '取消收藏', handler: () => this.handleUncollect(this.invitationData) },
				{ text: '举报', handler: () => this.handleReport(this.$route.params.invitationId) },
				{ text: '删除', handler: () => this.handleDelete(this.$route.params.invitationId, '/services/app/v1/coterie/topic/post/delete/', 'detail') }
			]
			let newMenu = [];
			if (this.permission === 100) {
				if (this.userId === this.$env.userId) {
					if (this.hasCollected) {
						newMenu.push(menu[1], menu[3])
					} else {
						newMenu.push(menu[0], menu[3])
					}
				} else {
					if (this.hasCollected) {
						newMenu.push(menu[1], menu[2], menu[3])
					} else {
						newMenu.push(menu[0], menu[2], menu[3])
					}
				}
			} else {
				if (this.userId === this.$env.userId) {
					if (this.hasCollected) {
						newMenu.push(menu[1], menu[3])
					} else {
						newMenu.push(menu[0], menu[3])
					}
				} else {
					if (this.hasCollected) {
						newMenu.push(menu[1], menu[2])
					} else {
						newMenu.push(menu[0], menu[2])
					}
				}
			}
			return newMenu
		}
	},
	async created() {
		// 帖子内容
		let invitationRes = await this.$http.get(`/services/app/v1/post/single/${this.$route.params.invitationId}`)
		this.invitationData = invitationRes.data.data
		this.userId = this.invitationData.createUserId

		// 话题内容
		let topicRes = await this.$http.get(`/services/app/v1/topic/single/${this.invitationData.topicId}`)
		this.topicData = topicRes.data.data
		this.$nextTick(() => {
			this.shareInfo({
				title: '圈子有了，一切都有了！',
				desc: this.invitationData.content,
				imgUrl: this.invitationData.videoThumbnailUrl || this.invitationData.imgUrl.split(',')[0].toString()
			});
		})
		
		// 查询收藏状态
		if (this.isNative && this.$env.custId) {
			let checkCollectRes = await this.$http.post(`/services/app/v1/store/check`, {
				moduleEnum: this.invitationData.moduleEnum,
				infoId: this.invitationData.id,
				resourceId: this.invitationData.resourceId
			})
			if (checkCollectRes.data.code === '200') {
				this.hasCollected = checkCollectRes.data.data
			} else {
				this.$toast(checkCollectRes.data.msg);
			}
		}
	},
	methods: {
		onAction() {
			// if (!this.isNative) return;
			this.$actionsheet(this.menuData);
		}
	}
}
</script>
<style>
@import "#/css/var.css";

.topic-info {
	padding: .3rem;
	margin-bottom: .2rem;		
	background: #fff;
}

.topic-info-invitation {
	& .topic-info-title {
		position: relative;
		font-size: .36rem;
		line-height: 18px;
		& .icon-more {
			position: absolute;
			top: 0;
			right: 0;
		}
	}
	& .icon-topic {
		color: #349dff;
		font-size: .34rem;
		margin-right: 5px;
	}
	& .topic-info-content {
		color: var(--text-secondary-color);
		line-height: 1.34;
		/*@apply --text-cut-multi-line;
		-webkit-line-clamp: 2;*/
		margin-top: .2rem;
	}
	& .topic-info-footer {
		margin-top: .2rem;
		& .nickName {
			font-size: .26rem; 
			color: var(--active-color); 
			margin-right: .3rem;
		}
		& .time {
			font-size: .26rem; 
			color: var(--text-tips-color); 
		}
	}
}
.topic-detail {
	& .topic_home-img {
		& img {
			width: 100%;
			height: 3.36rem;
			display: block;
		}
	}
	& .flow_detail {
		padding-bottom: 0;
		& .content_source-text {
			margin: 0;
		}
	}
	& .fontbold {
         font-weight: bold;
	}
}
</style>
 