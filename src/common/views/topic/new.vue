<template>
	<div class="topic_new">
		<y-nav :title="$R('topic-new')" :leftText="$R('cancel')" :beforeBack="goBack" :showLeftArrow="false">
			<span slot="nav-right">
				<y-publish-button>{{$R('publish')}}</y-publish-button>
			</span>
		</y-nav>
		<div class="topic_new--input">
			 <y-input class="topic_new-title" :maxlength="20" :minlength="4" :placeholder="$R('new-title')" v-model="title"></y-input>
			 <y-editor class="topic_new-content" v-model="vm.contentResource" :text-max-length="100" :img-max-length="1" :placeholder="$R('new-content')" ref="nativeEditor"></y-editor>
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
					contentResource: '[]',
				},
				postData: ''
			}
		},
		computed: {
			devType() {  // 机型
				let devType = this.$env.devType;
				if (devType === 0) {
					return 'Andriod';
				} else if (devType === 1) {
					return 'iOS ';
				} else {
					return 'PC';
				}
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
				if (this.title.length < 4) {
					Toast("标题太短，不少于4字");
					return false;
				}
				if (!summaryData.content) {
					Toast("内容不能为空");
					return false;
				}
				if (summaryData.content.length < 5) {
					Toast("介绍太少啦，不少于5字");
					return false;
				}
				if (!summaryData.imgUrl) {
					Toast("请添加图片");
					return false;
				}
				this.postData = {
					...summaryData,
					title: this.title,
					moduleEnum: '0041'
				}
			},
			publish() {
				this.$http.post('/services/app/v1/topic/single', this.postData).then(response => {
					let data = response.data;
					if (data.code === "200") {
						Toast('发布成功！');
						// 埋点
						window.zhuge.track('参与话题', {
							'用户id': this.$env.custId, // 用户id
							'机型': this.devType, // 设备类型 Andriod ios
							'圈子名称': this.$circle.circleName, // 圈子名称
						}, function () {
							// console.log('track succeed')	
						});
						this.publishSuccess('/topic/index')
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