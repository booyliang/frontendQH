<template>
	<div class="question_new">
		<!--顶部导航-->
		<y-nav  title="提问" :beforeBack="goBack" leftText="取消" :showLeftArrow="false" >
			<span slot="nav-right">
				<y-publish-button>发布</y-publish-button>
			</span>
		</y-nav>
		<!--顶部导航E-->
		<!--标题输入框-->
		<y-input v-model="questionTitle" :maxlength="30" placeholder="输入问题..."></y-input>
		<!--标题输入框E-->
		<!--内容输入框-->
		<y-editor v-model="questionVm.contentSource" :text-max-length="200" :img-max-length="20" placeholder="添加问题的补充说明..." ref = "nativeEditor"></y-editor>
		<!--内容输入框E-->
	</div>
</template>
<script>
	import YInput from '@/components/input'
	import YEditor from '@/components/content-editor'
	import YButton from '@/components/button'
	import Dialog from '@/components/dialog'
	import YNav from '@/components/nav/nav'
	import {YPublishButton, PublishMixin} from '@/components/content-publish'
	export default {
		components: {
			YInput, YEditor, YButton, YNav, YPublishButton
		},
		data() {
			return {
				questionTitle: '',
				questionVm: {
					contentSource: '[{"text": ""}]'
				},
				targetId: '',
			}
		},
		mixins: [PublishMixin],
		methods: {
			validate() {
				var summaryData = this.$refs.nativeEditor.getSummaryData();
				if (this.questionTitle.length === 0) {
					this.$toast("请输入标题 ");
					return false;
				}
				if ( this.questionTitle.length < 4) {
					this.$toast("标题不能少于4个字");
					return false;
				}
				if (summaryData.content.length === 0) {
					this.$toast("请输入正文");
					return false;
				}
				if (summaryData.content.length < 4) {
					this.$toast("不能少于4个字");
					return false;
				}
				this.postData = {
					...this.questionVm,
					...summaryData,
					moduleEnum: this.targetId ? "0013" : "0011",
					title: this.questionTitle,
					targetId: this.targetId
				};
			},
			// 发布问题
			publish() {
				this.$http.post('/services/app/v1/question/single', this.postData).then(response => {
					let data = response.data;
					if (data.code === '200') {
						this.$toast('发布问题成功');
						this.publishSuccess();
						this.$router.back();
					} else {
						this.publishError(data.msg);
					}
				}).catch(error => {
					this.publishError(JSON.stringify(error));
				})
			},
			// 点击取消
			goBack() {
				if (this.questionVm.contentSource.length > 2) {
					Dialog.confirm({
						title: '取消发布',
						message: '是否确认放弃编辑？',
					}, {
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
		},
		mounted() {
			let targetId = this.$route.params.targetId;
			this.targetId =  parseInt(targetId) !== 0 ? targetId : '';
		}
	}
</script>
<style>
@import '#/css/var.css';
.question_new{
	display: flex;
	flex-direction: column;
	min-height: 100vh;

	& .y-input {
		margin: 0.2rem 0;
	}
	
	& .content_editor {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		& .y-textarea {
			padding-bottom: 0.1rem;
			@apply --border-bottom;
		}
	}
}
</style>