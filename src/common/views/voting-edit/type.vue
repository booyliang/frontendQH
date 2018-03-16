<template>
	<div class="voting_type">
		<!--<div v-model="voteType.label" :value="voteValue">{{voteType.value}}</div>-->
		<y-check-group :data="typeList" type="radio"></y-check-group>
	</div>
</template>
<script>
import YCheckGroup from '@/components/check-group'
export default {
	components: {
		YCheckGroup
	},
	data() {
		return {
			voteVm: {},
			voteType: {},
			typeList: [{ id: "1", text: "单选" }, { id: "2", text: "多选" }]
		}
	},
	mounted() {
		this.voteVm = this.$localStore.get('vote-content');
		// this.voteType = this.voteVm.voteType;
	}
}
</script>
<style>
.voting_type {
	background: #fff;
	& .check_group {
		margin: 0.5rem
	}
}
</style>
