<template>
	<div class="index_page">
		<div class="index_head">
			<!-- 导航 S-->
			<y-nav :transparent="true" class="banner-index--height" :showSearch="true" :showMember="true">

			</y-nav>
			<!-- 栏目 S-->
			<y-slider v-if="showSlider">
				<div class="column-wrap" v-for="(columnPage ,index) in columnData" :key="index">
					<div class="column-item" v-for=" item in columnPage" :key="item.id">
						<y-link @click="track(item)" :url="item.columnPath" class="column-href">
							<!-- 当有className时，用className显示图标 -->
							<span class="column-icon" v-if="item.className" :class="item.className">
								<i class="column-hot" v-if="item.recommend === 1"></i>
							</span>
							<!-- 无className时，用返回的icon地址显示图标 -->
							<span class="column-icon" v-else :style="{backgroundImage:`url(${item.columnIcon})`}">
								<i class="column-hot" v-if="item.recommend === 1"></i>
							</span>
							<span class="column-text">{{item.columnName}}</span>
						</y-link>
					</div>
				</div>
			</y-slider>
		</div>
		<!-- 图文广告 S-->
		<y-ad :type="2" keyword="首页图文" :data-cache="true"></y-ad>
		<!-- 轮播广告 S-->
		<y-ad :type="1" keyword="首页轮播" :data-cache="true"></y-ad>
		<!-- 最新热门 S-->
		<section>
			<y-tab-bar v-model="tabId" :tabOption="menuData"></y-tab-bar>
			<y-tab-container v-model="tabId">
				<y-tab-container-item :id="$R('dynamic-recommend')">
					<y-dynamic-list good id="good-dynamic" :data-cache="true"></y-dynamic-list>
				</y-tab-container-item>
				<y-tab-container-item :id="$R('dynamic-all')">
					<y-dynamic-list :data-cache="true"></y-dynamic-list>
				</y-tab-container-item>
			</y-tab-container>
		</section>
		<y-ad :type="3" keyword="首页瀑布" at="#good-dynamic .dynamic_item:nth-child(6)"></y-ad>
		<router-link :to="`/user/${$env.userId}`" v-if="$env.userId" class="user_entry">
			<span class="iconfont icon-user"></span>
		</router-link>
	</div>
</template>
<script type="text/javascript">
import YAd from '@/components/ad';
import YDynamicList from '@/components/dynamic-list';
import YLink from '@/components/link';
import zhuge from '@/js/zhuge';

export default {
	components: {
		YAd, YDynamicList, YLink
	},
	data() {
		return {
			pageData: [],
			tabId: this.$R('dynamic-recommend'),
			menuData: [this.$R('dynamic-recommend'), this.$R('dynamic-all')],
			showSlider: true,
		}
	},
	async created() {
		// 栏目		
		
		this.$cache.getData('/services/app/v1/column/list', (res) => {
			this.pageData = res.data.data;
		}, () => {
			this.pageData = [{columnPath: ''}, {columnPath: ''}, {columnPath: ''}, {columnPath: ''}, {columnPath: ''}]
		})
	},
	watch: {
		pageData() {
			this.showSlider = false
			this.$nextTick(() => {
				this.showSlider = true
			})
		}

	},
	computed: {
		columnData: function () {
			let newArry = [];
			
			let columnPageSize = this.$route.meta.columnPageSize || 8;
			for (let index = 0; index < this.pageData.length; index += columnPageSize) {
				newArry.push(this.pageData.slice(index, index + columnPageSize))
			}
			return newArry;
		},
		devType() {  // 机型
			let devType = this.$env.devType;
			if (devType === 0) { 
				return 'Andriod';
			} else if ( devType === 1) {
				return 'iOS ';
			} else {
				return 'PC';
			}
		}
	},
	methods: {
		// 埋点
		track(item) {	
			window.zhuge.track(`[${this.$circle.circleName}]-入口`, {
				'用户id': this.$env.custId,  // 用户id
				'机型': this.devType,  // 机型
				'圈子名称': this.$circle.circleName, // 圈子名称
				'栏目名称': item.columnName // 栏目名称
			}, function () {			
				// console.log('track succeed', item.columnName)	
			});
		}
	}
}
</script>
<style>
	@import "#/css/var.css";
	
	.index_head {
		
		background-repeat: no-repeat;
		background-position: center top;
		background-size: contain;

		& .swiper-container {
			@apply --border-bottom;
			background: #fff;

			& .swiper-pagination-bullets .swiper-pagination-bullet {
				background: var(--text-column-color);
				margin-bottom: 0.2rem;

				&:only-child {
					display: none;
				}

				&.swiper-pagination-bullet-active {
					background: var(--text-assist-color);
				}
			}
		}
		.swiper-pagination {
			position: static;
		}

	}

	.banner-index--height {
		height: 2.58rem;
	}

	.column-wrap {
		padding-bottom: .3rem;
		display: flex;
		flex-wrap: wrap;

		& .column-item {
			flex: 0 0 25%;
		}

		& .column-href {
			padding: .12rem 0 .18rem;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		& .column-text {
			font-size: 14px;
			line-height: 1;
			height: 14px;
		}
		& .column-icon {
			width: .46rem;
			height: .46rem;
			margin-bottom: .2rem;
			background-repeat: no-repeat;
			background-position: center top;
			background-size: contain;
			position: relative;

			& .column-hot {
				display: inline-block;
				width: .36rem;
				height: .18rem;
				background: url(../../assets/hot@2x.png) no-repeat center;
				background-size: contain;
				position: absolute;
				top: .06rem;
				right: -.2rem;
			}
		}
	}
</style>
<style type="text/css">
	@import "#/css/var.css";

	.index_page {
		& .user_entry {
			@apply --circle;
			@apply --display-flex;
			position: fixed;
			right: 0.4rem;
			bottom: 0.4rem;
			justify-content: center;
			width: 1rem;
			height: 1rem;
			background: white;
			box-shadow: 0 0 0.1rem color(black alpha(0.1));

			& .iconfont {
				font-size: 0.55rem;
				color: #ccc;
			}
		}

		& .slide_ad {
			position: relative;

			&::after {
				@apply --bg-alpha;
				position: absolute;
				left: 0.1rem;
				bottom: 0.1rem;
				z-index: 1;
				color: white;
				border: none;
			}
		}
	}
	
</style>