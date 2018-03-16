/**
*	Author: huliang
*
*/
<template>
	<div class="phone-main">
		<y-item>
			<y-input v-bind="$props" v-model="values.phone" :maxlength='11' slot='head' :disabled='start1' :placeholder="$R('remind-phone')" type="number"></y-input>
			<y-click-button slot="foot" :start.sync='start1' @click.native='onClick' :smsStyles='styles'>
			</y-click-button>
		</y-item>
		<y-input v-bind="$props" v-model="values.verifyCode" :maxlength='6' :placeholder="$R('remind-verification-code')" class="verifyCode" type="number"></y-input>
	</div>
</template>

<script type="text/javascript">
import YInput from '@/components/input';
import YClickButton from './click-button';
import YItem from '@/components/item';
import Toast from '@/components/toast';
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
	},

	data() {
		return {
			start1: false,
			smsStyles: {
				background: '#f4f4f4',
				color: "#fff"
			},
			styles: {},
			PhoneDisabled: false,
			values: this.value
		}
	},
	// computed: {
	// 	styles() {
	// 		return this.styles = this.start1 ? this.smsStyles : ''
	// 	}
	// },
	mounted() {
		// console.log(this.Phone)
	},
	methods: {
		onClick() {
			if (this.values.phone === '' || !/^((13[0-9])|(14[1456789])|(15[0-9])|166|(17[0134678])|(18[0-9])|(19[8-9]))\d{8}$/.test(this.values.phone)) {
				return Toast(this.$R('toast-correct-phone'));
			} else {
				this.$http.get(`/services/app/v1/user/smsauth/${this.values.phone}/3`).then(res => {
					if (res.data.code === "200") {
						this.start1 = true;
					} else {
						Toast(this.$R('toast-correct-phone'))
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
	& .item {
		padding: 0;
	}
	& .item-wrap {
		padding: 0;
	}
	& .text-length-info {
		display: none;
	}
	& .verifyCode {
		@apply --border-top;
	}
}
</style>