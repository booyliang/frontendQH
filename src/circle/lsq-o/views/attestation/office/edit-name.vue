<template>
	<div class="edit-name">
		<y-nav :title="$R('office-name')">
			<span slot="nav-right">
				<y-button type="text" to="" @click.native='submit'>{{$R('lawyer-done')}}</y-button>
			</span>
		</y-nav>
		<y-input v-model="nickName" :placeholder="$R('office-all-name-placeholder')" :maxlength="30" :autofocus='true'></y-input>
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
			this.nickName = this.vm.data.lawFirmTitle;
		},
		methods: {
			submit() {
				if (this.nickName.length < 2) {
					Toast(this.$R('not-less-than-words', 2));
				} else {
					this.vm.data.lawFirmTitle = this.nickName;
					this.$router.back();
				}
				
			}
		}
	}
</script>
