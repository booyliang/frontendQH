<template>
	<div class="item-sell-list" v-if="!isOut">
		<div class="flow_item-body" @click="toDetail">
			<div class="flow_item-cover">
				<img v-if="data.coverPlanUrl" :src="data.coverPlanUrl | imageResize(1)" alt="" class="flow_item-thumb">
				<div v-if="data.name" class="flow_item-title" v-text="data.name"></div>
				<div v-if="data.province && data.city" class="flow_item-content merchant-area" v-text="data.province+' '+data.city"></div>
				<div v-if="data.className" class="flow_item-content merchant-name" v-text="data.className"></div>
			</div>
		</div>
		<div class="flow_item-button">
			<div>
				<span @click="edit" class="edit" v-text="$R('edit')"></span>
				<span @click="soldOut" v-text="$R('sold-out')" class="sold-out"></span>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
import Item from '@/components/item';
import List from '@/components/list';

export default {
	name: 'y-flow-item-mysell-list',

	components: {
		[Item.name]: Item,
	},

	props: {
		data: {
			type: Object,
			required: true
		}
	},

	data() {
		return {
			isOut: false,
		}
	},

	computed: {
	},

	methods: {
		toDetail() {
			this.$router.push({ path: `/sell/detail/${this.data.id}` })
		},
		edit() {
			this.$localStore.set('sellId', this.data.id);
			this.$router.push(`/sell/new/1`);
		},
		soldOut(id) {
			this.$http.put(`/services/app/v1/business/shelve`, { id: this.data.id })
				.then(res => {
					if (res.data.code === '200') {
						this.isOut = true;
					}
				})
		}
	}
};
</script>

<style type="text/css">
@import "#/css/var.css";
.item-sell-list {
	& .flow_item-body {
		& .flow_item-cover {
			display: inherit;
		}
	}
}

.flow_item-button {
	@apply --border-top;
	background: #fff;

	& div {
		display: flex;
		flex-wrap: wrap;
		text-align: center;
		width: 100%;
		padding: 0.2rem 0;
		color: #999;
	}
	& p {
		margin: auto;
	}
	& span {
		width: 50%;
		color: #DC8130;
	}

	& .edit {
		border-right: .01rem solid #efefef;
	}
}
</style>