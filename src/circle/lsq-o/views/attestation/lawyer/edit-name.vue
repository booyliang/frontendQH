<template>
	<div class="edit-name">
		<y-nav :title="$R('attest-name')">
			<span slot="nav-right">
				<y-button type="text" to="" @click.native='submit'>{{$R('lawyer-done')}}</y-button>
			</span>
		</y-nav>
		<y-input v-model="realName" :placeholder="$R('name-placeholder')" :maxlength="10" :autofocus='true'></y-input>
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
				realName: ''
			}
		},
		mounted() {
			this.vm = this.$localStore.get('petDeta');
			this.realName = this.vm.data.realName;
		},
		methods: {
			submit() {
				if (this.realName.length < 2) {
					Toast(this.$R('not-less-than-words', 2));
				} else {
					this.vm.data.realName = this.realName;
					this.$router.back();
				}
				
			}
		}
	}
</script>

