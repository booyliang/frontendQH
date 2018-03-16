<template>
    <y-message :icon="icon" :title="message" fullscreen></y-message>
</template>
<script>
import YMessage from '@/components/message'
import icon from '../../../assets/status-empty@2x.png';
export default {
	components: {
		[YMessage.name]: YMessage
	},
	data() {
		return {
			icon,
			message: '亲爱的小主，赶紧去写点什么吧~'
		}
	},
	computed: {
		
	}
}	
</script>
    