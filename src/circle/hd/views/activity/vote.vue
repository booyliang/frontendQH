<template>
	<div class="activity">
		
		<div class="activity_cover">
			<y-nav title="" :transparent="true"></y-nav>
			<img class="activity_cover-title" src="../../assets/title.png" alt="">
			<div class="activity_des">悠然一指平台将陆续强憾推出300个社群资源圈，现对首批100个社群资源圈中即将发布的圈子征求用户意见，您可以勾选出最想优先看到的10个圈子，平台将根据投票结果优先发布得票数多的圈子。期待您的参与！</div>
			<div class="activity_time">活动时间：2017年6月30日~7月30日</div>
			
		</div>
		<div class="activity_tips">投票成功即可获得平台赠送的</br> 5次“悠悠乐”抽奖机会！</div>
		
		<!--跑马灯-->
		<marquee class="activity_marquee" behavior="scroll" scrollamount="3" scrolldelay="0" loop="-1" bgcolor="#e6fffc" hspace="10" vspace="10"  onmouseover="this.stop();" onmouseout="this.start();">
			<ul class="activity_marquee-info">
				<li  v-for="item in marqueeContent"><span >{{item}}</span> 获得5次抽奖机会</li>
			</ul>
		</marquee>

		<div class="activity_action">
			<div class="activity_action-item activity_action-share" @click="handleClickShare"><span class="iconfont icon-share-o"></span>分享给小伙伴</div>
			<div class="activity_action-item activity_action-vote-result" @click="goToVoteResult"><span class="iconfont icon-vote-o"></span>查看投票结果页</div>
			
			<!--<router-link tag="div" to="/activity/vote-result"><span class="iconfont icon-vote-o"></span>查看投票结果页</router-link>-->
		</div>
		
		<div class="activity_vote">
			<div class="activity_vote-title">请勾选出您呢最想优先看到的圈子</div>
			<div class="activity_vote-info">(最多可选10个圈子)</div>
			<y-check-group :maxSelectedCount="10" :data="langList" textField="label" name="voteType" v-model='langId' type="checkbox" ref="langList" @click.native="handleLangClick"></y-check-group>
		</div>
		

		<y-button block class="activity_vote-btn" @click.native="voteClick">投票</y-button>
	</div>
