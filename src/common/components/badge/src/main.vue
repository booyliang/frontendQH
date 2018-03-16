/**
*	Author: yefan
*
*/
<template>
	<div class="y_badge">
		<slot></slot>
		<sup v-show="!hidden" class="y_badge-content" :class="{ 'is-fixed': $slots.default}">{{ content }}</sup>
	</div>
</template>
<script>
	export default {
		name: 'y-badge',
		props: {
			value: {},
			max: Number,
			hidden: Boolean
		},
		computed: {
			content() {
				const value = this.value;
				const max = this.max;
				if (typeof value === 'number' && typeof max === 'number') {
					return max < value ? `${max}+` : value;
				}
				return value;
			}
		}
	}
</script>
<style>
 .menu-box {

	& .y_badge {
		position: relative;
		display: inline-block;
		vertical-align: middle;

		& .y_badge-content {
			min-width: .26rem;
			height: .26rem;
			line-height: .26rem;
			background-color: #93c8f8;
			border-radius: 0.13rem;
			color: #fff;
			padding: 0 .4em;
			display: inline-block;
			font-size: .22rem;
			text-align: center;
			white-space: nowrap;

			&.is-fixed {
				position: absolute;
				top: .09rem;
				right: 0.18rem;
				transform: translateY(-50%) translateX(100%);
			}
	    }
	}
}
    
    .comment-list {
    	& .y_badge-content { 
    		color: #666;
			font-size: .26rem;
    			&.is-fixed {
				position: absolute;
				top: .19rem;
				right: 0.1rem;
				transform: translateY(-50%) translateX(100%);
			}

    	}
    }
	
</style>

