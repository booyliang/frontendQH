/**
*	Author: xiegen
*
*/
<template>
	<div class="hot" v-if="showHot">
		<div class="hot-button">
			<y-button v-for="(item, index) of finalHot" :key="index" :class="`hot-item-${item.type}`" @click.native.stop="changeHot(item)">
				<span class="iconfont" :class="[`icon-${item.icon}`, { cur: !item.active }]"></span>
				<strong v-if="item.icon === 'thumb'" v-text="item.value" class="hot-item_value"></strong>
				<strong v-if="item.icon === 'reward'" class="hot-item_value">{{forwardCount}}</strong>
			</y-button>
		</div>
		<slot>
			<div class="hot-foot">
				<slot name="foot"></slot>
			</div>
		</slot>
		<div class="hot-user">
			<router-link v-show="likeList.length !== 0" :to="`/hot/detail/${data.id}/${data.moduleEnum}?hots=${hots.join(',')}&resourceId=${data.resourceId}`" class="panel">
				<span class="iconfont icon-thumb"></span>
				<div class="hot_user-item_wrap">
					<span v-for="(user, index) in likeList" :key="index" class="hot_user-item likelist-photo">
						<img :src="user.userImg ? user.userImg : defaultAvatar">
					</span>
					<span v-show="likeList.length >= 15" class="likelist-more iconfont icon-arrow-double-right"></span>
				</div>

			</router-link>
			<router-link v-show="forwardCount && forwardCount !== 0" :to="`/hot/detail/${data.id}/${data.moduleEnum}?hots=${hots.join(',')}&resourceId=${data.resourceId}`" class="panel panel--gift">
				<span class="iconfont icon-reward-circle"></span>
				<div class="hot_user-item_wrap">
					<span v-for="(user, index) in forwardList" :key="index" class="hot_user-item hot_user-item--gift">
						<img :src="user.image" alt="">
						<p>{{user.nickName}}</p>
					</span>
					<span v-show="forwardCount >= 8" class="hot_user-item--gift iconfont icon-arrow-double-right"></span>
				</div>

			</router-link>
		</div>
	</div>
</template>
<script>
import YButton from '@/components/button'
import Toast from '@/components/toast'
let defaultHots = {
	like: {
		text: '点赞',
		icon: 'thumb',
		field: ['likeCount', 'eventCount']
	},
	forward: {
		text: '打赏',
		icon: 'reward',
		field: ['shareCount']
	}
};

