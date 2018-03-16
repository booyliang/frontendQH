<template>
	<div class="coterie-set-wrap">
		<y-nav :title="$R('permissions-setting')" :leftText="$R('cancel')" :showLeftArrow="false">
			<span slot="nav-right">
				<y-button type="text" @click.native="setOK">{{$R('confirm')}}</y-button>
			</span>
		</y-nav>
		<y-list>
			<y-item :title="$R('allow-share')">
				<y-switch slot="foot" v-model="allowShareFlag"></y-switch>
			</y-item>
			<y-item :title="$R('allow-generalize')">
				<y-switch slot="foot" v-model="allowGeneralizeFlag"></y-switch>
			</y-item>
		</y-list>

	</div>
</template>
<script>
import List from '@/components/list';
import Item from '@/components/item';
import Switch from '@/components/switch';
export default {
	components: {
		[List.name]: List,
		[Item.name]: Item,
		[Switch.name]: Switch,
	},
	data() {
		return {
			vm: null,
			allowShareFlag: true,
			allowGeneralizeFlag: true,
		}
	},
	mounted() {
		this.vm = this.$localStore.get('vm');
		if (this.vm) {
			this.allowShareFlag = Boolean(this.vm.allowShareFlag);
			this.allowGeneralizeFlag = Boolean(this.vm.allowGeneralizeFlag);
		}
	},
	methods: {
		setOK() {
			this.vm.allowShareFlag = Number(this.allowShareFlag);
			this.vm.allowGeneralizeFlag = Number(this.allowGeneralizeFlag);
			this.$localStore.set('vm', this.vm);
			this.$router.back();
		}
	}
}
</script>
<style>

</style>


