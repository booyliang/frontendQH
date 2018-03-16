<template>
	<div>
		<y-nav title="专业领域"></y-nav>
		<y-check-group v-if="foodList.length" :data="foodList" textField='goodField' name="vote" type="radio" ref="foodList" v-model='foodId' @clickItem="handlefoodClick" :iconAfterText="true"></y-check-group>
	</div>
</template>

<script>
	import {YNav} from '@/components/nav';
	import YCheckItem from '@/components/check-group/check-item';
	import YCheckGroup from '@/components/check-group/check-group';
	import Toast from '@/components/toast';
	export default {
		components: {
			YNav,
			YCheckItem,
			YCheckGroup
		},
		data() {
			return {
				vm: {},
				type: '1',
				foodId: null,
				foodList: [],
				listText: '',
				FieldData: ''
			}
		},
		mounted() {
			this.vm = this.$localStore.get('petDeta');
			console.log('sdfsfsfsfs', this.vm)
			this.$http.get('/services/app/v1/digital/authentication/goodField').then(res => {
				this.FieldData = res.data.data
				if (res.data.code === "200") {
//					this.foodList[0].text = this.FieldData.entities[0].goodField
					let foodList = this.FieldData
//					console.log('foodList', foodList)
					if (this.vm.data.goodField) {
						this.listText = this.vm.data.goodField;
						for (let item of foodList) {
//							item.checked = false;
							if (this.listText === item.goodField) {
								item.checked = true;
							}	
						}
					}						
					this.foodList = foodList
				}				
			});
			
		},
		methods: {
			handlefoodClick(item) {
				// console.log(this.$refs.foodList.getSelectedTexts().join(','));
				this.vm.data.goodField = item.goodField;
				console.log('this.vm.data.goodField', item)
			},
		}
	}
</script>

<style>

</style>