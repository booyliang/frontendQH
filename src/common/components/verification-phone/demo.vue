<template>
	<div class="demo">
		<y-verification-phone v-model="value"></y-verification-phone>
		<y-button @click.native="submit">提交</y-button>
	</div>
</template>

<script type="text/javascript">
import VerificationPhone from './main';
import Button from '@/components/button';
export default {
	components: {
		[VerificationPhone.name]: VerificationPhone,
		[Button.name]: Button,
	},
	data() {
		return {
			value: {
				phone: "",
				verifyCode: ""
			}
		}
	},
	methods: {
		submit() {
			console.log('this.value.phone', this.value.phone + "||" + this.value.verifyCode);
		}
	}
};
</script>

<style type="text/css" >
@import "#/css/var.css";
</style>