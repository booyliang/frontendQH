<template>
	<y-button :style="btnStyle" type="text" :disabled="Disabled">
		{{content}}</y-button>
</template>

<script>
import Button from '@/components/button';
export default {
	props: {
		initText: {
			type: String,
			default: '发送验证码'
		},
		firstCkText: {
			type: String,
			default: ''
		},
		secondCKText: {
			type: String,
			default: '重新获取'
		},
		start: {
			type: Boolean,
			default: false
		},
		smsStyles: Object
	},
	components: {
		[Button.name]: Button,
	},
	data() {
		return {
			myTime: null,
			flag: false,
			Disabled: false
		}
	},
	computed: {
		btnStyle() {
			let styles = {
				// fontSize: '13px',
				// height: '100%',
				// padding: '0',
				// borderRadius: '0',
				// background: '#f4f4f4',
				// color: "#E8E8E8"
			}
			return Object.assign(styles, this.smsStyles)
		},
		content() {
			if (typeof this.myTime === "number" && this.flag === true) {
				return `${this.myTime}s`
			} else if (typeof this.myTime === "number") {
				return `${this.firstCkText}${this.myTime}s`
			} else {
				return this.initText
			}
		}
	},
	methods: {
		countDown() {
			this.myTime = 60;
			this.Disabled = true;
			let time = setInterval(() => {
				this.myTime--;
				if (this.myTime === 0) {
					this.$emit('update:start', false);
					this.myTime = this.initText;
					this.flag = true;
					clearInterval(time)
					this.Disabled = false;
				}
			}, 1000)
		}
	},
	watch: {
		start(value) {
			if (value === true) {
				this.countDown()
			}
		}
	}
}
</script>
