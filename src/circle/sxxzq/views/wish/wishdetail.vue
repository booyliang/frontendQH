<template>
	<div class="wishdetail">
		<y-load-more :state="state" @can-load="onCanLoad" :endTip="!empty">
			<y-list class="comment-list">
				<div v-for="(item, index) of wishData" :key="item.id">
					<div class="comment">
						<div @click="bless(item)" class="bless" :class="{'bless-o':item.blessStatus}"></div>
						<y-card :src="item.userImg" :title="item.nickName" :to="`/user/${item.createUserId}`" :assist="item.createDate | recentTime"></y-card>
						<div class="comment-content" v-text="item.content"></div>
						<transition-group name="list" tag="div" class="content_editor-img_list" v-if="item.imgUrl.length">
							<div class="content_editor-img_item" v-for="(img, index) in item.imgUrl.split(',')" :key="index">
								<img :src="img" @click="showPreview(item.imgUrl.split(','),index)">
							</div>
						</transition-group>
						<div class="hot-user">
							<div class="panel">
								<span class="wish-icon--love"></span>
								<div class="hot_user-item_wrap">
									<span v-for="(user, index) in item.list" :key="index" v-show="index<5" class="hot_user-item">
										<img :src="user.headImg">
									</span>
								</div>
								<span v-show="item.list.length" class="iconfont" v-text="item.list.length<=5?`${item.list.length}${$R('wish-person')}`:`${$R('wish-other')}${item.list.length}${$R('wish-person')}`"></span>
							</div>
						</div>
					</div>
				</div>
			</y-list>
		</y-load-more>
	</div>
</template>

<script>
import List from '@/components/list';
import Item from '@/components/item';
import LoadMore from '@/components/load-more';
import YCard from '@/components/card';
import Button from '@/components/button';
import album from '@/components/album';

export default {
	name: 'wish-detail',
	components: {
		[LoadMore.name]: LoadMore,
		YCard,
		[Button.name]: Button,
		[List.name]: List,
		[Item.name]: Item
	},
	props: {
		flag: Number,
		id: String
	},
	data() {
		return {
			state: undefined,
			loaded: false,
			wishData: [],
			currentPage: 0,
			pageSize: 20
		}
	},
	computed: {
		empty() {
			return this.loaded && !this.wishData.length;
		},
		params() {
			return {
				classify: this.id,
				sortFlag: this.flag
			}
		}
	},
	mounted() {
		this.getdata();
	},
	methods: {
		onCanLoad() {
			this.getdata();
		},
		getdata() {
			this.state = "loading";
			this.currentPage++;
			let params = this.params;
			this.$http.get(`/services/app/v1/wish/list/${this.currentPage}/${this.pageSize}`, { params }).then(response => {
				if (response.data.code === "200") {
					this.loaded = true;
					let data = response.data.data.entities || [];
					console.log(data);
					if (data.length < this.pageSize || this.currentPage * this.pageSize >= response.data.data.count) {
						this.state = "end";
					} else {
						this.state = "prepared";
					}
					this.wishData.push(...data);
				} else {
					console.log(response.data.msg);
				}
			});
		},
		bless(item) {
			if (!item.blessStatus) {
				if (item.clickFlag) return;
				item.clickFlag = true;
				this.$http.get(`/services/app/v1/wish/bless//${item.id}`).then(response => {
					if (response.data.code === "200") {
						item.blessStatus = 1;
						item.list.unshift(response.data.data);
					} else {
						console.log(response.data.msg);
					}
					item.clickFlag = false;
				});
			}
		},
		showPreview(imgs, index) {
			album.init(imgs);
			album.show(index);
		}
	}
}
</script>

<style>

</style>