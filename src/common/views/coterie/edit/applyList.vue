<template>
	<div class="applyList">
		<!-- 导航 S-->
		<y-nav title="新成员">
		</y-nav>

		<!-- 列表 S-->

		<y-load-more-remote :request="request" @loaded="handleLoaded" :endTip="false">
			<div>
				<y-list v-if="data.length">
					<y-item v-for="(item, index) of data" :key="index">
						<y-card @click-img="handleClickImg(item.custId)" @click-name= "handleClickImg(item.custId)" :title="item.custName"  :src="item.custIcon" :badge="item.custCert === 1" :type="2" img-size="large" position="horizontal">
							<div slot="assist" class="y-card-assit">
								<p>{{item.createDate | moment('YYYY-MM-DD')}} 加入</p>
								<p>{{item.reason}}</p>
							</div>
						</y-card>

						<y-button v-if="item.status !== 0" @click.native="acceptApply(item)">通过</y-button>
						<y-button type="text" v-if="item.status === 0">已通过</y-button>
					</y-item>
				</y-list>
			</div>
		</y-load-more-remote>

		<y-message v-if="data.length === 0" :icon="icon" title="暂时还没有新成员加入哦~" fullscreen></y-message>
	</div>
</template>
<script>
import LoadMoreRemote from '@/components/load-more-remote';
import YCard from '@/components/card'
import YList from '@/components/list'
import YItem from '@/components/item'
import Message from '@/components/message'
import Toast from '@/components/toast'
// import icon from '@/assets/nodata_03.png';
export default {
	components: {
		YCard, YList, YItem, [LoadMoreRemote.name]: LoadMoreRemote, [Message.name]: Message, Toast
	},
	name: 'coterie',
	data() {
		return {
			icon: '/assets/static/no-data@2x.png',
			data: [],
			request: {
				methods: 'get',
				url: `/services/app/v1/coterie/member/applyList`,   // ${this.$route.params.coterid}`,
				params: {
					pageNo: '1',
					pageSize: '20'
				}
			}
		}
	},
	mounted() {
		// this.$localStore.set('refresh', true);
	},
	methods: {
		handleLoaded(dataList, res) {
			this.data.push(...dataList);
		},
		acceptApply(item) {
			this.$http.put(`/services/app/v1/coterie/member/agree/${item.custId}`).then(res => {
				if (res.data.code === '200') {
					item.status = 0
				} else if (res.data.code === '0') {
					item.status = 1
				} else if (res.data.code === '1025') {
					this.$toast(res.data.errorMsg);
				}
				this.$localStore.set('refresh', true);
			});
		},
		handleClickImg(userId) {
			this.$yryz.toPersonalInfo({ userId: userId });
		}
	}
}	
</script>
<style>
@import '#/css/var.css';
.applyList {
	background: #fff;
	width: 100vw;
	height: 100vh;
	& .y_card-title {
		font-size: .34rem;
		color: var(--text-primary-color);
	}
	& .y_card-text {
		& p:nth-child(1) {
			font-size: .24rem;
			color: #b6b6b6
		}
		& p:nth-child(2) {
			font-size: .28rem;
			color: #7f7f7f;
		}
	}
	& .y-card-assit {
		width: 4rem;
	}
	& .button {
		background: #7fc2ff;
		padding: 0.1rem 0.45rem;
		white-space: nowrap;
		&.button--text {
			background: none;
			color: var(--text-assist-color);
		}
	}
}
</style>    