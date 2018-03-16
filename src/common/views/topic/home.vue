<template>
	<div class="topic_home">
		<y-nav :transparent=true :title="$R('topic-home')" class="topic_home-top" :menuData="['index', 'refresh']">
		</y-nav>

	    <div class="top_info--module">
	        <div class="topic_info top_info--con">
				 <div class="topic_info--img">
				      <img :src="topicData.imgUrl">
				 </div>
				 <div class="topic_info--text">
				 	   <h4>{{topicData.title}}</h4>
				 	   <p :to="`/user/${topicData.createUserId}`" class="topic_info--user"><img :src="topicData.userImg"><span>{{topicData.nickName}}</span></p>
				 </div>
			</div>	

	        <div class="topic_info top_info--intr">
			     <p class="topic_info--count"><span>{{$R('browse')}}：{{topicData.viewCount}}</span><span>{{$R('discussion')}}：{{topicData.replyCount}}</span></p>
			     <p class="topic_info--detail">{{topicData.content}}</p>
			</div>
            
            <div class="topic_info--icon topic_info--left"><b></b></div> 
            <div class="topic_info--icon topic_info--right"><b></b></div> 
		</div>

		<y-tab-bar v-model="tabId" :tabOption="tabOption"></y-tab-bar>
		<y-flow-list :request="flowRequest"></y-flow-list>
		<div class="button_focus" v-if="$env.userId">
			<div class="reply-bottom" @click.stop="goJoin">
				<span type="text" :disabled="true" >{{$R('topic-join')}}</span>
			</div>			
		</div>
	</div>
</template>
<script>
import {YNav, YNavToggle} from '@/components/nav'
import YCard from '@/components/card'
import YFlowItem from '@/components/flow-item'
import YTabBar from '@/components/tab'
import YFlowList from '@/components/flow-list'
export default{
	components: {
		YNav,
		YNavToggle,
		YCard,
		YFlowItem,
		YTabBar,
		YFlowList
	},
	data() {
		return {
			topicData: {},
			tabId: this.$route.params.tabId || 'hot',
			tabOption: [{id: 'hot', text: this.$R('hot')}, {id: 'time', text: this.$R('time')}],
			menu: ['index'],
			options: {
				trigger: null,
				fixed: true
			}   
		}
	},
	created() {
		this.$http.get('/services/app/v1/topic/single/' + this.$route.params.id).then(response => {
			if ( response.data.code === "200" ) {
				this.topicData = response.data.data;
			}				
		})
	},
	computed: {
		flowRequest() {
			let module = this.$utils.getModule('0042');
			return {
				url: module.apiUrl,
				params: {
					pageSize: 10,
					topicId: this.$route.params.id,
					orderBy: this.tabId
				}
			}
		}
	},
	methods: {
		goJoin() {
			this.$router.push('/topic/join/' + this.$route.params.id)
		}
		
	}
}
</script>
<style>
   @import "#/css/var.css";

   .topic_home {
   	   & .top_info--module {
   	   	 margin-bottom: .2rem;

   	   	 & .topic_info--icon {
			position: absolute;

		   & b {
		   	  display: block;
		   	  width: .07rem;
		   	  height: .5rem;
		   	  background-color: #fff;
		   	  border-radius: .04rem;
		   	  position: absolute;
		   	  top: .04rem;
           	  left: .035rem;
           	  z-index: 2;
           }
           &:before,&:after {
           	  content: "";
           	  display: block;
           	  width: .14rem;
           	  height: .14rem;
           	  background-color: #ccc;
           	  @apply --circle;
           	  position: relative;
           	  z-index: 1;
           	 }

            &:after {
            	position: absolute;
                top: .45rem;   
          	 } 
           
   	   	 }

   	   	 & .topic_info--left {
   	   	    left: .4rem;
            top: 3.35rem; 
   	     }
   	     & .topic_info--right {
   	     	right: .4rem;
            top: 3.35rem; 
   	     }
   	   }

       & .top_info--con { 
       	    overflow: hidden;
       	    margin-left: 0;
       	    margin-right: 0;

           & .topic_info--img {
          	   width: 1.6rem;
          	   height: 1.6rem;
          	   float: left;

          	  & img {
          	  	width: 100%;
          	  	height: 100%;
          	  }
          }  

          & .topic_info--text {
              float: right;
              width:calc(100% - 1.9rem); 
              height: 1.6rem;
              margin-left: .3rem;
              position: relative;

              & h4 {
                font-size: .36rem;
                color: var(--text-primary-color);
                line-height: 22px;
              }

              & .topic_info--user {
              	 overflow: hidden;  
              	 line-height: .48rem;
              /*	 position: absolute;
              	 bottom: 0;*/
              	 margin-top: .2rem;
              	 & img {
                    width: .48rem;
                    height: .48rem;
                    @apply --circle;
                    float: left;
              	 }
              	 & span {
                    float: left;
                    color: #4f6687;
                    font-size: .28rem;
                    margin-left: .1rem;
              	 }
              }
          	
          }
       }

       & .top_info--intr {
       	  margin-top: .2rem;
       	  & .topic_info--count {
       	  	 font-size: .26rem;
       	  	 color: var(--text-assist-color);
       	  	 margin-bottom: .2rem;

       	  	  & span:first-child {
           	     margin-right: .35rem;
              }
       	  }
       	  & .topic_info--detail {
             font-size: .32rem;
             color: var(--text-primary-color);
       	  }
       }

		& .topic_home-subtitle {
			margin-bottom: 10px;
			& .flow_item-title {
				display: none;
			}
			& .flow_item-imgs {
				display: none;
			}
		}
		
	& .button_focus {
		padding-top: 0.95rem;
		 & .reply-bottom {
				position: fixed;
			    height: 1.06rem;
			    bottom: 0;
			    left: 0;
			    right: 0;
			    background: #f4f4f4;
			    padding: 0.18rem 0.3rem;
		    & span {
		    	display: block;
		    	width: 100%;
			    height: 0.7rem;
			    line-height: 0.7rem;
			    border-radius: 0.1rem;
			    background: #fff;
			    color: #bfbfbf;
			    font-size: .32rem;
			    padding: 0 0.2rem;
			    color: var(--text-assist-color);
		    }
		}
	} 
}
</style>