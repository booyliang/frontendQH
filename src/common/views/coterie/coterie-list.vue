<template>
	<div class="coterie-member-list">
		<!-- 导航 S-->
		<y-nav title="私圈"></y-nav>
		<!-- <y-flow-list :request="request" :item="item"></y-flow-list> -->
		<y-load-more-remote :request="memberRequest" @loaded="handleLoaded">
			<div>
				<div class="coterie-member-item" v-for="(item, index) of coterieList" :key="index" @click="toCoterie(item.coterieId)">
					<img :src="item.icon?item.icon:icon" alt="">
					<div class="coterie-member-item--right">
						<h3 class="coterie-member-item-title">{{item.name}}
						</h3>
						<div class="coterie-member-item-msg">
							<span>{{item.intro}}</span>
						</div>

						<div class="coterie-member-item-members">
							<span>{{item.memberNum}}人加入</span>
							<span class="coterie-member-item-members--free coterie-member-item-members--box" v-if="item.joinFee===0">免费</span>
							<span class="coterie-member-item-members--notfree coterie-member-item-members--box" v-if="item.joinFee!==0">{{item.joinFee | priceUnit}}悠然币</span>
						</div>
					</div>
				</div>
			</div>
		</y-load-more-remote>
	</div>
</template>
<script>
import LoadMoreRemote from '@/components/load-more-remote';
// import icon from '@/assets/default@2x.png';
export default {
	name: 'coterie-list',
	components: {
		[LoadMoreRemote.name]: LoadMoreRemote
	},
	data() {
		return {
			icon: "../assets/default@2x.png",
			coterieList: [],
			memberRequest: {
				url: '/services/app/v1/coterie/info/list'
			},
		}
	},
	methods: {
		handleLoaded(list, res) {
			this.coterieList.push(...list);
		},
		toCoterie(id) {
			this.$router.push(`/coterie/${id}`)
		}

	}
}
</script>
<style>
@import "#/css/var.css";
/* .coterie-member-list {
	background: #fff;
	color: var(--text-primary-color);
	width: 100vw;
	height: 100vh;
} */

</style>