<template>
	<div class="smq-inspect">
		<y-nav :title="$R('sm-expert-title')"></y-nav>
		<y-card :title="headData.nickName" :type='type' :badge='true' :src='headData.headImg' img-size="large" position="vertical">
			<div slot='assist' class="smq-assist">
				{{$R('skilled-field')}}：
				<span v-text="headData.goodField"></span>
			</div>
		</y-card>
		<div class="smq-conent" v-if='this.$route.params.id == 0'>
			<span class="iconfont icon-check-circle"></span>
			{{$R('sm-audit')}}
		</div>
		<div v-else class="smq-conent">
			<span class="iconfont icon-badge-question"></span>
			{{$R('sm-audit-win')}}
		</div>
	</div>
</template>

<script>
	import { YNav } from '@/components/nav';
	import YCard from '@/components/card';
	export default {
		components: {
			YNav,
			YCard
		},
		data() {
			return {
				type: 1,
				headData: '',
			}
		},
		mounted() {
			this.$http.get('/services/app/v1/digital/authentication/personalInfo/' + this.$env.userId).then(res => {
				this.headData = res.data.data
				if (res.data.code === "200") {
					console.log('接口掉的数据', this.headData)					
				}				
			});
		}
	}
</script>

<style>
.smq-inspect{
	height: 100vh;
	background: #fff;

	& .y_card{
		margin: 0.5rem 0 1.1rem 0;
	}
	& .y_card-title {
		font-size: 17px;
	}

	& .smq-assist{
		margin-top: 0.2rem;
	}
	& .smq-conent{
		text-align: center;
		font-size: 17px;
	}

	& .icon-badge-question {
		font-size: 20px;
		color: #84b6ff;
	}

	& .icon-check-circle{
		font-size: 16px;
		color: #f99534;
	}
}
	
</style>