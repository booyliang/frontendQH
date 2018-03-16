<template>
	<div class="platform-share-guide-wrap" v-if="data">
		<y-nav :title="data.activityTitle"></y-nav>
		<div class="content">
			<img :src="data.coverPlan | imageResize('600_600')" alt="">
			<div v-text="data.nickName" class="nickName"></div>
		</div>
		<div class="guide-sucess">
			<div class="iconfont icon-check-circle"></div>
			<p>发布成功</p>
		</div>
		<div class="tip-text">
			<p>您已参加</p>
			<!-- <section class="iconfont icon-play-yellow"></section> -->
			<div v-text="data.activityTitle"></div>
		</div>
		<div class="guide-share">
			<div>
				赶快分享给朋友为自己拉票
				<span v-if="prizesFlag">，
					<i>丰厚奖品</i>等你拿</span>！
			</div>
			<y-share v-if="inApp" :data="shareData" :actions="actions"></y-share>
			<div v-else>
				<y-button block @click.native.stop="toHome">分享我的作品</y-button>
				<y-button block @click.native.stop="download">下载APP</y-button>
			</div>
		</div>
	</div>
</template>
<script>
import Share from '../components/share';
import Mixin from '../mixins';
export default {
	mixins: [Mixin],
	components: {
		[Share.name]: Share,
	},
	computed: {
		voteCount() {
			return this.data.voteCount + '票';
		}
	},
	data() {
		return {
			inApp: !!this.$yryz.isNative(),
			actions: ['YRIM', 'WeChat', 'WeChatLine', 'QQ', 'QQZone'],
			data: null,
			prizesFlag: false,
			shareData: null,
		}
	},

	mounted() {
		// if (!this.inApp && !this.$env.custId) {
		// 	this.$router.replace({ path: `/platform-activity/vote/${this.$route.params.activityId}` })
		// 	return false;
		// }
		this.$opusApi.get(`/yyl/v1/activity/candidate/detail/${this.$route.params.id}`).then(res => {
			let _data = res.data;
			if (_data.ret !== 1) return false;
			this.data = _data.data;
			if (_data.data.obtainIntegral)
				this.$toast(`您通过参与活动获得${_data.data.obtainIntegral}积分`)
			let content = this.data.text || this.data.text1 || this.data.text2 || '';
			let shareInfo = {
				content: content,
				coverPlanUrl: _data.data.coverPlan,
				title: _data.data.activityTitle,
			}
			this.shareData = Object.assign({}, this.data, shareInfo);
		})

		this.$opusApi.get(`/yyl/v1/activity/vote/detail/${this.$route.params.activityId}`).then(res => {
			let _data = res.data;
			if (_data.ret === 1) {
				this.prizesFlag = _data.data.prizesFlag === 1;
			}
		});
	},
	methods: {
		toHome() {
			let params = this.$route.params;
			this.$router.replace({ name: 'voteDetail', params });
		},
		download() {
			this.downloadApp();
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.platform-share-guide-wrap {
	& .content {
		position: relative;
		height: 6rem;
		width: 6rem;
		margin: 0.3rem auto 0;
		border-radius: 0.2rem;
		overflow: hidden;
		& .nickName {
			position: absolute;
			bottom: 0;
			background-color: rgba(0, 0, 0, .5);
			color: #FFF;
			text-align: center;
			width: 100%;
			padding: .15rem 0;
			font-size: .36rem;
		}
	}
	& .guide-sucess {
		text-align: center;
		color: #FFD460;
		margin-top: .4rem;
		& .iconfont {
			font-size: .7rem;
		}
		& p {
			font-size: .36rem;
			font-weight: bold;
		}
	}
	& .tip-text {
		text-align: center;
		color: #666;
		font-size: .3rem;
		margin: .3rem 0;

		& section {
			transform: rotate(-90deg);
			margin-bottom: -.2rem;
			color: #f4f4f4;
		}
		& div {
			display: inline-block;
			color: #000;
			font-size: .38rem;
			font-weight: bold;
			background-color: #F4F4F4;
			padding: .1rem .4rem;
			border-radius: 1rem;
		}
	}
	& .guide-share {
		text-align: center;
		margin-top: .5rem;
		& div {
			margin: .2rem 0;
			color: #666;
			& span {
				display: inline-block;
			}
			& i {
				color: var(--theme-color);
			}
		}
	}
	& .button--block {
		margin: .4rem auto;
	}
}
</style>

