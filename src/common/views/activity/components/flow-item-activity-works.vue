<template>
	<router-link :to="`/activity/detail/${$route.params.id}/${data.id}`" v-if="data.activityId" :class="classList">
		<div class="works-columns--1" v-if="data.articleType === 1 || data.articleType === 3">
			<div class="flow_item-head">
				<y-card :src="cardImg" :title="cardName" :to="`/user/${data.userId}`" @click-img="toUserPage"></y-card>
				<span class="sort" :class="isFirst ? 'tip_y' : 'tip_b'" v-text="sort"></span>
			</div>
			<div class="flow_item-body">
				<p v-text="getText"></p>
				<div class="audio-info" v-if="data.articleType === 3">
					<div class="audio-icon">
						<span class="iconfont icon-aduio"></span>
						<span class="audio-graphic"></span>
					</div>
					<div v-text="coverTime"></div>
				</div>
			</div>
		</div>
	
		<div v-else class="works-columns--2">
			<div class="content-columns" v-if="data.articleType == 2">
				<y-video v-if="data.vidioUrl" :poster="data.imgUrl | imageResize(2)" preview></y-video>
			</div>
			<div class="content-columns" v-if="data.articleType == 4 && firstImg">
				<img :src="firstImg | imageResize(2)" alt="">
			</div>
			<span class="sort" :class="isFirst ? 'tip_y' : 'tip_b'" v-text="sort"></span>
			<div class="flow_item-head">
				<y-card :src="data.headImg" :title="data.nickName" :to="`/user/${data.userId}`" @click-img="toUserPage"></y-card>
			</div>
		</div>
		<div class="works-foot">
			<slot name="left-bottom" v-bind="{data}"></slot>
			<span v-text="ticketCount + $R('ticket')"></span>
			<y-button v-if="data.activityStatus === 2 && hasUserId" :disabled="isVote" @click.native.prevent="vote">{{ tickets >= count ? $R('voted') : $R('vote')}}</y-button>
		</div>
	</router-link>
</template>

<script type="text/javascript">
import YCard from '@/components/card';
import YVideo from '@/components/video';
export default {
	name: 'y-flow-item-activity-works',
	components: {
		YCard, YVideo,
	},
	props: {
		data: {
			type: Object,
			required: true
		},
		hasVoteThree: {
			type: Boolean,
		},
		isFirst: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			count: null,
			hasUserId: false,
			// hasVoteFlag: this.data.hasVoteFlag,
			ticketCount: this.data.ticketCount,
			tickets: this.data.tickets,
			admin_head: '/assets/static/admin_head_img@2x.png'
		}
	},

	computed: {
		cardImg() {
			return this.data.publisherType
				? this.admin_head
				: this.data.headImg;
		},
		cardName() {
			return this.data.publisherType
				? this.$R('official')
				: this.data.nickName;
		},
		classList() {
			return this.data.articleType === 2 || this.data.articleType === 4
				? 'activity-works-wrap-columns'
				: 'activity-works-wrap'
		},
		firstImg() {
			let urls = this.data.imgUrl;
			return urls ? urls.split(',')[0] : '';
		},
		sort() {
			return this.data.sort < 10
				? '0' + this.data.sort
				: this.data.sort + this.$R('num');
		},

		getText() {
			let contentSource = this.data.signupContent;
			let metaData = JSON.parse(this.getTranslateString(contentSource));
			return metaData[0].text;
		},

		coverTime() {
			let time = this.data.times / 1000;
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
			if (this.hasVoteThree) {
				return !(this.tickets > 0 && this.tickets < this.count);
			} else {
				return this.tickets >= this.count;
			}
		}
	},

	created() {
		this.hasUserId = this.$env.userId ? true : false;
		this.count = this.$localStore.get('count');

		if (this.hasVoteThree) this.$emit('update_vote');
	},

	methods: {
		getTranslateString(value) {
			return value.replace(/\\n/g, "<br>").replace(/\\r/g, "<br>");
		},

		toUserPage() {
			this.$router.push({ path: `/user/${this.data.userId}` });
		},

		// 投票
		async vote() {
			// 活动状态 下架处理
			let _data = await this.$http.get(`/services/app/v1/activity/selectShelveFlag/${this.$route.params.id}`);
			if (_data.data.code !== '200') return false;
			let shelveFlag = _data.data.data.shelveFlag;
			if (shelveFlag === '1') {
				this.$router.replace({ path: `/activity/homepage/${this.$route.params.id}` });
				return false;
			}
			let params = {
				activityId: this.data.activityId,
				signupId: this.data.id
			}
			this.$http.post(`/services/app/v1/activityticket/single`, params).then((res) => {
				if (res.data.msg === 'success') {
					this.tickets = res.data.data.flag;
					this.ticketCount++;
					this.$emit('update_vote', res.data.data.workCount);
				}
			})
		}
	}
}
</script>

<style>
@import "#/css/var.css";
.activity-works-wrap {
	position: relative;
	display: block;
	background: #fafafa;
	margin: 0 .2rem .3rem .2rem;
	background: #fafafa;
}

.activity-works-wrap-columns {
	position: relative;
	margin: 0 2% .3rem 2%;
	margin-bottom: .2rem;
	width: 46%;
	background: #fafafa;
}

.works-columns--1 {
	padding: .15rem;
	& .flow_item-head {
		align-items: flex-start;
		margin-bottom: 0.15rem;
		& .sort {
			color: #F4AD00;
			font-size: 15px;
		}
		/* & .tip_b {
			color: #66D0FF;
		} */
	}

	& .flow_item-body {
		& p {
			@apply --text-cut-multi-line;
			-webkit-line-clamp: 2;
		}
		& .audio-info {
			display: flex;
			align-items: center;
			margin-top: .15rem;
			& .audio-icon {
				position: relative;
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 4.8rem;
				height: .8rem;
				border-radius: .4rem;
				background: #F0F0F0;
				padding: 0 .1rem;
				margin-right: .15rem;
				& .iconfont {
					display: flex;
					justify-content: center;
					align-items: center;
					color: var(--theme-color);
					background-color: #fff;
					border-radius: 50%;
					font-size: 17px;
					width: .6rem;
					height: .6rem;
					padding-top: .05rem;
				}
				& .audio-graphic {
					background-image: url(../../../assets/audio-b.png);
					background-repeat: no-repeat;
					background-size: contain;
					display: inline-block;
					width: 3.6rem;
					height: .42rem;
				}
			}
		}
	}
}

.works-columns--2 {
	position: relative;
	& .content-columns {
		position: relative;
		& .video {
			padding-bottom: 100%;
		}
	}
	& .sort {
		position: absolute;
		top: 0;
		left: 0;
		color: #fff;
		background: #FF8A00;
		padding: 0 .3rem 0 .1rem;
		border-bottom-right-radius: .5rem;
	}
	& .tip_b {
		background: #FFBA00;
	}
	& .flow_item-head {
		margin-top: .1rem;
		margin-bottom: 0;
		padding: 0 .1rem;
	}
}

.works-foot {
	padding: .15rem;
	margin-top: .1rem;
	& span {
		color: var(--text-assist-color);
	}
	& button {
		position: absolute;
		right: 0;
		bottom: 0;
		padding: .1rem .3rem;
		border-radius: inherit;
		border-top-left-radius: .3rem;
	}
}
</style>