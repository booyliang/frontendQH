/**
*	Author: liuxia
*
*/
<template>
	<div v-if="vote && showVote" class="vote">
		<div>
			<div class="vote-title">
				<!--<div  class="vote-title--twoline">{{vote.title}}<span v-text='vote.type === "1"?"(单选)" : "(多选)"'></span></div>-->
				<div  class="vote-title--twoline">{{vote.title}}<span>{{votetype}}</span></div>
			</div>
			<!-- <div class="vote-time">投票截至时间：{{vote.endDate.substr(0,10)}}</div>-->
			<div class="vote-content--container">
				<div v-if="vote.joinStatus===0&&vote.endStatus===0" class="vote-checkgroup">
					<y-check-group  :data="voteItems" textField="content" ref="voteItems"
					 :type='vote.type === "1"?"radio" : "checkbox"'  :iconAfterText="true" idField="voteItemId" @click.native="voteClick"
					 ></y-check-group>
				</div>
				<div v-if="vote.joinStatus===1||vote.endStatus===1"   v-for = "(item , index) in voteItems" >
					<div class="vote-progress_bar" :class="item.voteStatus === 1?'vote-percentbar-active':'' ">
						
						<div class="vote-options">
							<div  class="vote-item--twoline">
							{{item.content}}
							<!--<span v-if= "item.voteStatus === 1">{{'('+$R('voting-haschecked')+')'}}</span>-->
							</div>
						</div>
						<span class="vote-votes">{{item.voteCount+$R('ticket')}}</span>
						<div class="vote-percent" :class="item.voteStatus === 1?'vote-percent-active':'' " :style="`width:${item.voteCount*100/voteSum}%`"></div>
						
					</div>
				</div>
			</div>
			<y-button @click.native='joinVote' :disabled="disabledButton" class="vote-btn">{{buttonText}}</y-button>

		</div>
	</div>
</template>

<script>
	import YButton from '@/components/button'
	import Toast from '@/components/toast'
	import YCheckGroup from '@/components/check-group'

	export default {
		name: "y-voting",
		components: {
			YButton, YCheckGroup
		},
		props: {
			data: Object,
		},
		data() {
			return {
				vote: null,
				voteItems: [],
				voteSum: null,
				voteIds: ''
			}
		},
		computed: {
			votetype() {
				if (this.vote.type === "1") {return '(' + this.$R('voting-radio') + ')'}
				else {return '(' + this.$R('voting-checkbox') + ')'}
			},
			buttonText() {
				if ( this.vote.endStatus === 0 && this.vote.joinStatus === 0) {
					return this.$R('vote');
				} else if (this.vote.joinStatus === 1) {
					return this.$R('voting-voted');
				} else {
					return this.$R('voting-ended');
				}
			
			},		
			disabledButton() {
				if (this.vote.endStatus === 0 && this.vote.joinStatus === 0) {
					return false;
				} else {
					return true;
				}
			},
			showVote() {
				return this.$env.userId;
			}

		},
		created() {
			this.getVote();
		},
		watch: {
			data() {
				this.getVote();
			}
		},
		methods: {
			async getVote() {
				if (!this.data || !this.data.id || !this.data.moduleEnum )
					return;
				var req = {
					method: 'GET',
					url: '/services/app/v1/vote/detail/' + this.data.moduleEnum + '/' + this.data.id,
					// url: 'http://192.168.30.142:8080/app-web/services/app/v1/vote/detail/' + this.data.moduleEnum + '/' + this.data.contentId,
					// headers: {userId: 'uuu'}
				};
				let res = await this.$http(req);
				if (res.data.code !== '200' || !res.data.data.vote) {
					return;
				} else { 
					this.vote = res.data.data.vote;
					this.voteItems = res.data.data.voteItems;
					this.voteIt
					for (let voteItem of this.voteItems) {
						this.voteSum = this.voteSum + voteItem.voteCount;
					};
				}
			},
			joinVote() {
				if (this.voteIds) {
					var req = {
						method: 'POST',
						url: '/services/app/v1/vote/participator/' + this.voteIds,
						// headers: {userId: 'uuu'}
					}
					this.$http(req).then((res) => {
						if (res.data.data === 1) {console.log(res.data.data); this.getVote()}
						else if (res.data.data === -5) {Toast(this.$R('voting-toast-voted'), {autoClose: 3000});  this.getVote()
						}
						else if (res.data.data === 4) {Toast(this.$R('voting-toast-ended'), {autoClose: 2000});  this.getVote()}
						else {Toast(this.$R('voting-toast-failed'), {autoClose: 3000})}
					})
				} else {
					Toast(this.$R('voting-toast-unchecked'), {autoClose: 2000})
				}	
			},
			voteClick() {
				if (this.vote.type === "1") {
					this.voteIds =  this.$refs.voteItems.getSelectedIds();
					return	this.voteIds
				} else if (this.vote.type === "2") {
					let ids =  this.$refs.voteItems.getSelectedIds();
					this.voteIds = JSON.stringify(ids).substr( 1, JSON.stringify(ids).length - 2 );
				} else {
					return false;
				}
			}
		}
	}
