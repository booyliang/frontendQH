<template>
	<div class="answer_detail">
		<!--顶部导航-->
		<y-nav title="详情" :menuData="menuData"></y-nav>
		<!--顶部导航E-->
		<y-flow-detail class="answer_detail-question" :data="questionData"></y-flow-detail>
		<y-flow-detail class="answer_detail-answer" :data="answerData"></y-flow-detail>
		<y-hot :hots="['like', 'forward']" :data="answerData">
			<div slot="foot">
				<y-ad :type="1" keyword="圈子内容"></y-ad>
			</div>
		</y-hot>
		<y-comment :data="answerData"></y-comment>
	</div>
</template>
<script>
import YNav from '@/components/nav/nav'
import YNavToggle from '@/components/nav/nav-toggle'
import YFlowDetail from '@/components/flow-detail'
import YComment from '@/components/comment'
import YHot from '@/components/hot';
import Ad from '@/components/ad';
export default {
	components: {
		YNav, YNavToggle, YFlowDetail, YComment, YHot, [Ad.name]: Ad
	},
	data() {
		return {
			answerData: {},
			questionData: {},
			menuData: ['index', 'copy-url', 'report']
		}
	},
	methods: {
		async initData() {
			let answerRes = await this.$http.get(`/services/app/v1/answer/detail/${this.$route.params.id}`);
			if (answerRes.data.code !== '200') {
				this.$toast(answerRes.data.msg);
				return false;
			}
			let answerResData = answerRes.data;
			this.answerData = answerResData.data;
			let questionRes = await this.$http.get(`/services/app/v1/question/detail/${this.answerData.questionId}`);
			if (questionRes.data.code !== '200') {
				this.$toast(questionRes.data.msg);
				return false;
			}
			let questionResData = questionRes.data;
			this.questionData = questionResData.data;
			this.answerData.questionTitle = this.questionData.title;
		}
	},
	mounted() {
		this.initData();
	}
}

</script>
<style>
@import '#/css/var.css';
.answer_detail {
	& .content_source {
		margin-top: 0.2rem;
		color: var(--text-primary-color);
		& p {
			font-size: .34rem;
			line-height: 28px;
			color: var(--text-primary-color);
		}
		& .image-box {
			margin-top: 0.2rem;
		}
		& .video-box {
			margin-top: 0.2rem;
		}
	}
}
.answer_detail-answer {
	margin-top: 0.2rem;
}
</style>
