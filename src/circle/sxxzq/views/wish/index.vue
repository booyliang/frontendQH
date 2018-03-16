<template>
	<div class="wishing-wrap">
		<y-nav :title="title" class="banner-wishing--height" :transparent="true" :showSearch="true" :menuData="menuData" ref="nav"></y-nav>
		<router-link to="/mywish" class="my-wish">{{$R('wish-my')}} ></router-link>
		<h1 class="panel-title">
			<span></span>{{$R('wish-sub')}}
		</h1>
		<div class="wishing-list">
			<router-link tag="div" class="wishing-list-item" v-for="(item,index) in wishclass" :to="`/wishclassify/${item.id}`" :key="item.id">
				<img :src="item.entranceImgUrl | imageResize(4)">
				<p>{{item.classifyName}}
					<span>({{`${item.count}${$R('wish-num')}`}})</span>
				</p>
			</router-link>
		</div>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';

export default {
	components: {
		YNav
	},
	data() {
		return {
			menuData: ['index'],
			isShow: false,
			wishclass: []
		}
	},
	computed: {
		title() {
			return this.isShow ? this.$R('wish-title') : '';
		}
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.handleScroll);
	},
	mounted() {
		this.$http.get(`/services/app/v1/wishclassify/list`).then(response => {
			if (response.data.code === "200") {
				// this.loaded = true;
				let data = response.data.data || [];
				this.wishclass.push(...data);
				this.$localStore.set('wishclass', this.wishclass);
				window.addEventListener('scroll', this.handleScroll)
			} else {
				console.log(response.data.msg);
			}
		});
	},
	methods: {
		handleScroll() {
			let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			this.isShow = scrollTop >= 50 ? true : false;
		}
	}
}
</script>

<style>
@import '#/css/var.css';
.wishing-wrap {
	background-color: #fff;
	height: 100vh;

	& .banner-wishing--height {
		height: 3.72rem;
		background-image: url(../../assets/xyqf_banner@2x.jpg);
		background-repeat: no-repeat;
		background-position: center top;
		background-size: 100% 3.72rem;
	}

	& .wishing-list {
		margin: .3rem .3rem .3rem .1rem;
		overflow: hidden;

		& .wishing-list-item {
			position: relative;
			width: 3.35rem;
			height: 2.55rem;
			background-color: #bdbdbd;
			border-radius: .1rem;
			float: left;
			margin: 0 0 .2rem .2rem;

			& img {
				display: block;
				width: 100%;
				height: 100%;
				border-radius: .1rem;
			}

			& p {
				background: rgba(0, 0, 0, .4);
				color: #fff;
				font-size: 16px;
				width: 100%;
				height: 0.6rem;
				line-height: 0.6rem;
				text-align: center;
				position: absolute;
				left: 0;
				bottom: 0;
				border-bottom-left-radius: .1rem;
				border-bottom-right-radius: .1rem;

				& span {
					font-size: 13px;
				}
			}
		}
	}


	& .my-wish {
		display: block;
		position: absolute;
		top: 2.88rem;
		left: 0.47rem;
		width: 1.83rem;
		height: 0.6rem;
		line-height: 0.6rem;
		color: #fff;
		font-size: 13px;
		background-color: #6c53b3;
		text-align: center;
		border-radius: 0.3rem;
	}

	& .panel-title {
		font-size: 16px;
		margin: 0.4rem 0.3rem 0;
		&::before {
			content: "";
			display: inline-block;
			width: 0.04rem;
			height: 1em;
			vertical-align: -0.15em;
			background: var(--theme-color);
			margin-right: 0.5em;
		}
	}
}
</style>