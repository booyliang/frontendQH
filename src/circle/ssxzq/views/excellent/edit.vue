<template>
	<div>
		<y-nav :transparent=false :showLeftArrow=false leftText="取消" :beforeBack="goBack">
			<span slot="nav-right">
				<y-publish-button>{{$R('publish')}}</y-publish-button>
			</span>
		</y-nav>
		<div class="join-content_editor">
			<y-editor v-model="vm.contentSource" :text-max-length="500" placeholder="我的印象..." :imgMaxLength="20" :imageEnable=true :videoEnable=true ref="nativeEditor">
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
				}
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
					Toast('请输入印象信息')
					return false;
				}
				this.postData = {
					...summaryData,
					...this.vm,
					schoolId: this.$route.params.id,
					moduleEnum: '10231'
				}
			},
			publish() {
				this.$http.post('/services/app/v1/school/post/single', this.postData).then(response => {
					if (response.data.code === "200") {
						Toast(this.$R('publish-success'));						
						this.publishSuccess('/excellent/school/' + this.$route.params.id);
					} else {
						this.publishError(response.data.msg)
					}
				}).catch((msg) => {
					this.publishError(msg)	
				})
			}
		}
	}
</script>

<style type="text/css">
.join-content_editor{
	position: relative;
}
</style>