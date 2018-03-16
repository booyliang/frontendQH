<template>
	<div class="works_new">
		<y-nav title="发布" :showLeftArrow="false" leftText="取消" :beforeBack="goBack">
			<span slot="nav-right">
				<y-publish-button>发布</y-publish-button>
			</span>
		</y-nav>
		<y-item title="选择分类" class="works_new-item" to="/works/selection" :value="name"></y-item>
		<y-input class="works_new-title" :maxlength="30" placeholder="输入标题..." v-model="newData.title"></y-input>
		<y-editor class="works_new-content" v-model="newData.contentSource" :text-max-length="1000" :img-max-length="9" placeholder="输入作品描述..." ref="nativeEditor"></y-editor>
	</div>
</template>
<script>
import { YNav } from '@/components/nav'
import { YPublishButton, PublishMixin } from '@/components/content-publish'
import YItem from '@/components/item'
import YInput from '@/components/input'
import YEditor from '@/components/content-editor'
import Dialog from '@/components/dialog'
import Toast from '@/components/toast'
export default {
	components: {
		YNav,
		YPublishButton,
		YItem,
		YInput,
		YEditor
	},
	mixins: [PublishMixin],
	data() {
		return {
			name: '',
			newData: {
				title: '',
				contentSource: '[]'
			}
		}
	},
	mounted() {
		this.$localStore.getOrSet('worksNewData', null, {
			title: '',
			classifyId: null,
			contentSource: '[]',
			moduleEnum: '101502'
		}).then(data => {
			this.newData = data;
		});
		this.$http.get('/services/app/v1/appreciation/classify/list').then(response => {
			var data = response.data.data;
			if (this.newData.classifyId) {
				for (let item of data) {
					if (item.id === this.newData.classifyId) {
						this.name = item.name;
					}
				}
			}
		})
	},
	methods: {
		goBack() {
			var summaryData = this.$refs.nativeEditor.getSummaryData();
			if (summaryData.content.length > 0 || this.title) {
				Dialog.confirm({
					message: '退出此次编辑？',
				}, {
						okText: '退出',
						cancleText: '取消'
					}).then(() => {
						this.$localStore.remove('worksNewData');
						this.$router.back();
					}).catch(() => {
						return false;
					})
				return false;
			}
		},
		validate() {
			var summaryData = this.$refs.nativeEditor.getSummaryData();
			if (!this.newData.title) {
				Toast("请输入标题");
				return false;
			}
			if (this.newData.title.length < 4) {
				Toast("标题太短，不少于4字");
				return false;
			}
			if (!summaryData.content) {
				Toast("内容不能为空");
				return false;
			}
			if (summaryData.content.length < 4) {
				Toast("介绍太少啦，不少于4字");
				return false;
			}
			if (!summaryData.imgUrl) {
				Toast("请添加图片");
				return false;
			}
			Object.assign(this.newData, summaryData);
		},
		publish() {
			this.$http.post('/services/app/v1/appreciation/single', this.newData).then(response => {
				let data = response.data;
				if (data.code === "200") {
					this.$localStore.remove('worksNewData');
					Toast('发布成功！');
					this.publishSuccess('/works/index')
				} else {
					this.publishError(data.msg);
				}
			})
		}
	}
}
</script>
<style>
.works_new {
	& .works_new-item {
		margin-top: 0.3rem;
		& .item-wrap {
			border: 0;
		}
	}
	& .works_new-title {
		margin-top: 0.2rem;
	}
	& .works_new-content {
		margin-top: 0.2rem;
	}
}
</style>