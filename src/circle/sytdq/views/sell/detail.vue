<template>
	<div class="business-detail-wrap">
		<y-nav :title="$R('detail')" :menuData="menu"></y-nav>
	
		<div class="detail-container" v-if="data">
			<div class="business-head">
				<div class="img-container">
					<img v-if="data.coverPlanUrl" :src="data.coverPlanUrl | imageResize(5)" alt="">
					<span class="addr">
						<span class="iconfont icon-addr-o"></span>
						<span v-text="data.province+' '+data.city"></span>
					</span>
				</div>
				<p v-text="data.name" class="text-container"></p>
			</div>
	
			<div class="business-body">
				<div class="bus-item">
					<div class="bus-item-title">
						<span class="iconfont icon-tag-b"></span>
						<span>{{$R('merchant-type')+'：'}}</span>
					</div>
					<p v-text="data.className"></p>
				</div>
				<div class="bus-item item-head-map">
					<div class="bus-item-title">
						<span class="iconfont icon-addr"></span>
						<span>{{$R('merchant-addr')+'：'}}</span>
					</div>
					<y-item @click="openMap" :clickable="true">
						<span slot="head" v-text="data.address"></span>
					</y-item>
				</div>
				<div class="bus-item bus-item-last">
					<div class="bus-item-title">
						<span class="iconfont icon-phone-b"></span>
						<span>{{$R('contact-number')+'：'}}</span>
					</div>
					<y-item>
						<span slot="head" v-text="data.phone"></span>
						<y-button class="call-tel" slot="foot" @click.native="callTel">{{$R('call')}}</y-button>
					</y-item>
				</div>
			</div>
	
			<div class="business-activity" v-if="activityList">
				<div class="bus-item-title">
					<span class="iconfont icon-gift"></span>
					<span v-text="getBusLen"></span>
				</div>
				<y-item v-for="(item,index) of activityList" :title="item.name" :key="index" @click.native.stop="toLink(item.url)" :clickable="true"></y-item>
			</div>
	
			<div class="business-detail">
				<div class="bus-item-title">
					<span class="iconfont icon-intr"></span>
					<span>{{$R('merchant-detail')+'：'}}</span>
				</div>
				<y-content-source :content-source="contentSource"></y-content-source>
				<y-hot :hots="['like']" :data="data">
				</y-hot>
			</div>
		</div>
		<y-comment v-if="data" :data="data"></y-comment>
	
		<div class="show-tel" v-if="isCall" @click="hideCallTel">
			<div class="container">
				<p>{{$R('contact-merchant')}}</p>
				<a :href="'tel:'+ data.phone" target="_blank">
					<span class="iconfont icon-phone-b"></span>
					<span v-text="data.phone"></span>
				</a>
			</div>
		</div>
	</div>
</template>

<script>
import YComment from '@/components/comment'
import Item from '@/components/item'
import Hot from '@/components/hot';
import Toast from '@/components/toast'
import ContentSource from '@/components/content-source'
import mapNav from '@/components/map-nav'

