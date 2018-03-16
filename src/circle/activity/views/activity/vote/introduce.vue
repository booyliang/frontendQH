<template>
	<div class="introduction-wrap" v-if="data">
		<template v-if="data">
			<!--活动主页头部-->
			<div class="activity-head-area">
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

			<y-list>
				<!-- 活动时间 -->
				<y-item vertical v-if="data.introduceSources">
					<div slot="head">
						<span class="iconfont icon-gift"></span>
						<span class="icon-title">活动奖励</span>
					</div>
					<y-content-source slot="foot" :content-source="data.introduceSources"></y-content-source>
				</y-item>

				<!-- 活动简介 -->
				<y-item vertical v-if="data.contentSources">
					<div slot="head">
						<span class="iconfont icon-article"></span>
						<span class="icon-title">活动简介</span>
					</div>
					<y-content-source slot="foot" :content-source="data.contentSources"></y-content-source>
				</y-item>
			</y-list>
		</template>
	</div>
</template>

<script>
import YContentSource from '@/components/content-source';
import CountDowm from '../components/count-down';
import YList from '@/components/list';
import YItem from '@/components/item';
import moment from 'moment';

export default {
	name: 'vote-introduction',
	components: {
		YList, YItem, YContentSource,
		[CountDowm.name]: CountDowm,
	},
	data() {
		return {
			data: null,
			showCount: true,
			currTime: null,
		}
	},
	computed: {
		endTime() {
			return this.data.activityStatus === 1 ? this.data.beginTime : this.data.endTime;
		},
		showTipText() {
			return this.data.activityStatus === 2 ? this.$R('activity-end-time') : this.$R('activity-start-time');
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
		// 倒计时结束
		countdownEnd() {
			this.showCount = false;
			this.data.activityStatus = 2;
		},
	}
}
</script>

<style>
@import "#/css/var.css";
.introduction-wrap {
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

	& .list {
		& .item-head {
			& .iconfont {
				color: #00AFF7;
			}
			& .icon-title {
				font-size: 14px;
				color: var(--text-assist-color);
			}
		}
		& .item-foot {
			font-size: 17px;
			line-height: 20px;
			margin-top: .1rem;
		}

		& .item-value {
			margin-right: .2rem;
			font-size: 14px;
		}
	}
	& .content_source-text {
		margin: 0;
	}
	& .item-wrap {
		padding-top: .4rem;
		padding-bottom: .4rem;
	}
}
</style>
