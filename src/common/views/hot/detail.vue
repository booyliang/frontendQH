<template>
	<div class="hot_detail">
		<y-nav title="互动详情">
		</y-nav>
		<div class="hot_detail-panel hot_detail-like" v-if="!likeFlag">
			<p class="title"><span class="iconfont icon-thumb"></span><span>共{{likeData.count}}个点赞</span></p>
			<div class="hot_user-wrap">
				<div v-for="(user, index) in likeData.entities" :key="index" class="hot_user-item" @click="goPersonInfo(user.userId)">
					<img :src="user.userImg ? user.userImg : defaultAvatar">
				</div>
			</div>
		</div>
		<div class="hot_detail-panel" v-if="rewardFlag">
			<p class="title"><span class="iconfont icon-reward-circle"></span><span>共{{forwardCount}}个打赏</span></p>
			<div class="hot_user-wrap hot_user-wrap--marginb">
				<span v-for="(user, index) in forwardList" :key="index" class="hot_user-item hot_user-item--gift" @click="goPersonInfo(user.custId)">
					<!-- <span :class="'pic'+ user.price/100" class="gift"></span> -->
					<img :src="user.image" alt="">
					<p>{{user.nickName}}</p>
				</span>
			</div>
		</div>
		<div class="hot_detail-panel">
			<div class="content">
				<y-comment :data="answerData" :disableComment="false"></y-comment>
			</div>
		</div>
	</div>
</template>
<script>
import {YNav} from '@/components/nav'
import YComment from '@/components/comment/comment'
export default{
	components: {
		YNav,
		YComment
	},
	props: {
		defaultAvatar: {
			default: '/assets/static/default-avatar@2x.png'
		},
		
	},
	data() {
		return {
			likeData: {},
			forwardList: [],
			forwardCount: '',
			answerData: {
				id: this.$route.params.infoId,
				moduleEnum: this.$route.params.moduleEnum
			},
		}
	},
	created() {
		var params = this.$route.params.infoId + '&moduleEnum=' + this.$route.params.moduleEnum + '&resourceId=' + this.$route.query.resourceId
		Promise.all([
			this.$http.get('/services/app/v1/like/list/1/10000?infoId=' + params),
			this.$http.get('/services/app/v1/report/list/1/10000?infoId=' + params),
			this.$http.get('/services/app/v1/report/single/opus?infoId=' + params)
		]).then(responses => {
			this.likeData = responses[0].data.data;
			this.forwardList = responses[1].data.data;
			this.forwardCount = responses[2].data.data;
		})
	},
	computed: {
		likeFlag() {
			return !!(this.$route.query.hots.split(',').indexOf('like') > -1)
		},
		rewardFlag() {
			return !!(this.$route.query.hots.split(',').indexOf('forward') > -1)
		}
	},
	methods: {
		goPersonInfo(id) { // 跳转到平台个人用户主页
			if (!this.isLink()) {
				return;
			}
			this.$yryz.toPersonalInfo({
				userId: id
			})
		},
		isLink() {
			return !!this.$utils.getModule('0021').link;
		}
	}
}
</script>
<style>
@import '#/css/var.css';

	.hot_detail{
		background-color: #fff;
	}

	.hot_detail-panel {
		margin: 0 0.14rem;
		padding: 0.3rem 0.16rem 0;
		@apply --border-bottom;


		& .title {
			padding-bottom: 0.2rem;
			color: var(--text-assist-color);
			font-size: .26rem;

			& .iconfont {
				color: #d5d5d5;
				font-size: .32rem;
				margin-right: 0.2rem;
			}

		}

		& .content{
			& .panel--rich{
				padding: 0;
				& .panel-head{
					border: 0;
					padding: 0;
					& .panel-title{
						font-size: .26rem;
						color: var(--text-assist-color);
						& .iconfont{
							font-size: .32rem;
							color: #d5d5d5;
						}
					}
				}
			}
		}
	}
	.hot_user-wrap {
		padding: 0 0.4rem;
		overflow: hidden;
		padding-bottom: 0.2rem;
	}
	.hot_user-wrap--marginb {
		padding-bottom: 0.1rem;
		padding-right: 0;

		& .hot_user-item--gift {
			margin-bottom: .18rem;
		}
	}
	.hot_user-item {
		display: inline-block;
		float: left;
		margin: 0 0.08rem 0.1rem;
		line-height: 1;
		text-align: center;
		& img {
			width: 0.6rem;
			height: 0.6rem;
			margin-top: 0.07rem;
    		margin-bottom: 0.06rem;
			@apply --round;
		}
	}
	.hot_user-item--gift {
		/*margin: 0 0.2rem 0.2rem;
		color: var(--active-color);*/
	
		display: inline-block;
		background: var(--bg-color);
		border-radius: .06rem;
		width: 1.4rem;
		height: 1.1rem;
		flex: 0 0 1.4rem;

		& .pic1{
			background: url(../../assets/reward_gift_1@2x.png) no-repeat center;
		}

		& .pic2{
			background: url(../../assets/reward_gift_2@2x.png) no-repeat center;
		}

		& .pic5{
			background: url(../../assets/reward_gift_5@2x.png) no-repeat center;
		}

		& .pic10{
			background: url(../../assets/reward_gift_10@2x.png) no-repeat center;
		}

		& .pic30{
			background: url(../../assets/reward_gift_30@2x.png) no-repeat center;
		}

		& .pic50{
			background: url(../../assets/reward_gift_50@2x.png) no-repeat center;
		}

		& .pic100{
			background: url(../../assets/reward_gift_100@2x.png) no-repeat center;
		}

		& .pic500{
			background: url(../../assets/reward_gift_500@2x.png) no-repeat center;
		}

		& .gift {
			display: inline-block;
			width: 0.94rem;
			height: 0.6rem;
			border-radius: 0;
			margin-bottom: 0.06rem;
			background-size: cover;
		}

		& p {
			width: 100%;
			@apply --text-cut;
			text-align: center;
			color: var(--text-secondary-color);
			font-size: .24rem;
			padding: 0 .1rem;
			line-height: 1.1;
		}
	}
</style>