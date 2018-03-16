<template>
	<div class="order-preview">
		<y-panel :colorful="true" to="/address" class="address-panel" title="收货人信息">
			<router-link tag="div" to="/address" class="address">
				<dl>
					<dt>收货人姓名</dt>
					<dd>{{ previewData.address.receivingName }}</dd>
				</dl>
				<dl>
					<dt>收货人电话</dt>
					<dd>{{ previewData.address.receivingPhone }}</dd>
				</dl>
				<dl>
					<dt>收货人地址</dt>
					<dd>{{ previewData.address.receivingAddress }}</dd>
				</dl>
			</router-link>
		</y-panel>

		<y-panel class="good-list" :colorful="true" title="商品信息">
			<y-good-item :data="item" v-for="item in previewData.items" :key="item.id"></y-good-item>
		</y-panel>

		<y-panel class="cycle-panel" :colorful="true" title="选择分期还款方式">
			<y-check-group type="radio" @clickItem="changeCycle" v-model="previewData.planConfigId" :data="cycleConfigData" textField="label" class="check-group--tag"></y-check-group>
		</y-panel>

		<y-panel class="contract-panel" title="签订合同" :colorful="true">
			<y-tips>请点击查看《产品信用赊销合同》全文并详细阅读，如您选择同意则视为已订立合同，并产生法律效力</y-tips>
			<y-check type="checkbox" name="agreement" v-model="agreeRules">我已阅读并同意<a href="javascript:;" class="j-agreement-trigger" @click="previewContract">《产品信用赊销合同》</a></y-check>
		</y-panel>
		<div class="confirm-action">
			<y-button block @click.native="createOrder" :disabled="!agreeRules">确认</y-button>
		</div>
	</div>
