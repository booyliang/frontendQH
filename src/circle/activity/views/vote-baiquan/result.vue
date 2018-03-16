<template>
	<div class="vote_result" :class="{'unNative': !this.$yryz.isNative()}">
		<div class="cover">
			<y-nav title="投票结果" :transparent="true" v-if="this.$yryz.isNative()" ></y-nav>
			<div class="vote_result-total">共{{total}}票 </div>
		</div>
		<ul class="rank">
			<li v-for="(item, index) in oVotes" :key="index" class="rank_item" v-if="index < 20">
				<div class="rank_item-index" v-if=" index > 2">{{index+1}}</div>
				<div class="rank_item-index" v-else></div>

				<div class="rank_item-title">{{item.name}} <span v-text="`${item.number}`+'票'"></span> </div>
				<div class="rank_item-percent"><span :style="`width: ${item.percent}%`" ></span>{{item.percent}}%</div>
			</li>
		</ul>
	</div>
</template>
<script>
import YNav from '@/components/nav/nav';
import VoteData from '../../js/voteData'
let circleNames = {};
for (let item of VoteData) {
	circleNames[item.id] = item.label;
}
// console.log("circleNames", JSON.stringify(circleNames));
export default {
	components: {
		[YNav.name]: YNav,
	},
	data() {
		return {
			total: 0,
			oVotes: [],
		}
	},

	created() {
		this.getVoteData();
	},
	methods: {
		getVoteData() {
			this.$opusApi.get("/yyl/v3/vote/getVoteList").then((res) => {
				this.oVotes = res.data.data;
				// console.log("排序:", JSON.stringify(this.oVotes));
				this.oVotes = this.oVotes.filter(item => circleNames[item.circleId]); // 去除脏数据
				this.oVotes.sort((b, d) => {return  d.number - b.number}); // 降序排序

				this.total = this.oVotes.reduce((sum, b) => sum + b.number, 0)
				// console.log("降序排序:", JSON.stringify(this.oVotes));

				// for (let item of this.oVotes)	{
				// 	this.total += item.number;				
				// }
				// console.log("total", this.total)
				for (let item of this.oVotes)	{
					item.name =  circleNames[item.circleId];
					item.percent = parseInt(item.number * 100 / this.total);
					// console.log("percent", item.percent)
				}
				
			})
			
			
			
		}
	}
}
</script>
<style>
@import "#/css/var.css";
.vote_result{
	background: #fff;
	color: var(--theme-color);
	& .cover {
		position: relative;
		margin:0 auto 10px;
		height: 4.7rem;
		background: #fff url("../../assets/banner_phb.jpg") no-repeat center top;
		background-size: contain;
    	
		& .vote_result-total {
			position: absolute;
			bottom: 5px;
			width: 100%;
			font-size: .36rem;
			text-align: center;
			color: #1bc2b8;
		}
	}
	& .rank {
		margin: 0;
		padding: 10px 15px;
		& .rank_item {
			position: relative;
			border-top: 1px solid #d6f5f1;
			padding: 10px 0 10px 50px;
			& .rank_item-index {
				position: absolute;
				top: 0;
				left: 0;
				color: #000;
				font-size: .36rem;
				width: 45px;
				height: 100%;
				font-size: 18px;
				color: #000;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			& .rank_item-title {
				overflow: hidden;
				color: #000;
				font-size: .32rem;
				margin-bottom: .15rem;
				& span {
					float:right;
					color: #1bc2b8;
				}
			}
			& .rank_item-percent {
				font-size: .26rem;
				color: #666;
				line-height: 13px;
				display: flex;
				& span {
					display:inline-block;
					height: 10px;
					margin: 1.5px 5px 1.5px 0;
					background-color: var(--theme-color);
					border-radius: 20px;
				}
			}
		}
		& .rank_item:nth-child(1) .rank_item-index {
			background: url("../../assets/cup_gold.png")  no-repeat center;
			background-size: .54rem auto;
		}
		& .rank_item:nth-child(2) .rank_item-index {
			background: url("../../assets/cup_silver.png")  no-repeat center;
			background-size: .54rem auto;
		}
		& .rank_item:nth-child(3) .rank_item-index {
			background: url("../../assets/cup_copper.png")  no-repeat center;
			background-size: .54rem auto;
		}
	}
}
.vote_result.unNative{
	& .cover{
		height: 4rem;
		background: #fff url("../../assets/banner_phb.jpg")  no-repeat center bottom;
		background-size: cover;
		margin: 0;
		& .vote_result-total{
			bottom: 0
		}
	}

}
</style>

