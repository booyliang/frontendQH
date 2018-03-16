export default {
	created() {
		if (!this.$circle.phone) {
			this.$router.replace({
				name: 'mobile-binding',
				query: {
					from: this.$route.fullPath
				}
			});
		}
	}
};