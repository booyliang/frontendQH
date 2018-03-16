<template>
	<div class="mywish">
		<y-nav :title="$R('wish-my')" :menuData="menuData"></y-nav>
	
		<y-load-more :state="state" @can-load="onCanLoad" :endTip="!empty">
			<div>
				<y-wish-detail v-for="(item, index) of wishData" :key="index" :data="item" :isSelf="true"></y-wish-detail>
			</div>
			<div v-if="empty" class="empty-tip">
				<div class="no-data"></div>{{$R("wish-notext")}}
			</div>
		</y-load-more>
	</div>
</template>

<script>
import LoadMore from '@/components/load-more';
import Dialog from '@/components/dialog';
import WishDetail from './components/wishdetail'

export default {
	components: {
		[LoadMore.name]: LoadMore,
		[WishDetail.name]: WishDetail
	},
	data() {
		return {
			menuData: ['index'],
			state: undefined,
			loaded: false,
			wishData: [],
			currentPage: 0,
			pageSize: 10
		}
	},
	computed: {
		empty() {
			return this.loaded && !this.wishData.length;
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
			this.$http.get(`/services/app/v1/wish/myWish/${this.currentPage}/${this.pageSize}`).then(response => {
				if (response.data.code === "200") {
					this.loaded = true;
					let data = response.data.data.entities || [];
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
		}
	}
}
</script>

<style>
@import '#/css/var.css';
.mywish {
	background-color: #fff;
	& .empty-tip {
		min-height: calc(100vh - 1.28rem);
		line-height: 2rem;
		text-align: center;
		color: #999;

		& .no-data {
			width: 2.45rem;
			height: 2.4rem;
			display: block;
			background: url(../../../../common/assets/no-data@2x.png) no-repeat;
			background-size: contain;
			margin: 2.5rem auto 0;
		}
	}
	& .classifyName {
		color: #6d1baa;
	}

	& button.button--text {
		font-size: 13px;
		padding-right: 0;
	}
}
</style>