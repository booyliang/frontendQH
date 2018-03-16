<template>
	<div class="edit-office">
		<y-nav :title="$R('professional-office')">
			<span slot="nav-right">
				<y-button type="text" to="" @click.native='submit'>{{$R('lawyer-done')}}</y-button>
			</span>
		</y-nav>
		<y-input v-model="office" :placeholder="$R('office-placeholder')" :maxlength="30" :autofocus='true'></y-input>
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
				office: ''
			}
		},
		mounted() {
			this.vm = this.$localStore.get('petDeta');
			this.office = this.vm.data.office;
		},
		methods: {
			submit() {
				if (this.office.length < 4) {
					Toast(this.$R('not-less-than-words', 4));
				} else {
					this.vm.data.office = this.office;
					this.$router.back();
				}
				
			}
		}
	}
</script>

<style>

</style>