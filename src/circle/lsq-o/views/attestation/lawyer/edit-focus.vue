<template>
	<div class="edit-focus">
		<y-nav :title="$R('professional-field')">
			<span slot="nav-right">
				<y-button type="text" to="" @click.native='submit'>{{$R('lawyer-publish')}}</y-button>
			</span>
		</y-nav>
		<y-check-group v-if='langList' v-on:clickToast='clickToast' :maxSelectedCount="3" :data="langList" textField="designation" name="voteType" v-model='langId' type="checkbox" ref="langList" @click.native="handleLangClick"></y-check-group>
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
				vm: {
					data: {}
				},
				type: '1',
				langId: null,
				langList: null,
				listText: '',
				listData: null
			}
		},
		mounted() {
			this.vm = this.$localStore.get('petDeta');
			console.log('875415554545454', this.vm.data.goodField);
			this.$http.get('/services/app/v1/lawyer/authentication/classify/childFields/2').then(res => {
				let _data = res.data.data;
//				let _data = [{ label: 'JS', id: 1}, { label: 'Java', id: 2}, { label: '.net', id: 3}, { label: 'Go', id: 4}];
				if (this.vm.data.goodField)
					this.listText = this.vm.data.goodField.split(',');
				for (let item of _data) {
					item.checked = false;
					if (this.listText.includes(item.designation)) {
						item.checked = true;
					}					
				}
				this.langList = _data
				console.log('000000000000', this.langList)
			})			
		},
		methods: {
			clickToast() {
				Toast(this.$R('max-checked', 3))
			},
			handleLangClick() {
				console.log(this.$refs.langList.getSelectedTexts().join(','));
			},
			submit() {				
				let length = this.$refs.langList.getSelectedTexts().length
				if ( length === 0 ) {
					Toast(this.$R('content-cannot-be-empty'))
				} else {
					this.vm.data.goodField = this.$refs.langList.getSelectedTexts().join(',');
					this.$router.back();
				}
			}
		}
	}
</script>

<style>
  @import '#/css/var.css';
  .edit-focus {
  	 & .check_group {
       background: #fff;
       margin-top: .2rem;
       padding-left: .3rem;
  	 }
  	 & .check_item {
  	 	 &.check_item-content {
            font-size: 17px; 
  	     }
  	     &.checked .check_item-content {
            color: var(--theme-color);
  	     }
  	 }

  }
</style>