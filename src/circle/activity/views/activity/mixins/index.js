export default {
	computed: {
		isWx() {
			return navigator.userAgent.match(/micromessenger/i) ? true : false;
		},
		isQq() {
			return navigator.userAgent.indexOf('MQQBrowser') !== -1;
		},
	},
	methods: {
		downloadApp() {
			window.location.href = 'https://static.yryz.com/quanhu/download/index.html';
			// if (this.$yryz.isIOS()) {
			// 	window.location.href = 'https://itunes.apple.com/cn/app/you-ran-yi-zhi/id1271618251?mt=8';
			// } else {
			// 	window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rz.rz_rrz';  // 地址需替换
			// }
		},

		async wxOauth() {
			let apiUrls = {
				'dev': 'http://api-dev.quanhu365.com',
				'mo': 'https://api-mo.quanhu365.com',
				'opus': 'https://api.quanhu365.com',
				'test': 'http://api-test.quanhu365.com',
				'localhost': 'http://api-dev.quanhu365.com'
			};
			let apiUrl = '';
			let href = this.$yryz.isNative() ? window.location.href : window.location.host;
			let match = href.match(/([A-Za-z]+)?\./)
			if (match && match.length > 1) {
				apiUrl = apiUrls[match[1].toLowerCase()];
				apiUrl = apiUrl || apiUrls['opus'] // 找不到环境信息则跳到线上环境
			} else {
				apiUrl = apiUrls['localhost'] || '';
			}
			let _url = this.$utils.getShareUrl().split('?')[0];

			let { activityChannelCode } = this.$attrs['activityData'] || this.$attrs['activity-data'];
			if (!activityChannelCode) {
				const { activityId } = this.$route.params;
				try {
					let res = await this.$opusApi.get(`/yyl/v1/activity/info/getActivityChannelCode?id=${activityId}`);
					let resData = res.data;
					if (resData.ret === 1) {
						activityChannelCode = resData.data.activityChannelCode;
					} else {
						this.$toast(resData.msg)
					}
				} catch (error) {
					this.$toast('服务器开小差，请稍后重试...')
				}
			}
			let wxAuthUrl = `${apiUrl}/api/v3/user/wxOauthThirdLogin?apiUrl=${apiUrl}&returnUrl=${_url}&activityChannelCode=${activityChannelCode}`;
			window.location.href = wxAuthUrl;
		},
		getUrlKey(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r) return unescape(r[2]);
			return null;
		},
		isWeiXin() {
			var ua = navigator.userAgent.toLowerCase();
			if (ua.includes("micromessenger")) {
				return true;
			}
			return false;
		},
		isWeiXinLogin() {
			const CustIdLocalKey = 'Qh_CustId';
			const TokenLocalKey = 'Qh_Token';
			let version = window.sessionStorage.getItem('version'); // 本地版本号
			if (this.$env.custId)
				return;
			if (this.isWeiXin()) {
				if (this.getUrlKey('custId') && version === this.$route.params.activityId) {
					this.$env.custId = this.getUrlKey('custId');
					this.$env.token = this.getUrlKey('token');
					window.sessionStorage.setItem(CustIdLocalKey, this.$env.custId);
					window.sessionStorage.setItem(TokenLocalKey, this.$env.token);
					//
					this.$router.replace({ path: this.$route.path });
				}
				if (!this.$env.custId) {
					window.sessionStorage.setItem('version', this.$route.params.activityId)
					this.wxOauth();
				}
			}
		}
	}
}