</template>
<script>
	import qs from 'qs'
	import YList from '@/components/list'
	import YItem from '@/components/item'
	import YCheckGroup from '@/components/check-group'
	import YCheck from '@/components/check'
	import YTips from '../../components/tips'
	import YTextCard from '../../components/text-card'
	import YPaymentType from '../../components/payment-type'
	import YProductImg from '../../components/product-img'
	import YTotalTool from '../../components/total-tool'
	import YGoodItem from '../../components/good-item'
	import wapPay from '../../mixins/wap-pay.js'
	import flowStatusMixin from '../../mixins/flow-status.js'
	export default {
		mixins: [wapPay, flowStatusMixin],
		components: {
			YList,
			YItem,
			YCheckGroup,
			YCheck,
			YTips,
			YTextCard,
			YPaymentType,
			YProductImg,
			YTotalTool,
			YGoodItem
		},
		data() {
			return {
				orderId: '',
				agreeRules: true,
				previewData: {
					address: {}
				},
				statusData: {flowStatus: 0},
				cycleConfigData: [],
				currentCycle: '',
				payPostData: {
					paymentSource: this.$env.devType
				},
				userType: ''
			}
		},
		methods: {
			// 创建订单
			async createOrder() {
				let address = this.previewData.address;
				if (!address.receivingPhone || !address.receivingName || !address.receivingAddress) {
					this.$toast('请填写完整的收货信息！');
					return;
				}
				let postData = {
					orderType: this.userType * 2,
					orderItems: this.previewData.items,
					// productType: 1001,
					...address,
					// paymentSource: 4,
					// channel: this.payPostData.channel,
					creditUserId: this.statusData.creditUserId,
					moduleEnum: 1,
					totalAmount: this.previewData.totalAmount,
					planConfigId: this.previewData.planConfigId
				};
				// if (this.previewData.planConfigId) {
				// 	postData.planConfigId = this.previewData.planConfigId;
				// }
				delete postData.id;
				let createOrderResponse = await this.$http.post('/services/app/v1/order/single', postData);
				let createOrderResData = createOrderResponse.data;
				if (createOrderResData.code === '200') {
					this.orderId = createOrderResData.data.id;
					if (parseInt(createOrderResData.data.poundageFlag) === 1) {
						this.$router.replace({ name: 'orderServiceCharge', params: { orderId: this.orderId, userType: this.userType}});
					} else {
						this.$router.replace(`/order/trading/${this.orderId}`);
					}
				} else {
					this.$toast(createOrderResData.msg);
				}
			},
			// 预览合同
			previewContract() {
				let totalAmount = this.previewData.totalAmount;
				let postData = {
					firstMoney: 0,
					items: this.previewData.items,
					periodCount: this.currentCycle,
					totalMoney: totalAmount,
					type: this.userType,
					userId: this.$env.userId
				}
				postData.loanMoney = totalAmount - postData.firstMoney;
				let remainder = postData.loanMoney % this.currentCycle;
				postData.repayMoney = (postData.loanMoney - remainder) / this.currentCycle + remainder;
				this.$http.get('/services/app/v1/flowInfo/credit/info').then(response => {
					let resData = response.data;
					if (resData.code === '200') {
						resData = resData.data;
						postData.idCardNo = resData.idCardNo;
						postData.name = resData.name;
						this.$localStore.set('contractData', postData);
						let contractType = this.userType === 2 ? 'xysx' : 'xyzx';
						this.$router.push(`/${contractType}/contract`);
					} else {
						this.$toast(resData.msg);
					}
				});
			},
			changeCycle(item) {
				this.currentCycle = item.cycleNumber;
			}
		},
		mounted() {
			this.previewData = this.$localStore.get('previewOrder') || {};
			let params = this.$route.params;
			let userType = parseInt(params.userType);
			this.userType = userType;
			// 获取分期数据
			this.$http.get(`/services/app/v1/cycleConfig/list?userType=${userType}`).then(response => {
				let resData = response.data;
				if (resData.code === '200') {
					resData.data.forEach((item, index) => {
						item.checked = index === 0;
					});
					if (this.previewData.planConfigId) {
						resData.data.forEach(item => {
							if (item.id === this.previewData.planConfigId) {
								this.currentCycle = item.cycleNumber;
							}
						})
					} else {
						let panelData = resData.data[0];
						this.currentCycle = panelData.cycleNumber;
						this.previewData.planConfigId = panelData.id;
					}
					resData.data.forEach(item => {
						item.label = item.cycleNumber + '个月';
					})
					this.cycleConfigData = resData.data;
				} else {
					this.$toast(resData.msg);
				}
			}).catch(error => {
				this.$toast('可能出现了一点小问题');
				console.log(error);
			})
			if (this.previewData.address.id) return;
			// 获取默认地址
			this.$http.get('/services/app/v1/addr/default').then(response => {
				let resData = response.data;
				if (resData.code === '200') {
					let addressData = resData.data || {};
					this.previewData.address = {
						id: addressData.id,
						receivingAddress: addressData.location,
						receivingName: addressData.consignee,
						receivingPhone: addressData.phone
					};
				} else {
					this.$toast(resData.msg);
				}
			});
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.order-preview {
		padding-bottom: 1.2rem;
		& .address-panel, & .contract-panel {
			& .panel-body {
				padding: 0 .2rem;
			}
		}
		& .cycle-panel .panel-body {
			padding-bottom: .2rem;
		}

		& .address-panel {
			position: relative;
			/*padding-bottom: .1rem;
			&::after {
				@apply --border-top;
				@apply --border-bottom;
				content: "";
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				height: 0.16rem;
				background: linear-gradient(to right, #8fc9f5 33.3%, transparent 0, transparent 50%, #f58f8f 0, #f58f8f 83.3%, transparent 0);
				background-size: 2rem;
				transform: skew(-45deg);
			}*/
		}
		& .address {
			position: relative;
			padding: 0 0.1rem;
			background: #fff;
			& dl {
				padding: .4rem 0;
				display: flex;
				line-height: 1.5;
				font-size: 17px;
				&:not(:first-child) {
					border-top: 1px solid var(--border-color);
				}
				&:last-child {
					margin-bottom: 0;
				}
				& dt {
					flex: 0 0 auto;
					font-size: 17px;
				}
				& dd {
					flex: 1;
					padding-left: 0.2rem;
					text-align: right;
					font-size: 15px;
				}

				&:last-child {
					display: block;
					& dd {
						padding-left: 0;
						margin-top: 6px;
						text-align: left;
					}
				}
			}

			/*& .icon {
				flex: 0 0 .4rem;
				& i {
					color: var(--theme-color);
					font-size: 14px;
				}
			}
			& .content {
				position: relative;
				flex: 1;
				padding-right: .8rem;
				&:after {
					content: "";
					position: absolute;
					right: 0;
					top: 50%;
					width: .25rem;
					height: .25rem;
					border: 2px solid var(--border-color);
					border-left-color: transparent;
					border-bottom-color: transparent;
					transform: translateY(-50%) rotate(45deg);
				}
			}
			& .consignee-info {
				display: flex;
				& .consignee {
					display: flex;
				}
			}
			& .phone {
				margin-left: .2rem;
			}*/
		}
		& .good-list {
			& .panel-body {
				padding: .1rem 0;
			}
		}
		& .check-group--tag {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			color: var(--text-assist-color);

			& .check_item {
				@apply --margin-bottom;
				flex: none;
				width: 49.3%;
				min-height: 0;
				height: 1.04rem;
				color: var(--text-assist-color);
				text-align: center;
				border: 1px solid transparent;
				background: #f0f0f0;
				border-radius: 0.1rem;

				& .iconfont {
					display: none;
				}
				& .check_item-content {
					margin-left: 0;
				}

				&.checked {
					color: var(--theme-color);
					border-color: var(--theme-color);
					background: #f8faff;
				}
			}
		}

		& .tips {
			background: none;
			& .icon i, & .content{
				color: red;
			}
		}

		& .assist-text {
			font-size: 12px;
			color: var(--text-assist-color);
			& i {
				color: var(--theme-color);
			}
		}
		& .contract-panel {
			& .panel-body {
				padding-bottom: .3rem;
				& .tips {
					padding-left: 0;
					padding-right: 0;
				}
			}
		}

		& .confirm-action {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background: #fff;
			margin: 0 auto;
			padding: .2rem 0;
			border-top: 1px solid var(--border-color);
			box-shadow: 0 5px 15px rgba(0, 0, 0, .3);

			& button {
				font-size: 17px;

			}
		}
		& .panel-head {
			line-height: 54px;
		}
	}
</style>
