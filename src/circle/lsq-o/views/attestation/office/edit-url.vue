<template>
	<div class="edit-url">
		<y-nav :title="$R('website')">
			<span slot="nav-right">
				<y-button type="text" to="" @click.native='submit'>{{$R('lawyer-done')}}</y-button>
			</span>
		</y-nav>
		<y-input v-model="nickName" :placeholder="$R('website-placeholder')" :maxlength="30" :autofocus='true'></y-input>
	</div>
</template>

<script>
	import {YNav} from '@/components/nav';
	import YInput from '@/components/input';
	import Toast from '@/components/toast';
	export default {
		components: {
			YNav,
			YInput
		},
		data() {
			return {
				vm: {
					data: {}
				},
				nickName: ''
			}
		},
		mounted() {
			this.vm = this.$localStore.get('petDeta');
			this.nickName = this.vm.data.lawFirmUrl;
		},
		methods: {
			submit() {
				let HUrl = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/
				if (this.nickName.length < 4) {
					Toast(this.$R('not-less-than-words', 4));
				} else if (!HUrl.test(this.nickName)) {
					Toast('请输入正确的网址');
				} else {
					this.vm.data.lawFirmUrl = this.nickName;
					this.$router.back();
				}
				
			}
		}
	}
</script>

<style>
 
</style>