import PublishDialog from './publish-dialog'
import Toast from '../toast'
export default {
	data() {
		return {
			forbidRouteLeave: false
		}
	},
	mounted() {
		this.$eventBus.$on('publish', this.$publish);
		this.$eventBus.$on('cancel-publish', this.$publishCancel);
	},
	beforeDestroy() {
		this.$eventBus.$off('publish', this.$publish);
		this.$eventBus.$off('cancel-publish', this.$publishCancel);
	},
	beforeRouteLeave(to, from, next) {
		if (this.forbidRouteLeave) {
			this.$dialog.confirm({
				title: '',
				message: '是否要离开当前页面？',
				okText: '确定',
				cancelText: '取消',
			}).then(() => {
				this.$afterPublish();
				next();
			}).catch(() => next(false))
		} else {
			next();
		}
	},
	methods: {
		async $publish() {
			this.forbidRouteLeave = false;
			if (this.validate) {
				try {
					let passed = await this.validate();
					if (passed === false) {
						this.$eventBus.$emit('publish-button-disable', false);
						return;
					}
				} catch (ex) {
					this.$eventBus.$emit('publish-button-disable', false);
					return;
				}
			}
			this.forbidRouteLeave = true;
			this.$eventBus.$emit('publish-button-disable', true);
			PublishDialog.open();

			// publish方法是promise，则自动还原状态
			let promise = this.publish();
			if (promise instanceof Promise) {
				promise.then(this.$afterPublish)
					.catch(this.$afterPublish)

			}





		},
		$afterPublish() {
			this.forbidRouteLeave = false;
			this.$eventBus.$emit('publish-button-disable', false);
			PublishDialog.close();

		},
		publishCancel() {
			this.$afterPublish();
		},
		publishSuccess(nextUrl) {
			this.$afterPublish();
			this.$utils.refreshOnBack();
			nextUrl && this.$router.replace(nextUrl);
		},
		publishError(msg) {
			this.$afterPublish();
			msg && Toast(msg);
		},
		translateContent(contentSource) {
			let content = '', imgs = [], videoUrl, audioUrl;
			contentSource.forEach(item => {
				let type = Object.keys(item)[0];
				if (type === 'text') {
					content += item.text;
				}
				if (type === 'image') {
					imgs.push(item.image)
				}
				if (type === 'video') {
					videoUrl = item.video.videoUrl;
				}
				if (type === 'audio') {
					audioUrl = item.audio.audioUrl;
				}
			})
			return {
				content,
				videoUrl,
				audioUrl,
				imgs: imgs.join(',')
			}
		},
	}
}
