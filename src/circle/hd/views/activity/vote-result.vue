<template>
	<div>
		<y-nav title="投票结果页"></y-nav>
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
</template>
<script>
import YNav from '@/components/nav/nav';
export default {
	components: {
		[YNav.name]: YNav,
	},
	data() {
		return {
			item: {
				content: "健康养生圈",
				voteStatus: 1,
				voteCount: 10,
			}
		}
	}
}
</script>
<style>
@import "#/css/var.css";
.vote-progress_bar {
	position:relative;
	height:1rem;
	border-radius: .06rem;
	background:#f8f8f8;
	margin-bottom: .02rem;
	text-align:left;
	line-height:1rem;
	font-size:16px;
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
.vote-progress_bar.vote-percentbar-active{
	/*background: #fff0f4;*/
	color: var(--theme-color);
}
</style>

