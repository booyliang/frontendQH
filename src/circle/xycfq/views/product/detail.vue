<template>
	<div>
		<y-nav :title="title" :menu-data="['index', 'copy-url', 'report']"></y-nav>
		<div class="product_summary">
			<y-slider class="product_images">
				<div v-for="(image, index) of images" :key="index" class="image--responsive">
					<img :src="image" alt="">
				</div>
			</y-slider>
			<div class="product_base">
				<h1 class="product_name" v-text="data.goodsName"></h1>
				<div class="product_meta">
					<div class="product_meta-item">
						<span class="product_meta-key">代理商价格：</span>
						<span class="product_meta-value"><strong class="product_price">￥<span class="product_price-number">{{data.goodsPrice / 100}}</span>/{{data.unitFlag}}</strong></span>
					</div>
					<div class="product_meta-item product_meta-item--fonts">
						<span class="product_meta-key">市场统一零售价：</span><span class="product_meta-value">￥{{data.marketPrice / 100}}/{{data.unitFlag}}</span>
					</div>
					<div class="product_meta-item product_meta-minor product_meta-item--fonts">
						<span class="product_meta-key">规格：</span><span class="product_meta-value">{{data.specifications}}</span>
					</div>
				</div>
			</div>
		</div>
		<y-panel title="商品详情" colorful>
			<y-content-source :content-source="data.contentSource"></y-content-source>
		</y-panel>
	</div>
</template>

<script type="text/javascript">
	import ContentSource from '@/components/content-source';

	export default {
		components: {
			[ContentSource.name]: ContentSource
		},

		data() {
			return {
				title: this.$route.meta.title,
				data: {
					goodsPrice: 0
				}
			};
		},

		computed: {
			images() {
				return this.data.productImg ? this.data.productImg.split(',') : [];
			}
		},

		methods: {
			async initData() {
				this.data = (await this.$http({
					url: `/services/app/v1/goods/getById/${this.$route.params.id}`
				})).data.data;
			},

			changeTitle() {
				this.title = this.data.goodsName;
			}
		},

		async created() {
			await this.initData();
			this.changeTitle();
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.product_summary {
		@apply --margin-bottom;
		background: white;
	}
	.product_images {
		& .swiper-slide {
			padding-bottom: 56.3%;
		}
	}
	.product_base {
		@apply --layout;
		padding-top: var(--layout-space);
		padding-bottom: var(--layout-space);
	}
	.product_name {
		font-size: 20px;
	}
	.product_meta {
		line-height: 1.6;
	}
	.product_meta-value {
		color: var(--text-assist-color);
	}
	.product_price {
		color: #ed652b;
	}
	.product_price-number {
		font-size: 1.8em;
	}
	.product_meta-item--fonts {
		font-size: 14px;
	}
</style>