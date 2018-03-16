<template>
	<div class="question_detail">
		<!--顶部导航 begin-->
		<y-nav title="问题主页" :show-search="true" :menuData="menuData"></y-nav>
		<!--顶部导航end-->
		<!--问题部分begin-->
		<y-flow-detail class="answer_detail-question" :data="questionData"></y-flow-detail>
		<!--问题部分end-->
		<!--中间浏览、回答部分 begin-->
		<div class="question_detail-controls">
			<p class="question_detail-controls--count">
				<span>浏览 {{questionData.viewCount}}</span>
				<span>回答 {{questionData.answerCount}}</span>
			</p>
			<a href="javascript:;" id="select-trigger">{{ sortText }}<i class="iconfont icon-arrow-down"></i></a>
			<y-menu select :menu="selectMenu" :options="{trigger: '#select-trigger'}" @selected="handleSelected"></y-menu>
		</div>
		<!--中间浏览、回答部分 end-->
		<!-- 回答为空 begin -->
		<div class="no_answer--area" v-if="questionData.answerCount == 0">
			<i class="no_answer-img"></i>
			期待你的回答...
		</div>
		<!-- 回答为空 end -->
		<!--回答不为空 begin-->
		<y-flow-list :request='answerRequest' v-if="questionData.answerCount > 0"></y-flow-list>
		<!--回答不为空 end-->
		<!--底部内容 begin-->
		<div class="select-btn--answer" v-if="!this.questionData.myAnswerId">
			<router-link :to='{name: "answerCreate", params: {questionId: questionData.id, type: questionData.type}}' class="answer-btn--bottom">
				<y-input placeholder="我来回答..." v-model="text"></y-input>
			</router-link>
		</div>
		<div class="select-btn--bottom" v-if="this.questionData.myAnswerId">
			<y-button @click.native="toMyAnswer" block>查看我的回答</y-button>
		</div>
		<!--底部内容 end-->
	
	</div>
</template>
<script>
import YNav from '@/components/nav/nav'
import YNavToggle from '@/components/nav/nav-toggle'
import YFlowList from '@/components/flow-list'
import YFlowDetail from '@/components/flow-detail'
import YInput from '@/components/input'
import YButton from '@/components/button'
import YMenu from '@/components/menu'
export default {
	components: {
		YNav, YNavToggle, YFlowDetail, YFlowList, YInput, YButton, YMenu
	},
	data() {
		return {
			questionData: {},
			answerList: [],
			text: "",
			answerRequest: {
				method: 'GET',
				url: '/services/app/v1/answer/list/2',
				params: {
					orderBy: 'hot',
					questionId: this.$route.params.id
				}
			},
			menuData: ['index', 'refresh'],
			selectMenu: [
				{
					id: 'hot',
					text: '热门排序',
					checked: true
				},
				{
					id: 'time',
					text: '时间排序',					
				}				
			],
			sortText: '热门排序'
		}
	},
	methods: {
		toMyAnswer() {
			this.$router.push({ name: 'answerDetail', params: { id: this.questionData.myAnswerId } })
		},
		handleSelected(item) {
			this.answerRequest.params.orderBy = item.id;
			this.sortText = item.text;
		}
	},
	created() {
		this.$http.get('/services/app/v1/question/detail/' + this.$route.params.id).then((response) => {
			this.questionData = response.data.data;
			if (this.questionData.answerCount === 0) return false;
		})
	}
}
</script>
<style>
@import "#/css/var.css";
.question_detail {
	padding-bottom: 1rem;
	& .question_detail-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: .2rem;
		padding: .3rem;
		border-bottom: .02rem solid var(--border-color);
		background-color: #fff;
		color: var(--text-assist-color);
		& .question_detail-controls--count {
			font-size: .26rem;			
			& span:first-child {
				margin-right: .7rem;
			}
		}
	}

	& .answer-btn--bottom {
		background: #f4f4f4;
		padding: 0.18rem 0.3rem;
		position: fixed;
		bottom: 0;
		width: 100%;
	}

	& .y-input {
		border-radius: 0.1rem;

		& input {
			font-size: .32rem;
		}
	}

	& .select-btn--bottom {
		position: fixed;
		width: 100%;
		padding: .2rem 0;
		background-color: #fff;
		bottom: 0;
		text-align: center;
	}
	& #select-trigger {
		position: relative;
		& i {
			margin-left: 0.1rem;
		}
	}
	& .flow_item-foot {
		display: block;
	}
}


</style>
