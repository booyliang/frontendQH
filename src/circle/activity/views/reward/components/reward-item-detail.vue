<template>
	<div class="reward_item_detail">
		<div class="detail-head">
			<div><y-card v-if="data.custSimpleDTO"  :src="data.custSimpleDTO.custImg" :title="data.custSimpleDTO.custNname"  @click-img="goPersonInfo(data.custSimpleDTO.custId)"></y-card></div>
			<div class="reward">悬赏金额  {{showPrice}}</div>
		</div>
		<div class="detail-body">
			<y-answer-content-source :content-source="contentSource"></y-answer-content-source>
			<y-reward-item-images v-if="data.imgUrl" :data="this.data.imgUrl.split(',')"></y-reward-item-images>
		</div>
		<div class="detail-foot">
			<div class="des-state">
				<span v-if = "data.complete  === 1 && this.restTime">还剩{{this.restTime}}</span> 
				<span v-if = "data.complete  === 2 && this.showTime">公示期还剩{{this.showTime}}</span> 
				<span v-if = "data.complete  === 3" >已解决</span>
				<div class="des-joined" v-if="data.replyNum !== 0 ">{{data.replyNum}}人已参与</div>
			</div>
			<div class="des-address" v-if="data.location"><span class="iconfont icon-add-a-c"></span>{{data.location}}</div>
		</div>
		<div  v-if="showDesActionBar" class="des-action-bar">
			<y-button v-if="data.isReply === 1" size="m" block :disabled='true'>已回答</y-button>
			<y-button v-if="data.complete  === 1  && data.isReply === 0" size="m" block @click.native="toJoin">参与悬赏</y-button>
		</div>
		
	</div>
</template>
<script>
import Card from '@/components/card'
import Item from '@/components/item'
import YPreviewImg from './preview-img'
import moment from 'moment';
import AnswerContentSource from './answer-content-source'
export default {
	name: 'y-reward-item-detail',
	components: {
		[Card.name]: Card,
		[Item.name]: Item,
		[YPreviewImg.name]: YPreviewImg,
		[AnswerContentSource.name]: AnswerContentSource,
	},
	data() {
		return {
			// restTime: '',
			contentSource: '[]',
		}
	},
	props: {
		data: Object,
		
	},
	mounted() {
		this.contentSource = this.data.contentSource;
		this.$nextTick(() => {
			this.setRestTime(this.data.terminalTime);
			
		})
		
	},
	watch: {
		data() {
			// this.setRestTime();
			this.contentSource = this.data.contentSource;
		}
	},
	computed: {
		'restTime': function () { // 悬赏剩余截止时间
			return this.setRestTime(this.data.terminalTime)
		},
		'showTime': function () { // 悬赏公示期
			return this.setRestTime(this.data.rewardTime)
		},
		showDesActionBar() { // 显示 "已回答/参与回答按钮" ps:分享至第三方统一视为普通用户只可能显示为“参与悬赏”
			if (this.data.complete !== 1 && this.data.isReply === 0) {  // 悬赏状态或已完成状态的 普通用户
				return false;
			}
			return (this.$env.custId !== this.data.custId) || (!this.$yryz.isNative());
			
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
			console.log(endTime, days + "天" + hours + "小时" + minutes + "分" + seconds + "秒" )
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
		async toJoin() {
			if (!this.$env.custId && !this.$yryz.isNative()) { // 在第三方打开没有custId 点击参加悬赏 跳转到下载页
				var ua = window.navigator.userAgent.toLowerCase();
				var env = this.$env;
				var isSafari = (ua.indexOf('chrome') < 0) || env.devType === '1';
				window.location.href = isSafari ? 'https://static.yryz.com/quanhu/download/index.html' : 'https://static.yryz.com/quanhu/download/index.html';
				return false;
			}
			await this.$user.login();
			// 查询当前用户是否被禁言
			let postData = { custId: this.$env.custId }
			let res = await this.$openApi.post(`/api/v3/permission/getAllPermission`, postData);
			let ResData = res.data;
			console.log("ResData", JSON.stringify(ResData))
			if ( ResData.ret === 1 ) {
				if (ResData.data.disTalk) {
					this.$toast("您已被禁言！")
					return false
				}
			} else {
				this.$toast(ResData.msg)
				return false
			}
			this.$router.push({path: `/reward/join/${this.data.offerId}` })
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.reward_item_detail{
	margin: .3rem 0 .2rem;
	background: #fff;

	& .detail-head{
		display: flex;
		justify-content: space-between;
		padding: 0 0.3rem;
		& .y_card .y_avatar{
			width: .44rem;
			height: .44rem;
			min-width: auto;
			min-height: auto;
			flex: 0 auto;
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
	& .detail-body{
		padding: 0 .3rem;
		& .des-info{
			line-height: .5rem;
			margin: .2rem auto;
			font-size: .36rem;
			color: var(--text-secondary-color);
		}
		& .content_source-text {
			margin-bottom: 0;
			min-height: .56rem;
			height: auto;
		}
		& .content_source .image-box{
			display: none;
		}
	
	}
	& .detail-foot{

		& .des-state{
			overflow: hidden;
			margin: 0 auto;
			color: var(--text-tips-color);
			font-size: .28rem;
			padding: .15rem .3rem .3rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			& span{
				margin-right: .2rem;
				color: var(--text-tips-color);
				font-size: .28rem;
			}
		}
		& .des-address{
			border-top: 1px solid #ecedef;
			font-size: .3rem;
			padding: 0.3rem;
			line-height: .4rem;
			color: var(--text-assist-color);
			& span{
				margin-right: .1rem;
				color: #bfbfbf;
				font-size: .28rem;
			}
		}
		
	}
	& .des-action-bar{
		border-top: 1px solid #ecedef;
		border-bottom: 1px solid #fff;
		& button{
			margin: .3rem auto;
			border-radius: .16rem;
			padding: 0;
			height: .68rem;
		}
	}


}
</style>

