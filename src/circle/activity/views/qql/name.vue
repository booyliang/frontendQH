<template>
	<div>
		<y-nav title="姓名">
			<span slot="nav-right">
				<router-link @click.native="submit" :disabled="submitDisabled">完成</router-link>
			</span>
		</y-nav>
		<y-input v-model="realName" text="true" maxlength="10" placeholder="请填写真实姓名" count="true" match="10"></y-input>
	</div>
</template>

<script>
	export default {
		// name: 'YInvSetName',
		data() {
			return {
				realName: "",
				readonly: ''
			}
		},
		computed: {
			submitDisabled: function () {
				if (this.realName) {
					return false;
				} else {
					return true;
				}	
			} 	
		},

		mounted() {
			
		},
		methods: {
			submit: function () {
				
			}
		}
	}
</script>

