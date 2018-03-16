<template>
	<div>
		<y-nav title="填写认证信息" :beforeBack="leftBack"></y-nav>
		<div class="jkys-attestation-require">
			<h2>身份证照片要求：</h2>
			<p>1、确保身份证上的所有信息清晰可见、完整无遮挡</p>
			<p>2、照片内容要求真实有效，不做任何修改</p>
			<p>3、仅支持.jpg、.jpeg、.png、.gif图片格式，图片大小不超过300K</p>
		</div>
		<div class="jkys-attestation-upimg">
			<div v-if='!src' class="uping-pic"></div>
			<img v-else :src="src" alt="身份证" />
		</div>
		<y-button block @click.native="selectImg" class="jkys-attestation-button">上传图片</y-button>
	</div>
</template>

<script>
	import {YNav} from '@/components/nav';
	import List from '@/components/list';
	import Item from '@/components/item';
	import Button from '@/components/button';
	
	export default {
		components: {
			YNav,
			[List.name]: List,
			[Item.name]: Item,	
			[Button.name]: Button
		},
		data() {
			return {
				vm: {
					data: {}
				},
				src: ''
			}
		},
		mounted() {
			this.vm = this.$localStore.get('petDeta');
			this.src = this.vm.data.idImg;
//			this.src = 'http://img5.imgtn.bdimg.com/it/u=1357154930,886228461&fm=26&gp=0.jpg'
		},
		methods: {
			selectImg() {
				this.$yryz.uploadPics({
					picNum: 1
				}).then((data) => {
					this.src = data.picUrls[0];
				})
				this.vm.data.idImg = this.src;
			},
			leftBack() {
				this.vm.data.idImg = this.src;
				console.log('this.permitData.imgsrc1', this.vm.data.idImg );
				this.$router.replace(`/shoot/perfect/${this.$route.params.id}`)
				return false;
			}	
		}		
	}
</script>

<style>

</style>