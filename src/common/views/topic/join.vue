<template>
	<div class="topic_join_page">
		<y-nav :transparent=false :title="$R('topic-join-title')" :showLeftArrow=false :leftText="$R('cancel')" :beforeBack="goBack">
			<span slot="nav-right">
				<y-publish-button>{{$R('publish')}}</y-publish-button>
			</span>
		</y-nav>
		<div class="join-content_editor">
			<y-editor v-model="vm.contentSource" :text-max-length="10000" :placeholder="$R('topic-hint')" :imgMaxLength="20" :imageEnable=true :videoEnable=true ref="nativeEditor">
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
				editorControl: null
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
				if (summaryData.content.length < 4) {
					Toast(this.$R('topic-content', 4));
					return false;
				}
				this.postData = {
					...summaryData,
					...this.vm,
					topicId: this.$route.params.id,
					moduleEnum: '0042',
				}
			},
			publish() {
				this.$http.post('/services/app/v1/post/single', this.postData).then(response => {
					if (response.data.code === "200") {
						Toast(this.$R('publish-success'));
						this.publishSuccess('/topic/home/' + this.$route.params.id);
					} else {
						this.publishError(response.data.msg)
					}
				}).catch((msg) => {
					this.publishError(msg)
				})
			},

			handleInputListening(isAdd) {
				this.editorControl[`${isAdd ? 'add' : 'remove'}EventListener`]('input', this.updateHeight);
			},

			updateHeight(e) {
				const element = e.target;
				if (parseInt(element.style.height) >= 240) return false;
				element.style.height = '';

				if (!element.value) {
					return;
				}

				this.$nextTick(() => {
					const inputHeight = element.scrollHeight;
					element.style.height = inputHeight + "px";
				});
			},
		},

		mounted() {
			this.editorControl = this.$refs['nativeEditor'].$el.getElementsByTagName('textarea')[0];
			this.handleInputListening(true);
		},

		beforeDestroy() {
			this.handleInputListening(false);
		}
	}
</script>

<style type="text/css">
.join-content_editor{
	position: relative;
}

	.topic_join_page {
		height: 100vh;

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
			/* max-height: 100%; */
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
		}
	}
</style>