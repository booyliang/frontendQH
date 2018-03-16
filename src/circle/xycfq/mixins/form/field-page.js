import Validator from '@/utils/validator';

import 'core-js/fn/array/find';

export default {
	props: {
		title: String,
		value: [
			String,
			Number
		],
		name: String
	},

	data() {
		return {
			localValue: this.value
		};
	},

	computed: {
		validator() {
			if (!this.rules) {
				return;
			}

			return new Validator(this.rules);
		},

		checkList() {
			const checkList = Object.assign([], this.baseCheckList);

			if (typeof this.localValue !== 'undefined' && this.localValue !== null) {
				checkList.find((item) => item.id === this.localValue).checked = true;
			}

			return checkList;
		}
	},

	methods: {
		async handleSave() {
			if (this.validator) {
				await this.validator.validate(this.name, this.localValue);
			}

			this.save();
		},

		save(value = this.localValue) {
			this.$emit('input', value);
			this.$router.back();
		},

		handleChecked(item) {
			this.save(item.id);
		}
	}
};