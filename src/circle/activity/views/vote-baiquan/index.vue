<template>
	<div class="activity" :class="{'unNative': !this.$yryz.isNative()}">
		
		<div class="activity_cover">
			<y-nav title=""  v-if="this.$yryz.isNative()"  :transparent="true"></y-nav>
			<img class="activity_cover-title"  src="../../assets/title.png" alt="悠然一指选圈投票活动">
			<div class="activity_des">悠然一指平台将陆续强憾推出300个社群资源圈，现对首批100个社群资源圈中即将发布的圈子征求用户意见，您可以勾选出最想优先看到的10个圈子，平台将根据投票结果优先发布得票数多的圈子。期待您的参与！</div>
			<div class="activity_time">活动时间：2017年6月30日~7月30日</div>
			<div class="activity_tips">投票成功即可获得平台赠送的</br> 5次“悠悠乐”抽奖机会！</div>
		</div>
		
		
		<!--跑马灯-->
		<marquee class="activity_marquee" behavior="scroll" scrollamount="3" scrolldelay="0" loop="-1" bgcolor="#e6fffc" hspace="10" vspace="10">
			<ul class="activity_marquee-info">
				<li v-for="(item, index) in marqueeContent" :key="index"><span ><label>•</label>{{item}}</span> 获得5次抽奖机会</li>
			</ul>
		</marquee>

		<div class="activity_action">
			<div class="activity_action-item activity_action-share" v-if="this.$yryz.isNative()" @click="handleClickShare"><span class="iconfont icon-share-o"></span>分享给小伙伴</div>
			<div class="activity_action-item activity_action-vote-result" @click="goToVoteResult"><span class="iconfont icon-vote-o"></span>查看投票结果</div>
		</div>
		
		<div class="activity_vote">
			<div class="activity_vote-title">请勾选出您最想优先看到的圈子</div>
			<div class="activity_vote-info">(最多可选10个圈子)</div>
			<y-check-group :maxSelectedCount="10" 
			:data="circleList" 
			textField="label" 
			v-model='selectedCircleIds' type="checkbox" ></y-check-group>
		</div>
		<div class="activity_vote-bottom">
		     <y-button block class="activity_vote-btn" @click.native="voteClick">投票</y-button>
		</div>
	</div>
