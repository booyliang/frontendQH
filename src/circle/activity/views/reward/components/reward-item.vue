<template>
	<div class="reward_item" @click="jumpUrl(data.offerId)">
		<y-item>
			<div class="reward_item-hd">
				<div><y-card v-if="data.custSimpleDTO" :src="data.custSimpleDTO.custImg" :title="data.custSimpleDTO.custNname" @click-img="goPersonInfo(data.custSimpleDTO.custId)"></y-card></div>
				<div class="reward">悬赏金额 {{showPrice}}</div>
			</div>
			<div class="reward_item-bd">
				{{data.content}}
			</div>
			<div class="reward_item-fd">
				<span v-if="data.imgUrl" class="iconfont icon-picture"></span>
				<span v-if="data.complete === 1 && this.restTime" >还剩{{this.restTime}}</span>
				<span v-if="data.complete === 2 && this.showTime" >公示期还剩{{this.showTime}}</span>
				<span v-if="data.complete === 1 && data.replyNum !== 0 ">{{data.replyNum}}人参加</span>
				<span v-if="data.complete !== 1">该悬赏有{{data.replyNum}}个回答</span> 
			</div>
		</y-item>
		<div class="reward_item-fd_address" v-if="data.location"><span class="iconfont icon-add-a-c"></span>{{data.location}}</div>
	</div>
</template>
<script>
import Card from '@/components/card'
import Item from '@/components/item'
import moment from 'moment';
export default {
	name: 'y-reward-item',
	components: {
		[Card.name]: Card,
		[Item.name]: Item,
	},
	data() {
		return {
			// restTime: ''	
		}
	},
	props: {
		data: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.setRestTime();
		})
	},
	watch: {
		data() {
			// this.setRestTime()
		}
	},
	computed: {
		'restTime': function () { // 悬赏剩余截止时间
			return this.setRestTime(this.data.terminalTime)
		},
		'showTime': function () { // 悬赏公示期
			return this.setRestTime(this.data.rewardTime)
		},
		'showPrice': function () {  // 前端金额展示值统一处理为 后台返回值price/100
			return (this.data.price / 100).toFixed(2);
		}
	},
	methods: {
		setRestTime(endTime) {
			let start = moment(new Date());
			let end = moment(endTime);
			let duration = moment.duration(end.diff(start));
			let days = duration.days();
			let hours = duration.hours();
			let minutes = duration.minutes();
			let seconds = duration.seconds();
			// console.log(endTime, days + "天" + hours + "小时" + minutes + "分" + seconds + "秒" )
			if (duration <= 0) {
				return null;
			}
			if ( days > 0) {
				return   24 * days  + hours + "小时"
			} else if (hours > 0) {
				return   hours + "小时"
			} else {
				return   minutes + "分钟"
			}

		},
		goPersonInfo(userId) {
			this.$yryz.toPersonalInfo({
				userId: userId
			})
		},
		jumpUrl(url) {
			let jumpUrl = `${window.location.protocol}//${window.location.host}/activity/reward/detail/${url}`;
			
			if (this.$yryz.isNative()) {
				this.$yryz.jumpUrl({url: jumpUrl});
			} else {
				this.$router.push(`/reward/detail/${url}`)
			}
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.reward_item{
	margin-top: .2rem;
	box-shadow: 0 0 8px color(var(--text-secondary-color) alpha(.2));
	margin: .3rem;
	border-radius: .1rem;
	& .item{
		border-radius: .1rem;
		& .item-wrap{
			display: block;
			width: 100%;
			padding: .3rem .06rem;
			& .reward_item-hd{
				display: flex;
				align-items: center;
				justify-content: space-between;
				& .y_card .y_avatar{
					width: .44rem;
					height: .44rem;
					min-width: auto;
					min-height: auto;
					flex: 0 auto;
					margin-right: .1rem;
				}
				& .y_card-title{
					color: var(--text-assist-color);
					font-size: .3rem;
					line-height: 1.5;
					margin: 0 .2rem 0 0;
				}
				& .reward{
					font-size: .3rem;
					color: #f5cd45;
					
				}
			}
			& .reward_item-bd{
				@apply --text-cut-multi-line;
				-webkit-line-clamp: 3;
				line-height: .5rem;
				margin: .3rem auto 0;
				font-size: .36rem;
				color: var(--text-secondary-color);
			}
			& .reward_item-fd{
				color: var(--text-tips-color);
				font-size: .28rem;
				margin-top: .2rem;
				& span{
					margin-right: .1rem;
					
					&.icon-picture {
                       color: #bbb;
					}
				}
				
				
			}
		}
		
	}
	& .reward_item-fd_address{
			font-size: .26rem;
			padding: 0.2rem .2rem;
			line-height: .4rem;
			color: var(--text-tips-color);
			background: #f8f8f8;
			border-bottom-left-radius: .1rem;
			border-bottom-right-radius: .1rem;
			& span{
				margin-right: .2rem;
				color: var(--text-tips-color);
			}
			& .icon-add-a-c {
               color: #bfbfbf;
			}
		}
	
}
</style>

