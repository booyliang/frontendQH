<template>
	<div class="goods">
		<y-nav :title="$R('goods')" :showSearch="true" :menuData="['index']">
		</y-nav>
		<div class="goods-head">
			<y-item to="/goods/list">
				<span slot="head"><span class="iconfont icon-fire"></span>{{$R('goods-hot')}}</span>
				<span slot="foot">{{$R('more')}}</span>
			</y-item>
		</div>
		<div class="goods-panel">
		    <div class="goods-panel_list">
			<router-link v-for="(item,index) of hotList" :key="index" class="panel" :to="`/goods/home/${item.id}`">
				<img :src="item.imgThumbnailUrl" alt="">
				<p>{{item.title}}</p>
			</router-link>
			</div>
		</div>
		<div class="goods-content">
			<y-item>
				<span slot="head"><span class="iconfont icon-new"></span>{{$R('goods-new')}}</span>
			</y-item>
			<y-flow-list :request="flowRequest"></y-flow-list>
		</div>
	</div>
</template>
<script>
import { YNav } from '@/components/nav'
import YItem from '@/components/item'
import YFlowList from '@/components/flow-list'
export default {
	components: {
		YNav,
		YItem
	},
	data() {
		return {
			hotList: []
		}
	},
	created() {
		this.$http.get('/services/app/v1/subject/list/1/4?orderBy=hot').then(response => {
			if (response.data.code === '200') {
				this.hotList = response.data.data.entities;
			}
		})
	},
	computed: {
		flowRequest() {
			return {
				url: '/services/app/v1/subject-post/list',
				params: {
					pageSize: 10,
					orderBy: 'time'
				}
			};
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.goods {
	& .item-head {
		font-size: 16px;
		color: var(--text-primary-color);
		& .iconfont {
			color: #ff6e3c;
			margin-right: 0.14rem;
			font-size: 22px;
			position: relative;
			top: 3px;
		}
		& .icon-new {
			font-size: 26px;
			position: relative;
			top: 5px;
		}
	}

	& .item-foot {
		color: var(--theme-color);
		font-size: 13px;
		& .iconfont {
			font-size: 10px;
			margin-left: 0.08rem;
			color: var(--theme-color);
		}
	}
}

.goods-panel{
	margin: 0.2rem;
	font-size: 0;

	& .list {
		overflow: hidden;
	}

	& .panel{
		display: inline-block;
		float: left;
		margin: 0.1rem;
		width: 3.35rem;
		text-align: center;
		& img{
			height: 2.8rem;
			width: 3.35rem;
		}
		& p{
			font-size: var(--default-font-size);
			color: var(--text-secondary-color);
			background: #fff;
			height: 1.06rem;
			display: flex;
			padding: 0.1rem 0.2rem;
			word-break: break-all;
			@apply --text-cut-multi-line;
			-webkit-line-clamp: 2;
		}
	}

	& .goods-panel_list {
		overflow: hidden;
		& .panel {
			background-color: #f8f8f8;
		}
       background-color: #f8f8f8;
	}
}

.goods-content > .item {
	@apply --border-bottom;
}
</style>