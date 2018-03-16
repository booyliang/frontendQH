<template>
	<div class="demo-score">
		<h7>评分默认值scoreNum为1，即：1分，半颗星；</br>
		点击星星改变评分值,每次点击只能选中整个星，评分不能为0星；</br>
		样式修改：星星的大小按比例4.2:0.54 修改starScore的宽高比</h7>
		<score @updataScore ="changeScore" :scoreNum = "1"></score>
	</div>
</template>
<script>
	import SCore from '@/components/score';
	export default {
		components: {
			[SCore.name]: SCore
		},
		data() {
			return {
				
			}
		},
		methods: {
			changeScore(val) {  // 点击评分星星时
				this.selectScore = val;
				console.log("评分：", val);
			},
		}
	}
</script>
<style>
	.demo-score {
		& .starScore {
			background: #eaeaea;
			width: 6.3rem;
			height: 0.81rem;
		}
	}
</style>