</script>

<style>
@import "#/css/var.css";
.vote {
	margin: 0 auto;
	background: #fff;
	border-radius: .1rem;
	border: .01rem solid var(--theme-color);

	font-size: .36rem;
		& .vote-title {
			padding: 0 0.3rem;
			background: var(--theme-color);
			min-height: 1rem;
			border-radius: .05rem .05rem 0 0;
			color: #FFF;
			line-height: 1rem;
			& .vote-title--twoline {
				line-height: 0.5rem;
				display:inline-block;
				margin-top: 0.15rem;
			}
	    }
		& .vote-time{
			padding-left:10px;
			font-size: var(--default-font-size);
			text-align:left;
		}
		& .vote-btn{
			display: block;
			background: var(--theme-color);
			width: 3rem;
			height: 0.7rem;
			margin: .5rem auto;
			font-size: .34rem;
			padding: 0;
		}
		& .vote-btn.disabled{
			background:#d7d7d7;
		}
		& .vote-content--container{
			 & .vote-checkgroup{
				padding-left:0.25rem;
					& .check_item{
					background:#f8f8f8;
					width:6.4rem;
					height:1rem;
					border-radius:6px;
					margin-bottom:2px;
					text-align:left;
					line-height:1rem;
					font-size: var(--default-font-size);
					margin-top:0.2rem;
					padding-left:0.25rem;
					margin-right:0.2rem;
					align-items: center;
						& i{
				           color: var(--theme-color);
						}
						& span {
								display: block;
								flex: 1;
								width: 4.1rem;
								line-height: 0.35rem;
							}
					}
			}
			& .vote-progress_bar {
				position:relative;
				height:1rem;
				border-radius: .06rem;
				background:#f8f8f8;
				margin-bottom: .02rem;
				text-align:left;
				line-height:1rem;
				font-size: .32rem;
				margin:.2rem 0.25rem .2rem .25rem;
				overflow:hidden;
					& .vote-percent {
						background:#E7E7E7;
						margin-top: 0.87rem;
						height:13%;
						display: inline-block;
						float: left;
						border-radius: .06rem 0 0 .06rem;
					}
					& .vote-options {
						z-index:2;
						padding-left: .2rem;
						float:left;
						border-radius: .15rem;
						position:absolute;
					}
					& .vote-votes{
						right: .2rem;
						position:absolute;
						color: var(--text-primary-color);
					}
			}
			& .vote-progress_bar.vote-percentbar-active{
				/*background: #fff0f4;*/
				color: var(--theme-color);
			}

			
			& .vote-percent.vote-percent-active{
				color: var(--theme-color);
			}
			
			& .votedstate{
				background:#ccb7ba;

			}
			
			
			& .vote-item--twoline{
				line-height:0.42rem;
				width:4.6rem;
				display:inline-block;
				margin-top:0.1rem;
			}
			& .check_item.checkedItem{
				color: var(--theme-color);
			}
			
		}
  
}

</style>