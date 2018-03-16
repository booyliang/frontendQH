<template>
  <router-view :activity-data="activityData"></router-view>
</template>
<script>
	export default {
		data() {
			return {
				activityData: {},
				activityId: ''
			}
		},
		mounted() {
			this.activityId = this.$route.params.activityId;
			this.getData();
			this.$eventBus.$on('reloadData', this.getData);
		},
		beforeDestroy() {
			this.$eventBus.$off('reloadData');
		},
		methods: {
			getData() {
				this.$opusApi.get(`/yyl/v1/activity/vote/detail/${this.$route.params.activityId}`).then(res => {
					let resData = res.data;
					if (resData.msg === 'success') {
						this.activityData = resData.data;
						this.$eventBus.$emit('activityDataRefresh', this.activityData);
					} else {
						this.$toast(resData.msg);
					}
				});
			},
		},
		activated() {
			let currentId = this.$route.params.activityId;
			
			if (this.activityId !== currentId) {
				this.$eventBus.$emit('global-message', {type: 'refresh'});
			}
		}
	}
</script>
