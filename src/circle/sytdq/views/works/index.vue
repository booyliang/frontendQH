<template>
	<div class="works_index">
		<y-nav title="优秀作品" :showSearch="true" :menuData="['index']">
		</y-nav>
		<y-tab-bar :tabOption="tabOption" v-model="tabId" textField="name"></y-tab-bar>
		<div class="works_index-content clearfix">
			<y-load-more-remote :request="request" @loaded="handleLoaded">
				<div ref="works_list">
					<div class="pic" v-for="(pic,index) of picData" :key="index" ref="pic" @click="linkTo(pic.id)">
						<img :src="pic.imgUrl.split(',')[0]">
					</div>
				</div>
			</y-load-more-remote>
		</div>
		<router-link v-if="isShow" class="add_idea" to="/works/new"></router-link>
	</div>
</template>
<script>
import YLoadMoreRemote from '@/components/load-more-remote'
import YList from '@/components/list'
import imageResize from '@/filters/imageResize'
export default {
	components: {
		YLoadMoreRemote,
		YList
	},
	data() {
		return {
			tabId: this.$route.params.tabId,
			tabOption: [],
			picData: [],
			isShow: false,
			request: {}
		}
	},
	// computed: {
	// 	request() {
	// 		return {
	// 			url: '/services/app/v1/appreciation/list',
	// 			params: {
	// 				classifyId: this.tabId
	// 			}
	// 		}
	// 	}
	// },
	mounted() {
		this.$http.get('/services/app/v1/appreciation/classify/list').then(response => {
			if (response.data.code === '200') {
				this.tabOption = response.data.data;
				this.getRequest();
			}
		})
		this.$http.get('/services/app/v1/photographer/checkStartByUserId/' + this.$circle.userId).then(response => {
			if (response.data.code === '200') {
				let _data = response.data.data;
				if (_data && _data.isAuthentication === 1) {
					this.isShow = true;
				}
			}
		})
	},
	methods: {
		getRequest() {
			if (!this.tabId)
				return {};
			let request = {
				url: '/services/app/v1/appreciation/list',
				params: {
					classifyId: this.tabId
				}
			}
			this.request = request;
		},
		waterfall() {
			let pics = this.$refs.pic;
			let _this = this;
			pics.forEach((item, index) => {
				let img = item.getElementsByTagName('img')[0];
				img.onload = function () {
					_this.put();
				}
			})
		},
		linkTo(id) {
			this.$router.push({
				path: `/works/detail/${id}`
			})
		},
		handleLoaded(list, res) {
			this.picData.push(...list);
			this.$nextTick(() => {
				this.waterfall();
			})
		},
		put() {
			let pics = this.$refs.pic;
			let w = pics[0].offsetWidth;
			let hArr = [];
			pics.forEach((item, index) => {
				if (index < 2) {
					hArr.push(item.offsetHeight);
				} else {
					// console.log('hArr', hArr);
					let minH = Math.min.apply(null, hArr);
					// console.log('minH', minH);
					let minEq = hArr.indexOf(minH);
					// console.log('minEq', minEq);
					item.style.position = "absolute";
					item.style.top = minH + "px";
					item.style.left = w * minEq + "px";
					hArr[minEq] += item.offsetHeight;
					this.$refs.works_list.style.height = Math.max.apply(null, hArr) + "px";
				}
			})
			console.log('put');
		}
	},
	watch: {
		tabId() {
			this.picData = [];
			this.$refs.works_list.style.height = 0;
			this.getRequest();
		}
	}
}
</script>
<style>
.works_index {
	/*background-color: #fff;*/
	& .works_index-content {
		position: relative;
		box-sizing: content-box;
		margin: 10px;
		height: auto;
		/*background-color: #fff;*/
		& .pic {
			float: left;
			padding: 5px 5px 0 5px;
			width: 50%;
		}
		& .load_more-tip {
			clear: both;
		}
	}
}

.clearfix:after {
	content: ".";
	display: block;
	height: 0;
	clear: both;
	visibility: hidden
}
</style>