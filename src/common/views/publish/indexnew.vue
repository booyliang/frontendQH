<template>
	<div class="indexNew">
		<y-nav :showSearch="true" :title="categoryName"></y-nav>
		<y-flow-list :request="Request" :item="Item"></y-flow-list>
		<y-publish-entry @button-clicked="handleClick" >
			<span class="iconfont icon-plus"></span>
		</y-publish-entry>
	</div>
</template>
<script type="text/javascript">
import ListItem from './components/list-item'
import YCard from '@/components/card'
import PublishMixin from "@/views/publish/mixin"
import PublishEntry from '@/components/publish-entry';
export default {
	mixins: [PublishMixin],
	components: { ListItem, [PublishEntry.name]: PublishEntry, },
	name: 'publish-index-new1111',
	data() {
		return {
			Item: ListItem,
			[YCard.name]: YCard,
			classifyId: this.$route.params.classifyId,
			categoryName: this.$route.params.classifyItemName,
			Request: {
				
			}
		}
	},
	// computed: {
	// 	Request() {
	// 		return {
	// 			method: 'GET',
	// 			url: '/services/app/v1/release/info/list',
	// 			params: {
	// 				classifyId: this.$route.params.classifyId,
	// 				classifyItemId: this.$route.params.classifyItemId
	// 			}

	// 		}

	// 	}
	// },
	mounted() {
		this.Request = {
			method: 'GET',
			url: '/services/app/v1/release/info/list',
			params: {
				classifyId: this.$route.params.classifyId,
				classifyItemId: this.$route.params.classifyItemId
			}
		}
	},

	async created() {
		let res = await this.$http.get(`/services/app/v1/classify/categoryAndItems/${this.classifyId}`)
		let data = res.data.data;

	},
	methods: {
		chagePublishData(publishData) {
			publishData.category.defaultId = this.$route.params.classifyItemId;
			publishData.category.defaultText = this.$route.params.classifyItemName;
			publishData.category.editable = false;
		},
		async handleClick() {
			await this.$user.login();
			this.$http.get('/services/app/v1/coterie/user/checkPlatformShutup').then(res => {
				if (res.data.code === '200') {

					this.start(this.classifyId)
				} else if (res.data.code === '1023') {
					this.$toast('您当前为禁言状态')
				} else {
					this.$toast(res.data.msg)
				}

			})
		},
		afterPublish(data) {
			this.$router.push(`/redirect/${data.moduleEnum}/${data.id}`)
		}
	}
}
</script>
<style>
.indexNew {
	& .flow_item .item-wrap {
		padding-bottom: .2rem;
	}
}
</style>
