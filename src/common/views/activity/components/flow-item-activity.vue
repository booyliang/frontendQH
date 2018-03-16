<template>
	<div class="activity-list" v-if="isShow">
		<div class="activity-img" @click="toRourter(data.activityType,data.id,data.outsideUrl)">
			<img :src="data.activityImg | imageResize(3)" class="activity-fm-img">
			<!-- <div class="activity_status">
	<img :src="statusIcon" class="status-icon">
	<span class="status-label" v-text="label"></span>
	</div> -->
			<span class="activity_status" v-text="label" :class="classList"></span>
		</div>
	
		<div class="activity-title" v-text="data.activityTitle"></div>
	
		<div class="activity-timer-area">
			<strong class="activity-time">{{$R('activity-time')}}：</strong>
			<div class="activity-date">
				<span class="activity-start" v-text="data.signupStartDate"></span>
				{{$R('to')}}
				<span class="activity-end" v-text="data.signupEndDate"></span>
			</div>
		</div>
	
		<div class="activity-addr-area" v-if="data.address">
			<strong class="activity-addr">{{$R('activity-address')}}：</strong>
			<i class="activity-intro-desc" v-text="getAddress"></i>
		</div>
	
		<div class="activity-intro-area">
			<strong class="activity-intro">{{$R('activity-intro')}}：</strong>
			<i class="activity-intro-desc" v-text="data.activityIntroduction"></i>
		</div>
	
		<div class="activity-details">
			<y-button @click.native="toRourter(data.activityType,data.id,data.outsideUrl)" class="activity-details-button">{{$R('activity-view-detail')}}</y-button>
			<y-button v-if="isCancel" @click.native="cancelActive" class="activity-details-button cancle-button">{{$R('cancel-activity')}}</y-button>
		</div>
	</div>
</template>

 <script type="text/javascript">
import Toast from '@/components/toast'
import Dialog from '@/components/dialog';
export default {
	name: 'y-flow-item-activity',
	props: {
		data: {
			type: Object,
			required: true
		},
		horizontal: Boolean,

		remove: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			label: '',
			isShow: true,
			isCancel: false,
		}
	},
	computed: {
		getAddress() {
			return this.data.address.replace(/,/g, '');
		},
		classList() {
			let str = '';
			switch (this.data.activityStatus) {
				case 1:
					this.label = this.$R('before-start');
					str = 'activity-status-before-start';
					break;
				case 2:
					this.label = this.$R('ongoing');
					str = 'activity-status-ongoing';
					break;
				case 3:
					this.label = this.$R('ended');
					str = 'activity-status-ended';
					break;
			}
			return str;
		}
	},

	mounted() {
		// console.log(this.data.createUserId, this.$env.userId, this.data.activityStatus)
		if (this.data.createUserId === this.$env.userId && this.data.activityStatus === 1) {
			this.isCancel = true;
		}
	},
	methods: {
		/**
		 * 根据活动类型跳转路由（外链）
		 * @param type  活动类型
		 * @param id   活动id
		 * @param url   外链url
		 */
		toRourter(type, id, url) {
			let match = /^(http|https|ftp|ftps):\/\//;
			let isOutSite = match.exec(url);
			switch (type) {
				case 1:
				case 2:
					this.$router.push({ path: `/activity/homepage/${id}` });
					break;
				case 3:
					if (this.$yryz.isNative()) {
						if (isOutSite) {
							this.$yryz.openUrl({ url: url });
						} else {
							this.$router.push({ path: url });
						}
					} else {
						if (isOutSite) {
							window.open(url, '_blank');
						} else {
							this.$router.push({ path: url });
						}
					}
					break;
			}
		},
		cancelActive() {
			this.$http.put(`/services/app/v1/activity/shelve/${this.data.id}`).then(res => {
				if (res.data.code === '200') {
					Dialog.confirm(this.$R('confirm') + this.$R('cancel-activity')).then(() => {
						this.isShow = false;
					}).catch(() => {
						console.log('cancel');
					});
				}
				if (res.data.code === '1000') {
					Toast('当前活动状态已更新，无法取消当前活动').then(() => {
						this.$utils.refresh();
					});
				}
			})
		}
	}
};
</script>

<style>
@import "#/css/var.css";

.activity-list {
	margin-bottom: .2rem;
	position: relative;
	padding: .3rem;
	background: #fff;
	& .activity-img {
		position: relative;
		& .activity-fm-img {
			width: 100%;
			height: 3.88rem;
		}
		& .activity_status {
			position: absolute;
			top: .2rem;
			right: -0.14rem;
			width: 1.3rem;
			height: 0.8rem;
			background-size: contain;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
		}
		& .activity-status-before-start {
			background-image: url(../../../assets/list_tip_1@2x.png);
		}
		& .activity-status-ongoing {
			background-image: url(../../../assets/list_tip_2@2x.png);
		}
		& .activity-status-ended {
			background-image: url(../../../assets/list_tip_3@2x.png);
		}
	}

	& .activity-title {
		font-size: 18px;
		color: var(--text-primary-color);
		border-bottom: 1px solid #EEEEEE;
		padding: .2rem 0;
		@apply --text-cut-multi-line;
		-webkit-line-clamp: 2;
		line-height: 1.75;
	}
	& .activity-timer-area {
		padding: .2rem 0;
		& .activity-time {
			color: var(--theme-color);
		}
		& .activity-date {
			display: inline-block;
			color: var(--text-primary-color);
		}
	}
	& .activity-addr-area {
		margin-bottom: .2rem;
		& .activity-addr {
			color: var(--theme-color);
		}
		& .activity-intro {
			color: var(--theme-color);
		}
		& .activity-intro-desc {
			color: var(--text-primary-color);
		}
	}
	& .activity-intro-area {
		@apply --text-cut-multi-line;
		-webkit-line-clamp: 2;

		& .activity-intro {
			color: var(--theme-color);
		}
		& .activity-intro-desc {
			color: var(--text-primary-color);
		}
	}
	& .activity-details {
		margin-top: .3rem;
		margin-bottom: .1rem;
		text-align: center;

		& .activity-details-button {
			width: 80%;
			padding: .45em 0;
			margin: .1rem 0;
		}
		& .cancle-button {
			background: #FB4545;
		}
	}
}
</style>