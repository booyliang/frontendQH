<template>
	<div class="schoolList">
		<y-list>
			<y-item :to="'/excellent/school/' + data.id">
				<y-card img-size='large' :to="'/excellent/school/' + data.id" :title="data.name" :subject="data.subject" :src='data.imgFirstUrl'>
					<div slot='assist' class="list_assist">
						<p class="address" v-text="getAddress"></p>
						<p class="impress" v-if="!!data.postCount"><span class="count" v-text="data.postCount"></span>个印象</p>
						<p class="subject" v-if="!!data.subjects"><span v-for="(item, index) in transformSub" :key="index" v-text="item"></span></p>
					</div>
				</y-card>
			</y-item>
		</y-list>
	</div>
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
				
			}
		},
		props: {
			data: {
				type: Object,
				required: true
			}
		},
		computed: {
			transformSub() {
				return this.data.subjects.split(',')
			},
			getAddress() {
				return this.data.provinceName + this.data.cityName + this.data.addr
			}
		}
	}
</script>

<style>
	@import '#/css/var.css';
	.schoolList {
		@apply --border-bottom;
		& .y_card {
		   & .y_card-text {
		   	    flex: 1;
		   	   & div.list_assist {
                    & .address {
                    	color: var(--text-assist-color);
					    font-size: 14px;	
					    margin: .1rem 0;
					    @apply --text-cut-multi-line;
			            -webkit-line-clamp: 1;
                	  }
                  	& .impress {
                  		font-size: 14px;
                  		margin-bottom: .1rem;
	                  	& .count {
	                  		color: #ff9e13;
	                  	}
                  	}
                    & .subject {
                    	& span{
                    		font-size: 12px;
	              			color: var(--theme-color);
		              	 	border: 1px solid var(--theme-color);
		              	 	padding: .05rem .17rem;
		              	 	border-radius: .2rem;
		              	 	margin-right: .1rem;
                    	}
	              	}
                }
		   	}
	           & .y_card-title {
	              font-size: 17px;  
	              color: var(--theme-color);
	              line-height: 1.2;
	              @apply --text-cut-multi-line;
			      -webkit-line-clamp: 1;
	            }
	    } 
	}
</style>