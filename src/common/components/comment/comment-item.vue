<template>
	<div class="comment">
		<y-comment-heat :data="data" :useOpusApi="useOpusApi"></y-comment-heat>
		<y-card :src="author.avatar" @click-img="toPersonallInfo">
			<span class="comment-detail" name="assist">
				<span class="comment-detail-child" @click="toPersonallInfo">{{author.name}}</span>
				<span>{{data.createDate | recentTime}}</span>
			</span>
		</y-card>

		<y-button v-if="mine" type="text" class="comment-delete" @click.native.stop="deleteComment">{{$R('delete')}}</y-button>
		<div class="comment-content" @click.stop="handleComment(data)" v-html="commentContent"></div>
		<y-reply-list v-if="data.replyList&&data.replyList.length" :data="data.replyList"></y-reply-list>
	</div>
</template>

<script type="text/javascript">
import YCard from '@/components/card';
import Button from '@/components/button';
import ReplyList from './reply-list';
import CommentHeat from './comment-heat';
import modules from '@/config/modules';

export default {
	name: 'y-comment-item',
	components: {
		YCard,
		[Button.name]: Button,
		[ReplyList.name]: ReplyList,
		[CommentHeat.name]: CommentHeat,
	},
	props: {
		data: Object,
		useOpusApi: Boolean,
	},
	data() {
		return {
			disable: true,
			isNative: this.$yryz.isNative()
		}
	},
	computed: {
		author() {
			return {
				link: this.$env.userId && modules['0021'].link ? modules['0021'].link.replace(':id', this.data.createUserId) : "",
				name: this.data.nickName,
				avatar: this.data.userImg
			};
		},
		mine() {
			return this.data.createUserId === this.$env.userId || this.data.createUserId === this.$env.custId;
		},
		commentContent() {
			return this.data.comment.replace(/\n/g, "<br>").replace(/\s/g, '&nbsp;');
		}
	},
	methods: {
		toPersonallInfo() {
			if (!this.isNative) return
			this.$yryz.toPersonalInfo({ userId: this.data.createUserId })
		},
		async deleteComment() {
			if (this.disable) {
				this.disable = false;
				let res = null;
				if (this.useOpusApi) {
					res = await this.$opusApi({
						method: 'POST',
						url: `/yyl/v1/comment/single/${this.data.id}`
					});
				} else {
					res = await this.$http({
						method: 'DELETE',
						url: `/services/app/v1/comment/single/${this.data.id}`
					});
				}

				if (res.data.code === "200" || res.data.msg === 'success') {
					this.disable = true;
					this.$emit('delete', this.data);
				} else {
					this.disable = true;
				}
			}
		},
		handleComment(comment) {
			//                let targetComment={
			//                  columnCode: this.data.columnCode,
			//                  targetId: reply.targetId,
			//                  // targetUserId: this.data.createUserId,
			//                  replyName: reply.nickName,
			//                  pId: reply.id,
			//                  rootId: reply.id,
			//                  createUserId: this.$env.custId,
			//                  type: 1,
			//                  contentUrl: location.href,
			//                  anchor: '',
			//                  nickName: reply.nickName,
			//                  replyIndex:index
			//                };

			this.$eventBus.$emit('targetComment', comment);
		},
	}
};
</script>

<style type="text/css">
@import '#/css/var.css';

 :root {
	--avatar-holder-width: calc(0.68rem + 0.2rem);
}

.comment {
	flex: 1;
	padding-left: var(--avatar-holder-width);
	padding-top: 0.1rem;
	padding-bottom: 0.1rem;

	& .comment-detail {
		display: flex;
		flex-direction: column;

		font-size: 0.28rem;
		& .comment-detail-child {
			color: var(--theme-color);
		}
	}
	&>.y_card {
		margin-left: -var(--avatar-holder-width);
		margin-bottom: 0.2rem;

		& .y_card-title {
			font-size: .28rem;
			color: var(--active-color);
		}
	}

	& .comment-content {
		word-wrap: break-word;
		word-break: break-all;
	}
}

.comment-delete {
	float: right;
	height: 1.5em;
	line-height: 1.5em;
	font-size: .26rem;
	color: var(--text-assist-color);
	padding: 0;

	&+* {
		margin-right: 0.8rem;
	}
}
</style>