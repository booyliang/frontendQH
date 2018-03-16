export default {
	methods: {
		wapPay(orderId, payType, returnUrl) {
			let payListData = { 
				3: 'toH5Alipay',
				12: 'toUnionPay'
			}
			returnUrl = returnUrl || window.location.origin + `/${this.$circle.circleShortName}/trade-success`
			this.$yryz.openUrl({
				url: `${this.$http.baseUrl}/services/app/v1/pay/${payListData[payType]}?orderId=${orderId}&returnUrl=${returnUrl}`
			}).catch( error => {
				console.log(error);
			})
			return this.$dialog.confirm({title: '确认提示', message: '支付完成前，请不要关闭此窗口。'}, {okText: '支付已完成', cancelText: '遇到问题'});
		}
	}
}