<template>
	<div class="wishclassify" :style="bgStyle">
		<y-nav :title="title" class="wishclassify-nav--height" :transparent="transparent" :menuData="menuData"></y-nav>
		<div v-if="wishclassify">
			<span class="totleCount">{{$R('wish-totalwish',wishclassify.count)}}</span>
			<section>
				<y-tab-bar v-model="tabId" :tabOption="tabOption"></y-tab-bar>
				<y-flow-list :request="flowRequest" :item="require('./components/wishdetail')"></y-flow-list>
			</section>
			<router-link class="new_add-btn" :to="`/wishnew/${wishclassify.id}`"></router-link>
		</div>
	</div>
</template>
<script>
import { YNav } from '@/components/nav';
import FlowList from '@/components/flow-list';
import WishDetail from './components/wishdetail'
export default {
	components: {
		YNav,
		[FlowList.name]: FlowList,
	},
	data() {
		return {
			menuData: ['index'],
			transparent: true,
			tabId: this.$route.params.tabId || 0,
			tabOption: [
				{ id: 0, text: this.$R('hot') },
				{ id: 1, text: this.$R('time') }
			],
			wishclassify: null
		}
	},
	mounted() {
		// let wishclass = this.$localStore.get('wishclass');
		// if (!wishclass) {
		// 	this.transparent = false;
		// 	return false;
		// }
		// for (let item of wishclass) {
		// 	if (item.id.toString() === this.$route.params.id) {
		// 		this.wishclassify = item;
		// 	}
		// }

		this.$http.get(`/services/app/v1/wishclassify/list`).then(response => {
			if (response.data.code === "200") {
				// this.loaded = true;
				let data = response.data.data || [];
				for (let item of data) {
					if (item.id.toString() === this.$route.params.id) {
						this.wishclassify = item;
					}
				}
			} else {
				console.log(response.data.msg);
			}
		});
	},
	computed: {
		bgStyle() {
			return this.wishclassify
				? { 'background-image': `url(${this.wishclassify.columnImgUrl})` }
				: { 'background-color': 'transparent' }
		},
		title() {
			return this.wishclassify
				? `${this.$R('wish-title')}-${this.wishclassify.classifyName}`
				: this.$R('wish-title')
		},
		flowRequest() {
			return {
				url: `/services/app/v1/wish/list`,
				params: {
					classify: this.wishclassify.id,
					sortFlag: this.tabId
				}
			}
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.wishclassify {
	background-repeat: no-repeat;
	background-position: center top;
	background-size: 100% 2.82rem;
	background-color: #fff;
	& .wishclassify-nav--height {
		height: 2.82rem;
	}
	& .totleCount {
		border-radius: .1rem;
		background: rgba(0, 0, 0, 0.5);
		padding: 0 0.25rem;
		line-height: 0.35rem;
		font-size: 12px;
		color: #fff;
		position: absolute;
		top: 2.37rem;
		right: 0.1rem;
	}
	& .new_add-btn {
		display: block;
		width: 1.12rem;
		height: 1.2rem;
		background: url(../../../../common/assets/release@2x.png) no-repeat center;
		background-size: cover;
		position: fixed;
		bottom: .4rem;
		right: .4rem;
		z-index: 9;
	}
}
</style>