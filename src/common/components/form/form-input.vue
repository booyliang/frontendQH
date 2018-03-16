<template>
	<div class="form_item" :class="{'error_class': hasError}">
		<div v-if="withLabel" class="label_input">
			<y-item :title="title" v-bind="$props" :vertical="type==='textarea'"> 
				<y-input v-bind="$props" v-model="vm[field]" :showTextLengthInfo="false || type==='textarea'" slot="foot"></y-input>
			</y-item>	
		</div>
		<div v-else>
			<y-input v-bind="$props" v-model="vm[field]"></y-input>
		</div>
	</div>
</template>
<script>
import YInput from '@/components/input'
import FormBase from './mixin'
import YItem from '@/components/item'
export default {
	name: 'y-form-input',
	components: {
		YInput, YItem
	},
	mixins: [FormBase],
	props: {
		...YInput.props,
		withLabel: { type: Boolean, default: false },
	},
	data() {
		return {
			hasError: false,
		}
	},
	methods: {},
	watch: {
		'vm.field': function (newVal, oldVal) {
			// 输入时清除错误样式
			this.hasError = false;
		}
	},
}
</script>
<style>
.form_item {
	& .label_input {
		& input{
			text-align: right;
		}
		& .item--vertical{
			& input{
				text-align: left;
			}
			& .y-input-wrap.y-textarea textarea {
				min-height: 0.8rem;
			}
		}
		
	}
}
.error_class {
	& input{
		color: red;
	}
}
</style>

