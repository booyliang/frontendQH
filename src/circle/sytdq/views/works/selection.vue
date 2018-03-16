<template>
	<div class="works_selection">
		<y-nav title="选择分类">
			<span slot="nav-right">
				<y-publish-button @click.native="saveSelect">完成</y-publish-button>
			</span>
		</y-nav>
		<y-check-group :data="listData" type="radio" ref="checkList"></y-check-group>
	</div>
</template>
<script>
import YCheckGroup from '@/components/check-group'
import {YPublishButton} from '@/components/content-publish'
import Toast from '@/components/toast'
export default{
	components: {
		YCheckGroup,
		YPublishButton
	},
	data() {
		return {
			listData: [],
			newData: {}
		}
	},
	created() {
		this.newData = this.$localStore.get('worksNewData');
		this.$http.get('/services/app/v1/appreciation/classify/list').then(response => {
			if (response.data.code === '200') {
				let listData = response.data.data;
				for (let item of listData) {
					if (this.newData && item.id === this.newData.classifyId) {
						this.listData.push({'text': item.name, 'id': item.id, 'checked': true});
					} else {
						this.listData.push({'text': item.name, 'id': item.id});	
					}
				}
			}
		})
		.catch(err => console.log("栏目分类请求失败！", err));
	},
	methods: {
		saveSelect() {
			let item = this.$refs.checkList.getSelectedItems()[0];
			console.log(item);
			if (!item) {
				Toast('请选择栏目！');
				return;
			}
			this.newData.classifyId = item.id;
			this.$router.back();
		}
	}
}
</script>
<style>
	.works_selection{
		height: 100vh;
		background-color: #fff;
		padding: 0 0.12rem 0 0.12rem;
		& i{
			margin-left: 0.16rem;
		}
	}
</style>