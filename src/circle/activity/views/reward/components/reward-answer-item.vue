<template>
	<div class="answer_item">
		<div class="answer_item-head">
			<y-card v-if="answerData.custSimpleDTO" :src="answerData.custSimpleDTO.custImg" :title="answerData.custSimpleDTO.custNname" :assist="answerData.createTime | recentTime">
			</y-card>
			<y-tag v-if="canReplay && this.$env.custId === this.detailData.custId" class="requist" @click.native= "handleSelect(answerData) ">征用</y-tag>
			<div class="reward-price" v-if="answerData.rewardState === 1 || answerData.rewardPrice != 0">获赏 {{showPrice}}</div>
		</div>
		<div class="answer_item-body" v-if= "answerData.see ===1 ">
			<div class="answer_content"   >
				<y-answer-content-source :clamp="showMore ? 0 : 3" :content-source="contentSource"
				ref="answer-item-content"
				></y-answer-content-source>
			</div>
			<div class="show-more" v-if ="showMoreBtn"  @click="expand">
				[<button class="expand-button">{{btnState.buttonText}} <span :class="btnState.icon"></span> </button>]
			</div>
			<y-reward-item-images v-if="imgs" :data="imgs"></y-reward-item-images>
		</div>
		<div class="answer_item-body unSee" v-else>
			<span>该内容被隐藏~</span>
			<div class="see-btn" @click="paySee(answerData)">1悠然币看答案</div>
		</div>
		<!--征用后 申诉期=3天 -->
		<div class="complain-btn" @click="handleComplain" v-if="showComplain"><span  class="iconfont icon-complain"></span>申诉</div>
		
	</div>
</template>
<script>
import Card from '@/components/card'
import Item from '@/components/item'
import YAudioPlayer from '@/components/audio-player'
import YAudio from '@/components/audio'
import Tag from '@/components/tag';
import YPreviewImg from './preview-img'
import ContentSource from '@/components/content-source'
import AnswerContentSource from './answer-content-source'
import moment from 'moment';
let btnStates = {
	'expend': {
		icon: 'iconfont icon-arrow-down',
		buttonText: '展开阅读全文'
	},
	'collapse': {
		icon: 'iconfont icon-arrow-up',
		buttonText: '收起'
	}
};