export default {
	name: 'y-hot',
	components: {
		YButton
	},
	props: {
		defaultAvatar: {
			default: '/assets/static/default-avatar@2x.png'
		},
		data: Object,
		hots: {
			type: Array,
			default() {
				return ['like', 'forward'];
			}
		}
	},
	data() {
		return {
			list: [],
			likeList: [],
			forwardList: [],
			forwardCount: '',
			likeClicked: false,
		}
	},
	computed: {
		showHot() {
			return this.$yryz.isNative();
		},
		finalHot() {
			if (!this.data || !this.data.moduleEnum)
				return [];
			let list = [];
			for (let item of this.hots) {
				let hot = defaultHots[item];
				let fields = hot.field || [item + 'Count'];
				let value = 0;
				for (let field of fields) {
					if (this.data.hasOwnProperty(field)) {
						value = this.data[field];
						break;
					}
				}
				let obj = Object.assign({}, hot, {
					value,
					type: item
				});
				// 判断点赞状态
				if (item === 'like') {
					if (!isNaN(this.data.likeStatus)) {
						obj.active = !!this.data.likeStatus
					} else {
						obj.active = this.data.likeFlag === 1 ? true : false;
					}
				}
				list.push(obj);
			}
			this.list = list; // 赋值给this.list,避免computed监听不到数据变化

			return list;
		}
	},
	watch: {
		data() {
			this.getData();
		}
	},
	mounted() {
		this.getData();
		this.$eventBus.$on('clickLike', this.changeHot);
	},
	beforeDestroy() {
		this.$eventBus.$off('clickLike', this.changeHot);
	},
	methods: {
		getData() {
			if (!this.data || !this.data.moduleEnum)
				return;
			Promise.all([
				this.$http.get('/services/app/v1/like/list/1/15?infoId=' + this.data.id + '&moduleEnum=' + this.data.moduleEnum),
				this.$http.get('/services/app/v1/report/list/1/6?infoId=' + this.data.id + '&moduleEnum=' + this.data.moduleEnum + '&resourceId=' + this.data.resourceId),
				this.$http.get('/services/app/v1/report/single/opus?infoId=' + this.data.id + '&moduleEnum=' + this.data.moduleEnum + '&resourceId=' + this.data.resourceId)
			]).then(responses => {
				this.likeList = responses[0].data.data.entities;
				this.forwardList = responses[1].data.data;
				this.forwardCount = responses[2].data.data;
				this.scroll();

			})
		},
		async reflesh() {
			setTimeout(() => {
				this.getData();
			}, 1000)
		},
		async changeHot(item, isLike) {
			await this.$user.login();
			if (item.type === 'forward') {
				return this.forward();
			}
			if (this.likeClicked) return;
			this.likeClicked = true;
			let postData = {
				infoId: this.data.id, // 点赞内容ID
				moduleEnum: this.data.moduleEnum,
				targetUserId: this.data.createUserId, // 被点赞人用户ID
				userImg: this.$circle.userImg,
				targetResourceId: this.data.resourceId,
			}
			let response = await this.$http.post('/services/app/v1/like/single', postData)
			if (response.data.code === "200") {
				this.likeClicked = false;
				this.$eventBus.$emit('isLiked')
				item.active = item.active || isLike; // isLike底部点赞的状态
				item.value += (item.active ? -1 : 1);
				console.log(isLike, item.value)
				if (!item.active) {
					this.likeList.unshift({ 'userImg': this.$circle.userImg, 'userId': this.$circle.userId })
				} else {
					this.likeList.forEach((item, index) => {
						if (item.userId === this.$circle.userId) {
							this.likeList.splice(index, 1)
						}
					})
				}
				item.active = !item.active;
			}
		},
		async forward(item) {
			let infoDesc = this.data.description || this.data.content || '';
			if (infoDesc && infoDesc.length > 70) {
				infoDesc = infoDesc.substr(0, 70)
			}
			let infoTitle = this.data.title;
			if (infoTitle && infoTitle.length > 20) {
				infoTitle = infoTitle.substr(0, 20)
			}
			// let imgArray = this.data.imgUrl ? this.data.imgUrl.split(',') : [];
			let img = this.data.coverPlanUrl || this.data.videoThumbnailUrl;
			if (!img) {
				if (this.data.audioUrl) {
					// 含有音频，显示音频默认图片
					img = `${window.location.origin}/assets/static/audio-cover.png`;
				} else {
					img = this.data.imgUrl || '';
				}
			}
			let imgArray = img.split(',');
			if (imgArray.length > 3) {
				imgArray = imgArray.splice(0, 3);
			}
			var forwardData = {
				authorId: '',
				appId: this.$circle.appId,
				moduleId: this.data.moduleEnum,
				resourceId: this.data.resourceId,
				infoId: this.data.id,
				infoTitle: infoTitle,
				infoDesc: infoDesc,
				infoPic: imgArray.join(','),
				// infoVideo: this.data.videoUrl,
				// infoVideoPic: this.data.videoThumbnailUrl,
				custName: this.data.nickName,
				infoCreateTime: this.data.createDate,
				type: 0
			}
			if (this.data.createUserId === this.$env.userId) {
				Toast("不能对自己打赏哦~");
				return;
			}
			let response = await this.$http.get('/services/app/v1/user/info/' + this.data.createUserId)
			if (response.data.code === '200') {
				forwardData.authorId = response.data.data.custId;
				var module = this.$utils.getModule(this.data.moduleEnum);
				// 合并配置中的forward数据
				if (module.forward)
					forwardData = Object.assign(forwardData, module.forward(this.data));
				try {
					await this.$yryz.forward(forwardData);
					Toast("打赏成功！");
					this.reflesh()
				} catch (err) {
					// Toast(err.data);
				}
			}
		},
		scroll() {
			window.scrollTo(0, 0);
		}
	}
}
</script>
<style type="text/css">
@import '#/css/var.css';

