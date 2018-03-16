<template>
	<div class="question_answer">
		<!--顶部导航-->
		<y-nav title="写回答" :beforeBack="goBack" leftText="取消" :showLeftArrow="false">
			<span slot="nav-right">
				<y-publish-button>发布</y-publish-button>
			</span>
		</y-nav>
		<!--顶部导航E-->
		<!--内容输入框-->
		<y-editor v-model="answerVm.contentSource"  :class="{'answerWhiteBg':showBg}" :audio-enable="true" :text-max-length="10000" :img-max-length="9" placeholder="写回答..." ref="nativeEditor"></y-editor>
		<!--内容输入框E-->
	</div>
</template>
<script>
import YEditor from '@/components/content-editor'
import { YPublishButton, PublishMixin } from '@/components/content-publish'
export default {
	components: {
		YEditor,
		YPublishButton
	},
	mixins: [PublishMixin],
	data() {
		return {
			answerVm: {
				contentSource: '[]',

			},
			showBg: false,
		}
	},
	mounted() {
		this.$nextTick( () => {
			if ( this.$yryz.isIOS()) return;
			// 安卓上键盘弹起收起 触发页面重绘
			this.initHeight = window.innerHeight;		
			window.addEventListener('resize', this.handleResize)
		})
		
	},
	destroyed() {
		window.removeEventListener("resize", this.handleResize);
	},
	methods: {
		handleResize() {
			let initHeight = this.initHeight;
			if (window.innerHeight < initHeight) {
				this.showBg = true;
			} else {
				this.showBg = false;
			}
		},
		async validate() {
			var summaryData = this.$refs.nativeEditor.getSummaryData();
			if (!summaryData.content.length && !summaryData.imgUrl && !summaryData.audioUrl) {
				this.$toast('请输入回答内容');
				return false
			}
			this.postData = {
				...this.answerVm,
				moduleEnum: "0241",
				questionId: this.$route.params.questionId,
				coterieId: this.$route.params.coterieId
			};
			this.postData.imgUrl = summaryData.imgUrl;
			this.postData.answerContent = summaryData.content;
			this.postData.audioLength = summaryData.audioTime;
			this.postData.answerAudio = summaryData.audioUrl;
			await this.$dialog.confirm('是否确认发布')
		},
		// 发布编辑内容
		publish() {
			this.$http.post('/services/app/v1/coterie/answer/single', this.postData).then(response => {
				let resData = response.data;
				if (resData.code === '200') {
					this.$toast('回答发布成功!');
					this.publishSuccess();
					this.$router.replace({ name: 'coterieQuestionDetail', params: { id: this.$route.params.questionId } });
				} else {
					this.publishError(resData.msg)
				}
			}).then(error => {
				this.publishError(JSON.stringify(error));
			})
		},
		// 返回问题详情页
		goBack() {
			if (this.answerVm.contentSource.length > 2) {
				this.$dialog.confirm(
					{
						title: '取消发布',
						message: '是否确认放弃编辑？',
					},
					{
						okText: '是',
						cancelText: '否'
					})
					.then(() => {
						this.$router.back();
					})
					.catch(() => {
						return false;
					});
				return false;
			}
		}
	}
}
</script>
<style>
    @import '#/css/var.css';
	.question_answer {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		& .nav-background-fix {
			background: none;
		}
		& .nav-center {
			color: var(--text-secondary-color);
		}
		& .nav-right {
			color: var(--text-secondary-color);
			font-size: .3rem;
			color: #5480ef;
		}
		& .content_editor {
			flex: 1;
			resize: both;
			display: flex;
			flex-direction: column;
			background: #fff;
			& .content_editor-view {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding-bottom: 1.2rem;
				& .y-input-wrap.y-textarea {
					flex: 1 1 100%;
					& textarea {
						flex: 1;
					}
					
					& .text-length-info {
						flex: 0 0 auto;
					}
				}
				& .content_editor-img_list{
					width: 100%;
					background: #fff;
				}
				& .content_editor-audio{
					width: 100%;
					background: #fff;
					margin: 0;
					padding: .3rem;
				}
			}
			& .content_editor-tool {
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				background: #fff;
				z-index: 3;
			}
		}
		& .content_editor.answerWhiteBg{
			position: relative;
			& .content_editor-view {
				padding-bottom: .9rem;
				& .content_editor-img_list{
					background: #fff;
					z-index: 2;
				}
				& .content_editor-audio{
					z-index: 2;
					background: #fff;
				}
			}
			
		}
		

		

		
		
		
	   
    }
</style>
