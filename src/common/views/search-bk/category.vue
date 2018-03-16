<template>
	<div class="search-cate-wrap">
		<div class="search-all body--white">
			<y-nav>
				<span slot="nav-center">
					<y-nav-search v-model="searchKeyword" :showSearch="true" icon="icon"></y-nav-search>
				</span>
				<span slot="nav-right">
					<y-button type="text" @click.native="handlerSearch" :disabled="!searchKeyword">搜索</y-button>
				</span>
			</y-nav>
			<div class="showBg" v-if="searchPlaceholder">
			</div>
		</div>
	</div>
</template>
<script>
import Nav from '@/components/nav/nav';
import YNavSearch from '@/components/nav/nav-search';
import YButton from '@/components/button';
export default {
	components: {
		[Nav.name]: Nav,
		YNavSearch,
		YButton
	},
	data() {
		return {
			searchKeyword: '',
			searchPlaceholder: '',
		}
	},
	created() {
		this.cateType = this.$route.query.label;
		this.searchPlaceholder = '搜索' + this.cateType;
	},
	methods: {
		handlerSearch() {
			if (!this.searchKeyword) return false;
			this.$router.push('/search/result?keyword=' + this.searchKeyword + '&type=' + this.$route.query.type);
		}
	}
}
</script>
<style>
.search-cate-wrap {
	& .showBg {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background: #ccc;
		bottom: 0;
	}
}
</style>
