<template>
	<div class="wishdetail" v-if="isShow">
		<y-list class="list dynamic_list">
			<div class="dynamic_item-head">
				<y-button v-if="isSelf" type="text" class="delete bless" @click.native="deleteWish" slot="foot">{{$R('delete')}}</y-button>
				<div v-else @click="bless" class="bless" :class="{'bless-o':blessStatus}"></div>
				<y-card-user :data="dataItem"></y-card-user>
			</div>
			<div class="dynamic_item-body">
				<div class="dynamic_item-title">
					<span v-text="'【'+dataItem.classifyName+'】'" class="classifyName"></span>
					<span v-text="dataItem.content"></span>
				</div>
				<ul class="dynamic_item-pics" v-if="imgs.length">
					<li class="image--responsive" v-for="(img, index) in imgs" :key="index" @click="showPreview(index)">
						<img :src="img | imageResize(imgs.length > 1 ? 2 : 3)">
					</li>
				</ul>
	
				<div class="hot-user">
					<div class="panel">
						<span class="wish-icon--love"></span>
						<div class="hot_user-item_wrap">
							<span v-for="(user, index) in lists" key="index" v-show="index<5" class="hot_user-item" :key="index">
								<img :src="user.headImg">
							</span>
						</div>
						<span v-show="lists.length" class="iconfont" v-text="lists.length<=5?`${lists.length}${$R('wish-person')}`:`${$R('wish-other')}${lists.length}${$R('wish-person')}`"></span>
					</div>
				</div>
				<span class="iconfont icon-close" v-if="dataItem.isSelf" @click="deleteWish"></span>
			</div>
		</y-list>
	</div>
</template>

<script>
import List from '@/components/list';
import YCardUser from '@/components/card-user';
import Dialog from '@/components/dialog';
import album from '@/components/album'
import ImageResize from '@/filters/imageResize';

export default {
	name: 'y-wish-detail',
	components: {
		YCardUser,
		[List.name]: List,
	},
	props: {
		data: {
			type: Object,
			required: true
		},
		isSelf: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isShow: true,
			dataItem: {},
			imgs: [],
			lists: [],
			blessStatus: this.data.blessStatus,
			clickFlag: this.data.clickFlag,
			swiperOptions: {
				initialSlide: 1,
				autoHeight: false,
				height: window.innerHeight,
				zoom: true,
				zoomMax: 4,
				zoomMin: 1,
				zoomToggle: false,
			},
		}
	},
	mounted() {
		// console.log(this.data.createUserId === this.$circle.userId);
		// console.log("createUserId:", this.data.createUserId);
		let tempObj = {
			'anonymity': this.data.anonymityFlag === 1,
			'isSelf': this.data.createUserId === this.$circle.userId,
		}
		this.dataItem = Object.assign({}, this.data, tempObj)
		this.lists = this.data.list;
		this.imgs = this.data.imgUrl ? this.data.imgUrl.split(',') : [];
	},
	beforeDestroy() {
		album.hide();
	},
	methods: {
		bless() {
			if (!this.blessStatus) {
				if (this.clickFlag) return;
				this.clickFlag = true;
				this.$http.get(`/services/app/v1/wish/bless/${this.data.id}`).then(response => {
					if (response.data.code === "200") {
						this.blessStatus = 1;
						this.lists.unshift(response.data.data);
					} else {
						console.log(response.data.msg);
					}
					this.clickFlag = false;
				});
			}
		},
		deleteWish() {
			Dialog.confirm(this.$R('remove-wish') + '？')
				.then(() => {
					// console.log('Confirm OK.');
					this.$http({
						method: 'DELETE',
						url: `/services/app/v1/wish/delete/${this.data.id}`
					}).then((res) => {
						if (res.data.code === "200") {
							this.isShow = false;
						}
					});
				})
				.catch(() => {
					console.log('Confirm canceled.');
				});
		},
		showPreview(index) {
			album.init(this.imgs, this.swiperOptions);
			album.show(index);
		}
	}
}
</script>

<style>
@import '#/css/var.css';
.wishdetail {
	padding: 0 .14rem;
	& .dynamic_list {
		padding: .3rem .16rem;
		& .dynamic_item-head {
			position: relative;
			& .bless {
				position: absolute;
				top: .15rem;
				right: 0;
				width: 1.4rem;
				height: 0.4rem;
				background-image: url(../../../assets/bless@2x.png);
				background-repeat: no-repeat;
				background-size: contain;
			}
			& .bless-o {
				background-image: url(../../../assets/bless-o@2x.png);
			}

			& .delete {
				background: none;
				height: auto;
				top: 0;
			}
		}

		& .dynamic_item-body {
			position: relative;
			& .dynamic_item-title {
				& .classifyName {
					color: var(--theme-color);
				}
			}
			& .dynamic_item-pics {
				margin-top: .2rem;
				&>.image--responsive {
					margin-top: 1.7%;

					&:nth-child(3n+1) {
						margin-left: 0;
					}
				}
			}

			& .hot-user {
				margin-top: 0;
				background: #fff;
				& .panel {
					margin: 0;
					padding: 0.3rem 0 .4rem 0;
					& .hot_user-item_wrap {
						flex: none;
						& .hot_user-item {
							margin: 0 .1rem .1rem;
						}
					}
					& .wish-icon--love {
						width: .39rem;
						height: .39rem;
						display: inline-block;
						background-image: url(../../../assets/icon-love@2x.png);
						background-repeat: no-repeat;
						background-size: contain;
						position: relative;
						margin-top: .1rem;
						margin-right: .1rem;
					}
					& .wish-icon--bless {
						background-color: #d1a5f2;
						width: .46rem;
						height: .46rem;
						line-height: .46rem;
						@apply --circle;
						text-align: center;
						display: inline-block;
						position: relative;
						margin-top: .08rem;
						margin-right: .1rem;
					}
					& .iconfont {
						color: var(--text-assist-color);
						margin-left: .1rem;
						margin-top: .13rem;
						font-size: 12px;
					}
					& .icon-bless {
						color: #fff;
						margin: 0;
						font-size: 14px;
					}
					& .icon-thumb {
						color: #d7d7d7;
					}
				}
			}

			& .icon-close {
				position: absolute;
				bottom: .4rem;
				right: 0;
				color: #fff;
				background: #DCB7F7;
				padding: .15rem .1rem .0 .22rem;
				border-top-left-radius: 100%;
				border-bottom-right-radius: .1rem;
			}
		}
	}
}
</style>