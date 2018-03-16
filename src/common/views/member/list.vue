<template>
	<div class="member-list">
		<y-nav :title="$R('member-all-member')" >
			<span slot="nav-right">
				<y-button type="text" to="/search" class="iconfont icon-search-c"></y-button>
			</span>
		</y-nav>
		<div>
			<y-load-more-remote :request="request" @loaded="onCanLoad">
				<y-list>
					<y-item v-for="(item, index) in memberData"
							:key="index">						
							<y-card :title="item.nickName" slot="head"
									position="horizontal"
									img-size="large"
									:src="item.userImg"
									:badge="item.authStatus===1" :to="`/user/${item.userId}`"></y-card>

						<y-button slot="foot" @click.native="addFriend(item)" v-if="item.friendFlag === 0">{{$R('member-add-friend')}}</y-button>
						<y-button slot="foot" @click.native="goChat(item)" v-else-if="item.friendFlag === 1">{{$R('member-chat')}}</y-button>
						<y-button slot="foot" disabled v-else>{{$R('member-self')}}</y-button>
					</y-item>
				</y-list>
			</y-load-more-remote>
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
		YNav,
		YNavSearch
	},
	data() {
		return {
			memberData: [],
			request: {
				url: '/services/app/v1/member/list'
			}
		}
	},
	methods: {
		onCanLoad(list) {
			this.memberData.push(...list);
		},
		addFriend(val) {
			const params = {
				require: {
					bCustId: val.custId
				},
				type: "2"
			};
			this.$http.post('/services/app/v1/user/relation', params)
			.then((req) => {
				if (req.data.msg === "success") {
					this.$toast(this.$R("toast-add-friend"), {autoClose: 3000}) // 好友申请已发送
				}
			}).catch((err) => {
				console.log(this.$R("toast-request-error")); // 请求失败，请稍后重试
			});
		},
		goChat(val) {
			var targerId = val.custId;
			this.$yryz.sessionP2P({ custId: targerId });
		}
	}
}

</script>
<style>
@import "#/css/var.css";
.member-list {
	& .button--text.disabled{
		color: var(--text-tips-color);
	}

	& .item-head {
		flex: 1 1 auto;
	}

	& .button {
		width: 92px;
	}
}
</style>