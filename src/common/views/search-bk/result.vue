<template>
	<div class="search-all-result">
		<y-nav>
			<span slot="nav-center">
				<y-nav-search :showSearch="true" v-model="searchKeyword" icon="icon"></y-nav-search>
			</span>
			<span slot="nav-right">
				<y-button type="text" @click.native.stop="handlerSearch()">搜索</y-button>
			</span>
		</y-nav>
		<div v-if="loading" class="load_more-tip">数据加载中...</div>
		<div v-else>
			<div class="no-search-content" v-if="userList.length == 0 && detailList.length == 0">
				<i></i>
				<p>未搜索到"{{keyword}}"相关结果！</p>
				<p>请您试试其他关键词！</p>
			</div>
			<div class="search-show-content" v-if="userList.length > 0">
				<div class="search-result-title"><i></i>成员</div>
				<div class="item" v-for="(item,index) in userList" :key="index">
					<y-card :title="item.name" img-size="large" :badge="item.badge" :to="`/user/${item.userId}`" position="horizontal" :src="item.avatar"></y-card>
				</div>
				<div class="loadMore" @click.stop="loadMore('users')" v-if="userList.length > 3 && this.searchType == 'all'">查看更多内容</div>
			</div>
			<div v-if="detailList.length > 0" class="search-show-content">
				<div class="search-result-title"><i></i>内容</div>
					<div v-for="(item,index) in detailList" :key="index">
						<y-flow-item :data="item" :heats="['answer','follow']"></y-flow-item>
					</div>
			</div>
		</div>
	</div>
</template>
<script>
import Nav from '@/components/nav/nav';
import YNavSearch from '@/components/nav/nav-search';
import YButton from '@/components/button';
import YCard  from '@/components/card';

import FlowItem from '@/components/flow-item';
export default {
	components: {
		[Nav.name]: Nav,
		YNavSearch,
		YButton,
		YCard,
		[FlowItem.name]: FlowItem
	},
	name: 'resultView',
	data() {
		return {
			userList: [],
			detailList: [],
			searchKeyword: '',
			searchType: 'all',
			keyword: '',
			searchHistory: [],
			loading: true
		}
	},
	methods: {
		toDetailLink(item) {
			this.$router.push(`/redirect/${ item.moduleEnum }/${ item.moduleId }`);
		},
		getLink(item, columnCode) {
			item.moduleEnum = columnCode ? columnCode : item.moduleEnum;
			let link = '';
			let column = this.$utils.getModule(item.moduleEnum)
			if (!column) {
				console.error(`Config of column ${ item.moduleEnum } not found.`);
				return link;
			}
			let linkTemplate = column.link;
			if (!linkTemplate) {
				console.error(`Column ${ item.moduleEnum } doesn't hava a link config.`);
				return link;
			} else if (typeof linkTemplate === 'function') {
				linkTemplate = linkTemplate.call(this, Object.assign({}, item, {
					type: item.tag
				}));
			}
			if (columnCode === 'user') {
				link = linkTemplate.replace(':id', item.userId);
			} else {
				link = linkTemplate
			}
			return link;

		},
		onSearch(keyword) {
			if (!keyword) return false;
			this.keyword = keyword;
			let keyIndex = this.searchHistory.indexOf(keyword);
			if (keyIndex !== -1) {
				this.searchHistory.splice(keyIndex, 1);
			}
			this.searchHistory.unshift(keyword);
			localStorage.setItem(this.$utils.circleName + 'searchHistory', JSON.stringify(this.searchHistory));
			this.loading = true;
			this.$http.get(`/services/app/v1/dynamic/search/${this.searchType}/${keyword}`).then((res) => {
				let users = res.data.data.users; // 成员
				this.userList = [];
				users.forEach((item) => {
					this.userList.push({
						name: item.nickName,
						avatar: item.headImg,
						badge: item.authRole,
						userId: item.id,
						link: this.getLink(item, 'user')
					})
				});
				// 内容
				let content = res.data.data.dynamices;
				this.detailList = [];
				content.forEach((item) => {
					this.detailList.push({
						id: item.moduleId,
						title: item.title,
						nickName: item.nickName,
						userImg: item.userImg,
						content: item.summary,
						imgUrl: item.thumbnail,
						moduleEnum: item.moduleEnum,
						moduleId: item.moduleId,
						columnCode: item.moduleEnum
					})
				});
				this.loading = false;
			})
		},
		loadMore(searchType) {
			this.$router.replace('/search/result?keyword=' + this.keyword + '&type=' + searchType);
		},
		initData(keyword) {
			let query = this.$route.query;
			this.searchKeyword = keyword || query.keyword;
			this.searchType = query.type ? query.type : 'all';
			let searchHistory = localStorage.getItem(this.$utils.circleName + 'searchHistory');
			this.searchHistory = searchHistory ? JSON.parse(searchHistory) : [];
			this.onSearch(this.searchKeyword);
		},
		handlerSearch() {
			if (!this.searchKeyword) return false;
			this.initData(this.searchKeyword);
		}
	},
	watch: {
		// '$route': 'initData'
	},
	mounted() {
		this.initData();
	}
}
</script>
<style>
@import '#/css/var.css';
.search-all-result {
	& .item {
		padding: 0 0.15rem;
		& .y_card{
			padding-top: .15rem;
			padding-bottom: .15rem;
		}
		& .item-wrap{
			padding-top: .25rem;
			padding-bottom: .25rem;
			border-bottom: .01rem solid #e7e7e7;
		}
	}
	& .loadMore {
		color: #00aff7;
	}
	& .flow_item-head {
		display: none;
	}
	& .flow_item-foot {
		display: none;
	}
	& .flow-pics {
		display: none;
	}
	& .heat {
		display: none;
	}
	& .no-search-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 0.32rem;
		color: #b4b4b4;
		& i {
			width: 2.55rem;
			height: 2.4rem;
			background: url(../../assets/no-result@2x.png) no-repeat center;
			background-size: 2.55rem auto;
			margin: 20vh 0 0.6rem;
		}
	}
}

.search-show-content {
	@apply --margin-bottom;
}
</style>
