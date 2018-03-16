export default {
	data() {
		return {
			userData: {},
		};
	},

	computed: {
		status() {
			return this.userData[this.statusField];
		},

		inUser() {
			return this.contextName === 'user';
		},

		formReadonly() {
			return this.inUser && ![
				0,
				2
			].includes(this.status);
		},

		formEditing() {
			return this.inUser && this.status === 2;
		}
	},

	methods: {
		async initUserData() {
			this.userData = (await this.$http({
				url: '/services/app/v1/flowInfo/credit/info'
			})).data.data;
			// Object.assign(this.userData, {
			// 	applyEntry: 2,
			// 	creditSupplyStatus: 6,
			// 	unqualifiedMsg: 'a'
			// });
			this.typeName = ({
				1: 'xyzx',
				2: 'xysx',
			})[this.userData.applyEntry];
		},

		handleErrorFields() {
			this.userData.unqualifiedList.forEach((apiFieldName) => {
				const fieldName = this.getFieldNameByApiFieldName(apiFieldName);
				const field = this.fields[fieldName];

				if (!field) {
					return;
				}

				this.$set(field, 'error', true);

				this.$watch(() => this.fields[fieldName].value, (newValue) => {
					if (newValue === this.userData[apiFieldName]) {
						this.$set(field, 'error', true);
					} else {
						this.$set(field, 'error', false);
					}
				});
			});
		}
	},

	async created() {
		if (this.contextName !== 'user') {
			return;
		}

		await this.initUserData();
		this.setFields();

		if (this.formEditing) {
			this.handleErrorFields();
		}

		this.doUser();
	},
};