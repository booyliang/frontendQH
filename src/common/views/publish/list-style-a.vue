<template>
	<div class="publish-list">
		<y-nav :showSearch="true" :title="classifyItemName" :menuData="['index', 'refresh']" v-if="isleveltwo"></y-nav>
		<y-tab-bar v-if="tabOption.length && !isleveltwo" v-model="classifyItemId" :tabOption="tabOption" textField="categoryName" :enableRouter="false"></y-tab-bar>
		<y-label-search v-if="classify.searchFlag" @search="doQuery" :labels="labelList" v-model="label"></y-label-search>
		<y-flow-list :item="contentItem" :class="flowClass" :request="request" @loaded="handleLoaded"></y-flow-list>
		<y-button class="publish-button" v-if="showButton" @click.native="handleClick"></y-button>
	</div>
</template>
<script type="text/javascript">
import PublishMixin from "./mixin"
import YLabelSearch from "./hot-label-search"
import PublishItem from './components/publish-item-general'
import PublishPicItem from './components/publish-item-pic'
export default {
	mixins: [PublishMixin],
	components: { YLabelSearch },
	name: 'publish-list-a',
	watch: {
		classifyItemId(newVal, oldVal) {
			this.labels[oldVal] = this.label;
			this.label = this.labels[newVal] || '';
			this.doQuery();
		}
	},
	data() {
		return {
			classifyId: this.$route.params.classifyId,
			classifyItemId: this.$route.params.classifyItemId || '',
			tabOption: [],
			labelList: null,
			category: {},
			showButton: false,
			config: {},
			classify: {},
			labels: {},
			publishItem: PublishItem,
			publishPicItem: PublishPicItem,
			label: '',
			request: {},
			isleveltwo: false
		}
	},
	async created() {
		this.isleveltwo = !!this.$route.params.classifyItemName;
		this.getTemplateConfig();
		this.getCategory();
		let res = await this.$http.get(`/services/app/v1/releasehotlabel/list/${this.classifyId}`);
		this.labelList = res.data.data;
	},
	computed: {
		flowClass() {
			return { search: this.label }
		},
		contentItem() {
			return !this.classify.contextStyle || this.classify.contextStyle === '0' ? this.publishItem : this.publishPicItem;
		},
		classifyItemName() {
			return this.$route.params.classifyItemName ? this.$route.params.classifyItemName : this.classify.categoryName;
		}
	},
	methods: {
		handleLoaded(data) {
			for (let item of data) {
				if (item.functionType === 1) {
					item.anonymity = true;
				}
			}
		},
		doQuery() {
			this.request = this.getRequest();
		},
		getRequest() {
			if (!this.classifyItemId)
				return {};
			let request = {
				url: this.$utils.getModule('0091').apiUrl,
				params: {
					label: this.label, classifyId: this.classifyId
				}
			};
			if (this.category.categoryItems && this.category.categoryItems.length) {
				request.params.classifyItemId = this.classifyItemId;
				request.params.orderType = '5';
			} else {
				request.params.orderType = this.isleveltwo ? '5' : this.classifyItemId; // 列表图样式下排序为5，非列表图样式并且没有二级分类按照最新最热排序
			}
			return request;
		},
		async getCategory() {
			let res = await this.$http.get(`/services/app/v1/classify/categoryAndItems/${this.classifyId}`);
			this.category = res.data.data;
			let { authStatus } = this.$circle;
			let { allowGeneralUserPublish, allowRegisterUserPublish } = this.category.category;
			this.category.editable = !this.isleveltwo;
			if (this.$env.userId && ((authStatus === 0 && allowGeneralUserPublish === 1) || (authStatus === 1 && allowRegisterUserPublish === 1)))
				this.showButton = true;
			this.classify = this.category.category;
			if (this.category.categoryItems.length && !this.isleveltwo) {
				this.classifyItemId = this.category.categoryItems[0].id;
				this.tabOption = this.category.categoryItems;
			}
			else {
				this.classifyItemId = this.classifyItemId || '6';
				this.tabOption = [{ id: '6', categoryName: this.$R('hot') }, { id: '1', categoryName: this.$R('time') }];
			}
			this.doQuery();
		},
		async getTemplateConfig() {
			let res = await this.$http.get(`/services/app/v1/release/config/template/${this.classifyId}`);
			this.config = res.data.data;
		},
		handleSearch(label) {
			this.doQuery();
		},
		handleClick() {
			//				var dataSource = {
			//					"city": "卢湾区",
			//					"functionType": 0,
			//					"classifyItemName": "的微分方程",
			//					"title": "法国哼哼唧唧健康",
			//					"classifyItemId": 31,
			//					"contentSource": [
			//						{
			//							"text": "唱歌好纠结空军建军节经济哈哈就白大褂哈哈哈刚刚好健康"
			//						}
			//					],
			//					"date": "2017-07-07",
			//					"description": "唱歌哼哼唧唧",
			//					"label": "唱个歌很积极",
			//					"province": "上海市"
			//
			//				};
			//				this.$saveEntity(dataSource);
			this.start(this.config, this.category);
		}

	},

}
</script>
<style>
@import "#/css/var.css";
.load_more.empty.search {
	&:after {
		content: '沒有您搜索的内容哦';
		display: block;
		height: 3rem;
		width: 3rem;
		margin: 1.2rem auto 0;
		background: url(../../assets/no-find@2x.png) no-repeat center;
		background-size: 2.56rem 2.4rem;
		padding-top: 3rem;
		font-size: .32rem;
		color: var(--text-tips-color);
	}
	& .load_more-tip {
		display: none;
	}
}

.publish-list {
	& .flow_item-foot {
		display: block;
	}
	& .heat {
		display: none;
	}

	& .tab_bar {
		position: static;
		/* 解决小米2兼容问题 */
		position: sticky;
	}
}
</style>
