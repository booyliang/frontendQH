<template>
	<div >
		<y-nav  :title="title"  :menuData="menuData"></y-nav>
		<!--话题详情-->
		<div >
			<y-publish-detail :data="data"></y-publish-detail>
			<y-hot :hots="hots" :data="data" v-if="configData.likeFlag !== 0 || configData.rewardFlag !== 0">
				<div slot="foot">
					<y-ad :type="1" keyword="圈子内容"></y-ad>
				</div>
			</y-hot>
			<div class="ad_container" v-else>
				<y-ad :type="1" keyword="圈子内容"></y-ad>
			</div>
		</div>
		<!--评论-->
		<y-comment :data="data" v-if="configData.commentFlag === 1"></y-comment>
	</div>
</template>
<script>

	import YPublishDetail from './components/publish-detail';
	import YComment from '@/components/comment/comment';
	import YHot from '@/components/hot';
	import Ad from '@/components/ad';
	export default {
		components: {
			YPublishDetail,
			YHot,
			YComment,
			[Ad.name]: Ad
		},
		data() {
			return {
				title: '详情',
				menuData: [
					'index',
					'copy-url',
					'report'
				],
				data: {},
				hots: [],
				configData: {}
			}
		},
		async created() {
			
			let res = await this.$http.get(`/services/app/v1/release/info/detail/${this.$route.params.id}`);
			if (res.data.code === '200') {
				this.data = res.data.data;
				if (this.data.functionType === 1) {
					this.data.anonymity = true;
				}
				this.configData = res.data.data.classifyObj;
				this.setTemplateConfig(this.configData);
			};
		},
		methods: {
			setTemplateConfig(config) {
				this.data.moodFlag = config.moodFlag;
				if (config.likeFlag === 1 && config.rewardFlag === 1) {
					this.hots = ['like', 'forward'];
				} else if (config.likeFlag === 0 && config.rewardFlag === 1) {
					this.hots = ['forward'];
				} else if (config.likeFlag === 1 && config.rewardFlag === 0) {
					this.hots = ['like'];
				}
			}
		}
	}
</script>
<style>
	@import "#/css/var.css";
	.ad_container{
		padding: .1rem .3rem .3rem;
		background-color: #fff;
		margin-bottom: .2rem;
		position: relative;
		&:after{
			content: '';
			position: absolute;
			top: 0;
			left: .14rem;
			right: .14rem;
		}
	}
</style>