export default {
	name: "y-reward-answer-item",
	components: {
		[Card.name]: Card,
		[Item.name]: Item,
		YAudioPlayer, YAudio, 
		[Tag.name]: Tag,
		[YPreviewImg.name]: YPreviewImg,
		[ContentSource.name]: ContentSource,
		[AnswerContentSource.name]: AnswerContentSource,
	},
	data() {
		return {
			imgs: [],
			showMoreBtn: false,
			showMore: false,
			btnState: btnStates['expend'],
			contentSource: '[]',
			answerData: this.data,
			currTick: 0,
		
		}
	},
	mounted() {	
		let contentSource = this.answerData.contentSource;
		
		this.contentSource = contentSource;
		
		// console.log(this.contentSource)
		this.imgs = this.answerData.imgUrl ? this.answerData.imgUrl.split(',') : [];
		this.expendBtnSet();
		
	},
	computed: {
		canReplay() { // 未完成的悬赏  悬赏状态complete( 1进行  2公示  3完成)
			return this.detailData && this.detailData.complete === 1
		},
		showComplain() { // 申述期悬赏 申诉按钮 
			let start = moment(new Date());
			let end = moment(this.answerData.rewardTime);
			let duration = moment.duration(end.diff(start));
			return  this.detailData.complete  === 2 &&  this.$env.custId !== this.answerData.custId  &&  this.detailData.isReply  === 1 && duration > 0
		},
		'showPrice': function () {  // 前端金额展示值统一处理为 后台返回值price/100
			return (this.answerData.rewardPrice / 100).toFixed(2);
		}
		
	},
	props: {
		data: {
			type: Object,
			default: () => {
				return {}
			}
		},
		detailData: Object,
	},
	watch: {
		answerData(newval) {
			if (newval) {
				this.currTick = 0;
				this.expendBtnSet();
				this.contentSource = this.answerData.contentSource;
			}
		}
	},

	methods: {
		expendBtnSet() {
			if (this.currTick > 10)
				return;
			this.currTick ++;
			let element = this.$refs['answer-item-content'];		
			if (!element ||  !element.$refs.textNode) {			
				this.$nextTick(this.expendBtnSet);
				return;
			}	
			this.showMoreBtn = element.hasClamp();
			
		},
		expand() { // 收起、展开
			this.showMore = !this.showMore
			this.btnState  = this.showMore ?  btnStates['collapse'] : btnStates['expend'];
			// console.log(this.showMore)
		},
		handleSelect(data) { // 征用按钮
			// 悬赏者 征用接口
			let postData = {
				custId: this.$env.custId,
				offerId: data.offerId,
				replyId: data.replyId
			}
			this.$dialog.confirm('确认征用 ' + data.custSimpleDTO.custNname + ' 的回答')
			.then(() => {
				console.log('Confirm OK.');
				// 支付成功后发送  征用接口
				this.$openApi.post(`/api/v3/offer/rewardReplay`, postData)
				.then(res => {
					let data = res.data;
					if (data.ret === 1) {
						this.answerData.isComplete = 1;
						this.$utils.refresh();
					} else {
						this.$toast(data.msg)
						this.publishError(data.msg);
					}
				})
				.catch(msg => {
					this.publishError(msg);
				})
				
				
			})
			.catch(() => {
				console.log('Confirm canceled.');
			});
		},
		async paySee(data) {  // 打开偷看弹框
			if (!this.$env.custId && !this.$yryz.isNative()) { // 在第三方打开没有custId 点击偷看按钮 跳转到下载页
				var ua = window.navigator.userAgent.toLowerCase();
				var env = this.$env;
				var isSafari = (ua.indexOf('chrome') < 0) || env.devType === '1';
				window.location.href = isSafari ? 'https://static.yryz.com/quanhu/download/index.html' : 'https://static.yryz.com/quanhu/download/index.html';
				return false;
			}
			await this.$user.login();
			try {
				await this.$dialog.confirm("支付1悠然币看答案");
				this.peekReplay(data);	// 确认后 调 偷看回复接口 获取偷看订单号
			} catch (error) {
				this.publishError(error);
			}
			
			// this.$dialog.confirm("支付1悠然币看答案")
			// .then(() => {
			// 	this.peekReplay(data);	// 确认后 调 偷看回复接口 获取偷看订单号
			// })
			// .catch(msg => {
			// 	this.publishError(msg);
			// })
		},
		async peekReplay(data) { // 偷看回复 接口
			let postData = {
				custId: this.$env.custId,
				offerId: data.offerId,
				replyId: data.replyId
			}
			let peekReplayRes = await this.$openApi.post(`/api/v3/offer/peekReplay`, postData);
			if (peekReplayRes.data.ret === 1) {
				let orderId = peekReplayRes.data.data.orderId;

				try {
					// 生成订单号后调起支付接口
					await this.$yryz.pay({
						payMoney: 100, // 偷看的金额固定为一个悠然币 100分
						orderId: orderId
					})
					
					// 偷看订单查询接口
					let res =  await this.$openApi.post(`/api/v3/offer/peekReplayOrderInfo`, {orderId: orderId});
					if (res.data.ret === 1) {
						if (res.data.data.offerReplyVo.orderStatus !== 1) {
							this.$toast("发布失败，请重新发布");
							return false;
						}
						this.answerData.see = 1; // 可查看字段改为see 注意！
						this.answerData = Object.assign({}, this.answerData, res.data.data.offerReplyVo);
						console.log("answerData", JSON.stringify(this.answerData))
					} else {
						this.$toast(res.data.msg)
					}
				} catch (error) {
					// this.$utils.alert(error);
					error.data && this.$toast(error.data); //
				}
			} else {
				this.$toast(peekReplayRes.data.msg)
			}
		},
		async handleComplain() { // 申诉按钮后调用举报功能
			await this.$user.login();
			await this.$yryz.report({
				type: '2',
				sourceId: this.$route.params.id
			})

		}
		
	}

}
</script>
<style>
@import '#/css/var.css';
.answer_item{
	width: 100%;
	& .answer_item-head{
		@apply --display-flex;
		justify-content: space-between;
		margin-bottom: 0.3rem;
		& .y_card {
			
			& .y_avatar{
				width: .44rem;
				height: .44rem;
				min-width: auto;
				min-height: auto;
				flex: 0 auto;
			}
			& .y_card-text{
				display: flex;
				align-items: center;
				& .y_card-title{
					color: #666;
					font-size: .3rem;
					line-height: 1.5;
					margin: 0 .2rem 0 0;
				}
				& .y_card-assist{
					font-size: .24rem;
					color: #999;
				}
			} 
		}
		
		& .tag{
			position: relative;
			line-height: .38rem;
			color: var(--theme-color);
			border-width: 1px;
			border-style: solid;
			border-color: var(--theme-color);
			background: #fff;
		}
		& .reward-price{
			font-size:.3rem;
    		color: #f5cd45;	
		}
	}
	& .answer_item-body{
		& .answer_content{
			
			font-size: .34rem;
			line-height: .5rem;
			margin: 0;
			& .content_source{
				margin: 0;
				& .content_source-text{
					color: #000;
					margin-top: 0;
				}
			}
			
		}
		
	
		& .ellipsis-plus{
			font-size: .34rem;
			line-height: .5rem;
			margin: .2rem 0;
			color: #333;
		}
		& .show-more{
			text-align: left;
			color: var(--theme-color);
			& .expand-button{
				display: inline-block;
				border-radius: .2rem;
				font-size: .26rem;
				color: #666;
				height: .36rem;
				text-align: center;
				color: var(--theme-color);
				& span{
					font-size: .2rem;
				}
			}
		}
		
	}
	& .unSee{
		text-align: center;
		color: #666;
		font-size: .26rem;
		line-height: .24rem;
		& .see-btn{
			display: block;
			margin: .2rem auto;
			width: 2.8rem;
			height: .52rem;
			line-height: .52rem;
			border-radius: .1rem;
			background: #f5cd45;
			color: #fff;
			font-size: .26rem;
		}
	}
	& .complain-btn{
		color: #e01515;
		font-size: .3rem;
		& span{
			
			margin-right: .05rem;
		}
	}

}

</style>

