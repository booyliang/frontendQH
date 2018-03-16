<template>
	<div class="topic-detail">
		<y-nav :transparent=true title="话题详情" class="topic_home-top" :menuData="menuData"></y-nav>
		<div class="topic_info flow_detail">
			<y-card :title='title' :default-avatar='defaultImg' :src='userImg' position='horizontal' class="topic-detail--card">
				<p class="topic_info--count"><span>{{$R('browse')}}：{{viewCount}}</span><span>{{$R('discussion')}}：{{replyCount}}</span></p>
			</y-card>
		</div>
		<!--话题详情-->
		<div class="topic-user_msg">
			<y-flow-detail :data="singConent">
			</y-flow-detail>
		</div>
		<y-hot :hots="['like', 'forward']" :data="singConent">
			<div slot="foot">
				<y-ad :type="1" keyword="圈子内容"></y-ad>
			</div>
		</y-hot>
		<!--评论-->
		<y-comment :data="singConent"></y-comment>
	</div>
</template>
<script>
import YCard from '@/components/card';
import YNav from '@/components/nav/nav';
import YNavSearch from '@/components/nav/nav-search';
import YNavToggle from '@/components/nav/nav-toggle';
import YFlowDetail from '@/components/flow-detail';
import Comment from '@/components/comment/comment';
import YHot from '@/components/hot';
import Ad from '@/components/ad';
import defaultImg from '@/assets/default-thumb@2x.png'
export default {
	components: {
		YCard,
		YNav,
		YNavSearch,
		YNavToggle,
		YFlowDetail,
		YHot,
		[Ad.name]: Ad,
		[Comment.name]: Comment
	},
	data() {
		return {
			title: null,
			userImg: '',
			introductions: '',
			viewCount: '',
			replyCount: '',
			singConent: {},
			defaultImg: defaultImg,
			menuData: [
				'index',
				'copy-url',
				'report'
			],
		}
	},
	created() {
		this.$http.get(`/services/app/v1/post/single/${this.$route.params.id}`).then(response => {
			var singleData = response.data.data;
			if (response.data.code === "200") {
				// console.log(singleData);
				this.singConent = singleData
			}
			let module = this.$utils.getModule('0042');
			// console.log(module.link)
			this.menuData = singleData.createUserId === this.$env.userId ? ['index', 'copy-url'] : ['index', 'copy-url', 'report']
			return this.$http.get('/services/app/v1/topic/single/' + singleData.topicId)
		}).then(response => {
			var topicData = response.data.data;
			if (response.data.code === "200") {
				this.title = topicData.title;
				this.userImg = topicData.imgUrl;
				this.viewCount = topicData.viewCount;
				this.replyCount = topicData.replyCount;
				// use for share
				this.singConent.topicTitle = this.title;
			}
		})
	}
}
</script>
<style>
@import "#/css/var.css";
.topic-detail, #forward-body-wrap {
	& .topic-detail--card {
		align-items: flex-start;
		& .y_card-title {
			font-size: .36rem;
			line-height: 22px;
			color: var(--text-primary-color);
		}
	}
	& .content_source {
		& .image-box {
			margin-bottom: 0;
		}
	}
	& .topic_info {
		margin-left: 0;
		margin-right: 0;
		& .y_card-text {
           flex: 1;
           word-wrap: break-word;
		}
		& .y_card {
			position: relative;
			& .y_avatar {
				width: 1.6rem;
				height: 1.6rem;
				min-width: 1.6rem;
				min-height: 1.6rem;
				& .y_avatar-img {
					border-radius: 0;
					width: 100%;
					height: 100%;
				}
				& .y_card-text {
					height: 1.6rem;
					margin-left: .1rem;
					& .y_card-title {
						color: var(--text-primary-color);
						font-size: .36rem;
						line-height: 22px;
					}
				}
				& .topic_info--count {
					position: absolute;
					bottom: 0;
					font-size: .26rem;
					color: var(--text-assist-color);
					& span:first-child {
						margin-right: .35rem;
					}
				}
			}
			& .topic_info--count {
				margin-top: .2rem;
				font-size: .26rem;
				color: var(--text-assist-color);
				& span:first-child {
					margin-right: .35rem;
				}
			}
		}
	}
}
#forward-body-wrap {
	& .topic_info{
		margin: 0 0 0;
	}
}
</style>
