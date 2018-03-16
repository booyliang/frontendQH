<template>
	<div class="answer_new">
		<!--顶部导航-->
		<y-nav title="写回答" :beforeBack="goBack" leftText="取消" :showLeftArrow="false">
			<span slot="nav-right">
				<y-publish-button>发布</y-publish-button>
			</span>
		</y-nav>
		<!--顶部导航E-->
		<!--内容输入框-->
		<y-editor v-model="answerVm.contentSource" :text-max-length="10000" :img-max-length="20" placeholder="写回答..." ref="nativeEditor"></y-editor>
		<!--内容输入框E-->
	</div>
</template>
<script>
import YEditor from '@/components/content-editor'
import Toast from '@/components/toast'
import YButton from '@/components/button'
import Dialog from '@/components/dialog'
import YNav from '@/components/nav/nav'
import {YPublishButton, PublishMixin} from '@/components/content-publish'
export default {
	components: {
		YEditor, YButton, YNav, YPublishButton
	},
	data() {
		return {
			answerVm: {
				contentSource: '[]'
			}
		}
	},
	mixins: [PublishMixin],
	methods: {
		validate() {
			var summaryData = this.$refs.nativeEditor.getSummaryData();
			if (!summaryData.content.length) {
				Toast('请输入正文');
				return false
			}
			if (summaryData.content.length < 10) {
				Toast('不能小于10个字');
				return false
			}
			this.postData = {
				...this.answerVm,
				...summaryData,
				moduleEnum: parseInt(this.$route.params.type) === 2 ? "0012" : '0014',
				questionId: this.$route.params.questionId
			};
		},
		// 发布编辑内容
		publish() {			
			this.$http.post('/services/app/v1/answer/single', this.postData).then(response => {
				let resData = response.data;
				if (resData.code === '200') {
					this.$toast('回答发布成功!');
					this.publishSuccess();
					this.$router.back()
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
				Dialog.confirm(
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
.answer_new {
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
}
</style>
