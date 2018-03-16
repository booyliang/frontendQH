<template>
	<y-item>
		<router-link :to="`/product/detail/${data.id}`">
			<div class="flow_item-product">
				<div class="flow_item-img">
					<img :src="data.coverPlanUrl">
					<span v-if="data.dealStatus===1">{{$R("complete-transaction")}}</span>
				</div>
				<div class="flow_item-product--right">
					<div class="flow_item-title">{{data.title}}</div>
					<div class="flow_item-class">
						<span class="flow_item-classfiy" v-if="this.$route.path==='/product'">{{data.classifyItemName}}</span>
						<span class="flow_item-location">{{data.address}}</span>
					</div>
					<div class="flow_item-price">￥
						<span>{{data.price}}</span>.00</div>
				</div>
			</div>
		</router-link>
	</y-item>
</template>

<script>
import YItem from '@/components/item'
export default {
	name: 'y-flow-item-product',
	components: {
		YItem,
	},
	props: {
		data: {
			type: Object,
		}
	}
}
</script>
<style>
@import "#/css/var.css";
</style>