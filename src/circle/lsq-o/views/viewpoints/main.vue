<template>
	<div class="viewpoints-main">
		<y-nav :title="$R('teacher-homepage')" :transparent="true" class="banner-lawyer--height"></y-nav>
		<div class="viewpoints-main-headimg">
			<img :src="vpData.imgUrl" />
			<span></span>
			<p>{{vpData.name}}</p>
		</div>
		<div class="viewpoints-main-description">
			<h3 class="viewpoints-main--head"><span><i class="iconfont icon-intr"></i>{{$R('individual-resume')}}</span></h3>
			<P class="viewpoints-main--des">{{vpData.description}}</P>
			<h3 class="viewpoints-main--head border-top--10"><span><i class="iconfont icon-lamp"></i>{{$R('all-dynamic')}}</span></h3>
			<y-flow-list :request='dynamicRequest' @loaded="handleLoaded"></y-flow-list>
		</div>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import YFlowList from '@/components/flow-list';

export default {
	components: {
		YNav,
		YFlowList
	},
	data() {
		return {
			vpData: {},
			dynamicRequest: {
				method: 'GET',
				url: '/services/app/v1/famous/statement/list',
				params: { famousId: this.$route.params.id }
			}
		}
	},
	methods: {
		handleLoaded(data) {
			for (let item of data) {
				item.disabledCard = true;
			}
		}
	},
	mounted() {
		this.$http.get(`/services/app/v1/famous/info/detail/${this.$route.params.id}`).then(response => {
			if (response.data.code === "200") {
				let data = response.data.data || {};
				this.vpData = data;
			} else {
				console.log(response.data.msg);
			}
		});
	}
}
</script>

<style>
@import '#/css/var.css';
.viewpoints-main {
	

	& .viewpoints-main-headimg {
		position: relative;
		height: 2.47rem;
		margin-top: -2.47rem;
		& img {
			display: block;
			margin: 0 auto;
			width: 1.2rem;
			height: 1.2rem;
			border-radius: 0.6rem;
		}
		& span {
			position: absolute;
			width: 0.34rem;
			height: 0.34rem;
			background: url(../../assets/vip@2x.png) no-repeat center;
			background-size: contain;
			top: 0.86rem;
			left: 50%;
			margin-left: 0.26rem;
		}
		& p {
			margin-top: 0.2rem;
			text-align: center;
			color: #fff;
			font-size: 16px;
		}
	}
	& .viewpoints-main-description {
		& .viewpoints-main--head {
			& span {
				margin: 0 .14rem;
			}
			font-size: 16px;
			padding: .3rem .16rem;
			background-color: #fff;
			@apply --border-bottom;

			& .iconfont {
               margin-right: .25rem; 
			}
		}

		& p.viewpoints-main--des {
			background-color: #fff;
			padding: 0.3rem;
			line-height: 0.44rem;	
			margin-bottom: .2rem;
		}
	}
}
</style>