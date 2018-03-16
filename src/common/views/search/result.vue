<template>
	<div class="search_result">
		<y-flow-list :request="Request" :item="Item" :endTip="false" @empty="handleLoaded"></y-flow-list>
		<y-message :icon="emptyIcon" title="没有您要搜索的内容"></y-message>
	</div>
</template>
<script>
import YFlowList from '@/components/flow-list'
import CotentItem from '@/views/coterie/general/components/item';
import UserItem from './components/userItem'
import CoterieItem from './components/coterieItem'
import Message from '@/components/message'
export default {
	name: 'search-result',
	components: {
		[YFlowList.name]: YFlowList, CotentItem, UserItem, CoterieItem, [Message.name]: Message
	},
	data() {
		return {
			emptyIcon: require('../../assets/status-empty@2x.png'),
			Item: null,
			searchKeyword: this.$route.query.keyword || "",
			type: this.$route.query.type,
			showEmpty: false
		}
	},
	computed: {
		Request() {
			let result = {
				url: `/services/app/v1/circle/search/${this.type}`,
				params: {
					keyWord: this.searchKeyword || "null"
				}
			}
			return result;
		}
	},
	mounted() {
		this.initData();
	},
	methods: {
		initData() {
			this.showEmpty = false;
			this.searchKeyword = this.$route.query.keyword;
			this.type = this.$route.query.type;
			switch (this.type) {
				case 'resource':
					this.Item = CotentItem;
					break;
				case 'user':
					this.Item = UserItem;
					break;
				case 'coterie':
					this.Item = CoterieItem;
					break;
			}
		},
		handleLoaded() {
			this.showEmpty = true;
		},
	}
}
</script>
<style>
@import "#/css/var.css";
.search_result {
	& .message {
		display: none;
		padding: 2.5rem 0 0 0;

		& .message-icon {
			width: 3.64rem;
			height: 3.12rem;
		}
	}

	& .empty~.message {
		display: block;
	}

	& .flow_list 
	{
      & .flow_item {
	       &:first-child {
	          border-top: none;
	       }
	  }
	  & .topic_item-wrap {
	  	 &:first-child {
	          border-top: none;
	     }
	  }
	}

	& .flow_item {
		 @apply --border-top;
	}

	& .article_item {
       @apply --border-top;
       border-bottom: none;
	}

	& .topic_item {
		border: none;
	}

    & .question_item-wrap {
    	 @apply --border-top;
    	 border-bottom: none;
    }

	& .topic_item-wrap {
       @apply --border-top;
      border-bottom: none;
	}


}
</style>
