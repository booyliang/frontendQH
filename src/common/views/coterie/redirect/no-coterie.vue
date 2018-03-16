<template>
    <y-message :icon="icon" :title="message" fullscreen></y-message>
</template>
<script>
import YMessage from '@/components/message'
import icon from '../../../assets/no-coterie@2x.png';
export default {
	components: {
		[YMessage.name]: YMessage
	},
	data() {
		return {
			icon,
			message: '您还没有创建私圈'
		}
	},
	computed: {
		
	}
}	
</script>
    