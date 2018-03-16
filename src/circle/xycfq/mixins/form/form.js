import Album from '@/components/album';
import AuthFileList from '../../components/auth-file-list';
import AuthFileItem from '../../components/auth-file-item';
import FormTip from '../../components/form-tip';

import Validator from '@/utils/validator';

export default {
	components: {
		[Album.name]: Album,
		[AuthFileList.name]: AuthFileList,
		[AuthFileItem.name]: AuthFileItem,
		[FormTip.name]: FormTip,
	},

	data() {
		return {
			fieldName: this.$route.query.field,
			album: [],
			submitDisabled: false
		};
	},

	computed: {
		validator() {
			const rules = {};

			for (let fieldName in this.fields) {
				const field = this.fields[fieldName];

				if (field.rules) {
					rules[fieldName] = field.rules;
				}
			}

			return new Validator(rules);
		},

		formClassList() {
			return [
				'form',
				{
					readonly: this.formReadonly
				}
			];
		}
	},

	watch: {
		fields: {
			deep: true,

			handler(newValue) {
				console.log(newValue);
				this.initAlbum();
			}
		}
	},

	filters: {
		placeholder(text, prefix) {
			return `请填写${prefix || ''}${text}`;
		}
	},

	methods: {
		getFieldRoute(fieldName) {
			return this.formReadonly ? undefined : {
				query: {
					'field': fieldName
				}
			};
		},

		getFieldText(fieldName) {
			const field = this.fields[fieldName];
			const value = field.value;
			return typeof value !== 'undefined' ? (field.display ? field.display(value) : value) : '';
		},

		getApiFields() {
			const fields = {};

			for (let fieldName in this.fields) {
				const field = this.fields[fieldName];
				const apiFieldName = field.apiField;

				if (apiFieldName) {
					fields[apiFieldName] = field.value;
				}
			}

			return fields;
		},

		setFields(fieldNames) {
			for (let fieldName in this.fields) {
				if (fieldNames && !fieldNames.includes(fieldName)) {
					continue;
				}

				const field = this.fields[fieldName];
				this.$set(field, 'value', this.userData[field.apiField]);
			}
		},

		getFieldClass(fieldName) {
			return {
				'error': this.fields[fieldName].error
			};
		},

		getFieldNameByApiFieldName(apiFieldName) {
			for (let fieldName in this.fields) {
				if (this.fields[fieldName].apiField === apiFieldName) {
					return fieldName;
				}
			}
		},

		initAlbum() {
			this.$nextTick(() => {
				const fileList = this.$refs['file-list'];

				if (!fileList) {
					return;
				}

				this.album = fileList.$children
					.map((item) => item.value)
					.filter((item) => !!item);
				Album.init(this.album, {});
			});
		},

		showAlbum(event) {
			const index = this.album.findIndex((item) => item === event.target.getAttribute('src'));
			Album.show(index);
		}
	},

	beforeRouteEnter(to, from, next) {
		next((vm) => {
			vm.fieldName = vm.$route.query['field'];
		});
	},

	beforeRouteUpdate(to, from, next) {
		this.fieldName = to.query['field'];
		next();
	}
};