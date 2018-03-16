<template>
	<div class="platform-activity-signup-wrap">
		<y-nav title="参与报名" class="nav-demo-b">
			<span slot="nav-right" class="sign-text" @click="submitPay">
				确认报名
			</span>
		</y-nav>
		<y-list v-if="signUpForm.configSources">
			<y-item v-for="config in signUpForm.configSources" :key="config.id" :title="config.title" :subtitle="subTitle( config.required)" :vertical="config.type === '0'">
				<div slot="body">
					<y-input :placeholder="config.inputPrompt" :type="config.type === '1' ? 'text' : 'textarea'" v-model.trim="config.value" :show-text-length-info="config.type === '0'" :maxlength="config.type === '0' ? 500 : 30">
					</y-input>
				</div>
			</y-item>
			<y-item title="手机号" :subtitle="subTitle(signUpForm.phoneRequired)" v-if="signUpForm.phoneRequired !== 2">
				<div slot="body">
					<y-input placeholder="请输入手机号码" type="text" v-model.trim="phone">
					</y-input>
				</div>
			</y-item>
		</y-list>
		<p clsss="desc" v-if="signUpForm.signUpType && signUpForm.signUpType != 3">
			<span class="iconfont icon-tips-a"></span>
			参与本次活动需要支付{{amount}}
			<span v-if="signUpForm.signUpType == 1">悠然币</span>
			<span v-else>积分</span>
		</p>
	</div>
</template>

<script>
import YList from '@/components/list';
import YInput from '@/components/input';
import Toast from '@/components/toast';
const PAY_CURRENCY = 1;  // 支付货币
const PAY_INTEGRAL = 2;  // 支付积分
const PHONE_EMPTY = 0;   // 手机号码允许为空
const PHONE_NO_EMPTY = 1;   // 手机号码不允许为空
const PHONE_HIDE = 2;  // 不显示手机号码
const NORMAL = 1; // 数据正常状态
const REQUIRED_FILL = "1"; // 必须填写
export default {
	components: {
		[YList.name]: YList,
		[YInput.name]: YInput
	},
	data() {
		return {
			signUpForm: {},
			phone: ""
		}
	},
	computed: {
		amount() {
			return this.signUpForm.signUpType === 1 ? this.signUpForm.amount / 100 : this.signUpForm.amount;
		}
	},
	mounted() {
		this.checkLogin();
		this.getSignUpForm();
	},
	methods: {
		checkLogin() {
			if (!this.$yryz.isNative()) {
				if (!this.$env.custId) {
					this.$router.replace({name: 'signupIndex'});
					return false;
				}
			}
		},
		subTitle(type) {
			if (type === '1' || type === 1) return "(必填)";
		},
		validateSignUp() {
			this.checkLogin();
			const sources = this.signUpForm.configSources;
			const signUpForm = this.signUpForm;
			for (let source of sources) {
				if (source.required === REQUIRED_FILL) {
					const maxLen = source.type === '1' ? 30 : 500;
					if (source.value === "" || source.value.length > maxLen) {
						Toast(source.errorPrompt);
						return false;
					}
				}
			}
			let phoneReg = /^((13[0-9])|(14[1456789])|(15[0-9])|166|(17[0134678])|(18[0-9])|(19[8-9]))\d{8}$/;
			let phone = this.phone;
			// 手机号码是必填
			if (signUpForm.phoneRequired === PHONE_NO_EMPTY) {
				if (!phone) {
					Toast("手机号码不能为空");
					return false;
				}
			}
			// 手机号码为空允许为空的话,如果还是填写依然判断
			if (phone) {
				if (!phoneReg.test(phone)) {
					Toast("您输入的手机号无效");
					return false;
				}
			}
			return true;
		},
		async getSignUpForm() {
			let id = this.$route.params.activityId;
			const res = await this.$opusApi({ url: `/yyl/v1/activity/signUp/activitySignUpFrom?id=${id}` });
			if (res.data.ret === NORMAL) {
				// 解析configSource
				let data = res.data.data;
				data.configSources = JSON.parse(data.configSources);
				data.configSources.forEach((source) => {
					source.value = "";
				});
				this.signUpForm = data;
				// 如果配置信息为空,并且手机号码不显示就直接提交
				if (data.configSources.length === 0 && data.phoneRequired === PHONE_HIDE) {
					this.submitPay();
				}
			} else {
				throw new Error(res.data.msg);
			}
		},
		parseParams() {
			let params = {
				activityInfoId: 0,
				enrolSources: [],
				phone: ""
			};
			const sources = this.signUpForm.configSources;
			for (let source of sources) {
				params.enrolSources.push({ id: source.id, value: source.value });
			}
			params.enrolSources = JSON.stringify(params.enrolSources);
			params.activityInfoId = this.signUpForm.activityInfoId;
			params.phone = this.phone;
			return params;
		},
		async validatePay(id, orderNo) {
			//  支付验证
			orderNo = orderNo || "";
			let status = await this.$opusApi(`/yyl/v1/order/getOrderInfo/${orderNo}`);
			if (status.data.data.orderState === NORMAL) {
				if (this.signUpForm.amount === 0 || !this.signUpForm.amount) {
					this.$router.replace(`/platform-activity/signup/${id}/share`);
					return false;
				}
				this.$router.replace(`/platform-activity/signup/${id}`);
			} else {
				throw status;
			}
		},
		async submitPay() {
			if (!this.validateSignUp()) {
				return;
			}
			let params = this.parseParams();
			const res = await this.$opusApi.post("/yyl/v1/activity/signUp/activitySignUpSubmit", params);
			const option = res.data.data;
			if (res.data.ret === NORMAL) {
				this.$localStore.set("pay", {
					type: option.signUpType,
					amount: option.amount / 100
				});
				const id = this.$route.params.activityId;
				// 有订单号码并且需要支付货币
				if (option.orderNo && option.signUpType === 1) {
					// 调用原生支付
					try {
						await this.$yryz.pay({
							payMoney: option.amount,
							orderId: option.orderNo
						});
						// 验证是否支付成功的接口
						this.validatePay(id, option.orderNo);
					} catch (err) {
						if (err.data) {
							Toast(err.data.msg || err.data);
						}
					}
				} else {				
					if (this.signUpForm.amount === 0 || !this.signUpForm.amount) {
						this.$router.replace(`/platform-activity/signup/${id}/share`);
						return false;
					}	
					this.$router.replace(`/platform-activity/signup/${id}`);
				}
			} else {
				Toast(res.data.msg)
			}
		}
	}
}
</script>

<style>
@import '#css/var.css';
.platform-activity-signup-wrap {
	width: 100%;
	& input[type="text"] {
		text-align: right;
	}
	& .sign-text {
		font-size: .32rem;
		color: #0085ff;
	}
	&>p {
		font-size: .28rem;
		padding-left: .2rem;
		color: #afafaf;
		margin: 0.3rem 0 2.3rem;
		& span {
			padding-right: .1rem;
		}
	}

	& .y-textarea {
		/* @apply --border-bottom; */
		& textarea {
			padding: .2rem 0;
		}
	}

	& .list {
		@apply --border-bottom;
	}
}
</style>
