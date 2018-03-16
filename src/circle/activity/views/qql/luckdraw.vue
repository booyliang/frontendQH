<template>
	<div class="lottery">
		<div class="lot-body">
			<table cellpadding="0" cellspacing="0">
				<tr v-for="(row, index) in luckUnits" :key="index">
					<template v-for="item in row" >
						<td v-if="item.index === 5" rowspan="2" colspan="2" :key ="item.index" >
							<button :disabled="disabled" @touchstart="loadAudio" slot="start-btn" @click="onStart">
								<p>{{promptText}}</p>
								<span class="lot-notice">(100积分抽奖1次)</span>
							</button>						
						</td>
						<td class="luck-unit" :class="{active: item.index === currIndex}" :key ="item.key">
							<div class="img-wrap"><img :src="`/activity/static/${item.url}`" /></div>
						</td>
					</template>				
				</tr>	
			</table>
			
		</div>
		<audio src="/activity/static/qql-mario.mp3" ref="audio"></audio>
		<audio src="/activity/static/qql-success.mp3" ref="audio1"></audio>
		<!-- luckEnd -->
		<div v-if="num < 100" class="tips-num">您当前积分不足100，快去赚取积分哦</div>
		<div class="left-points">剩余积分{{num}}</div>

		<!-- 中奖弹框 begin -->
		<div class="win-pop" v-if="showModel">
			 <div class="mask"></div>
			 <div class="win-pop-main">
			       <p>
				       <label>获得{{lotName || '0悠然币'}}，</label>
				       <label>已放入消费账户！</label>
			       </p>
			 	   <span class="win-pop-btn" @click="closeModel">我知道了</span>
			 </div>
		</div>
		<!-- 中奖弹框 end -->
	</div>
