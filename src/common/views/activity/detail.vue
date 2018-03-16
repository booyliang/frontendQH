<template>
	<div class="detail-wrap">
		<!--头部导航 S-->
		<y-nav :title="$R('detail')" :menuData="menuData"></y-nav>
	
		<div v-if="vm" class="detail-container">
			<y-card :src="cardImg" :title="cardName" :assist="vm.createDate | recentTime" :to="`/user/${vm.userId}`"></y-card>
			<div v-for="(item, index) in metaData" :key="index">
				<p v-if="Object.keys(item)[0] == 'text'" v-html="item.text" class="singupContent"></p>
			</div>
			<div v-if="vm.articleType===2 && vm.vidioUrl" class="upload-content video-content">
				<y-video :src="vm.vidioUrl" :poster="vm.imgUrl"></y-video>
				<span v-text="coverVideoTime" class="times"></span>
			</div>
			<div v-if="vm.articleType===3 && vm.audioUrl" class="upload-content audio-content">
				<y-audio-play :src="vm.audioUrl" :time="vm.times" :size="vm.size"></y-audio-play>
			</div>
			<div v-if="vm.articleType==4 && vm.imgUrl" class="upload-content img-content">
				<li v-for="(item,index) of vm.imgUrl.split(',')" :key="index">
					<img :src="item | imageResize(6)">
				</li>
			</div>
			<div class="activity-vote" v-if="hasUserId && vm.activityStatus === 2">
				<y-button block @click.native="handleVote" class="activityBtn-vote" :disabled="isVote">{{vm.tickets >= count ? $R('voted') : $R('vote')}}</y-button>
			</div>
		</div>
	</div>
</template>

<script>
import { YNav, YNavToggle } from '@/components/nav';
import YFlowDetail from '@/components/flow-detail';
import YButton from '@/components/button';
import YCard from '@/components/card';
import YVideo from '@/components/video';
import YAudioPlay from '@/components/audio-player';
import Action from '@/components/comment/action';
export default {
	components: {
		YNav,
		YFlowDetail,
		YNavToggle,
		YButton,
		YCard,
		YVideo,
		YAudioPlay
	},
	data() {
		return {
			menuData: [{
				icon: 'share-o-b',
				text: this.$R('menu-share'),
				action: this.action
			}, 'index', 'copy-url', 'report'],
			shareData: null,
			vm: null,
			metaData: [],
			hasUserId: false,
			admin_head: '/assets/static/admin_head_img@2x.png'
		}
	},

	computed: {
		cardImg() {
			return this.vm.publisherType ? this.admin_head : this.vm.headImg;
		},
		cardName() {
			return this.vm.publisherType ? this.$R('official') : this.vm.nickName;
		},
		coverVideoTime() {
			let time = this.vm.times / 1000;
			let hour = Math.trunc(time / (60 * 60)) % 24 + '';
			if (hour.length === 1) hour = '0' + hour;

			let minute = Math.trunc(time / 60) % 60 + '';
			if (minute.length === 1) minute = '0' + minute;

			let second = Math.trunc(time) % 60 + '';
			if (second.length === 1) second = '0' + second;

			let t_str = hour > 0
				? hour + ':' + minute + ':' + second
				: minute + ':' + second;

			return t_str;
		},
		isVote() {
			if (this.vm.hasVoteThree) {
				return !(this.vm.tickets > 0 && this.vm.tickets < this.count);
			} else {
				return this.vm.tickets >= this.count;
			}
		}
	},

	created() {
		this.hasUserId = this.$circle.userId ? true : false;
		this.count = this.$localStore.get('count');
		if (!this.count) {
			// 活动详情接口
			this.$http.get(`/services/app/v1/activity/single/${this.$route.params.id}`).then((res) => {
				if (res.data.code === '200') {
					let _data = res.data.data;
					this.count = res.data.data.oneWorkVoteCount;
				}
			})
		}
		this.$http.get('/services/app/v1/activitysignup/single/' + this.$route.params.id + '/' + this.$route.params.detailId).then((res) => {
			if (res.data.code === "200") {
				this.vm = res.data.data;
				this.shareData = {
					imgUrl: this.vm.activityImg,
					title: this.vm.activityTitle,
					content: this.vm.contentSource,
					id: this.vm.id,
					moduleEnum: this.vm.moduleEnum
				}
				this.initData();
			}
		})
	},

	methods: {
		getTranslateString(value) {
			return value.replace(/\\n/g, "<br>").replace(/\\r/g, "<br>");
		},
		initData() {
			let contentSource = this.vm.signupContent;
			try {
				this.metaData = JSON.parse(this.getTranslateString(contentSource));
			} catch (error) {
				console.error(error);
				console.error('组件content-source：请传入正确的contentSource格式')
			}
		},

		// 投票
		async handleVote() {
			// 活动状态 下架处理
			let _data = await this.$http.get(`/services/app/v1/activity/selectShelveFlag/${this.$route.params.id}`);
			if (_data.data.code !== '200') return false;
			let shelveFlag = _data.data.data.shelveFlag;
			if (shelveFlag === '1') {
				this.$router.replace({ path: `/activity/homepage/${this.$route.params.id}` });
				return false;
			}
			let params = {
				activityId: this.$route.params.id,
				signupId: this.$route.params.detailId
			}
			this.$http.post('/services/app/v1/activityticket/single', params)
				.then((res) => {
					if (res.data.code === "200") {
						this.vm.tickets = res.data.data.flag;
					}
				})
		},

		// 分享
		action() {
			Action["share"].call(this, this.shareData, true);
		}
	}
}
</script>

<style lang="css">
.detail-wrap {
	background-color: #fff;
	min-height: 100vh;
	& .detail-container {
		padding: 0.4rem 0.3rem;
		& .singupContent {
			margin: 0.2rem 0;
			line-height: 28px;
			font-size: 16px;
			color: #000;
		}
		& .video-content {
			position: relative;
			& .times {
				position: absolute;
				bottom: .1rem;
				right: .1rem;
				background: rgba(0, 0, 0, 0.6);
				border-radius: 1rem;
				padding: .05rem .2rem;
				color: #fff;
			}
		}
		& .activityBtn-vote {
			margin-top: 1rem;
			&.disabled {
				background-color: #d7d7d7;
				border-color: #d7d7d7;
			}
		}
		& .img-content img {
			width: 100%;
		}
	}
}
</style>