<template>
	<div class="lsq_view_wrapp">
		<y-nav :title="$R('teacher-said')" :showSearch="true" :menuData="menuData"></y-nav>
		<!--<y-load-more-remote :request="flowRequest" @loaded="handleLoaded">-->
			<router-link :to="`/viewpoints/main/${item.id}`" v-for="(item, index) of vpointData" :key="item.id">
			<y-card img-size="large" :to="`/viewpoints/main/${item.id}`" :badge="true" :src="item.imgUrl" :title="item.name" :assist="item.description"></y-card>
			</router-link>		
		<!--</y-load-more-remote>-->
	</div>
</template>
	
<script>
import { YNav } from '@/components/nav';
import YCard from '@/components/card';
import LoadMoreRemote from '@/components/load-more-remote';
export default {
	components: {
		YNav,
		YCard,
		[LoadMoreRemote.name]: LoadMoreRemote
	},
	data() {
		return {
			menuData: ['index'],
			vpointData: [],
			flowRequest: {
				method: 'GET',
				url: '/services/app/v1/famous/info/list'
			}
		}
	},
	mounted() {
		this.$http.get(`/services/app/v1/famous/info/list`).then(response => {
			if (response.data.code === "200") {
				this.vpointData = response.data.data
			} else {
				console.log(response.data.msg);
			}
		});
	}
//	methods: {
//		handleLoaded(list, res) {
//			this.vpointData.push(...list)
//		}
//	}
}
</script>

<style>
 @import '#/css/var.css';
.lsq_view_wrapp {
	min-height: 100vh;
	background-color: #fff;
	& .y_card-text{
		flex: 1;
	}
  & .y_card {
  	 align-items: flex-start;
  	 padding: .3rem .16rem;
  	 background-color: #fff;
  	 @apply --border-bottom;
  	 margin: 0 .14rem;

  	 & .y_card-title {
        font-size: 17px;
        color: var(--active-color);
        margin-bottom: .15rem;
  	 }

  	 & .y_card-assist {
        font-size: var(--default-font-size);
        word-wrap: break-word;
  	 }
  }
}

</style>