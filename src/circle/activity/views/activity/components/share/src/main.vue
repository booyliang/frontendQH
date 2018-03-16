<template>
	<div class="platform-share">
		<div class="share-content">
			<div v-for="(action, index) in shareActions" :key="index" @click="doAction(action)" class="share-item icon-share" :class="`icon-${ action.plat }`">
				<span v-text="action.text"></span>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
export default {
	name: 'y-share',
	components: {
	},
	props: {
		handle: String,
		data: Object,
		actions: Array,
	},
	data() {
		return {
			shareActions: [],
			shareParmas: {},
			shareTitle: '赶快分享给更多朋友加入进来',
			defaultActions: [
				{
					plat: 'YRIM',
					text: this.$R("share-YRIM")
				},
				// {
				// 	plat: 'YRShow',
				// 	text: this.$R("share-YRShow")
				// },
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
			let imgUrl = data.coverPlanUrl || data.videoThumbnailUrl || data.imgUrl || '';
			let content = data.description || data.content || '';
			let title = data.title || content;
			let url = data.url;
			let shareData = {
				content: content.substring(0, 75),
				plat,
				url: url || this.$utils.getShareUrl(),
				circleKey: this.$circle.appId,
				pic: imgUrl.split(',')[0],
				title: this.$R("rz-yryz") + title.substring(0, 20)
			};
			if (data.moduleEnum) {
				let Module = this.$utils.getModule(data.moduleEnum);
				if (Module.share) {
					shareData = Object.assign(shareData, Module.share.call(this, data, plat));
				}
			}
			return shareData;
		},
		async doAction(action) {
			if (action.plat === 'YRIM') await this.$user.login();
			let data = this.data || this.shareParmas;
			let shareData = this.getShareData(data, action.plat);
			if (this.$env.custId) {
				let params = {
					moduleEnum: data.moduleEnum,
					infoId: data.id,
					targetUserId: data.createUserId,
					contentDesc: data.content ? data.content.substring(0, 70) : '',
					contentUrl: this.$utils.getShareUrl(),
					contentTitle: data.title ? data.title.substring(0, 20) : '',
					targetResourceId: data.resourceId,
				}
				this.$opusApi.post('/yyl/v1/share/single', params);
			}
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
.platform-share {
	& .icon-share {
		width: 0.8rem;
		height: 1.4rem;
		background-repeat: no-repeat;
		background-position: center top;
		background-size: 0.8rem;
	}

	& .share-content {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		border: none;
		height: 3.6rem;
		padding: 0.1rem .4rem;
		text-align: -webkit-center;
		align-content: space-between;
	}

	& .share-item {
		width: 33.3%;
		padding-top: 0.96rem;

		&+.share-item {
			margin-bottom: 0.2rem;
		}
	}
}
</style>
