<template>
	<y-list class='office_list'>
		<y-item :to="'/office/detail/' + data.createUserId">
			<!--<y-card class='item-card' img-size='large' :to="'/office/detail/' + data.createUserId" :title="data.lawFirmTitle" :src='data.lawFirmLogo'>
				<div slot='assist'>
					<p v-text="data.lawFirmTel"></p>
					<span v-text="data.lawFirmAddress"></span>
				</div>
			</y-card>-->

			<div class="flow_item-body">
				<div class="flow_item-cover y_card-text">
					<img class="flow_item-thumb" :src="data.lawFirmLogo | imageResize(1)" />
					<div class='flow_item-right'>
						<div class="flow_item-title" v-text="data.lawFirmTitle"></div>
						<div class="flow_item-tel" v-text="data.lawFirmTel"></div>
						<div class="flow_item-address" v-text="data.lawFirmAddress"></div>
					</div>
				</div>
			</div>
		</y-item>
	</y-list>
</template>

<script>
	import List from '@/components/list';
	import Item from '@/components/item';
	import YCard from '@/components/card';
	export default {
		components: {
			YCard,
			[List.name]: List,
			[Item.name]: Item,
		},
		data() {
			return {}
		},
		props: {
			data: {
				type: Object,
				required: true
			}
		}
	}
</script>

<style type="text/css">
	@import "#/css/var.css";
	.office_list {
		& .item-wrap {
			display: block;
			padding-top: 0.4rem;
			padding-bottom: 0.4rem;
		}
		& .flow_item-head,
		& .flow_item-foot {
			@apply --display-flex;
			justify-content: space-between;
		}
		& .flow_item-head {
			margin-bottom: 0.3rem;
		}
		& .flow_item-cover {
			@apply --clearfix;
			display: flex;
			align-items: flex-start;
		}
		& .flow_item-title,
		& .flow_item-tel {
			@apply --text-cut-multi-line;	
		}	
		& .flow_item-tel {
			line-height: 1.34;
			font-size: 13px;
			color: var(--theme-color);
			-webkit-line-clamp: 2;
			margin: .05rem 0;
		}
		& .flow_item-address {
           font-size: var(--default-font-size);
		}
        & .flow_item-right {
           flex: 1;
           word-wrap: break-word;
        }
		
	}
</style>