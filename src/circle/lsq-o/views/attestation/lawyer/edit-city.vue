<template>
	<div>
		<y-nav title="所在地"></y-nav>
		<y-list>
        	<y-item v-for="(item, index) of lists[lists.length - 1]" :key="index" :title="item.text" clickable @click.native="select(item)"></y-item>
   		 </y-list>
	</div>
</template>

<script>
	import {YNav} from '@/components/nav';
	import provinces from '@/js/citydata';
	import List from '@/components/list';
	import Item from '@/components/item';
	export default {
		components: {
			YNav,
			[List.name]: List,
			[Item.name]: Item,	
		},
		data() {
			return {
				vm: {
					data: {}
				},
				lists: [provinces],
				value: ''
			}
		},
		
		watch: {
			lists(newValue) {
				this.$emit('back-change', newValue.length <= 1 ? null : this.back);
			}
		},

		methods: {
			select(item) {
				if (!this.city) {
					this.city = item.text
				}
				if (this.lists.length >= 2) {
					this.value = item.text;
					console.log(this.city, this.value)
					this.vm.data.location = this.city + ' ' + this.value
					this.vm.data.lawFirmAddress = this.city + ' ' + this.value
					this.$emit('save');
					this.$emit('back-change', null);
					this.$router.back();
				} else {
					this.lists.push(item.children);
				}
			},
			back() {
				this.lists.pop();
				return false;
			}
		},
		mounted() {
			this.vm = this.$localStore.get('petDeta');
		}
	}
</script>

<style>

</style>