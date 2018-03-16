<!-- Authot: Boring -->

<template>
	<y-picker :selects="selects" v-model="pickerValue" @changed="handleChanged"></y-picker>
</template>

<script type="text/javascript">
	import Picker from '@/components/picker';

	import popupMixin from '@/components/popup/mixin';
	import pickerMixin from '@/components/picker/mixin';

	import 'core-js/fn/string/includes';
	import 'core-js/fn/string/pad-start';
	import 'core-js/fn/array/find-index';

	/**
	 * 生成线性递增的数字字符串，用于显示日期。
	 *
	 * @param {Number} length 需要的长度。
	 * @param {Number} start 起始值。
	 * @return {Array<String>} 一个线性递增的数字字符串组成的数组。
	 */
	function createLinearNumberStrings(length, start = 0) {
		return Array.from({
			length
		}, (item, index) => fixZero(index + start));
	}

	function fixZero(num) {
		let numStr = num.toString();

		if (numStr.length < 2) {
			numStr = numStr.padStart(2, '0');
		}

		return numStr;
	}

	let fieldHolders = {
		'Y': 'year',
		'y': 'year',
		'M': 'month',
		'D': 'day',
		'd': 'day',
		'H': 'hour',
		'h': 'hour',
		'm': 'minute',
		'S': 'second',
		's': 'second',
	};

	let defaultSelects = {
		year: {
			options: createLinearNumberStrings(100, 1949),
		},
		month: {
			options: createLinearNumberStrings(12, 1),
		},
		day: {
			options: createLinearNumberStrings(31, 1),
		},
		hour: {
			options: createLinearNumberStrings(24),
		},
		minute: {
			options: createLinearNumberStrings(60),
		},
		second: {
			options: createLinearNumberStrings(60),
		},
	};

	let fieldGetters = {
		year() {
			return this.date.getFullYear();
		},

		month() {
			return this.date.getMonth() + 1;
		},

		day() {
			return this.date.getDate();
		},

		hour() {
			return this.date.getHours();
		},

		minute() {
			return this.date.getMinutes();
		},

		second() {
			return this.date.getSeconds();
		},
	};

	export default {
		name: 'y-date-picker',

		mixins: [
			popupMixin,
			pickerMixin
		],

		components: {
			[Picker.name]: Picker
		},

		props: {
			value: {
				type: String,
				default() {
					return new Date().toString();
				}
			},
			format: {
				type: String,
				default: 'Y-M-D'
			}
		},

		data() {
			return {
				pickerValue: {},
				selects: []
			};
		},

		computed: {
			date() {
				// iOS 不支持连字符分隔。
				return new Date(this.value.replace(/-/g, '/'));
			},

			/**
			 * 需要启用的选择控件的字段名。
			 *
			 * @return {Array<String>}
			 */
			fields() {
				let fields = [];

				for (let holder in fieldHolders) {
					if (this.format.includes(holder)) {
						fields.push(fieldHolders[holder]);
					}
				}

				return fields;
			},
		},

		watch: {
			value(newValue) {
				this.initPickerValue();
			},

			pickerValue(newValue) {
				this.$emit('input', this.formatDate(newValue));
			}
		},

		methods: {
			/**
			 * 生成符合 Picker 需要的 value 值。
			 */
			initPickerValue() {
				let value = {};

				this.fields.forEach((field) => {
					let fieldValue = fieldGetters[field].call(this);

					// 如果不是合法值，赋值为 ''。
					value[field] = Number.isNaN(fieldValue) ? '' : fixZero(fieldValue);
				});

				this.pickerValue = value;
				this.cascadeSelects(this.pickerValue);
			},

			/**
			 * 格式化时间。
			 *
			 * @param {Object} pickerValue 符合 Picker 需要的 value 值。
			 * @return {String} 格式化后的时间。
			 */
			formatDate(pickerValue) {
				let result = this.format;

				for (let holder in fieldHolders) {
					let fieldValue = pickerValue[fieldHolders[holder]];

					if (fieldValue) {
						result = result.replace(holder, fieldValue);
					}
				}

				// 如果没有进行任何格式化：
				if (result === this.format) {
					return '';
				}

				return result;
			},

			/**
			 * 生成符合 Picker 需要的 selects。
			 */
			initSelects() {
				this.selects = this.fields.map((field) => {
					let select = Object.assign({}, defaultSelects[field]);

					return {
						name: field,
						...select,
					}
				});
			},

			handleChanged(pickerValue) {
				this.cascadeSelects(pickerValue);
			},

			/**
			 * 联动 selects。
			 *
			 * @param {Object} pickerValue 符合 Picker 需要的 value 值。
			 */
			cascadeSelects(pickerValue) {
				let month = pickerValue.month;
				let day = pickerValue.day;

				if (['04', '06', '09', '11'].includes(month)) {
					this.updateSelectOptions('day', createLinearNumberStrings(30, 1));
				} else if (month === '02') {
					if (this.isLeapYear(pickerValue.year)) {
						this.updateSelectOptions('day', createLinearNumberStrings(29, 1));
					} else {
						this.updateSelectOptions('day', createLinearNumberStrings(28, 1));
					}
				} else {
					this.resetSelectOptions('day');
				}
			},

			updateSelectOptions(field, newOptions) {
				let fieldIndex = this.getSelectIndex(field);
				this.selects.splice(fieldIndex, 1, Object.assign({}, this.selects[fieldIndex], {
					options: newOptions
				}));
			},

			resetSelectOptions(field) {
				this.updateSelectOptions(field, defaultSelects[field].options);
			},

			getSelectIndex(field) {
				return this.selects.findIndex((select) => select.name === field);
			},

			isLeapYear(year) {
				if (year % 100 === 0) {
					return year % 400 === 0;
				} else {
					return year % 4 === 0;
				}
			}
		},

		created() {
			this.initSelects();
			this.initPickerValue();
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";
</style>