<template>
	<div>
		<div class="publish_pic-list" v-show="data.length">
			<a v-for="item in data" class="publish_pic-item" @click="handleClick(item)">
				<img v-if="item.imgUrl" :src="item.imgUrl || '' | imageResize(3)" alt="">
				<p class="publish_item-label">{{ item.categoryName }}</p>
			</a>
		</div>
		<div class="load_more-tip">没有更多了</div>
	</div>
</template>
<script type="text/javascript">
import ImageResize from '@/filters/imageResize'
export default {
	name: 'publish-list-b',
	props: {
		data: Array
	},
	methods: {
		handleClick(item) {
			this.$router.push(`/publish/list/classify/${this.$route.params.classifyId}/${item.categoryName}/${item.id}`)
		}
	}
}
</script>
<style>
@import "#/css/var.css";
.publish_pic-list {
	padding: .3rem;
	background-color: #fff;
	& .publish_pic-item {
		@apply --box;
		position: relative;
		display: block;
		margin-bottom: .3rem;
		padding-top: 56.23%;
		background: #f0f0f0 url(../../assets/default-thumb@2x.png) center no-repeat;
		&:last-child {
			margin-bottom: 0;
		}
		& .publish_item-label {
			position: absolute;
			bottom: 0;
			left: 0;
			color: #fff;
			display: block;
			font-size: .36rem;
			line-height: 1;
			padding: .2rem .35rem;
			white-space: nowrap;
			overflow: hidden;
			background: -webkit-gradient(linear, 0 0, 0 bottom, from(transparent), to(rgba(0, 0, 0, 0.5)));
		}
		&>img {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
}
</style>
