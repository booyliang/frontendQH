import AuthUpload from '../../components/auth-upload';

export default {
	components: {
		[AuthUpload.name]: AuthUpload
	},

	watch: {
		localValue: {
			deep: true,

			handler(newValue) {
				this.save();
			}
		}
	}
};
