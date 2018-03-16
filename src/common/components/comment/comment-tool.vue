<template>
	<div style="padding-top:1.06rem" class="comment-tool">
		<div id="comment-tool" class="comment-tool-wrap">
			<div class="input-box">
				<!--<input @focus="handleFocus" @blur="leaveInput" ref="commentInput" :placeholder="placeholder" v-model="text">-->
				<auto-textarea @focus="handleFocus" @blur="leaveInput" ref="commentInput" :placeholder="placeholder" v-model="text"></auto-textarea>
			</div>
			<div class="send-box" v-show="inputFocus">
				<y-button @click.native.stop="onSubmitComment" :disabled="commentdisabled">{{$R("comment-comments")}}</y-button>
			</div>
			<div class="menu-box" v-show="!inputFocus">
				<y-badge class="comment-count" :hidden="!commentNumber" :value="commentNumber" :max="99">
					<div class="iconfont icon-comment" @click.stop="onClickCommentMenu">
						<!-- <i v-if="commentNumber > 0">{{commentNumber >= 99 ? '99+' : commentNumber }}</i> -->
					</div>
				</y-badge>
				<y-comment-heat-hot v-if="!useOpusApi" :data="data"></y-comment-heat-hot>
				<y-comment-collect v-if="useOpusApi" :data="data" class="iconfont icon-star" :useOpusApi="useOpusApi"></y-comment-collect>
				<div v-show=" (data.moduleEnum === '0210' && parseInt(data.allowShareFlag) === 1) || data.moduleEnum === '0091' || data.moduleEnum === '0241' && !data.isOnlyShowMe || data.moduleEnum === '0231'  || useOpusApi" class="iconfont icon-share-right" id="clickShare"></div>

				<template>
					<y-share :data="data" handle="#clickShare" :useOpusApi="useOpusApi"></y-share>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import YButton from '@/components/button'
