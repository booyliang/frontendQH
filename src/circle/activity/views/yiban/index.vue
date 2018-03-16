<template>
	<div class="yiban">
		<y-nav :title="title" v-if="isApp">
			<span slot="nav-right">
				<y-button type="text" @click.native="toShare">分享</y-button>
			</span>
		</y-nav>
		<img alt="" src="" id="ip" style="display:none" />
		<table class="wrap" cellpadding="0" cellspacing="0">
			<tr>
				<td class="posi-reg">
					<img src="../../assets/yiban/1.jpg">
					<img src="../../assets/yiban/button.png" class="reg-btn" @click="download">
				</td>
			</tr>
			<tr>
				<td>
					<img src="../../assets/yiban/2.jpg">
				</td>
			</tr>
			<tr>
				<td>
					<img src="../../assets/yiban/3.jpg">
				</td>
			</tr>
			<tr>
				<td>
					<img src="../../assets/yiban/4.jpg">
				</td>
			</tr>
			<tr>
				<td>
					<img src="../../assets/yiban/5.jpg">
				</td>
			</tr>
			<tr>
				<td>
					<img src="../../assets/yiban/6.jpg">
				</td>
			</tr>
			<tr>
				<td>
					<img src="../../assets/yiban/7.jpg">
				</td>
			</tr>
			<tr>
				<td class="posi-reg">
					<img src="../../assets/yiban/8.jpg">
					<div class="bottom-box">
						<button class="filter-btn" @click="download">点击开始筛选对象</button>
						<p style="margin-top: 0.1rem;font-size: 12px;">一伴APP : 上一伴，找另一半</p>
					</div>
					<div class="copyright-box">
						<p>版权所有  广州一伴信息科技有限公司 粤ICP备16067089号</span></p>
					</div>
				</td>
			</tr>
		</table>
		<y-share ref="share" :useOpusApi="true"></y-share>
	</div>
</template>
<script>
import YShare from './share'
export default {
	components: {
		YShare
	},
	data() {
		return {
			isApp: this.$yryz.isNative(),
			title: '一伴—真实的高品质婚恋交友平台。允许添加微信，手持身份证注册，明确结婚计划',
			content: '一伴是一个真实的高品质婚恋交友平台。来一伴，找另一半。用户必须手持身份证进行注册，都有着明确的结婚计划，允许添加心动对象的微信。“假一赔十”，我们如此承诺！',
			isReqT: false
		}
	},
	mounted() {
		if (this.isApp) {
			this.$circle.circleName = this.title;
		} else {
			this.$utils.setBrowserShareInfo(this.title, this.content);
			
			var _hmt = _hmt || [];
			(function () {
				var hm = document.createElement("script");
				hm.src = "https://hm.baidu.com/hm.js?ff848271eee918383804dce84fdcd3bf";
				var s = document.getElementsByTagName("script")[0]; 
				s.parentNode.insertBefore(hm, s);
			})();

			this.req("t");
		}
	},
	methods: {
		req(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r) {
				this.isReqT = true;
				var t = unescape(r[2]);
				document.getElementById('ip').src = "http://oo.cshuaiw.com:9001/idfa/set?" + name + "=" + t + "&ts=" + new Date().getTime();
			}
			if (!this.isReqT) {
				document.getElementById('ip').src = "http://oo.cshuaiw.com:9001/idfa/set?t=y_gw" + "&ts=" + new Date().getTime()
			}
		},
		toShare() {
			if (this.isApp) {
				this.$refs.share.open({
					title: this.title,
					content: this.content,
					coverPlanUrl: '',
					url: window.location.href
				}, ['WeChat', 'WeChatLine', 'QQ', 'QQZone']);
			}
		},
		download() {
			if (this.isApp) {
				if (this.$yryz.isIOS()) {
					this.$yryz.openAPP({
						urlScheme: 'com.liuliu.cn',
						downloadUrl: 'itms-apps://itunes.apple.com/cn/app/id1321838413?mt=8'
					})
				} else {
					this.$yryz.openUrl(
						{url: "http://a.app.qq.com/o/simple.jsp?pkgname=com.yiban1314.yiban"}
					)
				}
				
			} else {
				window.top.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.yiban1314.yiban";
			}
		}
	}
}
</script>
<style>
.yiban {
	& img {
		display: block;
	}
	& .nav-center{
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		width: 70%;
	}
	& .wrap{ 
		max-width: 750px;
		min-width: 320px;
		width: 100%;
		margin:0 auto;
		overflow: hidden;
	}
	& .posi-reg {
		position: relative;
	}
	& .reg-btn{
		position: absolute;
		display: block;
		width: 48%;
		height: 9%;
		margin: auto;
		left: 0;
		right: 0;
		bottom: -4.5%;
		cursor: pointer;
	}
	& .bottom-box {
		position: absolute;
		width: 48%;
		height: 25%;
		margin:auto;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		color: #fff;
		text-align: center;
	}
	& .filter-btn {
		cursor: pointer;
		background: none;
		color: #fff;
		width: 100%;
		height: 80%;
		border: 1px solid #fff;
		border-radius: 50px;
		font-size: 13px;
	}
	& .copyright-box{
		position: absolute;
		width: 100%;
		height: 10%;
		margin:auto;
		right: 0;
		bottom: 0.2rem;
		left: 0;
		color: #fff;
		text-align: center;
		font-size: 12px;
	}
	& .icon-YRIM, & .icon-Sina{
		display: none;
	}
}

</style>


