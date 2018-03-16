export default {
	computed: {
		buttonData() {
			const data = this.statusData;
			const status = data.flowStatus;
			const buttonData = this.buttonListData[status];

			if (status === 10) {
				return buttonData[data.repaymentFlag];
			}

			return buttonData;
		}
	},
	methods: {
		async getFlowStatus() {
			let response = await this.$http.get('/services/app/v1/flowInfo/status');
			let resData = response.data;
			if (resData.code === '200') {
				this.statusData = resData.data;
			} else {
				this.$toast(resData.msg);
			}
		}
	},
	mounted() {
		this.getFlowStatus();
	}
}