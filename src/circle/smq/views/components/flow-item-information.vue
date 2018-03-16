<template>
	<y-item>
		<router-link :to="`/unused/detail/${data.id}`">
			<div class="flow_item-unuse">
				<div class="flow_item-img">
					<img :src="data.imgUrl">
				</div>
				<div class="flow_item-unuse--right">
					<div class="flow_item-title">{{data.title}}</div>
					<div class="flow_item-class">
						<span v-if="this.$route.path==='/expert/information'" class="flow_item-location">{{data.classifyItemName}}</span>
					</div>
				</div>
			</div>
		</router-link>
	</y-item>
</template>

<script>
import YItem from '@/components/item'
export default {
	name: 'flow-item-information',
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