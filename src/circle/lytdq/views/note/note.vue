<template>
	<div class="note_page">
		<y-nav :title="$R('note-detail')" :menuData="['index', 'refresh', 'copy-url', 'report']"></y-nav>
		<y-flow-detail :data="data">
			<y-tag-list v-if="scenics.length" slot="assist">
				<y-tag v-for="(scenic, index) of scenics" :key="index" :to="getScenicRoute(scenic)" v-text="scenic.name"></y-tag>
			</y-tag-list>
		</y-flow-detail>
		<y-hot :data="data">
			<!--广告-->
			<div slot="foot">
				<y-ad :type="1" keyword="圈子内容"></y-ad>
			</div>
		</y-hot>
		<y-comment :data="data"></y-comment>
	</div>
</template>

<script type="text/javascript">
	import FlowDetail from '@/components/flow-detail';
	import TagList from '@/components/tag-list';
	import Tag from '@/components/tag';
	import Hot from '@/components/hot';
	import Comment from '@/components/comment';
	import Ad from '@/components/ad'
	export default {
		components: {
			[FlowDetail.name]: FlowDetail,
			[TagList.name]: TagList,
			[Tag.name]: Tag,
			[Hot.name]: Hot,
			[Ad.name]: Ad,
			[Comment.name]: Comment,
		},

		data() {
			return {
				data: {}
			};
		},

		computed: {
			scenics() {
				return this.data.landscapeSource ? JSON.parse(this.data.landscapeSource) : [];
			}
		},

		methods: {
			async initData() {
				this.data = (await this.$http({
					url: `/services/app/v1/note/detail/${this.$route.params.noteId}`
				})).data.data;
			},

			getScenicRoute(scenic) {
				return scenic.id ? {
					name: 'scenic',
					params: {
						scenicId: scenic.id
					}
				} : {
					name: 'scenics',
					query: {
						name: scenic.name
					}
				}
			}
		},

		created() {
			this.initData();
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	/*.note_page {
		& .content_source {
			display: flex;
			flex-direction: column;

			& > * {
				margin-top: 0;
			}
			& .content_source-text {
				order: 1;
			}
		}
	}*/
</style>

<style type="text/css" scoped>
	@import "#/css/var.css";

	.flow_detail {
		& .tag_list {
			margin-top: 0.3rem;
		}
		& .tag {
			border: 1px solid;
			background: none;
		}
	}
</style>