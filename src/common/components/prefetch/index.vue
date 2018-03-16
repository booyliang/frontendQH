<template>
	<div style="display:none">
	<div class="index_head">
		<!-- 导航 S-->
	<span class="nav-left iconfont icon-arrow-left"></span>
		</y-nav>
		<!-- 栏目 S-->
		<div class="column-wrap" v-for="(columnPage ,index) in columnData" :key="index">
			<div class="column-item" v-for=" item in columnPage" :key="item.id">				
					<span class="column-icon" :style="{backgroundImage:`url(${item.columnIcon})`}">
						<i class="column-hot" v-if="item.recommend === 1"></i>
					</span>
				
			</div>
		</div>
	</div>
	</div>
</template>
<script>
export default {
	name: 'y-prefetch',
	// components: { YPrefetch },
	data() {
		return {
			pageData: []
		};
	},
	async created() {
		let defaultValue = [{columnPath: ''}, {columnPath: ''}, {columnPath: ''}, {columnPath: ''}, {columnPath: ''}];
		this.$cache.getData('pageData', '/services/app/v1/column/list', defaultValue)
	},

	computed: {
		columnData: function () {
			let newArry = [];
			for (let index = 0; index < this.pageData.length; index += 8) {
				newArry.push(this.pageData.slice(index, index + 8))
			}
			return newArry;
		}
	},
}
</script>