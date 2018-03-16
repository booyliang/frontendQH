<template>		
	<div class="user-content">
		<!--二级tab-->		
		<y-tab-bar v-if="subMenuData.length" 
		v-model="classifyId"  
		:tabOption="subMenuData" 
		@click="handleTabClick" 
		:enableRouter="false"></y-tab-bar>		
		
		<template v-if="moduleEnum  && custId">
			<y-dynamic-list  v-if="moduleEnum === '000'" @loaded="handleLoaded"   :author = "custId"></y-dynamic-list>
			<y-flow-list  v-else :request="flowRequest" :heat="heat" @loaded="handleLoaded"   :defaultModuleEnum= "moduleEnum"></y-flow-list>
		</template>
		

	</div>

</template>
<script>
	let heat = ['comment', 'like'];
	import TabBar from '@/components/tab';
	import DynamicList from '@/components/dynamic-list';
	import YFlowList from '@/components/flow-list';

	export default {
		components: {
			[TabBar.name]: TabBar,
			[DynamicList.name]: DynamicList,
			[YFlowList.name]: YFlowList,
		},
		data() {
			return {
				moduleEnum: '',
				classifyId: '',
				classifyItemId: '',
				userId: '',
				subMenuData: [],
				heat: ['comment', 'like'],
				tabOptions: {
					'0011': [{id: '0011', text: this.$R('user-question')}, {id: '0012', text: this.$R('user-answer')}],  // 一问多答: 提问,回答
					'0013': [{id: '0013', text: this.$R('user-question')}, {id: '0014', text: this.$R('user-answer')}], // 一问一答: 提问,回答
					'0041': [{id: '0041', text: this.$R('user-topic')}, {id: '0042', text: this.$R('discussion')}], // 话题:话题,讨论
				}			
			}
		},
		props: ['custId', "userData"],
		mounted() {			
			this.initData();

		},
		computed: {
			flowRequest() {
				let moduleEnum = this.moduleEnum;
				
				if (!moduleEnum ) return {};
				if (moduleEnum === '000')
					return {}
				// 如果是话题问答等功能时，取分类id为功能id
				if (this.tabOptions[moduleEnum]) {
					moduleEnum = this.classifyId || moduleEnum;
				}
			
				let module = this.$utils.getModule(moduleEnum);
				if (!module) {
					console.error('没有配置module', moduleEnum);
					return {};
				}
				let url = module.apiUrl;
				this.heat = module.heat || heat;
				if (!url)
					console.error(`功能 ${moduleEnum} 没有配置apiUrl`, module)
				if ( this.userData.userId !== this.$env.userId ) { // 不是自己
					return {
						url,
						params: {
							classifyId: this.classifyId,
							classifyItemId: this.classifyItemId,
							createUserId: this.userId,
							shelveFlag: '-1',
							privacy: 0, // 不是自己的个人主页  不显示匿名发布的信息
						}
					}
				}
		
				return { url, moduleEnum,

					params: {
						classifyId: this.classifyId,
						classifyItemId: this.classifyItemId,
						createUserId: this.userId,
						shelveFlag: '-1'
					}
					
				}
			}
			
		},	
		watch: {
			'$route'(to, from) {
				this.initData();
			}   
		},
		methods: {
			handleLoaded(data) {	
						
				for (let item of data) {
					item.disabledCard = true;
					if (item.functionType === 1) {
						item.anonymity = true;
					}
				}
				console.log('handleLoaded', data)	
			},
			initData() {
				this.moduleEnum = this.$route.params.moduleEnum || '000';
				this.classifyId = this.$route.params.classifyId;				
				this.classifyItemId = this.$route.params.classifyItemId;
				this.userId = this.$route.params.id
				this.subMenuData = [];
				this.subMenuData = this.tabOptions[this.moduleEnum] || [];				
				if (this.subMenuData.length) {
					// console.log('final this.classifyId', this.classifyId || this.subMenuData[0].id)
					this.classifyId = this.classifyId || this.subMenuData[0].id;
				}
			},
			handleTabClick(tabId) {
				// console.log(tabId)
				let routeName = 'user-module-classify';
				this.$router.replace({name: routeName, params: {moduleEnum: this.moduleEnum, classifyId: tabId}})
			}
		}

	}
</script>
