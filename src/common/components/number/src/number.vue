/**
*	Author: yefan
*
*/
<template>
	<div class="input-number">
		<span class="button-sub" @click.stop="subtraction" :class="{'button-disabled': disabledMin || disabled}">
			<i class="iconfont icon-minu"></i>
		</span>
		<input @click.stop @blur="handleBlur" :readonly="disabled" v-model.number="currentVal">
		<span class="button-plus" @click.stop="addition" :class="{'button-disabled': disabledMax || disabled}">
			<i class="iconfont icon-plus"></i>
		</span>
	</div>
</template>
<script>
export default {
	name: 'y-number',
	props: {
		value: {
			type: Number,
			default: 0
		},
		min: Number,
		max: Number,
		disabled: Boolean
	},
	data() {
		return {
			currentVal: 0
		}
	},
	watch: {
		value(newVal, oldVal) {
			if (newVal === oldVal) return;
			this.currentVal = this.value;
		},
		currentVal(newVal, oldVal) {
			if (this.currentVal === this.value || this.currentVal === '') return;
			if (isNaN(parseInt(newVal))) {
				this.currentVal = 0;
			}
			this.$emit('input', this.currentVal);
			this.$emit('change', this.currentVal);
		}
	},
	computed: {
		disabledMin() {
			return typeof this.min === 'undefined' ? false : (this.currentVal === '' ? true : this.currentVal <= this.min)
		},
		disabledMax() {
			return typeof this.max === 'undefined' ? false : (this.currentVal === '' ? true : this.currentVal >= this.max)
		}
	},
	methods: {
		handleBlur() {
			if (this.currentVal === '') {
				this.currentVal = this.min || 0;
			} else if (this.min && this.currentVal < this.min) {
				this.currentVal = this.min
			} else if (this.max && this.currentVal > this.max) {
				this.currentVal = this.max;
			}
		},
		subtraction() {
			if (!this.disabledMin && !this.disabled) {
				this.currentVal -= 1;
			}
		},
		addition() {
			if (!this.disabledMax && !this.disabled) {
				this.currentVal += 1;
			}
		}
	},
	mounted() {
		this.currentVal = this.value;
	}
}
</script>
<style>
@import '#/css/var.css';
.input-number {
	display: flex;
	width: 2rem;
	height: 0.5rem;
	background-color: #f8f8f8;
	border-radius: 0.05rem;
	border: 1px solid #d7d7d7;
	& .button-plus,
	& .button-sub {
		position: relative;
		width: .5rem;
		color: var(--theme-color);
		& i {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		&.button-disabled {
			color: #bfbfbf;
		}
	}
	& input {
		flex: 1 0 1rem;
		width: 1rem;
		padding: 0 0.1rem;
		background-color: #fff;
		text-align: center;
		border: none;
		border-left: 1px solid #d7d7d7;
		border-right: 1px solid #d7d7d7;
		border-radius: 0;
	}
}
</style>
