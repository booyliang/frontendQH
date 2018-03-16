<template>
		<!--资料提交成功!-->
		<div class="jkys-submit-successfully">
			<y-nav title="悠然认证" ></y-nav>
            <div class="success-image"></div>
			<p>资料提交成功!<br>系统审核中...请勿重复提交</p>
		</div>
</template>

<script>
	import {YNav} from '@/components/nav';
	export default {
		components: {
			YNav,
		},
		data() {
			return {}
		},
		methods: {			
		}
	}
</script>

<style>
.jkys-submit-successfully {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;

    & .success-image {
        width: 3rem;
        height: 3rem;
        background: url(../../assets/state-successful@2x.png) no-repeat center;
        background-size: contain;
        margin-top: 2.3rem;
    }

    & p {
        font-size: 16px;
        color: #b4b4b4;
        text-align: center;
        margin-top: 0.5rem;
    }
}
</style>