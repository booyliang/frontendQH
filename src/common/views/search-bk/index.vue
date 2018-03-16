<template>
	<div>
		<div class="body--white">
			<y-nav>
				<span slot="nav-center">
					<y-nav-search :on-icon-click="hanldeIconClick" :showSearch="true" icon="icon" v-model.trim="searchKeyword"></y-nav-search>
				</span>
				<span slot="nav-right">
					<y-button type="text" @click.native="onSearch(searchKeyword)" :disabled="!searchKeyword">搜索</y-button>
				</span>
			</y-nav>

			<div class="search_title">搜索圈子指定资源</div>
			<ul class="search_list">
				<li v-for="(item,index) in searchTypes" @click="setSearchType(item)">{{item.label}}</li>
				<router-link v-for="(item, index) in customSearchType" :key="index" :to="item.link" tag="li">{{ item.label }}</router-link>
			</ul>
			<div class="showSearchRecord">
				<div class="search-history-title" v-if="keywordRecordList.length > 0">
					<span>历史搜索</span>
					<span class="search-clear" @click="clearSearchHistory">清除</span>
				</div>
				<ul class="search-history-record">
					<li @click.stop="onSearch(keyword)" v-for="(keyword,index) in keywordRecordList" key="index"><span>{{keyword}}</span></li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>

export default {
	components: {

	},
	data() {
		return {
			searchKeyword: '',
			searchTypes: [{
				value: 'dynamices',
				label: '内容'
			}, {
				value: 'users',
				label: '成员'
			}],
			keywordRecordList: [],
			customSearchType: this.$utils.getModule('search') || []
		}
	},
	methods: {
		hanldeIconClick() {
			if ( !this.searchKeyword ) return false;
			this.onSearch(this.searchKeyword);
		},
		setSearchType(typeItem) {
			this.$router.push({
				path: '/search/category?label=' + typeItem.label + '&type=' + typeItem.value
			});
		},
		onSearch( keyword ) {
			this.$router.push( '/search/result?keyword=' + keyword );
		},
		clearSearchHistory() {
			localStorage.removeItem( this.$utils.circleName + 'searchHistory' );
			this.keywordRecordList = [];
		}
	},
	mounted() {
		let searchHistory = localStorage.getItem( this.$utils.circleName + 'searchHistory' );
		this.keywordRecordList = searchHistory ? JSON.parse( searchHistory ) : [];
	}
}
</script>
<style>
@import '#/css/var.css';

.search_title {
	text-align: center;
	color: #747474;
	line-height: 1;
	padding-top: 0.5rem;
}

.search_list {
	color: var(--theme-color);
	font-size: .3rem;
	text-align: center;
	line-height: 1;
	margin-top: 0.5rem;
	& li {
		display: inline-block;
		margin-right: 0.5rem;
	}
	& li:last-child {
		margin-right: 0;
	}
}

.search-history-title {
	height: 0.68rem;
	line-height: 0.68rem;
	padding: 0 0.3rem;
	color: var(--text-assist-color);
	margin-top: 0.5rem;
	@apply --border-bottom;
	font-size: .28rem;
	& .search-clear {
		float: right;
	}
}

.search-history-record li {
	height: 1.08rem;
	line-height: 1.08rem;
	padding: 0 0.3rem;
	color: var(--text-primary-color);
	@apply --border-bottom;
	font-size: .34rem;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}

.search-result-title {
	height: 0.9rem;
	@apply --border-bottom;
	background: #fff;
	line-height: 0.88rem;
	padding: 0 0.3rem;
	font-size: .32rem;
	& i {
		width: 0.04rem;
		height: 0.28rem;
		background-color: var(--theme-color);
		border-radius: 0.03rem;
		display: inline-block;
		position: relative;
		top: 0.03rem;
		margin-right: 0.1rem;
	}
}

.search-result-content {
	padding: 0 0.14rem;
	background-color: #fff;
	@apply --margin-bottom;
	& > div {
		padding: 0.4rem 0.16rem;
		overflow: hidden;
		@apply --border-bottom;
		& p {
			font-size: .36rem;
			color: var(--text-primary-color);
			text-align: justify;
			& span {
				color: var(--theme-color);
			}
		}
		& h3 {
			font-size: .36rem;
			color: var(--text-primary-color);
			margin-bottom: 0.2rem;
		}
		&:last-child {
			text-align: center;
			border-bottom: none;
			& b {
				text-align: center;
				font-size: .28rem;
				color: var(--theme-color);
			}
		}
	}
}

.search-result-img {
	float: left;
	margin-right: 0.4rem;
	line-height: 0.1rem;
}

.list-bigimg {
	& .avatar {
		width: 1.2rem;
		height: 1.2rem;
	}
	& .card-name {
		margin-bottom: 0;
	}
	& .card-assist {
		font-size: 0.24rem;
		margin-top: 0.16rem;
	}
}

.search-all-result {
	& .search-show-content {
		& .item-wrap {
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			padding-top: 0.4rem;
			& .card {
				margin-bottom: 0.3rem;
				& .avatar {
					width: 1.2rem;
					height: 1.2rem;
				}
				& .card-text .card-name {
					margin-bottom: 0.16rem;
				}
			}
		}
	}
	& .loadMore {
		background: #fff;
		color: var(--theme-color);
		height: 1.06rem;
		text-align: center;
		line-height: 1.06rem;
		@apply --margin-bottom;
		&:before {
			content: "";
			display: block;
			height: 1px;
			margin: 0 0.14rem;
			@apply --border-top;
			overflow: hidden;
		}
	}
}

</style>
