<template>
	<div class="temporary_activity-share_detail">
		<y-nav title="长江商报·红牛2017武汉大学生艺术创业" :showLeftArrow="showLeftArrow"></y-nav>
		<div class="share_detail-main">
			<div class="share_detail-cover">
				<img :src="detailData.coverPlan">
			</div>
			<h3 class="share_detail-title">{{ detailData.title }}</h3>
			<p class="share_detail-school">{{ detailData.schoolName }}</p>
			<p class="share_detail-tips">赶紧呼朋唤友来打Call~</p>
			<y-button v-if="this.$yryz.isNative()" block @click.native="openNativeShare">分享</y-button>
			<template v-else>
				<div class="-mob-share-ui-button -mob-share-open">分享</div>
				<div class="-mob-share-ui" style="display: none">
					<ul class="-mob-share-list">
						<li class="-mob-share-weixin">
							<p>微信</p>
						</li>
						<li class="-mob-share-qq">
							<p>QQ好友</p>
						</li>
						<li class="-mob-share-qzone">
							<p>QQ空间</p>
						</li>
						<li class="-mob-share-weibo">
							<p>新浪微博</p>
						</li>
					</ul>
					<div class="-mob-share-close">取消</div>
				</div>
				<div class="-mob-share-ui-bg"></div>
			</template>
		</div>
		<y-share ref="share"></y-share>
	</div>
</template>
<script>
const ShareScriptId = '-mob-share';
const ShareScriptSrc = `http://f1.webshare.mob.com/code/mob-share.js?appkey=21f5c2a507e76`;
import YShare from '@/components/comment/share'
export default {
	components: {
		YShare
	},
	data() {
		return {
			showLeftArrow: false,
			inApp: this.$yryz.isNative(),
			detailData: {},
			shareUrl: ''
		}
	},
	methods: {
		insertScriptTag() {
			let shareScriptTag = document.getElementById(ShareScriptId);
			if (!shareScriptTag) {
				shareScriptTag = document.createElement('script');
				shareScriptTag.id = ShareScriptId
				shareScriptTag.src = ShareScriptSrc;
				let s = document.getElementsByTagName('head')[0];
				s.appendChild(shareScriptTag);
			}
			shareScriptTag.addEventListener('load', () => {
				window.mobShare.config({
					appkey: '21f5c2a507e76',
					params: {
						url: this.shareUrl,
						title: this.detailData.title,
						description: this.detailData.content,
						pic: this.detailData.coverPlan,
					}
				})
			});
		},
		openNativeShare() {
			if (this.inApp) {
				this.$refs.share.open({
					title: this.detailData.title,
					content: this.detailData.content,
					coverPlanUrl: this.detailData.coverPlan,
					url: this.shareUrl
				});
			} else {
				this.$toast('请点击右上角，分享给您的朋友');
			}
		}
	},
	mounted() {
		if (!this.inApp) {
			this.insertScriptTag();
		}
		this.$http.get(`/services/app/v1/temp/activity/opus/single/${this.$route.params.id}`).then(response => {
			let resData = response.data;
			if (resData.code === '200') {
				this.detailData = resData.data;
				this.shareUrl = `${window.location.origin}/activity-temporary/detail/${this.detailData.id}`;
				if (!this.$yryz.isNative()) {
					window.document.title = this.detailData.title;
				}
			}
		})
	}
}
</script>
<style>
@import '#/css/var.css';
.temporary_activity-share_detail {
	& .share_detail-main {
		padding: .3rem .3rem 1rem;
		text-align: center;
	}
	& .share_detail-cover {
		& img {
			width: 100%;
		}
	}
	& .share_detail-title {
		margin-top: .5rem;
		font-size: .36rem;
		color: var(--theme-color);
	}
	& .share_detail-school {
		margin-top: .2rem;
		font-size: .34rem;
		color: #999;
	}
	& .share_detail-tips {
		margin: .4rem 0;
		font-size: .3rem;
		color: #666;
	}
}
</style>


