<template>
	<div class="lsq-phone edit-phone">
		<y-nav :title="$R('attest-phone')">
			<span slot="nav-right">
				<y-button type="text" to="" @click.native='submit'>{{$R('lawyer-done')}}</y-button>
			</span>
		</y-nav>
		<y-input v-model="Phone" :autofocus='true' type='Number' :maxlength='11' :disabled='PhoneDisabled' :placeholder="$R('remind-phone')" :show-text-length-info="false" class="input_txt--phone">
			<y-button slot='right' type='text' :class="{'class-disabled': isClass}"  @click.native='getVerifyCode'>{{securityCode}}</y-button>
		</y-input>
		<y-input v-model='verifyCode' :maxlength='6' :placeholder="$R('remind-verification-code')" :show-text-length-info="false"></y-input>
	</div>
</template>

<script>
	import {YNav} from '@/components/nav';
	import YInput from '@/components/input';
	import Button from '@/components/button';
	import Toast from '@/components/toast';
	export default {
		components: {
			YNav,
			YInput,
			[Button.name]: Button,
		},
		data() {
			return {
				securityCode: this.$R('get-verification-code'),
				count: 60,
				Phone: '',
				verifyCode: '',
				PhoneDisabled: false,
				isClass: false,
				vm: {
					data: {}
				}
			}
		},
		mounted() {
			this.vm = this.$localStore.get('petDeta');
			this.Phone = this.vm.data.cellPhone;
		},
		computed: {
			beforeDestroy() {
				clearInterval(this.interval);
			}
		},
		methods: {
			getVerifyCode() {
				if (this.Phone === '' || !/^1[3|4|5|7|8|9]\d{9}$/.test(this.Phone)) {
					return Toast(this.$R('error-phone'))
				}
				if (this.PhoneDisabled) return;
				this.$http.get(`/services/app/v1/user/smsauth/${this.Phone}/3`);
				this.count = 60;
				this.PhoneDisabled = true;
				this.isClass = true;
				this.interval = setInterval(() => {
					this.count = this.count - 1;
					this.securityCode = this.count + this.$R('get-verification-code-again');
					if (this.count <= 0) {
						this.PhoneDisabled = false;
						this.isClass = false;
						this.securityCode = this.$R('get-verification-code');
						clearInterval(this.interval);
					}
				}, 1000)
			},
			async submit() {
				console.log(typeof this.Phone)
				let length = this.Phone.length;
				if (this.Phone === '' || !/^1[3|4|5|7|8|9]\d{9}$/.test(this.Phone) || length <= 10) {
					Toast(this.$R('remind-phone')) 
					return;
				} else if (!this.verifyCode) {
					Toast(this.$R('remind-verification-code'))
				} else {
					var postData = {
						phone: this.Phone,
						code: '3',
						verifyCode: this.verifyCode
					};
					var httpUrl = await this.$http.post('/services/app/v1/user/smsauth/check', postData);
//					this.vm.data.cellPhone = this.Phone;
//					this.$router.back();
					if (httpUrl.data.data) {
						this.vm.data.cellPhone = this.Phone;
						this.$router.back();
					} else {
						Toast(this.$R('error-verification-code'));
					}
				}
			}
		}
	}
</script>

<style>
.class-disabled{
	color: #E8E8E8;
}
</style>