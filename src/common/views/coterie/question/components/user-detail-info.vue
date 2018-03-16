<template>
	<div class="question-user_info">
		<span class="iconfont icon-set-top" v-if="data.stickFlag === 1"></span>
		<em class="nickname" @click.stop="clickCreatekName(data.createUserId)">{{ userName }}</em>
		问
		<em class="nickname" @click.stop="clickTargetName(data.targetId)">{{ data.targetNickName }}</em>
	</div>
</template>
<script>
export default {
	props: {
		data: {
			type: Object,
			default: () => { }
		}
	},
	data() {
		return {
			userName: '',
			isNative: this.$yryz.isNative(),
		}
	},
	watch: {
		data() {
			this.initData();
		}
	},
	methods: {
		initData() {
			if (this.data.isAnonymity === 0) {
				this.data.nickName = '匿名用户'
			}
			this.userName = this.data.nickName;
		},
		clickCreatekName(userId) {
			if (!this.isNative) return;
			if (this.data.isAnonymity === 0) return;
			this.$yryz.toPersonalInfo({ userId: userId });
		},
		clickTargetName(userId) {
			if (!this.isNative) return;
			this.$yryz.toPersonalInfo({ userId: userId });
		},
	},
	created() {
		this.initData();
	}
}
</script>

<style>
@import '#/css/var.css';
.question-user_info {
	line-height: 22px;
	font-size: .3rem;
	& .nickname {
		color: #5db1ff;
	}
	& .icon-set-top {
		color: #fb4545;
		margin-right: 2px;
		font-size: .34rem;
	}
}
</style>
