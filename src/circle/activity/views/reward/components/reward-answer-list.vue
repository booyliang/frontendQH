<template>
	
	<y-load-more :state="state" @can-load="onCanLoad" :endTip="!empty">
		<div class="datail_answer_list" >
			
			<div v-if="empty && detailData && detailData.replyNum==0" class="empty-tip">
				<div class="no-data"></div>哦哦，目前还没有回答哦！
			</div>
			<y-list class="answer_list-item" v-else>
				<y-item v-for="(item, index) of answerList" :key="index">
					<y-reward-answer-item :data="item" :detailData ="detailData" ></y-reward-answer-item>
				</y-item>
			</y-list>
		</div>
		<div v-if="showHiddenTips" class="reward_answer_list-tip">
			{{detailData.isReply===0 ?'悬赏尚未完成' :'悬赏暂无回答被征用'}}<br/>
			为保障回答者权益<br/>
			{{detailData.isReply===0 ?'所有' :'其他'}}回答均为隐藏</div>
	</y-load-more>
</template>
<script>
import LoadMore from '@/components/load-more';
import YRewardAnswerItem from './reward-answer-item'
import List from '@/components/list';
export default {
	name: "y-reward-answer-list",
	components: {
		[YRewardAnswerItem.name]: YRewardAnswerItem,
		[List.name]: List,
		[LoadMore.name]: LoadMore,

	},
	props: ['offerId', "detailData"],
	data() {
		return {
			state: undefined,
			
			answerList: [],
			limit: 10,
			replyId: "", // 回复ID

		}
	},
	computed: {
		empty() {
			return this.state === 'end' && !this.answerList.length;
		},
		params() {
			let p = {
				custId: this.$env.custId || "",
				limit: this.limit,
				offerId: this.detailData.offerId || this.$router.currentRoute.params.id,
				replyId: this.replyId				 
			};
			// 进行中的回答者， 请求参数带上 replyCustId， 只查询自己回答的
			if (this.detailData.complete === 1 && this.detailData.isReply === 1) {
				p.replyCustId = this.$env.custId;
			}
			return  p
		},
		showHiddenTips() { // 进行中 普通用户 和回答者 ； 公示期 普通用户
			if (!this.detailData)
				return false;
			// 悬赏者或者已完成不显示tips
			if (this.detailData.custId === this.$env.custId || this.detailData.complete === 3)
				return false;
			// 进行中 回答者 且回答数只有一条 不显示tips
			if (this.detailData.complete === 1 && this.detailData.replyNum === 1 && this.detailData.isReply === 1)
				return false;
			// 进行中 回答者且回答数>1 普通用户 或  公示期 普通用户
			return (this.detailData.complete === 1   && this.detailData.replyNum > 0)  || (this.detailData.complete === 2   && this.detailData.isReply === 0)
		}
		
	},
	mounted() {		
		this.getdata();
	},
	watch: {
		detailData() {
			this.getdata();
		}
	},
	methods: {
		onCanLoad() {
			this.getdata();
		},
		getdata() {
			this.state = "end";
			if (!this.detailData) 
				return;
			// 进行中、公示期 普通用户 不发送请求
			if (this.detailData.complete !== 3 && this.detailData.custId !== this.$env.custId && this.detailData.isReply === 0)
				return;
			this.state = "loading";
			let params = this.params;
			this.$openApi.get(`/api/v3/offer/replayList`, { params }).then(res => {
				if (res.data.ret === 1) {					
					let data = res.data.data || [];
					if (data.length < this.limit) {
						this.state = "end";
					} else {
						this.replyId = data[data.length - 1].replyId;
						this.state = "prepared";
					}
					this.answerList.push(...data);
				} else {
					console.log("请求失败", res.data.msg);
				}
				console.log("loaded", this.loaded)
			});
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.datail_answer_list{
	& .empty-tip {
		text-align: center;
		color: var(--text-tips-color);
		& .no-data {
			width: 2.45rem;
			height: 2.4rem;
			display: block;
			background: url(../../../../../common/assets/no-data@2x.png) no-repeat;
			background-size: contain;
			margin: .5rem auto 0;
		}
	}

	& .answer_list-item {
		& .item .item-wrap {
			border-top: none;
			@apply --border-bottom;
		}
	}
	
}
.reward_answer_list-tip{
	margin: .5rem auto;
    text-align: center;
    font-size: .3rem;
    color: var(--text-assist-color);
    width: 5rem;
    padding: .3rem 0;
    background: #f8f8f8;
    display: flex;
    align-items: center;
	justify-content: center;
	border-radius: .14rem;
}
.reward_answer_list-tip + .load_more-tip{ 
	display:none;
}

</style>

