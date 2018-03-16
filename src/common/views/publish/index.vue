<template>
	<div>
		<y-nav :showSearch="true" :title="categoryName" :menuData="['index', 'refresh']"></y-nav>
		<y-list-style-a v-if="!itemStyle || itemStyle === '0'"></y-list-style-a>
		<y-list-style-b :data="itemList" v-else-if="itemStyle === '1'"></y-list-style-b>
	</div>
</template>
<script type="text/javascript">
	import YListStyleA from './list-style-a'
	import YListStyleB from './list-style-b'
	export default {
		components: {YListStyleA, YListStyleB},	
		name: 'publish-index',
		data() {
			return {
				itemStyle: '1', // 0 通用列表样式，1 大图列表样式
				classifyId: this.$route.params.classifyId,
				categoryName: '',
				request: {},
				itemList: []
			}
		},
		async created() {
			let res = await this.$http.get(`/services/app/v1/classify/categoryAndItems/${this.classifyId}`)
			let data = res.data.data;
			this.categoryName = data.category.categoryName;
			this.itemStyle = data.category.itemStyle;
			// this.itemStyle = 1;
			this.itemList = data.categoryItems;
		}
	}
</script>
<style>
</style>
