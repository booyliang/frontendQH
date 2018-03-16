<template>
	<div class="no-data not-found">
		<y-nav :title="title"></y-nav>
		<div class="not-found-wrap">
			<div class="not-img not-data-img"></div>
			<p>暂无数据</p>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'y-no-data',
		data() {
			return {
				title: ''
			}
		},
		mounted() {
			this.title = this.$route.meta.title;
		}
	}
</script>

<style>
.not-found.no-data .not-found-wrap .not-data-img {
	width: 2.45rem;
	height: 2.4rem;
}
/*no data page*/
.not-data-img{	background-image: url(../assets/no-data@2x.png); }
</style>
