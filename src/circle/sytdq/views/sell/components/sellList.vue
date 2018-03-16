<template>
	<div class="item-sell-list" @click="toDetail">
		<div class="flow_item-body">
			<div class="flow_item-cover">
				<img v-if="data.coverPlanUrl" :src="data.coverPlanUrl | imageResize(1)" alt="" class="flow_item-thumb">
				<div>
					<div v-if="data.name" class="flow_item-title" v-text="data.name"></div>
					<div v-if="data.province && data.city" class="flow_item-content merchant-area" v-text="data.province+' '+data.city"></div>
					<div v-if="data.className" class="flow_item-content merchant-name" v-text="data.className"></div>
				</div>
			</div>
		</div>
		<div class="flow_item-bus" v-if="activitys.length > 0">
			<y-panel :title="getBusLen" colorful>
				<y-item v-for="(item,index) of activitys" :title="item.name" :key="index" @click.native.stop="toLink(item.url)" :clickable="true"></y-item>
			</y-panel>
		</div>
	</div>
</template>

<script type="text/javascript">
import Item from '@/components/item';
import Panel from '@/components/panel';
import List from '@/components/list';

export default {
	name: 'y-flow-item-sell-list',

	components: {
		[Item.name]: Item,
		[Panel.name]: Panel,
	},

	props: {
		data: {
			type: Object,
			required: true
		}
	},

	computed: {
		getBusLen() {
			return `${this.$R('merchant-activity')} (${this.data.activitys.length})`;
		},
		activitys() {
			return this.data.activitys.slice(0, 2);
		}
	},

	methods: {
		toDetail() {
			this.$router.push(`/sell/detail/${this.data.id}`);
		},
		toLink(url) {
			this.$yryz.openUrl({ url })
		}
	}
};
</script>

<style type="text/css">
@import "#/css/var.css";
.item-sell-list {
	margin-bottom: 0.2rem;
	& .flow_item-body {
		padding: 0.4rem 0.3rem 0.3rem;
		background: #fff;
	}
	& .flow_item-cover {
		display: flex;
	}
	& .flow_item-title {
		margin-bottom: 0;
		line-height: 22px;

		&~.merchant-area {
			color: #666;
			margin-top: 5px;
			font-size: 13px;
			line-height: 1;
		}

		&~.merchant-name {
			line-height: 1;
			margin-top: 10px;
		}
	}

	& .panel-head {
		margin-top: -14px;
	}
	& .item-head {
		font-size: var(--default-font-size);
	}
}


.flow_item-bus {
	/*margin-top: 0.3rem;*/
	& .panel {
		& .panel-head {
			/*margin-top: 0;*/
		}
		& .panel-body {
			padding: 0;
			& .item {
				& .item-wrap {
					& .item-head {
						width: 88%;
						color: var(--theme-color);
						@apply --text-cut;
					}
				}
			}
		}
	}
}
</style>