<template>
	<y-load-more-remote :request="request" v-bind="{maxPage, endTip}" @loaded="handleLoaded" class="sale_list">
		<y-list>
			<y-item v-for='(item, index) of dataList' :key='index'  @click = "toRourter(item.productUrl)">
				<div class="sale_item">
					<div class="sale_item-img">
						<img :src="item.imgUrl" alt="">
						<span class="sale_item-discount" v-text="`${item.discount}`+'折'"></span>
					</div>
					<div class="sale_item-title" v-text = "item.name"></div>
					<div class="sale_item-price">
						<div class="sale_item-price--current"><label>￥</label><span v-text="`${item.currentPrice}`"></span>{{$R("from")}}</div>
						<div class="sale_item-price--original">￥<del v-text ='item.originalPrice' ></del></div>
						<y-button tag="span" class="sale_item--buy">{{$R("buy-now")}}</y-button>
					</div>
					<div class="sale_item-remark" v-text="item.remark"></div>
				</div>
			</y-item>
		</y-list>
	</y-load-more-remote>
</template>
<script>
import YButton from '@/components/button';
import LoadMoreRemote from '@/components/load-more-remote';
import List from '@/components/list';
import Item from '@/components/item';
export default {

	name: 'y-sale-list',
	components: {
		YButton,
		[LoadMoreRemote.name]: LoadMoreRemote,
		[List.name]: List,
		[Item.name]: Item
	},
	props: {
		pageSize: {
			type: Number,
			default: 10
		},
		maxPage: {
			type: Number,
			default: Infinity
		},
		endTip: {
			type: Boolean,
			default: true
		},
		placeId: {
			type: Number
		}

	},
	data() {
		return {
			dataList: [],
			request: {
				methods: 'get',
				url: "/services/app/v1/product/list",
				params: {
					pageSize: this.pageSize,
					placeId: this.placeId
				}
			}
		}
	},
	methods: {
		handleLoaded(list, res) {
			this.dataList.push(...list);
			
		},
		toRourter(url) { // 跳转到第三方的产品详情页
			this.$yryz.openUrl({url: url});
		}


	}
}
</script>

<style>
	@import "#/css/var.css";

	.sale_list  .item {
		margin-bottom: .2rem;
		& .item-wrap{
			border:none;
			padding-bottom: .2rem;
			& .sale_item{
				width: 100%;
				margin-bottom: .2rem;
				& .sale_item-img{
					position: relative;
					height: 3.88rem;
					& img{
						width: 100%;
						height: 100%;
					}
					& .sale_item-discount {
						position: absolute;
						top: .2rem;
						left: 0;
						width: 1.6rem;
						height: .5rem;
						line-height: .5rem;
						color: #fff;
						text-align: center;
						font-size: 15px;
						background: url(../../assets/tag@2x.png) no-repeat;
			            background-size: contain;
			        }    

				}
				& .sale_item-title{
					font-size: 18px;
					color: var(--text-primary-color);
					display: -webkit-box;
					-webkit-box-orient: vertical;
					overflow: hidden;
					white-space: normal;
					-webkit-line-clamp: 2;
					margin-top: 0.2rem;
				}
				& .sale_item-price{
					position: relative;
					padding: .1rem 0;
					& .sale_item-price--current{
						color: var(--text-assist-color);
						font-size: 12px;
						& label {
							color: #ff5a00;
							font-size: var(--default-font-size);
						}
						& span{
							color: #ff5a00;
							font-size: 17px;
							margin-right: .1rem
						}
					}
					& .sale_item-price--original{
						color: #999;
						font-size: 12px;
						margin-top: -3px;
						
					}
					& .sale_item--buy{
						position: absolute;
						top: .25rem;
						right: 0;
						font-size: 16px;
						width: 2rem;
						height: .6rem;
						line-height: .58rem;
                        padding: 0; 
					}
				}
				& .sale_item-remark{
					font-size: 13px;
					color: var(--text-tips-color);
				}
			}
		}
	}

</style>

