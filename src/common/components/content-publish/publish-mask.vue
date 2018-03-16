/**
*	Author: zhulin
*
*/
<template>
    <transition name="publish">
        <div v-if="visible" class="publish">
            <y-mask ></y-mask>
            <section class="publish-content">
                <div class="publish-body">
                    <div class="publish-image" ></div>
                    <div class="publish-message" v-text="message"></div>
                </div>
            </section>
        </div>
    </transition>
</template>

<script type="text/javascript">
	import Mask from '../mask';
	export default {
		name: 'y-publishMask',
		components: {
			[Mask.name]: Mask,
		},

		data() {
			return {
				message: '正在发布',
				visible: false
			};
		},
	};
</script>

<style type="text/css">
    @import '#/css/var.css';

    :root {
        --publish-duration: 0.2s;
    }

    .publish {
        @apply --full;
        position: fixed;
        z-index: 90;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .publish-message {
        text-align: center;
        color: #fff;
    }

    .publish-image {
        width: 3rem;
        height: 3rem;
        background: url(../../assets/loading@2x.gif) no-repeat center;
        background-size: 2rem auto;
    }
</style>
