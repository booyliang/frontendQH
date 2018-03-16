<template>
	<div class="download" :class="{'unNative': !this.$yryz.isNative()}">
		<div class="cover">
			<y-nav title="" :transparent="true"   v-if="this.$yryz.isNative()" ></y-nav>
		</div>
		<img src="../../assets/succeed@2x.png" class="succeed" alt="">
		<div class="txt">
			<div class="p1">领取成功</div>
			<div class="p2">您已获得<span>5</span>次悠悠乐抽奖机会！</div>
			<div class="p1">请下载悠然一指APP,<br/>在APP首页的悠悠乐中参与抽奖！</div>
		</div>

		<div class="download_action">
			<y-button class="download_btn" @click.native="download_ios">iOS下载</y-button>
			<y-button class="download_btn" @click.native="download_Android">安卓下载</y-button>
		</div>
	</div>
</template>
<script>
import YNav from '@/components/nav/nav';
export default {
	components: {
		[YNav.name]: YNav,
	},
	methods: {
		download_ios() {
			location.href = 'https://itunes.apple.com/cn/app/you-ran-yi-zhi/id1108712331?mt=8';
			
		},
		download_Android() {
			location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rz.rz_rrz';
		}
	}
}
</script>
<style>
@import "#/css/var.css";
.download{
	& .cover{
		background: url("../../assets/banner_cg.jpg") no-repeat center bottom; 
		background-size: 100% auto;
    	height: 4rem;
    	padding-bottom: 40px;
	}
	& .banner_cg{
		width: 100%;
	}
	& .succeed{
		display:block;
		width: 120px;
		margin: 50px auto 20px;
	}
	& .txt{
		text-align: center;
		font-size: 13px;
		color: #000;
		& .p1{
			font-size: 16px;
		}
		& .p2{
			font-weight: 700;
			color: #52cfbf;
			font-size: 18px;
			margin: 20px auto 10px;
			& span{
				color: #ffb446;
			}
		}
	}
	
	& .download_action{
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		width: 90%;
		margin: .5rem auto 20px;
		& .download_btn{
			-webkit-box-flex: 1;
			-ms-flex: 1;
			flex: 1;
			font-size: 17px;
			color: #fff;
			text-align: center;
			border-radius: 20px;
			padding: .1rem .3rem;
			margin: auto 10px;
			border-radius: 8px;
		}
	}
}
</style>


