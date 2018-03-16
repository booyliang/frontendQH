<template></template>

<script>
	export default {
		data() {
			return {
				messages: {
					'001': {
						link: '/product/list/user-type/:id'
					},
					'002': {
						link(id) {
							return `/${this.entries[id]}`;
						}
					},
					'003': {
						link: '/user/profile'
					},
					'004': {
						link: '/user/order/tab/2'
					},
					'005': {
						link: '/user/repayment/payall/:id'
					},
					'006': {
						link(id) {
							return `/${this.entries[id]}`;
						}
					},
					'007': {
						link: '/user/repayment/payall/:id'
					},
					'008': {
						link: '/user/credit'
					},
					'009': {
						link: '/user/credit'
					},
					'010': {
						link: '/user/additional-profile'
					},
					'011': {
						link: '/user/additional-profile'
					},
				},
				entries: {
					'1': 'xyzx',
					'2': 'xysx',
				}
			};
		},

		methods: {
			to404() {
				this.$eventBus.$emit('global-message', {
					type: 'notfound',

					action(app) {
						app.currentView = 'y-not-found';
					}
				});
			}
		},

		mounted() {
			const messageId = this.$route.params['messageId'];
			const messageConfig = this.messages[messageId];

			if (!messageConfig) {
				console.error(`"${messageId}" is an invalid message id.`);
				this.to404();
				return;
			}

			const linkTemplate = messageConfig.link;
			const id = this.$route.params['id'];
			const link = typeof linkTemplate === 'function'
				? linkTemplate.call(this, id)
				: linkTemplate.replace(':id', id);
			this.$router.replace(link);
		}
	};
</script>