<template>
	<div class="product-list">
		<y-tips>
			提示：您可用的赊销额度为<span>{{ infoData.availableQuota | price }}</span>元
		</y-tips>
		<y-load-more :state="listParams.loadMoreState" @can-load="loadData">
			<div class="list-main">
				<y-product-item @select="handleProductSelect" :key="item.id" :data="item" v-for="(item, index) in productList">
				</y-product-item>
			</div>
		</y-load-more>
		<y-total-tool :button-disabled="!totalPrice || buttonDisabeld" @click-button="toPreviewOrder" button-text="确认" :price="totalPrice"></y-total-tool>
	</div>
</template>
<script>
	import YLoadMore from '@/components/load-more'
	import YTips from '../../components/tips'
	import YProductItem from '../../components/product-item'
	import YTotalTool from '../../components/total-tool'
	export default {
		components: {
			YLoadMore,
			YTips,
			YProductItem,
			YTotalTool
		},
		data() {
			return {
				productList: [],
				selectedProducts: [],
				listParams: {
					page: 1,
					pageSize: 10,
					loadMoreState: 'prepared'
				},
				// 用户类型相应数据
				infoData: {}
			}
		},
		computed: {
			totalPrice() {
				let total = 0;
				if (this.selectedProducts.length === 0) return total;
				this.selectedProducts.forEach(item => {
					total += item.goodsPrice * item.quantity;
				})
				return total;
			},
			buttonDisabeld() {
				let minValid = this.totalPrice >= this.infoData.minCreditAmount;
				let maxValid = this.totalPrice <= this.infoData.availableQuota;
				if (!minValid || !maxValid || this.totalPrice > this.infoData.maxCreditAmount) {
					return true;
				} else {
					return false;
				}
			}
		},
		methods: {
			handleProductSelect(status, data) {
				if (status) {
					this.selectedProducts.push(data);
				} else {
					this.selectedProducts.forEach((item, index) => {
						if (data.id === item.id) {
							this.selectedProducts.splice(index, 1);
						}
					})
				}
			},
			// 获取商品列表数据
			loadData() {
				if (this.listParams.loadMoreState === 'loading') {
					return;
				}
				this.listParams.loadMoreState = 'loading';
				this.$http.get(`/services/app/v1/goods/getGoodsByAssort/${this.listParams.page}/${this.listParams.pageSize}?assortId=${this.$route.params.userType}`).then(response => {
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
			},
			toPreviewOrder() {
				let items = [];
				let totalAmount = 0;
				this.selectedProducts.forEach(item => {
					let subtotal = item.goodsPrice * item.quantity;
					items.push({
						classifyId: this.$route.params.userType,
						productId: item.id,
						productName: item.goodsName,
						firstImg: item.firstImg,
						productImg: item.firstImg,
						quantity: item.quantity,
						price: item.goodsPrice,
						marketPrice: item.marketPrice,
						unitFlag: item.unitFlag,
						specifications: item.specifications,
						subtotal: subtotal,
					});
					totalAmount += subtotal;
				});
				this.$localStore.set('previewOrder', {
					items,
					totalAmount,
					address: {}
				});
				this.$router.replace({name: 'previewOrder', params: { ...this.$route.params }});
			}
		},
		async mounted() {
			let response = await this.$http.get(`/services/app/v1/assortment/getAssortmentsById?id=${this.$route.params.userType}`);
			let resData = response.data;
			if (resData.code === '200') {
				this.infoData = resData.data;
				let quotaResponse = await this.$http.get('/services/app/v1/flowInfo/quotainfo');
				let quotaResData = quotaResponse.data;
				this.infoData = Object.assign({}, this.infoData, quotaResData.data);
				this.loadData();
			} else {
				this.$toast(resData.msg);
			}
		}
	}
</script>
<style>
	.product-list {
		& .product-item:not(:first-child) {
			margin-top: .2rem;
		}

		& .product-item + .product-item {
			border-top: 0;
		}
	}
</style>
