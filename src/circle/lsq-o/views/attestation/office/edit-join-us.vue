<template>
	<div class="edit-join-us">
		<y-nav :title="$R('recruitment-information')">
			<span slot="nav-right">
				<y-button type="text" to="" @click.native='submit'>{{$R('lawyer-done')}}</y-button>
			</span>
		</y-nav>
		<y-input v-model="Case" :placeholder="$R('remind-recruitment-information')" :maxlength="1000" :autofocus='true' type="textarea"></y-input>
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
				Case: ''
			}
		},
		mounted() {
			this.vm = this.$localStore.get('petDeta');
			this.Case = this.vm.data.recruitmentInformation;
		},
		methods: {
			submit() {
				this.vm.data.recruitmentInformation = this.Case;
				this.$router.back();
			}
		}
	}
</script>

<style>

</style>