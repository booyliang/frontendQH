// author： AiQingmin
<template>
	<div class="form">
		<slot></slot>
	</div>
</template>
<script>
import {YFormInput} from '@/components/form'
import * as FormValidate from '@/utils/form-validator'
export default {
	name: 'y-form',
	components: {
		YFormInput
	},
	props: {
		value: {type: Object, default: () => {}},
	},
	data() {
		return {
			validateResults: [],
			errorList: []
		}
	},
	methods: {
		// base child component register field
		registerField(formItem) {
			let {field} = formItem;
			if (this.value[field] === undefined) {
				this.$set(this.value, field, '');
			}
			// this.$eventBus.$emit('form-value', this.value[field]);
			formItem.vm = this.value

		},
		// form component expose validate method
		validate() {
			let validateResults = [];
			for (let child of this.$children) {
				if (!child.isFormControl) continue;
				let result = {};
				if (typeof child.validate === 'function') {
					result = child.validate();
				} else {
					result = FormValidate.validate(this.value[child.field], child.$props);
				}
				if (result.hasError) {
					validateResults.push(result);
					if (child.$data.hasOwnProperty('hasError')) {
						child.$data.hasError = true;
					}
				}
			}
			if (validateResults.length > 0) {
				console.log('validateResults', validateResults);
				this.showErrList(validateResults);
				return validateResults;
			}
		},
		// form validation message
		showErrList(errorArr) {
			if (!errorArr) {
				return;
			}
			let errorList =  errorArr.map((result) => {
				return result.errors[0].errorMessage
			})
			for (let child of this.$children) {
				if ( child.hasOwnProperty('errorList') ) {
					child.errorList = errorList;
				}
			}
		},
		
	},
	beforeDestroy() {
		this.$eventBus.$off('form-item-register', this.registerField);		
	},
	created() {
		this.$eventBus.$on('form-item-register', this.registerField);		
	},
	// beforeRouteLeave(to, from, next) {
	// 	alert('leave form');
	// 	// this.$refs.demoForm.closeModel();
	// 	next();
	// },
	
	

}
</script>
<style>
.form{
	& .form_item{
		margin-top: 0.2rem;
	}
	& .form_error{
		color: red;
		padding: 0 0.3rem;
		& li{
			list-style: decimal;
		}
		
	}
}
</style>

