/**
*	Author: huliang
*
*/
<template>
	<div class="phone-main">
		<div class="phone">
			<div v-if="hasDefaultValue" v-text="values.phone" class="showPhone"></div>
			<y-input v-else v-bind="$props" v-model="values.phone" :maxlength='11' :disabled='start1' placeholder="请输入手机号领取" type="number"></y-input>
		</div>
		<div class="captcha" v-if="showImageCaptcha">
			<y-input v-model="imageCaptcha" placeholder="请输入图形验证码"></y-input>
			<div class="captcha_button" @click.stop="refreshImageCaptcha">
				<img :src="imageCaptchaUrl" alt="图形验证码">
			</div>
		</div>
		<div class="verifyCode" v-if="!hasDefaultValue">
			<y-input v-bind="$props" v-model="values.verifyCode" :maxlength='6' placeholder="请输入验证码" type="number"></y-input>
			<y-click-button :start.sync='start1' @click.native='onClick' :smsStyles='styles'>
			</y-click-button>
		</div>

	</div>
</template>

<script type="text/javascript">
import YInput from '@/components/input';
import YClickButton from './click-button';
import YItem from '@/components/item';
import Toast from '@/components/toast';
import moment from 'moment'
export default {
	name: 'y-verification-phone',
	components: {
		YInput,
		YClickButton,
		YItem
	},

	props: {
		...YInput.props,
		value: Object,
		hasDefaultValue: {
			type: Boolean,
			defalut: false
		}
	},
	watch: {
		'values.phone'(newVal, oldVal) {
			if (newVal !== oldVal && this.showImageCaptcha) {
				this.refreshImageCaptcha();
			}
		}
	},
	computed: {
		showImageCaptcha() {
			console.log(this.validaImageCaptcha && this.validPhone(this.values.phone));
			return this.validaImageCaptcha && this.validPhone(this.values.phone)
		},
		imageCaptchaUrl() {
			let baseUrls = {
				'dev': 'http://opusapi-dev.quanhu365.com',
				'mo': 'https://opusapi-mo.quanhu365.com',
				'opus': 'https://opusapi.quanhu365.com',
				'test': 'http://opusapi-test.quanhu365.com',
				'localhost': 'http://opusapi-dev.quanhu365.com'
			};
			let baseUrl = '';
			let href = window.location.href;
			let match = href.match(/([A-Za-z]+)?\./)
			if (match && match.length > 1) {
				baseUrl = baseUrls[match[1].toLowerCase()];
				baseUrl = baseUrl || baseUrls['opus']
			} else {
				baseUrl = baseUrls['localhost'] || '';
			}
			return `${baseUrl}/yyl/v1/activity/vote/image?phone=${this.values.phone}&timestamp=${this.timestamp}`;
		}
	},

	data() {
		return {
			smsStyles: {
				background: '#f4f4f4',
				color: "#fff"
			},
			styles: {},
			PhoneDisabled: false,
			values: this.value,
			start1: false,
			errorMsg: '',
			imageCaptcha: '',
			validaImageCaptcha: false,
			timestamp: ''
		}
	},

	methods: {
		validPhone(value) {
			const regexPhone = /^((13[0-9])|(14[1456789])|(15[0-9])|166|(17[0134678])|(18[0-9])|(19[8-9]))\d{8}$/;
			return regexPhone.test(value);
		},
		refreshImageCaptcha() {
			if (this.validPhone(this.values.phone)) {
				this.timestamp = moment().format('x');
			} else {
				this.errorMsg = '请输入正确的手机号码';
			}
		},
		onClick() {
			let postData = {
				code: "8",
				phone: this.values.phone,
				type: "1",
			}
			if (this.validaImageCaptcha) {
				if (!this.imageCaptcha) {
					this.errorMsg = '请输入图形验证码';
					return false;
				}
				postData.chartCodeDto = this.imageCaptcha;
			}
			if (this.values.phone === '' || !/^1[3|4|5|7|8|9]\d{9}$/.test(this.values.phone)) {
				return Toast(this.$R('toast-correct-phone'));
			} else {
				this.$opusApi.post(`/yyl/v1/activity/vote/sendVerifyCode`, postData).then(res => {
					if (res.data.msg === "success") {
						if (res.data.data.isSendViewCode === '1') {
							this.validaImageCaptcha = true;
							return false;
						}
						this.start1 = true;
					} else {
						Toast(res.data.msg)
					}
				});
			};
		}
	}
};
</script>

<style type="text/css">
@import '#/css/var.css';
.phone-main {
	width: 5.4rem;
	margin: 0 auto;

	& .phone {
		@apply --border;
		display: flex;
		border-radius: 4px;

		& .showPhone {
			padding: .2rem .3rem;
			color: #666;
		}
	}

	& .captcha {
		@apply --border;
		border-radius: 4px;
		display: flex;
		margin-top: .2rem;
		align-items: stretch;
		overflow: hidden;

		& .captcha_button {
			display: flex;
			align-items: center;
			width: 3rem;
			/* flex: 0 0 2.1rem; */
			/* border: 1px solid #e4e4e4; */
			border-radius: 4px;
			background: #f8f8f8;
			& button {
				width: 100%;
				height: .84rem;
				padding: 0;
				color: var(--theme-color);
				border-radius: 0;
				background: #f8f8f8;
			}
			& img {
				height: .84rem;
			}
		}
	}

	& .verifyCode {
		@apply --border;
		display: flex;
		margin: .2rem 0;
		border-radius: 4px;
		& .button {
			width: 3.2rem;
			padding: 0.45em .5em;
			background-color: #F8F8F8;
			border-radius: 0;
		}
	}
}
</style>