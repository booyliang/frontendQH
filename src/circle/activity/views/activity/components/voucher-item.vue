<template>
	<div class="voucher-wrap">
		<div class="volume">
			<div class="ticket-other" :class="{'ticket-over': data.issueNum === 0}">
				<span class="ticket-type" v-text="data.prizesName"></span>
				<div>
					<span v-text="data.prizesNum" class="ticket-num"></span>
					<span v-text="data.prizesUnit" class="ticket-unit"></span>
				</div>
			</div>
			<div class="ticket-text">
				<div class="prizes-name" v-text="showTxt"></div>
				<div class="prizes-time">
					<span v-text="prizesTime"></span>
					<span v-if="data.issueNum === 0" class="prizes-over">已领完</span>
				</div>
				<div class="show-more" @click="showRemark">
					<span class="show-more-remark">{{ data.remark }}</span>
					<span class="iconfont" :class="isShowInfo ? 'icon-arrow-up' : 'icon-arrow-down'"></span>
				</div>
			</div>
		</div>
		<div v-if="isShowInfo" v-text="data.remark" class="shor-remark"></div>
	</div>
</template>

<script>
export default {
	name: 'voucher-item',
	props: {
		data: {
			type: Object,
			require: true
		},
		showTxt: {
			type: String,
			default: '下载用券 中奖无忧'
		}
	},
	computed: {
		prizesTime() {
			return this.data.beginTime.split(' ')[0].replace(/-/g, '.') + '-' + this.data.endTime.split(' ')[0].replace(/-/g, '.');
		}
	},
	data() {
		return {
			isShowInfo: false,
		}
	},
	methods: {
		showRemark() {
			this.isShowInfo = !this.isShowInfo;
		}
	}
}
</script>

<style>
	.voucher-wrap {
		& .show-more-remark {
			width: calc(100% - .4rem);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
