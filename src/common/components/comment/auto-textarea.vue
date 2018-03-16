<template>
	<textarea @blur="$emit('blur')" @focus.stop="$emit('focus')" @input="handleInput" @scroll="scroll" :placeholder="placeholder" v-model="temp_value" ref="input" class="auto-textarea-input">
	</textarea>
</template>

<script>
export default {
	name: "auto-textarea",
	data() {
		return {
			temp_value: (() => {
				return this.value;
			})()

		};
	},
	created() {
	},
	props: {
		value: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: ''
		},


	},
	methods: {
		scroll() {
			console.log("textarea滚动");
			// document.body.style.overflowY = "hidden";
		},

		handleInput(e) {
			this.updateHeight();
		},
		focus() {
			this.$refs.input.focus();
		},

		updateHeight(element = this.$refs['input']) {
			element.style.height = '';

			if (!element.value) {
				return;
			}

			this.$nextTick(() => {
				let inputHeight = element.scrollHeight;
				element.style.height = inputHeight + "px";
			});
		},

	},
	watch: {
		value: function (val, oldVal) {
			if (val.length > 200) {
				this.temp_value = oldVal
			} else {
				this.temp_value = val
			}
		},
		temp_value: function (val, oldVal) {
			this.$emit('input', val)
		}
	}
};
</script>
<style>
.auto-textarea-input {
	display: block;
	width: 100%;
	height: 0.53rem;
	top: 0px;
	left: 0;
	margin: 0;
	padding: 0.13rem .1rem .07rem;
	border-radius: 0.1rem;
	overflow-y: auto;
	color: #000;
	background: #fff;
	min-height: .7rem;
	max-height: 1.6rem;
	outline: none;
	border: none !important;
	resize: none;
	-webkit-appearance: none;
	font-size: .32rem;
	text-align: justify;
	line-height: 23px;
}
</style>