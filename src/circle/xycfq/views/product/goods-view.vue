<template>
	<div class="goods-list">
		<y-load-more :state="listParams.loadMoreState" @can-load="loadData" :endTip="false">
			<div class="list-main">
				<header class="list-head"><h1 class="list-title">当前可赊销商品</h1></header>
				<y-product-item @click.native="toProductDetail(item)" :key="item.id" :data="item" :show-market-price="true" v-for="(item, index) in productList"></y-product-item>
			</div>
		</y-load-more>
	</div>
</template>
<script>
	import YLoadMore from '@/components/load-more'
	import YTips from '../../components/tips'
	import YProductItem from '../../components/product-item'
	export default {
		components: {
			YLoadMore,
			YTips,
			YProductItem,
		},
		data() {
			return {
				productList: [],
				listParams: {
					page: 1,
					pageSize: 10,
					loadMoreState: 'prepared'
				}
			}
		},
		methods: {
			toProductDetail(itemData) {
				this.$router.push({name: 'product-detail', params: {id: itemData.id}});
			},
			// 获取商品列表数据
			loadData() {
				if (this.listParams.loadMoreState === 'loading') {
					return;
				}
				this.listParams.loadMoreState = 'loading';
				this.$http.get(`/services/app/v1/goods/list/${this.listParams.page}/${this.listParams.pageSize}`).then(response => {
					let resData = response.data;
					if (resData.code === '200') {
						resData = resData.data;
						if (this.productList.length === 0) {
							this.productList = resData.entities;
						} else {
							resData.entities.forEach(item => {
								this.productList.push(item);
							})
						}
						this.listParams.page++;
						this.$nextTick(() => {
							this.listParams.loadMoreState = resData.entities.length === this.listParams.pageSize ? 'prepared' : 'end';
						});
					} else {
						this.listParams.loadMoreState = 'end';
						this.$toast(resData.msg);
					}
				}).catch(error => {
					this.listParams.loadMoreState = 'end';
					console.log(error);
				});
			}
		},
		async mounted() {
			this.loadData();
		}
	}
</script>
<style>
	.goods-list {
		& .product-radio {
			display: none;
		}
		& .list-head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: .2rem;
			padding: 0 0.3rem;
		    border-bottom: 1px solid #eee;
		    line-height: 44px;
		    background-color: #fff;
		    & .list-title{
		    	font-size: 16px;
		    	color: #315ac1;
		    }
		    & .list-title::before {
		        border-radius: 999px;
		        content: "";
		        display: inline-block;
		        width: 2px;
		        height: 1em;
		        vertical-align: -0.15em;
		        background: #315ac1;
		        margin-right: 0.5em;
		    }
		}
		& .product-item {
			padding: .4rem .3rem;
		}
		& .product-item + .product-item {
			border-top: 0;
			margin-top: .2rem;
		}
	}
</style>
