export default{
	'RZ': {
		'android': {
			urlScheme() {
				return 'rzWealth://uri.main?custId=' + this.$env.custId + '&token=' + this.$env.token;
			},
			'downloadUrl': 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rongzhong.wealth.activity',
			'extendParameter': 'com.rongzhong.wealth.activity'
		},
		'iOS': {
			urlScheme() {
				return 'rzw.wealth://productList?custId=' + this.$env.custId + '&token=' + this.$env.token;
			},
			'downloadUrl': 'itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=935521203',
		}
	},
	'yiban': {
		'iOS': {
			urlScheme() {
				return 'com.liuliu.cn';
			},
			'downloadUrl': 'itms-apps://itunes.apple.com/cn/app/id1321838413?mt=8',
		}
	}
}