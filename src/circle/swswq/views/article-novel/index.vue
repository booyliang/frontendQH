<template>
	<div class="article-novel-wrap">
		<y-nav :title="title" :showSearch="true" :menuData="['index', 'refresh', 'copy-url', 'report']"></y-nav>
	
		<div class="tab_menu">
			<y-tab-bar :tabOption="tabOption" v-model="tabId"></y-tab-bar>
			<div class="tab_bar sort-bar">
				<a href="javascript:;" @click="handerOrder(0, 0)">
					<div class="tab_bar-item" :class="{active:isActive===0}">{{$R('orderBy-hot')}}</div>
				</a>
				<a href="javascript:;" @click="handerOrder(1, 1)">
					<div class="tab_bar-item" :class="{active:isActive===1}">{{$R('orderBy-time')}}</div>
				</a>
				<a href="javascript:;" @click="handerOrder(2, 2)">
					<div class="tab_bar-item" :class="{active:isActive===2}">{{$R('orderBy-score')}}</div>
				</a>
			</div>
		</div>
		<y-load-more-remote v-if="showData" :request="request" @loaded="handleLoaded">
			<div class="container">
				<y-book-item v-for="(item, index) of bookList" :key="index" :data="item"></y-book-item>
			</div>
		</y-load-more-remote>
	
		<router-link class="add_idea" to="/book/new/0"></router-link>
	</div>
</template>

<script>
import LoadMoreRemote from '@/components/load-more-remote';
import BookItem from '../components/book-item';
export default {
	name: "novel-list",
	components: {
		[LoadMoreRemote.name]: LoadMoreRemote,
		[BookItem.name]: BookItem,
	},
	data() {
		return {
			tabId: this.$route.params.tabId || '',
			tabOption: [
				{ id: '', text: this.$R('classify-all') },
			],
			bookList: [],
			isActive: 0,
			order: 0, // 默认排序方式 0 热门排序 1 推荐时间 2 作品排序
			bookCategory: [],
			showData: true,

		}
	},
	watch: {
		tabId() {
			this.bookList = [];
		}
	},
	async mounted() {
		// 缓存 parentId
		this.$localStore.set('parentId', this.$route.params.id);
		// 小说分类
		let params = {
			parentId: this.$route.params.id
		}
		let res = await this.$http.get('/services/app/v1/bookclassify/list/1/10', { params });
		if (res.data.code === '200') {
			let _res = res.data.data.entities || [];	
			this.bookCategory = _res.map(item => { return { id: item.id, text: item.categoryName }} ) // 书籍类型
			this.tabOption = [...this.tabOption, ...this.bookCategory];			
			this.$localStore.set('bookCategory', this.bookCategory); // 缓存书籍类型
			// console.log("001", JSON.stringify(bookCategory))
		}

	},

	computed: {
		title() {
			return this.$route.params.id === '1' ? this.$R('module-novel') : this.$R('module-publication')
		},
		request() {
			if (this.bookCategory.length === 0)
				return {};
			let classifyIdStr = this.tabId;
			if (classifyIdStr === '')
				classifyIdStr = this.bookCategory.map(item => item.id).join(',')
			return {
				methods: 'get',
				// url: "/services/app/v1/book/list",  // 小说列表请求地址 
				url: this.$utils.getModule('10081').apiUrl,
				params: {
					classifyIdStr,
					order: this.order // 排序方式  

				}
			}
		},


	},
	activated() {
		let editnovel = parseInt(this.$localStore.get('editnovel')) 
		if (editnovel > 0) {

			this.showData = false;
			this.$localStore.remove('editnovel') 
			this.bookList = [];
			this.$nextTick(() => {
				this.tabId = editnovel.toString()
				this.showData = true;
			})
		}
	},
	methods: {
	
		handerOrder(order, index) {
			if (this.order === order) 
				return false;			
		
			this.$nextTick(() => {	
				this.bookList = [];			
				this.isActive = index;
				this.order = order;
			})

		},
		handleLoaded(list, res) {
			this.bookList.push(...list);
		
		},
	}
}
</script>

<style>
@import '#/css/var.css';
.article-novel-wrap {
	background: #fff;
	
	& .tab_menu {
		position: fixed;
		top: 1.28rem;
		left: 0;
		width: 100%;
		background: #fff;
		z-index: 1;
		padding-top: .3rem;
		border-bottom: .2rem solid #f8f8f8;
		& .tab_bar {
			position: relative;
			top:0;
			margin-bottom: .3rem;
			& a {
				border-bottom: none;
				& .tab_bar-item {
					padding: 10px 10px 0;
					margin: 0;
				}
				& .tab_bar-item.active {
					color: var(--theme-color);
					background: #f4f4f4;
					font-size: 16px;
					border-radius: .08rem;
					border: none;
				}
			}
		}

	}
	& .load_more {
		margin-top: 2.6rem;
	}
	
	& .sort-bar {
		text-align: initial;
		display: block;
	}
	& .container {
		background: #fff;
		padding-top: .3rem;
	}
}
/* 兼容iphone5 */
@media (device-height:568px) and (-webkit-min-device-pixel-ratio:2){ 
	.article-novel-wrap .book-list {
		padding: .3rem 0;
		& .flow_item-body .flow_item-cover .right-foot{
			position: static;
		}
	}
}
</style>


