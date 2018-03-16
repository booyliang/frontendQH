<template>
	<transition name="share">
		<div v-show="visible" class="share">
			<y-mask @click.native="close"></y-mask>
			<div class="share-alert">
				<div class="share-header">
					<h1 class="share-title" v-text="shareTitle"></h1>
				</div>
				<div class="share-content">
					<div v-for="(action, index) in shareActions" :key="index" @click="doAction(action)" class="share-item icon-share" :class="`icon-${ action.plat }`">
						<span v-text="action.text"></span>
					</div>
				</div>
				<div class="share-footer">
					<div @click="close" v-text="shareCencel" class="share-cencel"></div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script type="text/javascript">
import Mask from '@/components/mask';
export default {
	name: 'y-share',
	components: {
		[Mask.name]: Mask
	},
	props: {
		handle: String,
		data: Object,
		actions: Array,
	},
	data() {
		return {
			visible: false,
			shareActions: [],
			shareParmas: {},
			shareTitle: this.$R("share-to"),
			shareCencel: this.$R("cancel"),
			defaultActions: [
				{
					plat: 'YRIM',
					text: this.$R("share-YRIM")
				},
				{
					plat: 'YRShow',
					text: this.$R("share-YRShow")
				},
				{
					plat: 'WeChat',
					text: this.$R("share-WeChat")
				},
				{
					plat: 'WeChatLine',
					text: this.$R("share-WeChatLine")
				},
				{
					plat: 'QQ',
					text: this.$R("share-QQ")
				},
				{
					plat: 'QQZone',
					text: this.$R("share-QQZone")
				},
				{
					plat: 'Sina',
					text: this.$R("share-Sina")
				}
			]
		};
	},
	methods: {
		getShareData(data, plat) {
			let imgUrl = data.coverPlanUrl;
			let content = data.description || data.content || '';
			let title = data.title || content;
			let url = data.url;
			let shareData = {
				content: content.substring(0, 75),
				plat,
				url: url || this.$utils.getShareUrl(),
				pic: imgUrl.split(',')[0],
				title: title
			};
			return shareData;
		},
		async doAction(action) {
			let data = this.data || this.shareParmas;
			let shareData = this.getShareData(data, action.plat);
			try {
				await this.$yryz.shareToOtherPlat(shareData)
				this.$toast('分享成功！');
			} catch (err) {
				if (err.errMsg === 'shareToOtherPlat:cancel') {
					this.$toast('分享已取消');
				} else {
					this.$toast('分享失败！');
				}
			}
		},
		open(data, actions) {
			if (data) {
				this.shareParmas = data;
			}
			if (actions) {
				this.shareActions = this.defaultActions.filter(key => actions.includes(key.plat));
			}
			this.visible = true;
		},
		close() {
			this.visible = false;
		}
	},

	mounted() {
		if (this.actions) {
			this.shareActions = this.defaultActions.filter(key => this.actions.includes(key.plat));
			return false;
		}
		this.shareActions = this.defaultActions;
	}
};
</script>

<style type="text/css">
@import '#/css/var.css';
</style>
