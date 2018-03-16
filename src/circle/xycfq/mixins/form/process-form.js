export default {
	data() {
		return {
			typeName: this.$route.meta.type,
			contextName: this.$route.meta.context,
		};
	},

	computed: {
		type() {
			return this.types[this.typeName];
		},

		context() {
			return this.contexts[this.contextName];
		},
	}
};