.hot-button {
	text-align: center;
	background-color: #fff;
	padding: 1rem 0;
	& .button {
		margin: 0 0.55rem;
		width: 1.2rem;
		height: 1.2rem;
		background: var(--bg-color);
		@apply --round;
		line-height: 1;
		display: inline-block;
		padding: 0;
		text-align: center;
		-webkit-tap-highlight-color: color(#000 alpha(0));


		& .cur {
			color: #d7d7d7;
		}
		& .hot-item_value {
			position: relative;
			top: 0.5rem;
			font-size: .24rem;
			color: var(--text-assist-color);
			word-break: normal;
		}

		& .iconfont {
			margin: 0.3rem auto 0;
			display: block;

			&.icon-thumb {
				font-size: 0.56rem;
			}

			&.icon-reward {
				font-size: 0.65rem;
				color: #f5cd45;
				margin-top: .25rem;
			}
		}
	}
}

.hot-foot {
	background-color: #fff;

	& .slide_ad {
		padding: 0.4rem 0.16rem 0.3rem;
		margin: 0 0.14rem;
		position: relative;
		&:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
		}
	}

	&>div {
		padding-bottom: 0.1rem;
	}
}

.hot-user {
	margin-top: 0.2rem;
	background: #fff;

	& .panel {
		margin: 0 .14rem;
		padding: 0.3rem 0;
		@apply --border-bottom;
		display: flex;

		&.panel--gift {
			padding-bottom: 0.1rem;
		}
		& .hot_user-item_wrap {
			flex: 1;
			height: auto;
			display: flex;
			flex-wrap: wrap;
			overflow: hidden;

			& .likelist-photo {
				margin-bottom: 0;
				margin-top: .1rem;
			}

			& .likelist-more {
				width: .6rem;
				height: .6rem;
				border-radius: 50%;
				background: var(--bg-color);
				margin-left: .1rem;
				margin-top: .17rem;
			}
		}

		&:nth-child(2) .hot_user-item_wrap {
			height: auto;
		}
		& .icon-thumb {
			color: #d5d5d5;
			padding-top: .1rem;
		}
		& .hot_user-item {
			line-height: 1;
			margin-right: .1rem;
			flex: 0 0 0.6rem;
			text-align: center;
			& img {
				width: 0.6rem;
				height: 0.6rem;
				border-radius: 50%;
				margin-top: 0.07rem;
				margin-bottom: 0.06rem;
			}

			& .pic1 {
				background: url(../../../assets/reward_gift_1@2x.png) no-repeat center;
			}

			& .pic2 {
				background: url(../../../assets/reward_gift_2@2x.png) no-repeat center;
			}

			& .pic5 {
				background: url(../../../assets/reward_gift_5@2x.png) no-repeat center;
			}

			& .pic10 {
				background: url(../../../assets/reward_gift_10@2x.png) no-repeat center;
			}

			& .pic30 {
				background: url(../../../assets/reward_gift_30@2x.png) no-repeat center;
			}

			& .pic50 {
				background: url(../../../assets/reward_gift_50@2x.png) no-repeat center;
			}

			& .pic100 {
				background: url(../../../assets/reward_gift_100@2x.png) no-repeat center;
			}

			& .pic500 {
				background: url(../../../assets/reward_gift_500@2x.png) no-repeat center;
			}

			& .gift {
				display: inline-block;
				width: 100%;
				height: 0.6rem;
				border-radius: 0;
				background-size: contain;
				margin-top: .07rem;
			}

			& p {
				color: var(--text-secondary-color);
				width: 100%;
				@apply --text-cut;
				text-align: center;
				font-size: .24rem;
				padding: 0 .1rem;
			}
		}
		& .hot_user-item--gift {
			margin: 0 .18rem .18rem 0;
			display: inline-block;
			background: var(--bg-color);
			border-radius: .06rem;
			width: 1.4rem;
			height: 1.1rem;
			flex: 0 0 1.4rem;
		}

		& .iconfont {
			margin: .1rem .22rem 0 0.16rem;

			&.icon-reward-circle {
				margin-right: 0.3rem;
				margin-top: .3rem;
				color: #d5d5d5;
				font-size: .32rem;
			}
			&.icon-more {
				color: var(--text-tips-color);
				margin: 0.4rem .3rem 0.16rem 0;
			}
		}
		& .icon-arrow-double-right {
			margin: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--text-tips-color);
			font-size: .2rem;
		}
	}
}

.comment_panel.panel--rich {
	margin-top: 0;
}
</style>