<template>
	<div class="goods_home">
		<y-nav :title="$R('goods-home')" :menuData="['index']"></y-nav>
		<div class="goods_home-subject">
			<p class="title">{{subjectData.title}}</p>
			<img :src="subjectData.imgUrl" alt="">
			<div class="content">{{subjectData.content}}</div>
		</div>
		<div class="goods_home-post">
			<y-tab-bar v-model="tabId" :tabOption="tabOption"></y-tab-bar>
			<y-flow-list :request="flowRequest"></y-flow-list>
		</div>
		<div class="button_focus">
			<div class="reply-bottom" @click.stop="goJoin">
				<input type="text" :disabled="true" :placeholder="$R('topic-join')" />
			</div>			
		</div>
	</div>
</template>
<script>
import {YNav} from '@/components/nav'
import YTabBar from '@/components/tab'
import YFlowList from '@/components/flow-list'
export default{
	components: {
		YNav,
		YTabBar,
		YFlowList
	},
	data() {
		return {
			subjectData: {},
			tabOption: [{id: 'hot', text: this.$R('hot')}, {id: 'time', text: this.$R('time')}],
			tabId: this.$route.params.tabId || 'hot'
		};
	},
	created() {
		this.$http.get('/services/app/v1/subject/single/' + this.$route.params.id).then(response => {
			if (response.data.code === '200') {
				this.subjectData = response.data.data;
			}
		})
	},
	computed: {
		flowRequest() {
			return {
				url: '/services/app/v1/subject-post/list',
				params: {
					pageSize: 10,
					orderBy: this.tabId,
					topicId: this.$route.params.id
				}
			}
		}
	},
	methods: {
		goJoin() {
			this.$router.push('/goods/new/' + this.$route.params.id)
		}
		
	}
}
</script>
<style>
@import "#/css/var.css";
.goods_home{
	& .goods_home-subject{
		padding: 0.42rem 0.32rem 0.4rem;
		background-color: #fff;
		& .title{
			font-size: 22px;
			line-height: 28px;
			color: #000;
		}
		& img{
			margin-top: 0.32rem;
			width: 6.9rem;
			height: 3.87rem;
		}
		& .content{
			font-size: 17px;
			line-height: 28px;
			color: #000;
		}
	}
	& .goods_home-post{
		margin-top: 0.2rem;
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
		    & input {
		    	width: 100%;
			    height: 0.7rem;
			    line-height: 0.7rem;
			    border-radius: 0.1rem;
			    background: #fff;
			    color: #bfbfbf;
			    font-size: 16px;
			    padding: 0 0.2rem;
			    color: var(--text-assist-color);
		    }
		}
	} 
}
</style>