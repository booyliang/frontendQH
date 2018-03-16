<template>
	<div class="sale">
		<y-nav :title="$R('module-sale')" :show-search="true" :menuData="['index']"></y-nav>
		<y-sale-list></y-sale-list>
	</div>
</template>

<script type="text/javascript">
import YSaleList from '../../components/sale-list';
export default {
	components: {
		[YSaleList.name]: YSaleList,
	},

}
</script>

<style type="text/css">
@import "#/css/var.css";
</style>