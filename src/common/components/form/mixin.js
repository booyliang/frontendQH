import Vue from 'vue'
export default {
	data() {
		return { 
			isFormControl: true,
			vm: {default: () => {}, type: Object}
		}
	},
	props: { 
		required: Boolean,
		regex: [String, RegExp],
		maxlength: Number,
		minlength: Number,
		requiredErrmsg: String,
		regexErrsg: String,
		maxlengthErrmsg: String,
		minlengthErrmsg: String,
		field: '',
		title: '',
	},
	mounted() {
		this.$eventBus.$emit('form-item-register', this);
	},
	watch: {
		// formItemValue(newVal, oldVal) {
		// 	this.$eventBus.$emit('form-item-updateValue', newVal);
		// }
	},
	methods: {

	}
};
