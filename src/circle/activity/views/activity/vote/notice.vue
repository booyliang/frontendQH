<template>
	<div class="platform-activity-prize-wrap" v-if="data">
		<div class="activity-head-area" v-if="data.activityStatus !== 3">
			<div class="activity-cover">
				<img :src="data.coverPlan | imageResize(5)">
			</div>
			<!--活动未开始 或 活动进行中-->
			<div class="activity-date">
				<div class="activity-count-down" v-if="data.activityStatus !== 3">
					<span class="head-icon">
						<span class="iconfont icon-clock"></span>
						<span v-text="showTipText"></span>
					</span>
					<y-count-down v-if="currTime && showCount" :endDate="endTime" :nowDate="currTime" @countdown_end="countdownEnd"></y-count-down>
				</div>
				<!--活动进行中 活动已结束-->
				<div class="activity-ended" v-else>
					<span class="iconfont icon-clock"></span>
					<span>活动已结束</span>
				</div>
			</div>
		</div>
		<y-content-source v-if="data.prizesSources" :content-source="data.prizesSources"></y-content-source>
		<y-message v-else :icon="icon" :title="msgTitle">
			<span v-text="msgSubTitle"></span>
		</y-message>
	</div>
</template>
<script>
import YContentSource from '@/components/content-source';
import YMessage from '@/components/message';
import CountDowm from '../components/count-down';
import icon from '@/assets/static/no-info@2x.png';
export default {
	name: 'vote-prize',
	components: {
		[CountDowm.name]: CountDowm,
		YContentSource, YMessage,
	},
	computed: {
		endTime() {
			return this.data.activityStatus === 1 ? this.data.beginTime : this.data.endTime;
		},
		showTipText() {
			return this.data.activityStatus === 2 ? this.$R('activity-end-time') : this.$R('activity-start-time');
		},
		msgTitle() {
			return this.data.activityStatus === 3 ? '系统正在核对中奖者信息，相关中奖公告' : '活动尚未结束';
		},
		msgSubTitle() {
			return this.data.activityStatus === 3 ? '稍后给出，请耐心等待' : '活动相关奖品信息请查看活动介绍';
		}
	},
	data() {
		return {
			data: null,
			showCount: true,
			currTime: null,
			icon,
		}
	},
	mounted() {
		this.$opusApi.get(`/yyl/v1/activity/vote/detail/${this.$route.params.activityId}`).then(res => {
			let _data = res.data;
			if (_data.msg === 'success') {
				this.data = _data.data;
				this.currTime = this.data.currentDate;
			}
		});
	},
	methods: {
		countdownEnd() {
			this.showCount = false;
			this.data.activityStatus = 2;
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.platform-activity-prize-wrap {
	& .activity-head-area {
		background: white;
		line-height: 1;
		color: var(--text-primary-color);
		position: relative;
		margin-bottom: .1rem;

		& .activity-cover {
			position: relative;
			margin-bottom: 0;
			&>img {
				display: block;
				width: 100%;
				height: 3.36rem;
			}
		}

		& .activity-date {
			position: absolute;
			bottom: 0;
			width: 100%;
			color: #fff;
			background: var(--bg-alpha-color);
			padding: .2rem;
			& .activity-count-down {
				display: flex;
				justify-content: space-between;
				font-size: 15px;
				line-height: .4rem;
				& .head-icon {
					& .iconfont {
						font-size: 17px;
					}
				}
			}
			& .activity-ended {
				text-align: center;
				& .iconfont {
					font-size: 17px;
				}
			}
		}
		& .activity-title {
			padding: .3rem;
			font-size: 22px;
			margin: .1rem 0;
		}
	}
	& .content_source {
		padding: 0 .3rem;
	}

	& .message {
		padding-top: 1.4rem;
		& .message-icon {
			width: 3.2rem;
			height: 3.2rem;
		}
		& .message-title {
			margin-top: -.5rem;
			font-size: 15px;
		}
		& span {
			color: var(--text-assist-color);
		}
	}
}
</style>

