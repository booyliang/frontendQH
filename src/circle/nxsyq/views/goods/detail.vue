<template>
	<div class="goods_detail">
		<y-nav :title="$R('goods-detail')" :menuData="menuData"></y-nav>
		<div class="goods_detail-title">
			<span class="iconfont icon-subject"></span><span>{{subjectData.title}}</span>
		</div>
      	<y-flow-detail :data="detailData"></y-flow-detail>
		<y-hot :hots="['like', 'forward']" :data="detailData">
			<div slot="foot">
				<y-ad :type="1" keyword="圈子内容"></y-ad>
			</div>
		</y-hot>
		<y-comment :data="detailData"></y-comment>
	</div>
</template>
<script>
	import {YNav} from '@/components/nav'
	import YFlowDetail from '@/components/flow-detail'
	import YHot from '@/components/hot'
	import YComment from '@/components/comment/comment'
	import Ad from '@/components/ad';
	export default {
		components: {
			YNav,
			YFlowDetail,
			YHot,
			YComment,
			[Ad.name]: Ad
		},
		data() {
			return {
				menuData: [
					'index',
					'copy-url',
					'refresh',
					'report'
				],
				detailData: {},
				subjectData: {}
			}
		},
		created() {
			this.$http.get('/services/app/v1/subject-post/single/' + this.$route.params.id).then(response => {
				if (response.data.code === '200') {
					this.detailData = response.data.data;
					var topicId = this.detailData.topicId;
					return this.$http.get('/services/app/v1/subject/single/' + topicId)
				}
			}).then(response => {
				if (response.data.code === '200') {
					this.subjectData = response.data.data;
				}
			})
		}
	}
</script>
<style>
@import '#/css/var.css';

.goods_detail{
	& .goods_detail-title{
		padding: 0.46rem 0.28rem;
		background-color: #fff;
		@apply --border-bottom;
		& span{
			font-size: 22px;
			line-height: 28px;
			color: #000;

			&.iconfont{
				display: inline-block;
				margin-right: 0.24rem;
				font-size: 25px;
				text-align: center;
				line-height: 0.38rem;
				color: #fff;
				width: 0.82rem;
				height: 0.38rem;
				background: var(--theme-color);
				border-radius: 0.05rem;
				position: relative;

				&:after {
					content: '';
					display: inline-block;
					border-width: 0.1rem 0 0.15rem 0.2rem;
					border-color: transparent;
					border-left-color: var(--theme-color);
					border-style: solid;
					width: 0;
					height: 0;
					position: absolute;
					bottom: -0.09rem;
					right: -0.05rem;
					transform: rotate(40deg);
				}
			}

			&.icon-subject:before {
			   position: relative;
			   top: 1px;	
			}
		}
	}
}
</style>