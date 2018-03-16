<template>
	<div class="search body--white">
		<y-nav>
			<span slot="nav-center">
				<y-nav-search :showSearch="true" icon="icon" v-model.trim="searchKeyword"></y-nav-search>
			</span>
			<span slot="nav-right">
				<y-button type="text" @click.native="handleSearch" :disabled="!searchKeyword">搜索</y-button>
			</span>
		</y-nav>

		<y-tab-bar :tabOption="tabOption" v-model="tabId" ref="tab_bar" @click="handleSearch" :enableRouter="false"></y-tab-bar>
		<router-view ref="children"></router-view>
	</div>
</template>
<script>

export default {
	components: {

	},
	data() {
		return {
			searchKeyword: this.$route.query.keyword,
			delayKeyword: '',
			delayTimeout: null,
			tabId: this.$route.query.type || 'resource',
			tabOption: [
				{ id: 'resource', text: "内容" },
				{ id: 'user', text: '用户' },
				{ id: 'coterie', text: '私圈' },
			],
		}
	},
	mounted() {

	},
	watch: {
		searchKeyword(newVal, oldVal) {
			if (this.delayTimeout)
				clearTimeout(this.delayTimeout);
			this.delayTimeout = setTimeout(this.changeKeyword, 800)
		}
	},
	methods: {
		changeKeyword() {
			this.delayKeyword = this.searchKeyword;
			this.delayTimeout = null;
			this.handleSearch();
		},

		handleSearch() {  // 点击tab		
			clearTimeout(this.delayTimeout);
			let routeName = 'search-result';
			let currentRouteName = this.$route.name;
			this.$router.replace({ name: routeName, query: Object.assign({}, { keyword: this.searchKeyword, type: this.tabId }) })
			if (currentRouteName === 'search-result') {
				this.$refs.children.initData();
			}
		}

	},

}
</script>
<style>
@import '#/css/var.css';
.search {
	& .no-search-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 0.32rem;
		color: #b4b4b4;
		& i {
			width: 3.68rem;
			height: 3.15rem;
			background: url(/assets/static/no-data@2x.png) no-repeat center;
			background-size: 3.68rem auto;
			margin: 20vh 0 0.3rem;
		}
	}
	& .tab_bar-wrap {
		width: 100%;
	}
	& .article_item-text {
        font-size: .26rem;
        color: var(--text-tips-color);
        & .icon-arrow-right {
        	font-size: .26rem;
        }
	}
	& .item:not(:first-child) .item-wrap {
	   border-top: none;
	}
	& .item--clickable {
		@apply --border-bottom;
	}
	& .activity-img {
       margin-bottom: 0;
	}
	& .y_card-img__large {
       margin-right: .2rem;
	}
    & .search_result {
      & .coterie-member-item:last-child {
      	 @apply --border-bottom;
      }
    }

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
	&>div {
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
