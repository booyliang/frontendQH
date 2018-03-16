<template>
	<div :class="['user-activity-list',{'unshelved':this.data.shelveFlag === 1}]" @click = "toRourter(data.id)" >
		<img class = "activity-img" :src = "data.activityImg">
		<div class = "activity-title" v-text = "data.activityTitle"></div>
		<div class = "activity-timer-area">
			<strong class = "activity-time">{{$R('activity-time')}}：</strong>
			<div class = "activity-date">
				<span class = "activity-start" v-text = "getAcitityTime(data.signupStartDate)"></span>
				~
				<span class = "activity-end" v-text = "getAcitityTime(data.signupEndDate)"></span>
			</div>
		</div>

	</div>
</template>

<script type="text/javascript">
	export default {
		name: 'y-flow-item-userActivity',
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
		methods: {
			/**
			 * 个人主页活动跳转路由（无外链类型）
			 * @param id   活动id
			 */
			toRourter(id) {
				this.$router.push({path: `/activity/homepage/${id}`});
			},

			/**
			 * 格式化活动时间
			 * @param date
			 * @returns {*|string}
			 */
			getAcitityTime(date) {
				return date.split(' ')[0];
			}
		}


	};
</script>

<style>
	.user-activity-list {
		margin: 0.4rem;
		position: relative;
		border-bottom: #ddd 1px solid;
		padding-bottom: 0.4rem;
		overflow: hidden;
		& .activity-img{
			width: 2rem;
			height: 1.62rem;
			float: left;
			margin-right: 0.4rem;
		}

		& .activity-title {
			font-size: 16px;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			overflow: hidden;
			white-space: normal;
			-webkit-line-clamp: 2;
		  }
		& .activity-timer-area {
			& .activity-time {
				  font-size: 14px;
				  color: #666;
				  display: block;
			  }
			& .activity-date {
				  display: inline-block;
				  font-weight: 400;
				  font-size: 14px;
				  color: #666;
			  }
		}

	}
	.user-activity-list.unshelved::after{
		background-position: right 0.3rem top 0;
	}
</style>