</template>
<script>
import Api from './api'
export default {
	name: 'y-luck-draw',
	data() {
		return {	
			showModel: false,
			// [0, 1, 2, 3, 5, 7, 11, 10, 9, 8, 6, 4]	
			luckUnits: [
				[{url: 'qql-lucky@2x.png', index: 0}, {url: 'qql-1@2x.png', index: 1},
				{url: 'qql-3@2x.png', index: 2}, {url: 'qql-30@2x.png', index: 3}],
				[{url: 'qql-300@2x.png', index: 4}, {url: 'qql-again@2x.png', index: 5}],
				[{url: 'qql-1t@2x.png', index: 6}, {url: 'qql-5@2x.png', index: 7} ],
				[{url: 'qql-500@2x.png', index: 8}, {url: 'qql-thanks@2x.png', index: 9},
				{url: 'qql-50@2x.png', index: 10}, {url: 'qql-10@2x.png', index: 11}  ]
			],
			timer: 0,	// setTimeout的ID，用clearTimeout清除
			speed: 20,	// 初始转动速度
			count: 12,	// 总共有多少个位置			
			times: 0,	// 当前转动次数
			cycle: 50,	// 转动基本次数：即至少需要转动多少次再进入抽奖环节
			// prize: -1,	// 中奖位置			

			promptText: "开始抽奖", // 按钮提示文本
			custId: "",
			num: 0, // 剩余积分
			disabled: false, // 按钮禁用状态
			lotId: 0, // 用户抽中的编号
			lotName: "", // 用户抽中的描述
			flag: false,
			awardType: -100,
			
		}
	},
	created() {
		if (!this.$env.custId) return;
	
		this.custId = this.$env.custId;
		var params = "custId=" + this.custId;
		Api.getUserLottery(params).then(res => {
			let resBody = res.data;
			let resData = resBody.data;
			this.num = resData.number;
		})
	},
	computed: {
		currIndex() {
			if (!this.times)
				return -1;
			let index = this.times % this.count;
			let paths  = [0, 1, 2, 3, 5, 7, 11, 10, 9, 8, 6, 4]
			return paths[index];
		}
	},
	methods: {
		closeModel() {
			this.showModel = false;
		},
		// 点击抽奖
		async onStart() {
			await this.$user.login();
			if (this.disabled) { return };
			// console.log('this.num', this.num)
			if (this.num < 100) {
				return this.$toast('您当前积分不足100，快去赚取积分哦')
			}
			let params = "custId=" + this.custId;
			this.disabled = true;
			
			try {
				let res = await Api.lottery(params);
				let resBody = res.data;
				if (resBody.ret === 1) {
					this.$refs.audio.currentTime = 0;
					this.$refs.audio.play();
					this.promptText = "抽奖中";

					let resData = resBody.data;
					this.num = resData.number;
					this.lotId = resData.lotId;
					this.awardType = resData.type;
					// this.lotId = 3;
					// this.awardType = 1;
					this.lotName = resData.lotName;
					this.drawLuck(this.lotId);
					
				} else {
					this.disabled = false;
					this.$toast('账户异常，请稍候再试');
				}
			} catch (err) {
				this.disabled = false;
			}
		},
		// 加载音频
		loadAudio() {
			if (this.flag) return;
			this.$refs.audio.load();
			this.$refs.audio1.load();
			this.flag = true;
		},
		drawLuck(luckId) {
			if (this.timer) {
				return false;
			}		
			this.speed = 100;
			this.times = this.times % this.count;
			let endPos = parseInt(this.cycle / 12 + 1) * 12  + luckId - 1;	
			this.rollLuck(endPos);	
		},
		// 抽奖结束
		onLotEnd() {
			this.disabled = false;
			this.promptText = "开始抽奖";
			if (this.$refs.audio) {
				this.$refs.audio.pause();
			}
			
			if (this.awardType === 1) {
				this.showModel = true;
				// this.$toast('恭喜您，获得' + this.lotName + '!详情查看中奖记录');
				this.$refs.audio1.play();
			}
			// if (this.awardType === 2) {
			// 	this.$dialog.confirm({
			// 		title: "恭喜您",
			// 		message: '获得' + this.notice + '一部',
			// 		okText: '领取奖品',
			// 		cancelText: '返回抽奖'
			// 	})
			// }
		},
		rollLuck(endPos) {
			this.times += 1;
			if (this.times < endPos) {
				if (endPos - this.times > 12) {
					this.speed -= 10;
				} else if (endPos - this.times < 6) {
					this.speed += 110;
				} else {
					this.speed += 20;
				}
				if (this.speed < 40) {
					this.speed = 40;
				};	
				this.timer = setTimeout(() => {this.rollLuck(endPos)}, this.speed);
			} else {
				clearTimeout(this.timer);
				this.timer = null;
				this.onLotEnd();
			}
			return false;
		}
	}

}
</script>
<style>
@import "#/css/var.css";
.lottery {
	& .lot-body{
		width: 6.3rem;
		height: 5.7rem;
		margin: 0 auto;
		background: url(../../assets/qql-09award@2x.png);
		background-size: cover;
		text-align: center;

		& table {
			margin: auto;
			position: relative;
			border-spacing: .1rem;
		}
	}
	
	& .tips-num {
		color: #711300;
		font-size: .24rem;
		text-align: center;
		position: absolute;
		top: 6.37rem;
		left: 1rem;
	}
	
	& .left-points{
		position: absolute;
		top: 6.86rem;
		left: 1.67rem;
		color: #fff;
		width: 3rem;
		height: .5rem;
		line-height: .5rem;
		margin: auto;
		text-align: center;
	}
	& .luck-unit {
		text-align: center;
		width: 1.45rem;
		height: 1.3rem;
		background: url(../../assets/qql-default@2x.png) no-repeat;
		background-size: cover;
        margin: auto;
		& img {
			width: 60%;
		}
	}
	& .active{
		background: url(../../assets/qql-09award-on.png) no-repeat;
		background-size: cover;
	}
	& .win-pop {
		& .mask {
			background: color(#000 alpha(.75));
			z-index: 11;
		}
		& .win-pop-main {
           width: 6.39rem;
           height: 6.27rem;
           background: url(../../assets/qql-win-bg.png) no-repeat;
           background-size: cover;
           position: absolute;
           z-index: 13;
           top: 50%;
           left: 50%;
           margin-top: -3.135rem;
           margin-left: -3.195rem;
           display: flex;
		   justify-content: center;
		   align-items: flex-end;

		   & p {
		   	 position: absolute;
		   	 bottom: 1.45rem;
		   	 font-size: .34rem;
		   	 line-height: .56rem;
		   	 color: #fff;
		   	 text-align: center;
		   	 left: 32%;
		   	 & label {
		   	 	display: block;
		   	 }
		   }

           & .win-pop-btn {
              display: block;
           	  width: 3.28rem;
           	  height: 1.08rem;
           	  background: url(../../assets/qql-okbtn.png) no-repeat;
           	  background-size: cover;
           	  text-indent: -999rem;
              @apply --no-tap-highlight; 
           }
		}
	}
}
</style>
