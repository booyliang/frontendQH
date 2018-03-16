<template>
	<y-panel :title="title" icon="comment" class="comment_panel" id="commentHeader">
		<y-load-more :state="state" @can-load="onCanLoad" :endTip="!empty">
			<y-comment-list :data="commentData" @delete="handleDelete" :useOpusApi="useOpusApi"></y-comment-list>
			<div v-if="empty" class="empty-tip">
				<span class="icon"></span>{{$R("none-comment")}}
			</div>
		</y-load-more>
	</y-panel>
</template>

<script type="text/javascript">
import Panel from '@/components/panel';
import CommentList from './comment-list';
import LoadMore from '@/components/load-more';
import Heat from '@/components/heat';

export default {
	name: 'y-comment-panel',
	components: {
		[Panel.name]: Panel,
		[CommentList.name]: CommentList,
		[LoadMore.name]: LoadMore,
		[Heat.name]: Heat
	},
	props: {
		data: Object,
		commentData: Array,
		pageSize: Number,
		useOpusApi: Boolean,
	},
	mounted() {
		this.$eventBus.$on('newComment', this.addComment);
		this.getdata();
		this.$eventBus.$on('unload-comment', this.unloadCommentList); // 评论框聚焦时禁止评论加载
		this.$eventBus.$on('canload-comment', this.canloadCommentList);
	},
	beforeDestroy() {
		this.$eventBus.$off('newComment', this.addComment);
		this.$eventBus.$off('unload-comment', this.unloadCommentList);
		this.$eventBus.$off('canload-comment', this.canloadCommentList);
	},
	data() {
		return {
			state: undefined,
			loaded: false,
			currentPage: 1,
			count: 0,
			unloadComment: false, // （评论框聚焦时）不加载评论
		};
	},
	watch: {
		commentData() {
			this.$emit('commentNumber', this.commentData.length);
		},
		data() {
			this.getdata();
		}
	},
	computed: {
		title() {
			return `${this.count}${this.$R("num-comment")}`;
		},
		empty() {
			return this.loaded && !this.commentData.length;
		}
	},
	methods: {
		unloadCommentList() {
			this.unloadComment = true;
		},
		canloadCommentList() {
			this.unloadComment = false;
		},
		onCanLoad() {
			this.getdata();
		},
		async getdata(currentPage, pageSize) {
			if (this.useOpusApi) {
				if (!this.data.id || this.unloadComment) return;
			} else if (!this.data.id || !this.data.moduleEnum || this.unloadComment) return;

			this.state = "loading";

			let params = {
				targetId: this.data.id,
				moduleEnum: this.data.moduleEnum || '',
			};
			currentPage = currentPage || this.currentPage;
			pageSize = pageSize || this.pageSize
			let response = null;
			if (this.useOpusApi) {
				response = await this.$opusApi.get(`/yyl/v1/comment/list/${currentPage}/${pageSize}`, { params })
			} else {
				response = await this.$http.get(`/services/app/v1/comment/list/${currentPage}/${pageSize}`, { params })
			}
			let resData = response.data;
			if (pageSize !== 1)
				this.currentPage++;
			if (resData.code === "200" || resData.msg === 'success') {
				this.loaded = true;
				let data = resData.data.entities || [];
				if (this.count !== resData.data.count) {
					this.$emit('count-change', resData.data.count);
				}
				this.count = resData.data.count;
				if ((this.currentPage - 1) * this.pageSize >= response.data.data.count) {
					// console.log(this.currentPage, this.pageSize, response.data.data.count)
					this.state = "end";
				} else {
					this.state = "prepared";
				}
				this.commentData.push(...data);

			} else {
				console.log(response.data.msg);
			}
		},
		addComment(comment) {
			if (!comment.id) return;
			switch (comment.type) {
				case 0:
					this.$emit('add-comment');
					this.count++;
					var preComment = this.commentData[this.commentData.length - 1];
					if (preComment && preComment.id === comment.id)
						return;
					this.commentData.unshift(comment);
					break;
				case 1:
					for (let comm of this.commentData) {
						//  防止添加重复数据
						if (comm.id === comment.topId) {
							comm.replyList = comm.replyList || [];
							let preReplay = comm.replyList[comm.replyList.length - 1];
							if (preReplay && preReplay.id === comment.id)
								return;
							comm.replyList.push(comment);
							break;
						}
					}
					break;
				default:
					throw new Error(`该记录 type 为 ${comment.type}。`);
			}
		},
		handleDelete(comment) {
			this.commentData.splice(this.commentData.indexOf(comment), 1);
			this.count--;
			this.$emit('delete-comment');
			if (this.count > (this.currentPage - 1) * this.pageSize) { // 总评论数 > 已加载出来的评论数时, 删一条评论加载一条数据
				let currentPage = (this.currentPage - 1) * this.pageSize;
				this.getdata(currentPage, 1)
			}

		}
	}
};
</script>
<style>
@import '#/css/var.css';
.comment_panel.panel--rich {
	margin-top: 0;
	& .panel-head {
		border-bottom: 0;
	}

	& .panel-body {
		padding-top: 0;
	}

	& .panel-title {
		color: var(--text-tips-color);
		font-size: .26rem;

		& .iconfont {
			font-size: .26rem;
			margin-right: 0.2rem;
			color: #d5d5d5;

			&.icon-comment {
				font-size: var(--default-font-size);
			}
		}
	}

	& .comment {
		& .comment-content {
			font-size: .32rem;
			color: var(--text-primary-color);
		}
		& .iconfont {
			margin-right: 0.2rem;
			color: #bfbfbf;
		}

		& button.button {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		& button.button--s {
			display: block;
		}
	}
}
</style>