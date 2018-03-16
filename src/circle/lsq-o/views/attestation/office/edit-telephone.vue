<template>
	<div class="edit-telphone">
		<y-nav :title="$R('office-telephone')">
			<span slot="nav-right">
				<y-button type="text" to="" @click.native='submit'>{{$R('lawyer-done')}}</y-button>
			</span>
		</y-nav>
		<div class="ls-phone">
			<y-input v-model="nickName" :placeholder="$R('office-telephone-placeholder')" :maxlength="30" :autofocus='true' :showTextLengthInfo='false'></y-input>
		</div>
		
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
			this.nickName = this.vm.data.lawFirmTel;
		},
		methods: {
			submit() {
				let phone = /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/
				if (!this.nickName) {
					Toast(this.$R('remind-telephone'));
					return false;
				};
				if (!phone.test(this.nickName)) {
					Toast(this.$R('error-telephone'));
					return false;
				};
				this.vm.data.lawFirmTel = this.nickName;
				this.$router.back();
				
				
			}
		}
	}
</script>

<style>
.ls-phone {
	& .input-bottom-txt {
			display: none;
	}
}

</style>