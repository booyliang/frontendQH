<template>
	<div class="question_single_detail">
		<!--顶部导航 begin-->
		<y-nav :title="$R('detail')" :menuData="['index', 'copy-url', 'report']"></y-nav>
		<!--顶部导航 end-->
		<y-flow-detail class="answer_detail-question" :data="questionData"></y-flow-detail>

		<!--有问有答 begin-->
		<div v-if="questionData.answerCount > 0">
			<y-flow-detail class="answer_detail-answer" :data="answerData"></y-flow-detail>
			<y-hot :hots="['like', 'forward']" :data="answerData"></y-hot>
			<y-comment :data="answerData"></y-comment>
		</div>
		<!--有问有答 end-->

		<!--只问不答 begin-->
		<div v-if="questionData.answerCount == 0">
			<!-- 问题被下架 -->
			<div class="answer_detail--shelve-flag" v-if="answerShelveFlag === 0">
				<y-card class="card_data--show" :title="questionData.targetNickName" :src="questionData.targetUserImg"></y-card>
				<i class="no_answer-img"></i>
				<p>问题被下架</p>
			</div>
			<!-- 问题被下架 end -->

			<!--只问不答，提问者角度 begin-->
			<div class="answer_detail--questioner no_answer--area" v-else-if="$env.userId == questionData.createUserId">
				<y-card class="card_data--show" :to="`/user/${questionData.targetId}`" :title="questionData.targetNickName" :src="questionData.targetUserImg"></y-card>
				<i class="no_answer-img"></i>
				<p>尚未回答</p>
			</div>
			<!--只问不答，提问者角度 end-->

			<!--只问不答，回答者角度 begin-->
			<div class="answer_detail--responder" v-else-if="$env.userId == questionData.targetId">
				<y-card class="card_data--show" :to="`/user/${questionData.targetId}`" :title="questionData.targetNickName" :src="questionData.targetUserImg"></y-card>
				<y-button :to="askLink" class="write_answer-btn"> <b class="iconfont icon-plus"></b> 写答案</y-button>
			</div>
			<!--只问不答，回答者角度 end-->
		</div>
		<!--只问不答 end-->
	</div>
</template>
<script>
	import YNav from '@/components/nav/nav'
	import YNavToggle from '@/components/nav/nav-toggle'
	import YFlowDetail from '@/components/flow-detail'
	import YComment from '@/components/comment'
	import YButton from '@/components/button'
	import YCard from '@/components/card'
	import YHot from '@/components/hot';
	export default {
		components: {
			YNav, YNavToggle, YFlowDetail, YComment, YButton, YCard, YHot
		},
		data() {
			return {
				questionData: {},
				answerData: {},
				answerShelveFlag: null,
			}
		},
		computed: {
			askLink: function () {
				return `/answer/new/${this.questionData.type}/${this.questionData.id}`;
			}
		},
		methods: {
			async initData() {
				let questionRes = await this.$http.get(`/services/app/v1/question/questionAnswerDetail/?${this.$route.params.type}Id=${this.$route.params.id}`);
				if (questionRes.data.code !== '200') {
					this.$toast(questionRes.data.msg);
					return false;
				}
				this.answerShelveFlag = questionRes.data.data.answerShelveFlag;
				// this.answerShelveFlag = 0;
				this.questionData = questionRes.data.data.question;
				if (this.questionData.answerCount === 0) return false;
				this.answerData = questionRes.data.data.answer;

			}
		},
		mounted() {
			this.initData();
		}
	}
</script>
<style>
 @import "#/css/var.css";

 .question_single_detail {
 	 & .answer_detail--questioner {
 	 	padding-top: .4rem;
 	 	margin-top: .2rem;
 	 	& .no_answer-img {
 	 		margin-top: .8rem;
 	 	}
 	 }

 	 & .card_data--show {
 	 	margin-left: .3rem;

 	 	& .y_card-text {
           text-align: left;
 	 	}
 	 }

	 & .answer_detail--responder {
		 margin-top:.2rem;
	 	 background-color: #fff;
	 	 padding-top: .4rem;
	 	 padding-bottom: .8rem;
	 	 text-align: center;

	     & .write_answer-btn {
	     	font-size: .32rem;
	     	padding: 0 1rem;
	     	margin-top: .8rem;
	     	& b {
	     	  margin-right: .3rem;
	     	}

	     }
	 }
	 & .flow_item-foot {
		display: block;
	}
 }
</style>