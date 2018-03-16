<template>
	<div v-if='isshow' class="yddr">
		<y-nav title="运动达人"></y-nav>
		<y-load-more-remote :request="request" @loaded="handleLoaded">
			<y-list>
				<y-item v-for='(item, index) of list' :key='index' :to="`/user/${item.userId}`">
					<y-card img-size='large' :title="item.nickName" :src='item.userImg' :to="`/user/${item.userId}`">
						<div slot='assist'>
							<p v-if="item.remark">运动身份：{{item.remark}}</p>
						</div>
					</y-card>
				</y-item>
			</y-list>
		</y-load-more-remote>
	</div>
</template>

<script>
	import { YNav } from '@/components/nav';
	import YList from '@/components/list';
	import YItem from '@/components/item';
	import YCard from '@/components/card';
	import LoadMoreRemote from '@/components/load-more-remote';
	export default {
		components: {
			YNav,
			YCard,
			YList,
			YItem,
			[LoadMoreRemote.name]: LoadMoreRemote,
		},
		data() {
			return {
				isshow: true,
				request: {
					url: '/services/app/v1/member/list',
					params: {
						pageNo: '1',
						pageSize: '10'
					}
				},
				list: []
			}
		},
		created() {
			console.log(this.list);
		},
		methods: {
			handleLoaded(list, res) {
				this.list.push(...list);
			}
		}
	}
</script>

<style>
.yddr .y_card-title {
	font-size: 17px;
}
</style>