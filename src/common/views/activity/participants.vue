<template>
	<div class="participants-wrap">
		<!--头部导航 S-->
		<y-nav :title="$R('participants')"> </y-nav>
		<!--头部导航 E-->
		<y-load-more-remote :request="request" @loaded="handleLoaded" :endTip="false">
			<ul class="card-list">
				<li v-for="(item,index) of data" :key="index">
					<y-card :title="item.nickName" :src="item.headImg" img-size="large" position="vertical" :to="`/user/${item.userId}`" :key="index"></y-card>
				</li>
			</ul>
		</y-load-more-remote>
	</div>
</template>

<script>
import LoadMoreRemote from '@/components/load-more-remote';
import Nav from '@/components/nav/nav';
import NavToggle from '@/components/nav/nav-toggle';
import Button from '@/components/button';
import YCard from '@/components/card';

export default {
	components: {
		[LoadMoreRemote.name]: LoadMoreRemote,
		[Nav.name]: Nav,
		[NavToggle.name]: NavToggle,
		[Button.name]: Button,
		YCard
	},

	data() {
		return {
			data: [],
			request: {
				methods: 'get',
				url: `/services/app/v1/activityticket/list/${this.$route.params.id}`,
				params: {
					pageNo: '1',
					pageSize: '30'
				}
			}
		}
	},

	created() {
		// console.log(this.$route.params.id, this.$route.params.detailId);
		// 查询当前用户
		this.$http.get(`/services/app/v1/activityticket/single/${this.$route.params.id}`).then((res) => {
			if (res.data.code === '200') {
				this.data.unshift(...res.data.data);
			}
		})
	},

	methods: {
		handleLoaded(dataList, res) {
			this.data.push(...dataList);
		},

		/**
		 * 跳转个人主页
		 * @param id
		 */
		toUserPage(id) {
			this.$router.push({ path: `/user/${id}` });
		}
	}
}
</script>

<style>
@import "#/css/var.css";
.participants-wrap {
	min-height: 100vh;
	background: #fff;

	& .card-list {
		background: #fff;
		padding: .4rem .3rem;
		display: flex;
		flex-wrap: wrap;
		/* justify-content: space-between; */
		/* align-items: center; */
		& li {
			width: 20%;
		}
		& .y_card {
			margin-bottom: .4rem;
			& .y_card-img__large {
				width: 1rem;
				height: 1rem;
			}
			& .y_avatar {
				margin-bottom: 0;
			}
			& .y_card-text {
				& h4 {
					color: var(--text-primary-color);
				}
			}

			& .y_card-title {
				width: 4em;
				@apply --text-cut;
			}
		}
	}
}
</style>
