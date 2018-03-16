<template>
	<div class="activity-report">
		<div class="cover">
			<y-nav   v-if="this.$yryz.isNative()"  :transparent="true"></y-nav>
			<img src="../../static/images/report/top.png" class="width100" :class="{'native': this.$yryz.isNative()}" alt="">
		</div>
		
		<div class="report_list">
			<img src="../../static/images/report/list_01.jpg" class="width100" alt="" 
			@click="toRourter('http://hb.people.com.cn/n2/2017/0705/c202353-30427582.html')">
			<img src="../../static/images/report/list_02.jpg" class="width100" alt="" 
			@click="toRourter('http://www.hb.xinhuanet.com/2017-07/06/c_1121273464.htm')">
			<img src="../../static/images/report/list_10.jpg" class="width100" alt="" 
			@click="toRourter('http://news.cnr.cn/native/city/20170706/t20170706_523836873.shtml')">
			<img src="../../static/images/report/list_03.jpg" class="width100" alt="" 
			@click="toRourter('http://www.yicai.com/news/5311372.html')">
			<img src="../../static/images/report/list_04.jpg" class="width100" alt="" 
			@click="toRourter('http://hb.ifeng.com/a/20170705/5797609_0.shtml')">
			<img src="../../static/images/report/list_05.jpg" class="width100" alt="" 
			@click="toRourter('http://hb.qq.com/a/20170705/031986.htm')">
			<img src="../../static/images/report/list_06.jpg" class="width100" alt="" 
			@click="toRourter('http://www.toutiao.com/i6439217414960841217/')">
			<img src="../../static/images/report/list_07.jpg" class="width100" alt="" 
			@click="toRourter('http://www.changjiangtimes.com/2017/07/572096.html')">
			<img src="../../static/images/report/list_08.jpg" class="width100" alt="" 
			@click="toRourter('http://news.21so.com/2017/qqb21news_0705/59170.html')">
			<img src="../../static/images/report/list_09.jpg" class="width100" alt="" 
			@click="toRourter('http://www.hb.chinanews.com/news/2017/0705/284317.html')">

			<img src="../../static/images/report/list_others.png" class="width100" alt="">
			
		</div>
		<div class="report_share" v-if="this.$yryz.isNative()" @click="handleClickShare">
			<img src="../../static/images/report/share_btn.png" class="width100" alt="">
		</div>

		<div style="height:70px;" v-if="this.$yryz.isNative()"></div>
	</div>
</template>
<script>
	import Action from '@/components/comment/action'
	
	export default {
		
		methods: {
			toRourter(url) { // 跳新闻页
				if (this.$yryz.isNative()) { //  原生跳转
					this.$yryz.openUrl({ url: url });
				} else {
					location.href = url;
				}
				
			},
			handleClickShare() { // 分享至第三方
				Action["share"].call(this, {
					imgUrl: "",
					title: "信用创富计划引爆全国媒体",
					content: "信用是一种资本，进悠然一指·信用创富圈，凭信用赊销产品，用自己的信用创造财富。普通民众和在校大学生均可参加，信用赊销额度高达10万元，首轮限额3000名。",
				})
			},
		},
		mounted() {
			
		}
	}
</script>
<style >
	@import '#/css/var.css';

	body{
		height: 100vh;
	}
	.activity-report + div
	{
		
		& .nav{display: none;}
	}
	.activity-report{
		background: #fff;
		& .cover{
			& img.native{
				margin-top: -1.28rem;
			}
		}
		& .report_list{
			background: #fff;
		}
		& .report_share{
			display: block;
			margin: 20px auto;
			width: 70%;
		}
	}
	.share-content{
		height: auto;
	}
	.activity-report {
		& .icon-share.icon-QQ, .icon-share.icon-QQZone, .icon-share.icon-Sina {
		display:none;
		}
	}
	
</style>


