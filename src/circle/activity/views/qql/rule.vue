<template>
	<div class="rule-box">
	    <y-nav :show-background="true" title="抽奖规则">
        </y-nav>
        <div class="rule-content">
            <p>“圈圈乐”是平台提供给圈乎注册用户使用积分进行抽奖的一种娱乐功能，注册用户可通过抽奖获得相应奖励，具体规则如下：</p>
            <br/>
            <p>1、每个用户每次抽奖需消耗100圈乎积分；</p>
			<br/>
            <p>2、中奖奖品包括：1悠然币、3悠然币、5悠然币、10悠然币、30悠然币、50悠然币、300悠然币、500悠然币、1000悠然币；</p>
			<br/>
            <p>3、用户可到“我的账户”—“消费账户”中查看中奖的悠然币；</p>
			<br/>
            <p>4、《圈圈乐抽奖规则》最终解释权归武汉悠然一指网络有限公司所有</p>
			<br/>
            <p>温馨提示：积分和悠然币的相关说明具体可参见《积分获取攻略》和《账户规则》</p>
        </div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
			}
		},


	}
</script>
<style>
@import "#/css/var.css";
    .rule-box{
		font-size:0.34rem;
		color:#000;
        & .rule-content{
            padding:0.4rem 0.3rem;
        }
        & p{
			line-height:0.56rem;
        }
        & h4{
            padding-top:0.4rem;
			padding-bottom:0.3rem;
			position:relative;
			text-indent:0.4rem;
        }
		& h4 span{
			position: absolute;
			display: inline-block;
			width: 0.3rem;
			height: 0.3rem;
			border-radius: 50%;
			background: #000;
			left: 0;
			top: 0.47rem;
		}
    }
</style>

