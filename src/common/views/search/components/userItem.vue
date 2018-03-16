<template>
	<div class="searchMember">
		<div>
			<y-item>
				<y-card slot="head" position="horizontal" img-size="large" :src="data.custImg" :badge="data.authStatus===1" :type="2" @click-img="handleClickImg(data.custId)">
					<span slot="assist" v-html="name" @click="handleClickImg(data.custId)"></span>
					<h4 class="search-member-intro" v-html="custDesc" @click="handleClickImg(data.custId)"></h4>
				</y-card>
				<!-- <y-button slot="foot" @click.native="addFriend(data)" v-if="data.friendFlag !== 1">加好友</y-button>
											<y-button type="text" class="" slot="foot" v-else-if="data.friendFlag === 1">已是好友</y-button> -->
			</y-item>
		</div>
	</div>
</template>
<script>
import List from '@/components/list';
import Item from '@/components/item';
import Card from '@/components/card';
import Button from '@/components/button';
import Toast from '@/components/toast';
import LoadMoreRemote from '@/components/load-more-remote';
import { YNav } from '@/components/nav';
import YNavSearch from '@/components/nav/nav-search';
export default {
	components: {
		[List.name]: List,
		[Item.name]: Item,
		'y-card': Card,
		[Button.name]: Button,
		[LoadMoreRemote.name]: LoadMoreRemote,
	},
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	computed: {
		name() {
			let reg = RegExp(this.replaceData, 'g');
			return this.data.custNname.replace(reg, `<span class='search-color'>${this.replaceData}</span>`)
		},
		custDesc() {
			let reg = RegExp(this.replaceData, 'g');
			return this.data.custDesc.replace(reg, `<span class='search-color'>${this.replaceData}</span>`)
		}
	},
	data() {
		return {
			replaceData: this.$route.query.keyword.replace(/\\/g, '').replace(/\//g, ''),
		}
	},
	methods: {
		// addFriend(val) {
		// 	const params = {
		// 		require: {
		// 			bCustId: val.id
		// 		},
		// 		type: "2"
		// 	};
		// 	this.$http.post('/services/app/v1/user/relation', params)
		// 		.then((req) => {
		// 			if (req.data.msg === "success") {
		// 				this.$toast(this.$R("toast-add-friend"), { autoClose: 3000 }) // 好友申请已发送
		// 			}
		// 		}).catch((err) => {
		// 			console.log(this.$R("toast-request-error")); // 请求失败，请稍后重试
		// 		});
		// },
		handleClickImg(userId) {
			this.$yryz.toPersonalInfo({ userId: userId });
		}
	}
}

</script>
<style>
@import "#/css/var.css";
.searchMember {
	@apply --border-bottom;
	& .y_card-title {
		color: var(--text-primary-color);
	}
	& .search-member-intro {
		font-size: .28rem;
		color: var(--text-assist-color);
	}
	& .button--text.disabled {
		color: var(--text-tips-color);
	}

	& .item-head {
		flex: 1 1 auto;
	}

	& .button {
		width: 92px;
		background: #7fc2ff;
		padding: 0.05rem 0.1rem;
	}
	& .button--text {
		color: var(--text-tips-color);
		background: none;
	}
}
</style>