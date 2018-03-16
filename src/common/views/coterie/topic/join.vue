<template>
	<div class="topic_join_page">
		<y-nav :transparent=false :title="$R('topic-join-invitation')" :showLeftArrow=false :leftText="$R('cancel')" :beforeBack="goBack">
			<span slot="nav-right">
				<y-publish-button>{{$R('publish')}}</y-publish-button>
			</span>
		</y-nav>
		<div class="join-content_editor">
			<y-editor v-model="vm.contentSource"  :class="{'answerWhiteBg':showBg}"  :text-max-length="10000" :placeholder="$R('topic-hint')" :imgMaxLength="9" :img-disable="imgDisable" :video-enable="videoEnable" :video-disable="videoDisable" ref="nativeEditor">
			</y-editor>
		</div>
	</div>
</template>
<script>
	import YNav from '@/components/nav/nav';
	import YNavSearch from '@/components/nav/nav-search';
	import YNavToggle from '@/components/nav/nav-toggle';
	import YEditor from '@/components/content-editor';
	import Dialog from '@/components/dialog';
	import Toast from '@/components/toast';
	import {YPublishButton, PublishMixin} from '@/components/content-publish'
	export default {
		components: {
			YNav,
			YNavSearch,
			YNavToggle,
			YEditor,
			YPublishButton
		},
		mixins: [PublishMixin],
		data() {
			return {
				vm: {
					contentSource: '[]'
				},
				editorControl: null,
				imgDisable: false,
				videoEnable: true,
				videoDisable: false,
				showBg: false
			}
		},
		methods: {
			// 返回问题详情页
			goBack() {
				var summaryData = this.$refs.nativeEditor.getSummaryData();
				if (this.forbidRouteLeave)
					return;
				if (summaryData.content.length > 0) {
					Dialog.confirm({
						message: this.$R('cancel-publish'),
					}, {
						okText: this.$R('confirm'),
						conceText: this.$R('cancel')
					})
					.then(() => {
						this.$router.back();
					})
					.catch(() => {
						return false;
					});
					return false;
				}
			},
			validate() {
				var summaryData = this.$refs.nativeEditor.getSummaryData();
				if (!summaryData.content && !summaryData.imgUrl && !summaryData.videoUrl) {
					Toast('请输入帖子正文');
					return false;
				}
				this.postData = {
					...summaryData,
					...this.vm,
					topicId: this.$route.params.topicId,
					moduleEnum: '0231'
				}
			},
			publish() {
				this.$http.post('/services/app/v1/coterie/topic/post/inside/single', this.postData).then(response => {
					if (response.data.code === "200") {
						Toast(this.$R('publish-success'));
						this.publishSuccess('/coterie/' + this.$route.params.coterieId + '/topic/home/' + this.$route.params.topicId);
					} else {
						this.publishError(response.data.msg)
					}
				}).catch((msg) => {
					this.publishError(msg)
				})
			},
			handleResize() {
				let initHeight = this.initHeight;
				if (window.innerHeight < initHeight) {
					this.showBg = true;
				} else {
					this.showBg = false;
				}
			},

			// handleInputListening(isAdd) {
			// 	this.editorControl[`${isAdd ? 'add' : 'remove'}EventListener`]('input', this.updateHeight);
			// },

			// updateHeight(e) {
			// 	const element = e.target;
			// 	if (parseInt(element.style.height) >= 240) return false;
			// 	element.style.height = '';

			// 	if (!element.value) {
			// 		return;
			// 	}

			// 	this.$nextTick(() => {
			// 		const inputHeight = element.scrollHeight;
			// 		element.style.height = inputHeight + "px";
			// 	});
			// },
		},

		mounted() {
			// this.editorControl = this.$refs['nativeEditor'].$el.getElementsByTagName('textarea')[0];
			// this.handleInputListening(true);
			this.$nextTick( () => {
				if (this.$yryz.isIOS()) return;
				// 安卓上键盘弹起收起 触发页面重绘
				this.initHeight = window.innerHeight;		
				window.addEventListener('resize', this.handleResize)
			})
		},
		destroyed() {
			window.removeEventListener("resize", this.handleResize);
		},
		watch: {
			'vm.contentSource': function (newVal) {
				let summaryData = this.$refs.nativeEditor.getSummaryData();
				console.log(JSON.stringify(summaryData))
				if (summaryData.imgUrl) {
					this.videoDisable = true
				} else {
					this.videoDisable = false
				}
				if (summaryData.videoUrl) {
					this.videoDisable = true
					this.imgDisable = true
				} else {
					this.imgDisable = false
				}
			}
		},
		// beforeDestroy() {
		// 	this.handleInputListening(false);
		// }
	}
</script>

<style type="text/css">
.join-content_editor{
	position: relative;
}

	.topic_join_page {
		/* height: 100vh;

		&,
		& .join-content_editor,
		& .content_editor {
			display: flex;
			flex-direction: column;
		}
		& .join-content_editor,
		& .content_editor {
			flex: 1;
		}
		& .content_editor-view {
			padding-bottom: 1.3rem;
		}
		& .y-input-wrap {
			padding-bottom: .2rem;
			border-bottom: 1px solid #f4f4f4;
		}
		& .content_editor-tool {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 2;
			background: #fff;
		} */

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
					z-index: 2;
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