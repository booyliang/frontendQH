<template>
	<div class="xycf_index">
		<div class="index_head">
			<y-nav :transparent="true" class="banner-index--height" :showSearch="false" :showMember="false"></y-nav>

			<!-- 栏目 S-->
			<div class="xycf_column">
				<div @click.stop="jumpUrl(item.columnPath)" v-for="item in columnData" :key="item.id" class="column-item">
					<span class="column-icon" :style="{backgroundImage:`url(${item.columnIcon})`}"></span>
					<span class="column--text">{{item.columnName}}</span>
				</div>
				<span class="view_guidence-btn" @click="goToGuidence"></span>
			</div>
		</div>

		<!-- 图文广告 S-->
		<y-ad :type="2" keyword="首页图文" :data-cache="true"></y-ad>
		<!-- 轮播广告 S-->
		<y-ad :type="1" keyword="首页轮播" :data-cache="true"></y-ad>
		<!-- 最新播报 S-->
		<div class="xycf_news">
			<h2 class="xycf_news-title icon-news">最新播报</h2>
			<y-load-more-remote :request="newsRequest" @loaded="handleNewsLoaded">
				<div>
					<div class="xycf_news-item" v-for="item in news" key="item.id">
						<y-card :src="item.headImg" :title="item.nickName" >
							<div slot="assist" class="xycf_news-item--addr">{{item.addr}}</div>
						</y-card>
						<p class="xycf_news-item--info">{{item.createDate | recentTime}}&nbsp;购买了&nbsp;<b class="xycf_news-item--num">{{item.count}}盒&nbsp;{{item.goodsName}}</b></p>
					</div>
				</div>
			</y-load-more-remote>
		</div>
		<a @click.stop="jumpUrl('/user')" v-if="$env.userId" class="user_entry"><span class="iconfont icon-user"></span></a>
		<!-- <a href="tel:4000777260" class="service_entry"><span class="icon"></span>客服</a> -->
	</div>
</template>
<script>
import YAd from '@/components/ad';
import YCard from '@/components/card';
import YLink from '@/components/link';
import LoadMoreRemote from '@/components/load-more-remote';

export default {
	components: {
		YAd, YCard, YLink,
		[LoadMoreRemote.name]: LoadMoreRemote
	},
	data() {
		return {
			columnData: [],
			news: [],
			newsRequest: {
				url: '/services/app/v1/information/list'
			}
		}
	},
	methods: {
		// async getNews() {
		// 	let res = await this.$http.get();
		// 	this.news = res.data.data.entities;
		// },
		goToGuidence() {
			let url = "https://opus.yryz.com/activity/xycf/help"
			this.$yryz.openUrl({url: url});
		},

		handleNewsLoaded(list) {
			this.news.push(...list);
		},
		jumpUrl(url) {
			let jumpUrl = `${window.location.protocol}//${window.location.host}/xycfq${url}`;
			if (this.$yryz.isNative()) {
				this.$yryz.jumpUrl({url: jumpUrl});
			} else {
				this.$router.push(url)
			}
		}
	},
	beforeDestroy() {
		clearInterval(this.interval);
	},
	async created() {
		// this.getNews();
//		this.interval = setInterval(this.getNews, 1000 * 60)

		// 栏目
		let res = await this.$http.get('/services/app/v1/column/list')
		this.columnData = res.data.data;
	}
}
</script>
<style>
	@import '#/css/var.css';

	.xycf_index {
		/*background: white;*/

		& .xycf_column {
			position: relative;
			padding: 0.5rem 0 0.4rem;
			/*margin: 0 0.2rem;*/
			background: #fff;
			border-radius: 0.1rem;
			/*box-shadow: 0 0 0.1rem 0.02rem #b5c9da;*/
			display: flex;
			justify-content: space-around;
			& .view_guidence-btn{
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0.24rem;
				margin: auto;
			}
		}
		/*& .view_guidence-btn{
			width: 2.6rem;
			height: .6rem;
			background: url('../assets/btn@2x.png') center no-repeat;
			background-size: cover;
		}*/
		& .column-item {
			display: inline-block;
			text-align: center;
			line-height: 1;
		}

		& .column-icon {
			width: 0.6rem;
			height: 0.6rem;
			display: block;
			margin: 0 auto 10px;
			background-size: contain;
			background-repeat: no-repeat;
			background-position: center top;
		}

		& .xycf_index .image_text_ad-item_title {
			font-size: 14px;
			color: var(--text-secondary-color);
		}

		& .xycf_news {
			background: #f8f8f8;
		}

		& .xycf_news-title {
			@apply --layout;
			height: 41px;
			line-height: 41px;
			background: var(--bg-color);
			background-size: 0.37rem auto;
			font-size: 14px;
			color: var(--text-assist-color);

			&::before {
				content: "";
				display: inline-block;
				vertical-align: text-bottom;
				width: 18px;
				height: 18px;
				background: url(../assets/icon-news@2x.png) no-repeat center;
				background-size: contain;
				margin-right: 0.8em;
			}
		}

		& .xycf_news-item {
			@apply --border-top;
			@apply --border-bottom;
			@apply --margin-bottom;
			background: #fff;

			& .y_card {
				padding: 0.16rem 0.3rem;
				display: flex;
			}
			& .y_avatar {
				width: 0.54rem;
				height: 0.54rem;
				min-width: 0.54rem;
				min-height: 0.54rem;
				flex: 0 0 0.54rem;
			}
			& .y_card-text {
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			& .y_card-title, & .xycf_news-item--addr {
				color: var(--text-assist-color);
			}
		}
		& .xycf_news-item--info {
			@apply --border-top;
			height: 45px;
			display: flex;
			align-items: center;
			padding: 0 0.3rem;
			color: var(--text-secondary-color);

			&:before {
				content: '';
				display: inline-block;
				width: 3px;
				height: 3px;
				background: #46e2f0;
				@apply --round;
				margin-right: 0.24rem;
			}
		}

		& .xycf_news-item--num {
			color: #2f70a8;
		}

		/*个人中心*/
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

			&:after {
				color: white;
				background: rgba(0, 0, 0, .5);
				position: absolute;
				left: 1.6px;
				left: 1.6px;
				left: 0.1rem;
				bottom: 1.6px;
				bottom: 1.6px;
				bottom: 0.1rem;
				z-index: 1;
				color: white;
				border: none;
			}
		}
	}
	.xycf_index .nav .nav-left{ 
		display: none; 
	}
</style>

<style type="text/css" scoped>
	@import "#/css/var.css";

	.service_entry {
		@apply --round;
		position: fixed;
		right: 0;
		bottom: 24%;
		z-index: 1;
		font-size: 14px;
		color: white;
		padding: 0.5em 0.7em;
		background: #ffae28;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;

		& .icon {
			vertical-align: middle;
			width: 20px;
			height: 20px;
			background-image: url(../assets/service-1@2x.png);
			margin-right: 0.4em;
		}
	}

</style>