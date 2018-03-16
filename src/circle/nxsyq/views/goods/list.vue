<template>
	<div class="goods_list">
		<y-nav :title="$R('goods-all')" :menuData="['index']"></y-nav>
		<div class="goods-panel">
			<y-load-more-remote :request="request" @loaded="handleLoaded">
				<y-list>
					<router-link v-for="(item,index) of dataList" :key="index" class="panel" :to="`/goods/home/${item.id}`">
						<img :src="item.imgThumbnailUrl" alt="">
						<p>{{item.title}}</p>
					</router-link>
				</y-list>
			</y-load-more-remote>
		</div>
	</div>
</template>
<script>
import {YNav} from '@/components/nav'
import YLoadMoreRemote from '@/components/load-more-remote'
import YList from '@/components/list'
export default{
	components: {
		YNav,
		YLoadMoreRemote,
		YList
	},
	data() {
		return {
			request: {
				url: '/services/app/v1/subject/list',
				params: {
					pageSize: 10,
					orderBy: 'hot'
				}
			},
			dataList: []
		};
	},
	methods: {
		handleLoaded(list, res) {
			this.dataList.push(...list);
		}
	}
}
</script>