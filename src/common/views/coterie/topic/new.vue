<template>
	<div class="topic_new">
		<y-nav :title="$R('topic-new')" :leftText="$R('cancel')" :beforeBack="goBack" :showLeftArrow="false">
			<span slot="nav-right">
				<y-publish-button>{{$R('publish')}}</y-publish-button>
			</span>
		</y-nav>
		<div class="topic_new--input">
			 <y-input class="topic_new-title" :maxlength="10" :minlength="1" :placeholder="$R('add-title')" v-model="title"></y-input>
			 <y-editor class="topic_new-content" v-model="vm.contentSource" :text-max-length="100" :img-max-length="1" :placeholder="$R('add-content')" ref="nativeEditor"></y-editor>
		</div>
	</div>
</template>
<script>
	import {YNav} from '@/components/nav'
	import {YPublishButton, PublishMixin} from '@/components/content-publish'
	import YInput from '@/components/input'
	import YEditor from '@/components/content-editor'
	import Dialog from '@/components/dialog'
	import Toast from '@/components/toast'
	export default{
		components: {
			YNav,
			YPublishButton,
			YInput,      
			YEditor
		},
		mixins: [PublishMixin],
		data() {
			return {
				title: '',
				vm: {
					contentSource: '',
				},
				postData: ''
			}
		},
		methods: {
			goBack() {
				var summaryData = this.$refs.nativeEditor.getSummaryData();
				if (summaryData.content.length > 0 || this.title) {
					Dialog.confirm({
						message: this.$R('cancel-publish'),
					}, {
						okText: this.$R('confirm'),
						cancleText: this.$R('cancel')
					}).then(() => {
						this.$router.back();
					}).catch(() => {
						return false;
					})
					return false;
				}
			},
			validate() {
				var summaryData = this.$refs.nativeEditor.getSummaryData();
				if (!this.title) {
					Toast("请输入标题");
					return false;
				}
				if (!summaryData.content) {
					Toast("内容不能为空");
					return false;
				}
				if (summaryData.content.length < 10) {
					Toast("最少需要10个字的详细描述");
					return false;
				}
//				if (!summaryData.imgUrl) {
//					Toast("请添加图片");
//					return false;
//				}
				this.postData = {
					...summaryData,
					title: this.title,
					moduleEnum: '0230',
					contentSource: this.vm.contentSource
				}
			},
			publish() {
				this.$http.post('/services/app/v1/coterie/topic/single', this.postData).then(response => {
					let data = response.data;
					if (data.code === "200") {
						Toast('发布成功！');
						// this.publishSuccess(`/coterie/${this.$route.params.coterieId}/topic`);
						this.publishSuccess();
						window.sessionStorage.setItem('tabId', 'topic');
						this.$router.back();
					} else {
						this.publishError(data.msg);
					}
				})
			}
		}
	}
</script>
<style>
	.topic_new {
		display: flex;
		flex-direction: column;
		min-height: 100vh;

		& .topic_new--input {
          display: flex;
		  flex-direction: column;
		  flex: 1;
		
		  & .topic_new-content ,& .content_editor-view {
            display: flex;
			flex-direction: column;
			background: #fff;
			flex: 1;
		  }
		}
		& .topic_new-title {
			margin-top: .3rem;
		}
		& .topic_new-content {
			margin-top: .2rem;	
		}
	}
</style>