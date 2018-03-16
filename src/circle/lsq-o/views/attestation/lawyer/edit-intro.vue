<template>
	<div class="edit-intro">
		<y-nav :title="$R('individual-resume')">
			<span slot="nav-right">
				<y-button type="text" to="" @click.native='submit'>{{$R('lawyer-done')}}</y-button>
			</span>
		</y-nav>
		<y-input v-model="Intro" :placeholder="$R('individual-placeholder')" :maxlength="200" :autofocus='true' type="textarea"></y-input>
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
				Intro: ''
			}
		},
		mounted() {
			this.vm = this.$localStore.get('petDeta');
			if (this.vm.data.personalProfile) {
				this.Intro = this.vm.data.personalProfile;
			}			
		},
		methods: {
			submit() {
				if (this.Intro.length < 10) {
					Toast(this.$R('not-less-than-words', 10));
				} else {
					this.vm.data.personalProfile = this.Intro;
					this.$router.back();
				}
				
			}
		}
	}
</script>

<style>

</style>