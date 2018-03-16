<template>
	<div class="comment-wrap">
		<y-comment-panel ref="panel" :data="data" @add-comment="addComment" @delete-comment="deleteComment" @count-change="setCommentCount" :commentData="comment" :pageSize="pageSize" :useOpusApi="useOpusApi"></y-comment-panel>
		<comment-tool v-if="$yryz.isNative() && disableComment" :data="data" :commentNumber="count" :useOpusApi="useOpusApi"></comment-tool>
	</div>
</template>

<script type="text/javascript">
import CommentPanel from './comment-panel';
import CommentTool from './comment-tool';

export default {
	name: 'y-comment',
	components: {
		[CommentPanel.name]: CommentPanel,
		CommentTool,
	},
	props: {
		data: Object,
		disableComment: {
			type: Boolean,
			default: true
		},
		pageSize: {
			type: Number,
			default: 10
		},
		useOpusApi: Boolean,
	},
	data() {
		return {
			targetComment: null,
			comment: [],
			count: 0
		};
	},
	methods: {
		setCommentCount(value) {
			this.count = value;
		},
		addComment() {
			this.count += 1;
		},
		deleteComment() {
			this.count -= 1;
		}
	},
	mounted() {

	}
};
</script>
<style>
.comment-wrap {
	& .comment-tool-wrap {
		& .menu-box .like-count {
			& .is-fixed {
				top: -.001rem;
			}
		}

		& .y_badge-content {
			border: none;
			background: #93c8f8;
			&.is-fixed {
				top: .05rem;
				right: 0.1rem;
			}
		}
	}
}
</style>

