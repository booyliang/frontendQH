export default {
	methods: {
		open() {
			this.$children[0].open();
		},

		close() {
			this.$children[0].close();
		},
	},

	popupImpl: undefined
};