<template>
	<div :class="hasCollect ? 'select-state' : 'not-select-state'" @click="handleCollect">
	</div>
</template>
<script>
import Toast from '@/components/toast'
export default {
	name: 'y-comment-collect',
	props: {
		data: {
			type: Object,
			default: () => { }
		},
		useOpusApi: Boolean,
	},
	data() {
		return {
			hasCollect: false,
			disable: true
		}
	},
	watch: {
		data() {
			this.check();
		}
	},
	mounted() {
		this.check();
	},
	methods: {
		async check() {
			if (!this.useOpusApi) {
				if (!this.data.moduleEnum) return;
			}
			if (!this.data || !this.data.id) return;
			if (!this.$env.custId) return;
			let params = {
				moduleEnum: this.data.moduleEnum || '',
				infoId: this.data.id,
				resourceId: this.data.resourceId
			}
			let res = null;
			if (this.useOpusApi) {
				res = await this.$opusApi.post('/yyl/v1/store/check', params)
			} else {
				res = await this.$http.post('/services/app/v1/store/check', params)
			}
			if (res.data.code === "200" || res.data.msg === 'success') {
				this.hasCollect = res.data.data;
			} else {
				Toast(res.data.msg);
			}
		},
		async handleCollect() {
			await this.$user.login();
			if (this.disable) {
				this.disable = false;
				if (this.hasCollect) {
					let params = {
						moduleEnum: this.data.moduleEnum,
						infoId: this.data.id,
						// authorId: this.data.createUserId
						targetResourceId: this.data.resourceId
					}
					let res = null;
					if (this.useOpusApi) {
						res = await this.$opusApi.post('/yyl/v1/store/single/del', params)
					} else {
						res = await this.$http.post('/services/app/v1/store/single/del', params)
					}
					if (res.data.code === "200" || res.data.msg === 'success') {
						this.hasCollect = false;
					} else {
						Toast(res.data.msg);
					}
					this.disable = true;
				}
				else {
					let shareTitle = this.data.title ? this.data.title.substring(0, 20) : '';
					// let imgUrl = this.data.coverPlanUrl || this.data.videoThumbnailUrl || this.data.imgUrl || '';
					let imgUrl = this.data.coverPlanUrl || this.data.videoThumbnailUrl;
					if (!imgUrl) {
						if (this.data.audioUrl) {
							// 含有音频，显示音频默认图片
							imgUrl = `${window.location.origin}/assets/static/audio-cover.png`;
						} else {
							imgUrl = this.data.imgUrl || '';
						}
					}
					let imgArray = imgUrl ? imgUrl.split(',') : [];
					if (imgArray.length > 3) {
						imgArray = imgArray.splice(0, 3);
					}
					let imgStr = imgArray.join(",");
					var shareData = {
						authorId: this.data.createUserId,
						infoDesc: this.data.description ? this.data.description : this.data.content.substring(0, 70),
						infoId: this.data.id,
						storeUrl: this.$utils.getShareUrl(),
						moduleEnum: this.data.moduleEnum || '',
						infoPic: imgStr,
						infoThumbnail: "",
						infoVideo: "",
						infoTitle: shareTitle,
						createUserId: this.$env.userId,
						userId: this.$env.custId,
						targetResourceId: this.data.resourceId,
						coterieId: this.data.coterieId,
						resourceId: this.data.resourceId,
					};

					if (this.data.moduleEnum) {
						let Module = this.$utils.getModule(this.data.moduleEnum);
						if (Module.favorite) {

							shareData = Object.assign(shareData, Module.favorite.call(this, this.data));
						}
					}

					let res = null;
					if (this.useOpusApi) {
						res = await this.$opusApi.post('/yyl/v1/store/single', shareData)
					} else {
						res = await this.$http.post('/services/app/v1/store/single', shareData)
					}
					if (res.data.code === "200" || res.data.msg === 'success') {
						this.hasCollect = true;
					} else {
						Toast(res.data.msg);
					}
					this.disable = true;
				}
			}
		}
	}
}

</script>

