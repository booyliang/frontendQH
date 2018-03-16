<template>
	<div class="question_index  old-doctor">
		<!--顶部导航 begin-->
		<y-nav title="名老中医" :show-search="true" :menuData="['index', 'refresh']"></y-nav>
		<!--顶部导航end-->
		<div class="question_index-user_list">
			<div class="question_index-header">
				<h3 class="question_index-title">
					<i class="iconfont icon-doctor-a"></i>医生</h3>
				<router-link v-if="userList" class="question_index-more" to="/medicine/celebritylist">查看全部
					<i class="iconfont icon-arrow-right"></i>
				</router-link>
			</div>
			<y-list class="flow_list">
				<y-flow-item-celebrity v-for="(item, index) in userList" :key="index" :data="item"></y-flow-item-celebrity>
			</y-list>
		</div>
		<div class="question_index-host_list">
			<y-tab-bar v-model="tabId" :tabOption="tabOption"></y-tab-bar>
			<y-flow-list :request="request"></y-flow-list>
		</div>
		<y-button class="publish-button" v-if="showButton && this.$route.params.tabId === 'general'" @click.native="handleClick"></y-button>
	</div>
</template>
<script>
import YList from '@/components/list'
import YFlowItem from '@/components/flow-item'
import YItem from '@/components/item'
import YFlowDetail from '@/components/flow-detail'
import YFlowItemCelebrity from '../components/flow-item-celebrity'
import PublishMixin from "@/views/publish/mixin"
import Toast from '@/components/toast'
export default {
	mixins: [PublishMixin],
	components: {
		YList,
		YFlowItem,
		YFlowItemCelebrity,
		YFlowDetail
	},
	data() {
		return {
			tabId: this.$route.params.tabId,
			classifyId: this.$route.params.classifyId,
			tabOption: [{ id: 'new', text: '最新咨询' }, { id: 'general', text: '' }],
			questionList: [],
			userList: [],
			category: {},
			config: {},
			showButton: false,
		}
	},
	mounted() {
		this.judgeUser();
		this.getDoctorList();
		this.getTemplateConfig();
		this.getCategory();
	},
	computed: {
		request() {
			return {
				method: 'GET',
				url: this.tabId === 'new' ? '/services/app/v1/question/list/1' : this.$utils.getModule('0091').apiUrl,
				params: this.tabId === 'new' ? { orderBy: 'hot', contain: 1 } : { classifyId: this.classifyId }
			}
		}
	},
	methods: {
		async judgeUser() {
			let infoRes = await this.$http.get(`/services/app/v1/doctorAuthentication/checkStartByUserId/${this.$env.userId}`);
			this.judgeState = infoRes.data.data.isAuthentication;
			if (this.judgeState === 1) {
				this.showButton = true;
			}
		},
		async getDoctorList() {
			let userRes = await this.$http.get('/services/app/v1/doctorAuthentication/list/1/3');
			this.userList = userRes.data.data.entities;
		},
		async getCategory() {
			let configData = await this.$http.get(`/services/app/v1/classify/categoryAndItems/${this.classifyId}`);
			this.category = configData.data.data.category;
			this.category.editable = false;
			this.tabOption[1].text = this.category.categoryName;
		},
		async getTemplateConfig() {
			let res = await this.$http.get(`/services/app/v1/release/config/template/${this.classifyId}`);
			this.config = res.data.data;
		},
		handleClick() {
			console.log(this.category)
			this.start(this.config, this.category);
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.question_index {
	& .question_index-host_list {
		background: #f8f8f8;
	}

	&.old-doctor .question_index-title .iconfont {
		color: #ff957f;
	}
}
</style>

