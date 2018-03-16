<template>
	<div class="activity-wrap">
		<div class="body-white">
			<!--头部导航 S-->
			<y-nav :title="$R('activity')" :showSearch="true" :menuData="menuData"></y-nav>
			<!--头部导航 E-->
			<!--活动列表导航 S-->
			<y-tab-bar v-model="tabId" :tabOption="tabOption"></y-tab-bar>
			<!--活动列表导航 E-->
	
			<!--活动列表 S-->
			<y-flow-list v-if="showData" :request="flowRequest" :item="activityItem"></y-flow-list>
			<!--活动列表 E-->
	
			<router-link v-if="isPublish" class="add_idea" to="/activity/new"></router-link>
		</div>
	</div>
</template>

<script>
import ActivityItem from '@/views/activity/components/flow-item-activity'
export default {
	components: {
		ActivityItem,
	},
	name: 'activty',
	data() {
		return {
			menuData: ['index'],
			activityItem: ActivityItem,
			tabId: this.$route.params.tabId || 1,
			tabOption: [{ id: 1, text: this.$R('activity-current') }, { id: 2, text: this.$R('activity-past') }],
			isPublish: false,
			showData: true
		}
	},
	computed: {
		flowRequest() {
			/* let module = this.$utils.getModule('0052');
			return {url: module.apiUrl + '/' + this.tabId}*/

			return {
				url: `/services/app/v1/activity/list/${this.tabId}`,
				params: {
					pageNo: 1,
					pageSize: 20
				}
			}
		}
	},
	created() {
		this.$http.get(`/services/app/v1/activityrole/selectAppRoleList`).then(res => {
			if (res.data.code === '200') {
				let _data = res.data.data || [];
				_data.forEach((item, index) => {
					if (item.activityType === '1') {  // 可发投票类活动
						this.isPublish = true;
					}
				});
			}
		})
	}
}
</script>