</template>
<script>
import YNav from '@/components/nav/nav';
import YCheckGroup from '@/components/check-group/check-group';
import voteData from "../../mock/voteData"; // 圈子模拟数据
import marqueeData from "../../mock/marqueeData"; // 跑马灯模拟数据
export default {
	components: {
		[YNav.name]: YNav,
		[YCheckGroup.name]: YCheckGroup,
	},
	data() {
		return {
			langId: null,
			marqueeContent: marqueeData,
			// langList: [{ label: 'JS', id: 1 }, { label: 'Java', id: 2 }, { label: '.net', id: 3 }, { label: 'Go', id: 4, checked: true }]
			langList: voteData,
			selectedCircle: []
		}
	},
	watch: {
		langId() {
			// console.log('langId', this.langId);
		}
	},
	methods: {
		login() { // login
			this.$yryz.login().then((loginInfo) => {
				alert(JSON.stringify(loginInfo))
			});
		},
		handleLangClick() {
			this.selectedCircle = this.$refs.langList.getSelectedIds();
			// this.selectedCircle = JSON.stringify(this.$refs.langList.getSelectedItems());
		},
		handleClickShare() { // 分享至第三方
			// TODO
			this.$toast("分享至第三方");
		},
		goToVoteResult() { // 查看投票结果
			this.$router.push("/activity/vote-result");
		},
		
		voteSucess() { // 投票成功，感谢您参与投票活动 送过抽奖机会
			this.$dialog.alert('投票成功，感谢您参与投票活动')
			.then(() => {
				console.log('Alert closed.');
			});
		},
		isJoin() { // 是否参加过抽奖活动
			this.$opusApi.post("/yyl/v3/vote/insertRegist", {custId: this.$env.custId}).then((res) => {
				alert(JSON.stringify(res))
				if (res.data.ret === 3) { // 送过抽奖机会
					this.$toast(" 已经送过抽奖机会")
				} else { // 跳到悠悠乐抽奖
					let yyl = window.location.origin + '/yyl';
					window.location.href = yyl;
				}
			})
		},
		goToLogin() { // 投票成功，感谢您参与投票活动 送过抽奖机会
			this.$dialog.confirm({
				message: '投票成功，您已获得5次抽奖机会',
			}, {
				okText: '去抽奖',
				cancelText: '取消'
			})
			.then(() => {
				console.log('Confirm OK.');
				this.$yryz.login().then((loginInfo) => {
					alert(JSON.stringify(loginInfo))
					if (loginInfo.custId) {
						this.isJoin();
					}
				});
			})
			.catch(() => { // 点击取消进入活动页
				this.$router.push("/")
			});
		},
		voteSucessAndGetChange() { // 投票成功 获得5次抽奖机会
			this.$dialog.confirm({
				message: '投票成功，您获得5次悠悠乐抽奖机会！',
			}, {
				okText: '去抽奖',
				cancelText: '取消'
			})
			.then(() => {
				console.log('Confirm OK.');
				// TODO
				this.$router.push("/activity/vote-result"); // 跳到悠悠乐抽奖
			})
			.catch(() => {
				console.log('Confirm canceled.');
			});
		},
		voteClick() { // 投票
			if (!this.selectedCircle.length || !this.langId) {
				this.$toast("至少选一项");
				return;
			}  
			console.log(this.$env.custId);
			let circleIds = '[\"' + this.selectedCircle.join('\",\"') + '\"]';
			this.$opusApi.post('/yyl/v3/vote/userVote', {circleIds})
			.then((res) => {
				if (res.data.ret === 1) { // 投票成功后 判断用户在app还是第三方 
					alert("投票成功")
					if (!this.$yryz.isNative()) { //  不是原生 跳转到自定义注册页面
						this.$router.push("/log/register"); 
					} else {
						if (this.$env.custId) { // 是原生 且登录过 判断是否送过抽奖机会
							alert(this.$env.custId);
					
							this.isJoin();
						} else {
							// 调起原生注册登录页面
							this.goToLogin();
							
						}
					}
														
				}
				
			})
			.catch((err) => {
				console.log(err);
				this.$toast("投票失败，请重新投票");
				this.$router.push("/")
			});


		}
		
	}
}
</script>
<style>
@import "#/css/var.css";
.activity{
	/*padding: 0 .3rem;*/
	background: #f8f8f8;
	& .activity_cover{
		background:url("../../assets/index_banner.jpg") no-repeat center bottom;
		height: auto;
		padding-bottom:40px;
		& img.activity_cover-title{
			display:block;
			margin: -20px auto 10px;
			width:70%;
		}
		& .activity_time{
			font-size: 14px;
			text-align: center;
			color: #fff;
			margin: 20px 0 20px;
		}
		& .activity_des{
			display:block;
			margin: 0 auto;
			width: 80%;
			background: #27bfa9;
			border-radius: 10px;
			font-size: 15px;
			color: #fff;
			padding: 0.2rem;
			text-align: left;
			font-weight: 600;
		}
		
	}
	& .activity_tips{
		color: #000;
		font-size: 16px;
		text-align: center;
		margin: -20px auto 10px;
		font-weight: 600;
	}
	& .activity_action{
		display: flex;
		& .activity_action-item{
			-webkit-box-flex: 1;
			-ms-flex: 1;
			flex: 1;
			font-size: 15px;
			color: #fff;
			text-align: center;
			background: #ffbf7b;
			border-radius: 20px;
			padding: 5px 0;
			border: 2px solid #ff8400;
			margin: 20px 5px;

			& span{
				color: #fff;
				font-size: 16px;
				margin-right: 10px;
			}
		}
		& .activity_action-item:last-child{
			background: #44deca;
			border: 2px solid #27c1ad;

		}
		
	}
	& .activity_marquee{
		margin: 0 10px;
		height: 50px;
		line-height: 50px;
		font-size: 14px;
		color: #666;
		& .activity_marquee-info{
			list-style-type:disc;
			& li{
			list-style-type:disc;
			display:inline-block;
			margin-right: .5rem;
				& span{
					color: #ff6600;
					font-size: 14px; 
				}
			}
		}
	}
	& .activity_vote{
		& .activity_vote-title{
			font-size: 17px;
			color: #000;
			text-align:center;
			font-weight:700;
		}
		& .activity_vote-info{
			font-size: 14px;
			color: #666;
			text-align:center;
		}
		& .check_group{
			overflow: hidden;
			& .check_item{
				border: none;
				float: left;
				width: 30%;
				background: #eee;
				margin: 15px 1.5% 0px 1.5%;
				border-radius: 20px;
				height: 30px;
				color: #666;
				& i{
					height: 30px;
					line-height: 30px;
					text-align: center;
					font-size:20px;
				}
				& i.icon-check-b:before{
					content: "\E60D";
					color: #fff;
				}
				& span{
					width: auto;
					
				}
			}
			& .check_item.checkedItem{
				background: #52cfbf;
				color: #fff;
				& .checked{
					color: #fff;
					
				}
			}
		}
	}
	& .activity_vote-btn{
		margin: 20px auto;
		border-radius: 20px;
		height: 35px;
		line-height:35px;
		background: #52cfbf;
	}
}

</style>
<style scoped>
.dialog-foot .button:last-child{
	color: #27c1ad;
}
</style>

 