export default {
	components: {
		Toast,
		[Item.name]: Item,
		[Hot.name]: Hot,
		[YComment.name]: YComment,
		[ContentSource.name]: ContentSource,
	},
	data() {
		return {
			menu: ['index'],
			data: null,
			activityList: null,
			contentSource: '[]',
			isCall: false,
			isShowMap: false,
			noFindAddr: false,
			map: null,
		}
	},

	created() {
		this.$http.get(`/services/app/v1/business/single/${this.$route.params.id}`)
			.then(res => {
				if (res.data.code === '200') {
					let data = res.data.data;
					let obj = { title: data.name };
					this.data = Object.assign({}, data, obj);
				}
			})
	},
	computed: {
		getBusLen() {
			return `${this.$R('merchant-activity')} (${this.activityList.length})`;
		},
		imgUrl() {
			// coverPlanUrl
			let imgs = this.data.userImg.split(',');
			return imgs[0];
		}
	},
	watch: {
		data(val) {
			if (val) {
				this.activityList = this.data.activitys;
				this.contentSource = this.data.contentSource;
			}
		}
	},
	methods: {
		toLink(url) {
			if (this.$yryz.isNative()) {
				this.$yryz.openUrl({ url: url });   // 原生跳转
			} else {
				location.href = url;
			}
		},

		callTel() {
			this.isCall = true;
		},
		hideCallTel(evt) {
			// console.log(evt.target.className);
			if (evt.target.className === 'show-tel') {
				this.isCall = false;
			}
		},
		openMap() {
			mapNav.init({
				province: this.data.province,
				city: this.data.city,
				address: this.data.address,
			})
		}
	},
	beforeDestroy() {
		mapNav.hide();
	}
}
</script>
<style>
@import '#/css/var.css';
.business-detail-wrap {
	& .business-head {
		background: #fff;
		padding-bottom: 0.3rem;
	}
	& .img-container {
		position: relative;
		& img {
			display: block;
		}
		& .addr {
			position: absolute;
			right: .1rem;
			bottom: .2rem;
			background: color(#000 alpha(0.5));
			border-radius: 20px;
			line-height: 20px;
			color: #fff;
			padding: 0 9px;
			font-size: 13px;
		}
	}

	& .text-container {
		margin: 0.3rem 0.3rem 0;
		@apply --text-cut-multi-line;
		-webkit-line-clamp: 2;
		font-size: 22px;
		line-height: 28px;
	}

	& .business-body {
		margin-top: .2rem;
		background: #fff;
		padding: 0 .3rem;

		& .item {
			min-height: 0;
			padding: 0;
			& .item-wrap {
				padding: 0.1rem 0;
				border-top: none;
			}
		}
	}
	& .bus-item.bus-item-last {
		border-bottom: none;

		& .item .item-wrap {
			padding: 0;
		}
	}

	& .bus-item {
		@apply --border-bottom;
		padding: 0.4rem 0 0.3rem;
		& .bus-item-title {
			font-size: 16px;
			color: var(--theme-color);
		}
		& .iconfont {
			margin-right: .1rem;
		}
		& .icon-tag-b,
		& .icon-intr,
		& .icon-phone-b,
		& .icon-gift {
			font-size: 14px;
		}
		& .icon-addr {
			font-size: 15px;
		}
		.call-tel {
			float: right;
			font-size: 16px;
		}
	}

	& .item-head-map {
		& .item {
			& .item-wrap {
				& .item-head {
					width: 90%;
				}
			}
		}
	}

	& .item-head {
		font-size: 16px;
	}


	& .business-activity {
		margin-top: .2rem;
		background: #fff;

		& .bus-item-title {
			line-height: .5rem;
			font-size: 16px;
			color: var(--theme-color);
			line-height: .6rem;
			padding: .15rem .3rem;
		}
		& .item {
			& .item-wrap {
				& .item-head {
					width: 88%;
					@apply --text-cut;
				}
			}
		}
	}

	& .business-detail {
		margin-top: 0.2rem;
		background: #fff;
		& .bus-item-title {
			line-height: .5rem;
			font-size: 16px;
			color: var(--theme-color);
			line-height: .6rem;
			padding: .15rem .3rem;
			background: #fff;
		}

		& .content_source {
			padding: 0 0.3rem;
			background: #fff;

			& .content_source-text {
				margin: 0;
			}
		}
	}
	& .show-tel {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 99;
		& div {
			text-align: center;
			background: #fff;
			width: 80%;
			margin: 0 auto;
			border-radius: .1rem;
			overflow: hidden;
			position: relative;
			top: 35%;
			font-size: 18px;
			& p {
				padding: .4rem 0;
			}
			& a {
				display: block;
				color: #DC8130;
				background: #F8F8F8;
				padding: .4rem 0;
				& span {
					margin: 0 .1rem;
				}
			}
		}
	}
}
</style>
