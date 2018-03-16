<template>
	<div class="viewpoints-detail">
		<y-nav :title="$R('detail')" :menuData="menuData"></y-nav>
		<div class="viewpoints-detail-content">
			<y-flow-detail :data="detailData">
			</y-flow-detail>
			<y-hot :hots="['like']" :data="detailData"></y-hot>
			<y-comment :data="detailData"></y-comment>
		</div>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import YFlowDetail from '@/components/flow-detail';
import YComment from '@/components/comment/comment';
import YHot from '@/components/hot';

export default {
	components: {
		YNav,
		YFlowDetail,
		YHot,
		YComment
	},
	data() {
		return {
			detailData: {},
			menuData: ['index', 'copy-url', 'report']
		}
	},
	mounted() {
		this.$http.get(`/services/app/v1/famous/statement/detail/${this.$route.params.id}`).then(response => {
			if (response.data.code === "200") {
				let data = response.data.data || {};
				data.disabledCard = true;
				this.detailData = data;
			} else {
				console.log(response.data.msg);
			}
		});
	},
	methods: {

	}
}
</script>

<style>

</style>