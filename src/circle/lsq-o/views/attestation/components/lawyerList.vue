<template>
	<y-list>
		<y-item :to="'/lawyer/detail/' + data.createUserId">
			<y-card img-size='large' :badge="true" :to="'/lawyer/detail/' + data.createUserId" :title="data.realName" :src='data.portrait'>
				<div slot='assist'>
					<p v-html="merageLabel"></p>
					<p>{{$R('professional-field')}}：<span v-html="goodField"></span></p>
				</div>
			</y-card>
		</y-item>
	</y-list>
</template>

<script>
	import List from '@/components/list';
	import Item from '@/components/item';
	import YCard from '@/components/card';
	export default {
		components: {
			YCard,
			[List.name]: List,
			[Item.name]: Item,
		},
		data() {
			return {
				merageLabel: this.data.merageLabel ? this.data.merageLabel.replace(new RegExp(/\//g), '<span class="lable-seper"> / </span>') : "",
				goodField: this.data.goodField ? this.data.goodField.replace(new RegExp(/\,/g), '<span class="lable-seper"> / </span>') : ""
			}
		},
		props: {
			data: {
				type: Object,
				required: true
			}
		}
	}
</script>

<style>

</style>