</template>
<script>
import YNav from '@/components/nav/nav';
import YCheckGroup from '@/components/check-group/check-group';
import voteData from "../../js/voteData"; // 圈子模拟数据
import marqueeData from "../../js/marqueeData"; // 跑马灯模拟数据
import Action from '@/components/comment/action'
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
			circleList: [],
			selectedCircleIds: []
		}
	},
	watch: {	

	},
	created() {
		this.circleList = voteData;
	},
	methods: {
		handleClickShare() { // 分享至第三方
			// TODO
			Action["share"].call(this, {
				imgUrl: "",
				title: "投投投投投出你喜爱的圈子！",
				content: "投票百分百有奖，赶快来参与吧！",
				// id: 2
			})
		},
		goToVoteResult() { // 查看投票结果
			this.$router.push("/vote-baiquan/result");
		},
		
		voteSucess() { // 投票成功，感谢您参与投票活动 送过抽奖机会
			this.$dialog.alert('投票成功感谢您参与投票活动')
			.then(() => {
				console.log('Alert closed.');
			});
		},
		isJoin() { // 是否参加过抽奖活动
			this.$opusApi.post("/yyl/v3/vote/insertRegist", {custId: this.$env.custId}).then((res) => {
				// this.$toast(JSON.stringify(res));  // TODO 测试 最后需要删掉
				if (res.data.ret === 3) { // 送过抽奖机会
					this.$dialog.alert("投票成功，感谢您的参与！")
					.then(() => {
						this.selectedCircleIds = [];
						this.$router.replace("/vote-baiquan");
					});
				} else { // 跳到悠悠乐抽奖
					this.$dialog.confirm({
						message: '恭喜您获得5次抽奖机会！',
					}, {
						okText: '去抽奖',
						cancelText: '取消'
					})
					.then(() => {
						this.gotoYYL();
					})
					.catch(() => { // 点击取消进入活动页
						this.$router.push("/vote-baiquan")
					});
				}
			})
		},
		gotoYYL() { // 跳到悠悠乐抽奖
			let yyl = window.location.origin + '/yyl';
			window.location.href = yyl;
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
					// alert(JSON.stringify(loginInfo))
					if (loginInfo.custId) {
						this.$env.custId =  loginInfo.custId;
						this.isJoin();
					}
				});
			})
			.catch(() => { // 点击取消进入活动页
				this.$router.push("/vote-baiquan")
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
				//  跳到悠悠乐抽奖
				let yyl = window.location.origin + '/yyl';
				window.location.href = yyl;
				
			})
			.catch(() => {
				console.log('Confirm canceled.');
			});
		},
		voteClick() { // 投票
			if (!this.selectedCircleIds.length) {
				this.$toast("至少选一项");
				return;
			}  

			let circleIds = '[\"' + this.selectedCircleIds.join('\",\"') + '\"]';
			this.$opusApi.post('/yyl/v3/vote/userVote', {circleIds})
			.then((res) => {
				if (res.data.ret === 1) { // 投票成功后 判断用户在app还是第三方 

					// this.$toast("投票成功") // TODO 测试 最后需要删掉
					if (!this.$yryz.isNative()) { //  不是原生 跳转到自定义注册页面
						this.$router.push("/vote-baiquan/register"); 
					} else {
						if (this.$env.custId) { // 是原生 且登录过 判断是否送过抽奖机会
							// this.$toast(this.$env.custId);  // TODO 测试 最后需要删掉
					
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
				this.$router.push("/vote-baiquan")
			});


		}
		
	}
}
</script>
<style>
@import "#/css/var.css";
.activity {
	background: #fff;
	padding-bottom: 70px;
	& .activity_cover {
		background: #52cfbf url(../../assets/index-bg@2x.jpg) no-repeat center bottom;
		height:auto;
		background-size: cover;
		padding-bottom: 60px;
		position: relative;
		margin-bottom: 20px;
	
		& img.activity_cover-title {
			display:block;
			margin: -.65rem auto .2rem;
			width: 70%;
		}
		& .activity_time {
			font-size: .26rem;
			text-align: center;
			color: #fff;
			/*margin-top: .1rem;*/
			margin: .2rem auto .3rem;
		}
		& .activity_des {
			display:block;
			margin: 0 auto;
			width: 90%;
			background: #27bfa9;
			border-radius: .2rem;
			font-size: .32rem;
			line-height: .44rem;
			color: #fff;
			padding: 0.25rem;
		    text-align: justify;
		}
		& .activity_tips {
			color: var(--text-primary-color);
			font-size: .34rem;
			line-height: 1.3;
			text-align: center;
			position: absolute;
			bottom:0;
			left: 0;
			width: 100%;
	    }
		
	}
	
	& .activity_action {
		display: flex;
		width: 90%;
		margin: .3rem auto .4rem;
		& .activity_action-item {
			font-size: .3rem;
			color: #fff;
			text-align: center;
			background: #ffbf7b;
			border-radius: 20px;
			padding: .06rem .3rem;
			border: 1px solid #ff8400;
			margin: 0 auto;
   
			& span {
				color: #fff;
				font-size: .3rem;
				margin-right: 10px;
			}
		}
		& .activity_action-item:last-child {
			background: #44deca;
			border-color:#27c1ad;
		}
		
	}
	& .activity_marquee {
		/*padding: .25rem 0;*/
		padding: 0;
		height:.68rem;
		line-height: .68rem;
		margin: 0 .2rem;
		font-size: .28rem;
		color: var(--text-assist-color);
		border-radius: .1rem;
		& .activity_marquee-info {
			display: flex;
			& li {
				margin-right: .7rem;
				white-space: nowrap;
				& span {
					color: #ff6600;
					font-size: .28rem; 

					& label {
						color: #999;
						margin-right: 3px;
					}
				}
			}
		}
	}
	& .activity_vote {
		padding-top: .3rem;
		border-top: .1rem solid #f8f8f8;
		& .activity_vote-title {
			font-size: .34rem;
			color: var(--text-primary-color);
			text-align:center;
		}
		& .activity_vote-info {
			font-size: 14px;
			color: #666;
			text-align:center;
		}
		& .check_group {
			overflow: hidden;
			font-size: .28rem;
			& .check_item {
				border: none;
				float: left;
				width: 30%;
				background: #eee;
				margin: 15px 1.5% 0px 1.5%;
				border-radius: 20px;
				height: 30px;
				color: var(--text-assist-color);
				min-height: 30px;
				& i {
					height: 30px;
					line-height: 30px;
					text-align: center;
					font-size: 20px;
					margin-left: 2.5px;
				}
				& i.icon-check-b:before {
					content: "\E60D";
					color: #fff;
				}
				& .check_item-content{
					margin-left:.1rem;
				}
				& span {
					width: auto;
					text-align: center;
				}
			}
			& .check_item.checked {
				background: #52cfbf;
				color: #fff;
				& .checked{
					color: #fff;
					
				}
			}
		}
	}
	& .activity_vote-bottom {
		background-color: #fff;
		padding: .2rem 0;
		box-shadow: 0 -1px 6px rgba(0, 0, 0, .2);
		margin-top: .5rem;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1.06rem;
		& .activity_vote-btn {
			margin: 0 auto;
			border-radius: 10px;
			height: .7rem;
			line-height:1;
			background: #52cfbf;
			font-size: .32rem;
	    }
	}

}
.activity.unNative{
	& .activity_cover{
		padding-top: 40px;
	}
	& .yryz-download {
		& .nav{
			display: none;
		}
		& .down-btn{
			display: none;
		}
	}
	
}

</style>
<style scoped>
.dialog-foot .button:last-child {
	color: #27c1ad;
}
</style>

 