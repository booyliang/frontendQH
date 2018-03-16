<template>
	<div class='sm-main'>
		<y-nav :title="$R('digital-talent')" :showSearch="true"  :menuData="['index']"></y-nav>
		<y-load-more-remote :request="request" @loaded="handleLoaded">
			<y-list>
				<y-item v-for='(item, index) of dataList' :key='index' :to="'/user/' + item.createUserId">
					<y-card  img-size='large' :to="'/user/' + item.createUserId" :type='type' :badge='true' :title="item.nickName" :src='item.headImg'>
						<span slot='assist'>{{$R('skilled-field')}}：{{item.goodField}}</span>
					</y-card>
				</y-item>
			</y-list>
		</y-load-more-remote>
		<div @click='submit' class="add_idea iconfont icon-user-v"></div>
	</div>
</template>

<script>
	import { YNav } from '@/components/nav';
	import Button from '@/components/button';
	import LoadMoreRemote from '@/components/load-more-remote';
	import List from '@/components/list';
	import Item from '@/components/item';
	import YCard from '@/components/card'
	export default {
		components: {
			YNav,
			YCard,
			[Button.name]: Button,
			[LoadMoreRemote.name]: LoadMoreRemote,
			[List.name]: List,
			[Item.name]: Item
		},
		data() {
			return {
				type: 1,
				dataList: [],
				request: {
					method: 'get',
					url: '/services/app/v1/digital/authentication/list',
				}
			}
		},
		methods: {
			handleLoaded(list, res) {
				this.dataList.push(...list);
			},
			submit() {
				// 查询认证状态
				this.$http.get(`/services/app/v1/digital/authentication/authstatus/${this.$env.userId}`).then(res => {
					this.headData = res.data.data
					if (res.data.code === "200") {
						console.log(this.headData);
						if (this.headData.recordCount === 0) {
							this.$router.push({path: `/expert/edit/${this.headData.recordCount}`});
							return false;
						} else if (this.headData.recordCount === 1 && this.headData.authstatus === 0 || this.headData.authstatus === 1) {
							this.$router.push({path: '/expert/inspect/' + this.headData.authstatus})
						} else if (this.headData.authstatus === 2 || this.headData.authstatus === 3) {
							this.$router.push({path: `/expert/edit/${this.headData.authstatus}`})
						}
					}				
				});
			}
		}
	}
</script>

<style>
	.icon-user-v{
		font-size: 0.6rem;
		height: 1.1rem;
		line-height: 1.1rem;
		text-align: center;
		background: #b5d3f9;
		border-radius: 50%;
		color: white;
	}
	.sm-main {
		& .item-list {
			width: 100%;
		}
		& .icon-user-v {
			font-size: 0.6rem;
			height: 1.1rem;
			line-height: 1.1rem;
			text-align: center;
			background: #b5d3f9;
			border-radius: 50%;
			color: white;
	    }
	    & .y_card-text {
	    	flex: 1;
	    	word-wrap: break-word;
	    }
	}
	

</style>