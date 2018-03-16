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
		useOpusApi: Boolean,
		actions: Array
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
	computed: {
		handleElement() {
			return document.querySelector(this.handle);
		},
		devType() {  // 机型
			let devType = this.$env.devType;
			if (devType === 0) {
				return 'Andriod';
			} else if (devType === 1) {
				return 'iOS ';
			} else {
				return 'PC';
			}
		}
	},
	methods: {
		getShareData(data, plat) {
			let imgUrl = data.coverPlanUrl || data.videoThumbnailUrl || data.imgUrl;
			let content = data.description || data.content || '圈子有了，一切都有了！进圈乎 玩圈子 共享资源 价值变现';
			let title = data.title || '圈子有了，一切都有了！';
			let url = data.url;
			let shareData = {
				content: content.substring(0, 100),
				plat,
				url: url || this.$utils.getShareUrl(),
				circleKey: this.$circle.appId,
				pic: imgUrl.split(',')[0],
				title: this.$R("rz-yryz") + title.substring(0, 30)
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
			let shareContent = {
				'0240': "私圈问答",
				'0221': "私圈活动",
				'0230': "私圈话题",
				'0210': "私圈资源",
				'0091': "圈子资源",
			}
			if (this.$env.custId) {
				let params = {
					moduleEnum: data.moduleEnum,
					infoId: data.id,
					targetUserId: data.createUserId || '',
					contentDesc: data.content ? data.content.substring(0, 70) : '',
					contentUrl: this.$utils.getShareUrl() || '',
					contentTitle: data.title ? data.title.substring(0, 20) : '',
					targetResourceId: data.resourceId || '',
					coterieId: data.coterieId || '',
					eventType: 40,
					userId: this.$env.custId,
				}
				// usePousApi:平台, isReward:悬赏,其余的来自圈子内
				if (this.useOpusApi) {
					this.$opusApi.post('/yyl/v1/share/single', params);
				} else if (data.isReward) {
					this.$openApi.post('/api/v3/event/record', params);
				} else {
					this.$http.post('/services/app/v1/share/single', params);
				}
			}
			// 埋点
			window.zhuge.track('资源分享', {
				'用户id': this.$env.custId, // 用户id
				'机型': this.devType, // 设备类型 Andriod ios
				'圈子名称': this.$circle.circleName, // 圈子名称
				'分享渠道': shareData.plat, // 分享渠道
				'类容类型': shareContent[`${data.moduleEnum}`],
			});
			
			this.$yryz.shareToOtherPlat(shareData);

			// 点击关闭
			this.close();
		},
		open(data, useOpusApi, actions) {
			if (data) {
				this.shareParmas = data;
			}
			if (useOpusApi) {
				this.useOpusApi = useOpusApi;
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
		this.$eventBus.$on('share', this.open);
		if (this.handleElement) {
			this.handleElement.addEventListener('click', this.open);
		}
		this.shareActions = this.defaultActions;
	},
	beforeDestroy() {
		this.$eventBus.$off('share', this.open);
	},
};
</script>

<style type="text/css">
@import '#/css/var.css';

.icon-share {
	width: 0.8rem;
	height: 1.4rem;
	background-repeat: no-repeat;
	background-position: center top;
	background-size: 0.8rem;
}

.share {
	@apply --full;
	position: fixed;
	z-index: 999;

	&.share-enter-active,
	&.share-leave-active {
		transition: visibility 0.3s;

		&>.mask,
		& .share-alert {
			transition: inherit;
		}
		&>.mask {
			transition-property: opacity;
		}
		& .share-alert {
			transition-property: transform;
		}
	}

	&.share-enter,
	&.share-leave-to {
		visibility: hidden;

		&>.mask {
			opacity: 0;
		}
		& .share-alert {
			transform: translate(0, 100%);
		}
	}
}

.share>.mask {
	@apply --full;
}

.share-alert {
	position: absolute;
	right: 0;
	left: 0;
	bottom: 0;
	background: #fff;
	text-align: center;
}

.share-header {
	height: .88rem;
	line-height: .88rem;
}

.share-title {
	font-size: var(--default-font-size);
	color: var(--text-secondary-color);
}

.share-content {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	@apply --border-top;
	@apply --border-bottom;
	/* height: 4.6rem; */
	height: auto;
	padding: .6rem;
	text-align: -webkit-center;
	align-content: space-between;
	color: var(--text-secondary-color);
}

.share-item {
	width: 25%;
	padding-top: 0.96rem;

	&+.share-item {
		margin-bottom: 0.2rem;
	}
}

.share-footer {
	height: .8rem;
	line-height: .8rem;
	font-size: var(--default-font-size);
	color: var(--text-secondary-color);
}

.icon-YRShow {
	background-image: url(../../assets/share_icon_youyou@2x.png);
}

.icon-YRIM {
	background-image: url(../../assets/share_icon_talk@2x.png);
}

.icon-WeChat {
	background-image: url(../../assets/share_icon_wechat@2x.png);
}

.icon-WeChatLine {
	background-image: url(../../assets/share_icon_quan@2x.png);
}

.icon-QQ {
	background-image: url(../../assets/share_icon_qq@2x.png);
}

.icon-QQZone {
	background-image: url(../../assets/share_icon_qqeara@2x.png);
}

.icon-Sina {
	background-image: url(../../assets/share_icon_sina@2x.png);
}
</style>
