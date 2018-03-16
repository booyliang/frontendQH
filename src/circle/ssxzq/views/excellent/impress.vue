<template>
	<div class="impress">
		<y-nav title="详情" :menuData="['index', 'copy-url', 'report']"></y-nav>
		<y-flow-detail :data="impressData"></y-flow-detail>
		<y-hot :hots="['like', 'forward']" :data="impressData">
			<div slot="foot">
				<y-ad :type="1" keyword="圈子内容"></y-ad>
			</div>
		</y-hot>
		<y-comment :data="impressData"></y-comment>
	</div>
</template>

<script>
	import YFlowDetail from '@/components/flow-detail';
	import Comment from '@/components/comment/comment';
	import YHot from '@/components/hot';
	import Ad from '@/components/ad';
	export default {
		components: {
			YFlowDetail,
			YHot,
			[Ad.name]: Ad,
			[Comment.name]: Comment
		},
		data() {
			return {
				impressData: {}
			}
		},
		created() {
			this.$http.get("/services/app/v1/school/post/single/" + this.$route.params.id).then(res => {
				if (res.data.code === '200') {
					this.impressData = res.data.data
				}
			})
		}
	}
</script>

<style>
	@import '#/css/var.css';
</style>