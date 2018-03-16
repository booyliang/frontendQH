<template>
	<div class="lawyer-preview_wrapp">
		<y-nav :title="$R('lawyer-preview')" :transparent="true" class="banner-lawyer--height"></y-nav>
		<y-card v-if='headImg' :title="vm.data.realName" :src='headImg' img-size="large" position="vertical" class="lawyer_top-card">
			<p slot='assist' v-html='assist'></p>
		</y-card>
		<y-panel :title="$R('individual-resume')" icon="intr" v-if='vm.data.personalProfile'>
			<p v-text="vm.data.personalProfile"></p>
		</y-panel>
		<y-panel :title="$R('professional-field')" icon="tasks-check" v-if='vm.data.goodField'>
			<y-tag v-for="(tag, index) in tags" :key="index" :data="tag">{{tag}}</y-tag>
		</y-panel>
		<y-panel :title="$R('professional-office')" icon="build" v-if='vm.data.goodField'>
			<p v-text="vm.data.office"></p>
		</y-panel>
		<y-panel :title="$R('case-show')" icon="case" v-if='vm.data.caseShow'>
			<p v-text="vm.data.caseShow"></p>
		</y-panel>
	</div>
</template>

<script>
	import {YNav} from '@/components/nav';
	import YCard from '@/components/card';
	import YPanel from '@/components/panel';
	import YTag from '@/components/tag';
	export default {
		components: {
			YNav,
			YCard,
			YPanel,
			YTag
		},
		data() {
			return {
				vm: {
					data: {}
				},
				headImg: '',
				assist: '',
				tags: []
			}
		},
		mounted() {
			this.vm = this.$localStore.get('petDeta');
			console.log(this.vm.data.location)
			this.headImg = this.vm.data.portrait
			if (this.vm.data.location && this.vm.data.ageLimit) {
				this.assist = this.vm.data.location + '/' + this.vm.data.ageLimit;
			} else if (this.vm.data.location && !this.vm.data.ageLimit) {
				this.assist = this.vm.data.location
			} else if (!this.vm.data.location && this.vm.data.ageLimit) {
				this.assist = this.vm.data.ageLimit
			}
			if (this.vm.data.goodField) {
				let idArray = this.vm.data.goodField.split(',');
				this.tags = idArray;
			}
		}
	}
</script>

<style>
 @import '#/css/var.css';
 .lawyer-preview_wrapp {
 		& .lawyer_top-card {
			position: relative;
			height: 2.47rem;
			margin-top: -2.47rem;

			& .y_card-title {
			   font-size: 16px;
			   color: #fff;	
			   margin-bottom: .1rem;
			}

			& p {
				font-size: 13px;
				color: #fff;	
			}
	 }
     & .panel-body {
     	& .tag:not(:last-child) {
           margin-right: .3rem;
           margin-bottom: .3rem;
     	}
     }
 }

</style>