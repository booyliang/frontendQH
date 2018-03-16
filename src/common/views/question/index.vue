<template>
	<div class="question_index">
		<!--顶部导航 begin-->
		<y-nav title="问答" :show-search="true" :menuData="['index', 'copy-url', 'report']"></y-nav>
		<!--顶部导航end-->
		<div class="question_index-user_list">
			<div class="question_index-header">
				<h3 class="question_index-title"><i class="iconfont icon-badge-question"></i>问答明星</h3>
				<router-link class="question_index-more" to="/question/celebrity-list">查看全部
				<i class="iconfont icon-arrow-right"></i></router-link>
			</div>
			<y-list class="flow_list">
				<y-flow-item-celebrity v-for="(item, index) in userList" :key="index" :data="item"></y-flow-item-celebrity>
			</y-list>
		</div>
		<div class="question_index-host_list">
			<div class="question_index-header">
				<h3 class="question_index-title"><i class="iconfont icon-badge-star"></i>精选咨询</h3>
				<router-link class="question_index-more" to="/question/list/1">查看全部
				<i class="iconfont icon-arrow-right"></i></router-link>
			</div>
			<y-list class="flow_list">
				<y-flow-item v-for="(item, index) in questionList" :key="index" :data="item"></y-flow-item>
			</y-list>
		</div>
	</div>
</template>
<script>
	import YList from '@/components/list'
	import YFlowItem from '@/components/flow-item'
	import YFlowItemCelebrity from './components/flow-item-celebrity'
	export default {
		components: {
			YList,
			YFlowItem,
			YFlowItemCelebrity
		},
		data() {
			return {
				questionList: [],
				userList: [],
			}
		},
		mounted() {
			Promise.all([
				this.$http.get('/services/app/v1/question/star/1/3?orderBy=like'),
				this.$http.get('/services/app/v1/question/list/1/1/20?orderBy=hot&contain=1')
			]).then(values => {
				let userRes = values[0].data,
					questionRes = values[1].data;
				if (userRes.code === '200') {
					this.userList = userRes.data.entities;
				} else {
					this.$toast(userRes.msg)
				}
				if (questionRes.code === '200') {
					this.questionList = questionRes.data.entities;
				} else {
					this.$toast(questionRes.msg);
				}

			}).catch(error => {
				this.$toast('请求出错，请联系管理员!');
			})
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.question_index {
		& .question_index-host_list {
			margin-top: 0.2rem;
			background: #fff;
		}
		& .question_index-title {
		   & .iconfont {
		   	  margin-right: .15rem;
		   	  color: var(--theme-color);
		   }	
           
		}
	}
	.question_index-user_list {
		background: #fff;
	}
	.question_index-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 0.3rem;
		height: 0.9rem;
		border-bottom: 1px solid var(--border-color);
	}
	.question_index-title {
		font-size: .32rem;
	}
	.question_index-more {
		font-size: .24rem;
		color: var(--theme-color);
	}
</style>

