<template>
	<div class="snack_detail">
		<div class="snack-body flow_detail">
			<y-nav :title="$R('detail')" :menuData="menuData"></y-nav>
			<h2 class="snack_detail-title" v-if="detailData.refName">{{ detailData.refName }}</h2>
			<div class="snack_detail-intro">{{detailData.breif}}</div>
			<y-content-source :content-source="detailData.contentSource"></y-content-source>
		</div>
		<y-hot :hots="['like']" :data="detailData">
			<div slot="foot">
				<y-ad :type="1" keyword="圈子内容"></y-ad>
			</div>
		</y-hot>
		<y-comment :data="detailData"></y-comment>
	</div>
</template>
<script>
	import {YNav} from '@/components/nav'
	import YHot from '@/components/hot'
	import YComment from '@/components/comment/comment'
	import YContentSource from '@/components/content-source'
	import YAd from '@/components/ad'
	export default {
		components: {
			YNav,
			YHot,
			YComment,
			YContentSource,
			YAd,
		},
		data() {
			return {
				menuData: [
					'report',
					'copy-url',
					'index',
				],
				detailData: {},
				subjectData: {}
			}
		},
		created() {
			this.$http.get(`/services/app/v1/refreshment/getById?id=${this.$route.params.id}`).then(res => {
				if (res.data.code === '200') {
					let resData = res.data.data;
					resData.content = resData.breif;
					resData.title = resData.refName;
					this.detailData = resData;
				}
			})
		}
	}
</script>
<style>
.snack_detail{
	& .snack-body{
		padding: 0.4rem 0.3rem;
		background: #fff;
	}
	& h2{
		font-size: 22px;
	}
	& .snack_detail-intro{
		margin: 0.2rem 0;
		font-size: 17px;
	}
	& .content_source{
		font-size: 17px;
	}
}
</style>