import Toast from '@/components/toast'
import YBadge from '@/components/badge'
import YShare from './share'
import YCommentHeat from './comment-heat'
import YCommentHeatHot from './comment-heat-hot'
import YCommentCollect from './comment-collect'
import YAutoTextarea from './auto-textarea'
export default {
	name: 'YCommentTool',
	components: {
		YButton,
		Toast,
		YBadge,
		YShare,
		YCommentHeat,
		YCommentHeatHot,
		YCommentCollect,
		[YAutoTextarea.name]: YAutoTextarea
	},
	props: {
		data: {
			type: Object,
			default: () => {
			}
		},
		commentNumber: {
			type: Number,
			default: 0
		},
		useOpusApi: Boolean,
	},
	computed: {
		'placeholder'() {
			return this.targetComment.nickName ? this.$R("comment-reply") + ':' + this.targetComment.nickName : this.$R("say-something");
		}
	},
	data() {
		return {
			commentdisabled: true,
			inputFocus: false,
			text: '',
			targetComment: {}
		}
	},
	watch: {
		"text"(newVal, oldVal) {
			// console.log("newVal", newVal, newVal.length, "oldVal:", oldVal, oldVal.length)
			if (newVal.length > oldVal.length) {
				// console.log("在输入。。。")
			} else {
				// console.log("在删除。。。")
				if (newVal.length === 0) {
					// this.$toast("文字删没啦~")
				}
			}

			if (newVal && newVal.toString().trim().length > 0) {
				this.commentdisabled = false;
				// console.log("输入不为空，按钮不置灰")
			} else {
				this.commentdisabled = true;

			}
		}
	},
	methods: {
		async handleFocus(flag) {
			try {
				await this.$user.login();
				this.inputFocus = true;
			} catch (error) {
				this.$refs.commentInput.$el.blur();
			}
			
			if (!this.targetComment.id) {
				this.$nextTick(() => {
					window.scrollTo(0, document.body.scrollHeight);
				});
			}

			if (this.$yryz.isNative() && this.$yryz.isIOS()) { // ios 键盘弹起fixed失效 评论框聚焦禁止评论加载以防止评论数据加载后评论框被挤到键盘下面
				setTimeout(() => {
					window.scrollTo(0, document.body.scrollHeight);
				}, 200)
				this.$eventBus.$emit('unload-comment');
			}
		},
		leaveInput() {
			this.inputFocus = this.text;
			if (this.$yryz.isNative() && this.$yryz.isIOS()) {
				this.$eventBus.$emit('canload-comment');
			}
		},
		async onSubmitComment() {
			await this.$user.login();
			if (this.text.length > 200)
				return this.$toast('评论内容不能超过200字')
			this.commentdisabled = true;
			let postData = {
				targetId: this.data.id,
				comment: this.text,
				moduleEnum: this.data.moduleEnum,
				topId: this.targetComment.parentId === 0 ? this.targetComment.id : this.targetComment.topId,
				parentId: this.targetComment.id,
				targetAuthorId: this.data.createUserId,
				targetResourceId: this.data.resourceId,
				coterieId: this.data.coterieId,
			};
			// console.log(postData);
			try {
				let response = null;
				if (this.useOpusApi) {
					response = await this.$opusApi.post('/yyl/v1/comment/single', postData)
				} else {
					response = await this.$http.post('/services/app/v1/comment/single', postData)
				}
				if (response.data.code === "200" || response.data.ret === 1) {
					let data = response.data.data;
					data.type = data.parentId === 0 ? 0 : 1;
					this.text = '';
					this.inputFocus = false;
					this.targetComment = {};
					this.$eventBus.$emit('newComment', data);
					this.$refs['commentInput'].updateHeight();
				} else {
					Toast(response.data.msg);
				}
				this.commentdisabled = false;
			} catch (error) {
				this.commentdisabled = false;
			}
		},
		onClickCommentMenu() {
			var flowDetails = document.getElementsByClassName('flow_detail');
			if (flowDetails.length === 0) return;
			let commentHeader = document.querySelector('#commentHeader');
			let flowHeight = commentHeader.offsetTop;
			var commentHeaderTop = commentHeader.getBoundingClientRect().top;

			if (window.innerHeight < commentHeaderTop) {
				window.scrollTo(0, flowHeight - document.querySelector('#navigator').clientHeight);
			}
			else {
				window.scrollTo(0, 0);
			}
		},
		onTargetComment(targetComment) {
			// console.log(targetComment);

			this.targetComment = targetComment;
			this.inputFocus = true;
			this.$refs.commentInput.focus();
		}
	},
	mounted() {
		this.$eventBus.$on('targetComment', this.onTargetComment);
	},
	beforeDestroy() {
		this.$eventBus.$off('targetComment', this.onTargetComment);
	},
}
</script>
<style >
.comment-tool {
	& .comment-tool-wrap {
		position: fixed;
		z-index: 99;
		bottom: 0;
		left: 0;
		width: 100%;
		height: auto;
		min-height: 1.06rem;
		max-height: 2.12rem;
		padding: 0.18rem 0.3rem;
		display: flex;
		background: #f4f4f4;
		& .input-box {
			flex: 1 1 100%;
			transition: width 0.3s;
			height: 100%;

			/*& input {
				display: block;
				width: 100%;
				height: 100%;
				padding: 0 0.1rem;
				background: #fff;
				border-radius: 0.1rem;
				font-size: 16px;
				color: #666;
			}*/
			&~.send-box {
				margin-left: 0.2rem;
				-webkit-align-items: flex-end;
				-ms-flex-align: flex-end;
				align-items: flex-end;
				height: auto;
				font-size: .32rem;
				& button {
					background: #faa846;
					height: .7rem;
					line-height: .7rem;
					padding: 0;
					width: 1.23rem
				}
				& button[disabled] {
					background: #d7d7d7;
				}
			}
		}
		& .menu-box,
		& .send-box {
			flex: 1 0 auto;
			display: flex;
			align-items: center;
		}
	}

	& .iconfont {
		margin-left: 0.5rem;
		font-size: .4rem;
		color: #bfbfbf;
	}

	& .icon-comment-o {
		position: relative;
		& i {
			width: 0.32rem;
			height: 0.32rem;
			line-height: 0.32rem;
			text-align: center;
			background: #f93434;
			border-radius: 50%;
			display: inline-block;
			position: absolute;
			top: -0.04rem;
			right: -0.16rem;
			color: #fff;
			font-size: .2rem;
		}
	}

	& .select-state {
		color: #ffab2f;
	}
	& .not-select-state {
		color: #bfbfbf;
	}
}
</style>
