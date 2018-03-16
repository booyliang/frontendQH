<template>
	<div class="form_error">
		<slot>
			<ol class="form_error-list" v-if="errorList.length">
				<template v-if="showAll">
					<li v-for="res of errorList" :key="res.index">{{res}}</li>
				</template>
				<template v-else>
					<li>{{errorList[0]}}</li>
				</template>
			</ol>
		</slot>
	</div>
</template>
<script>
export default {
	name: 'y-form-error',
	components: {},
	props: {
		// errorList: Array,
		showAll: {type: Boolean, default: true}
	},
	data() {
		return {
			errorList: [],
		}
	},
}
</script>
<style>
.form_error {
	& .form_error-list{
		color: red;
		padding: 0 0.3rem;
		& li{
			list-style: decimal;
		}
	}
}

</style>
