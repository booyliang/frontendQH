/**
*	Author: wangminggui
*
*/
<template>
	<section class="list-selector-wrap" :style="setHeight" ref="selector">
		<section class="select-bar-container">
			<div class="select-bar" v-for="(data, index) of listData" :key="index" @click="open(index)">
				<span :class="{selected: isShow && index === currentIndex}" v-text="data.text || data.defaultText"></span>
				<span class="iconfont" :class="isShow && index === currentIndex ? 'icon-arrow-up' : 'icon-arrow-down'"></span>
			</div>
		</section>
		<section v-if="isShow" class="list-container">
			<y-mask class="mask" @click.native="hideMask"></y-mask>
			<div v-if="currentData">
				<div class="area-list" v-if="type === 'area'">
					<div class="province-list" ref="list">
						<ul ref="list_content">
							<li v-if="currentData.data && currentData.data.length" @click="selectProvince('all')">{{$R('national')}}</li>
							<li v-else>{{$R('no-data')}}</li>
							<li v-for="(item, index) of currentData.data" @click="selectProvince(index)" :class="subIndex === index?'active':''" :key="index">{{item[textField]}}</li>
						</ul>
					</div>
					<div class="city-list" v-if="isShowChild" ref="list_city">
						<ul ref="list_city_content">
							<li v-text="allCity" class="first-name"></li>
							<li v-for="(item,index) of childData" @click="selectCity(index)" :key="index">{{ typeof item === 'string' ? item : item[textField]}}</li>
						</ul>
					</div>
				</div>
				<div class="other-list" v-else ref="list">
					<ul ref="list_content">
						<li v-if="currentData.data && currentData.data.length" @click="selectOther('all')">{{$R('all-category')}}</li>
						<li v-else>{{$R('no-data')}}</li>
						<li v-for="(item, index) of currentData.data" :class="currentData.text === item[textField] ?'o-active':''" :key="index" @click="selectOther(index)">{{item[textField]}}</li>
					</ul>
				</div>
			</div>
		</section>
	</section>
</template>
<script>
import Mask from '@/components/mask'

export default {
	name: 'y-list-selector',
	components: {
		[Mask.name]: Mask,
	},
	props: {
		options: {
			type: Array,
			require: true
		},
		tabHeight: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			listData: [],
			isShow: false,
			isShowChild: false,

			currentData: null,
			currentIndex: null,

			subIndex: null,
			scrollTop: 0,
		}
	},
	mounted() {
		// if (supportCss3()) {

		// }
		this.options.forEach(item => {
			this.listData.push(Object.assign({}, item, { text: '' }));
		})
		window.addEventListener('resize', this.resizeHeight);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.resizeHeight);
	},
	watch: {
		isShow(val) {
			if (val) {
				this.$nextTick(() => {
					this.$refs['list'].scrollTop = this.scrollTop;
					// let H = this.$refs['list'].offsetHeight;
					// let h = this.$refs['list_content'].offsetHeight;
					// this.$refs['list'].style.height = h > H ? '70%' : 'auto'
				})
			} else {
				this.scrollTop = this.$refs['list'].scrollTop;
			}
			this.$emit('open', this.isShow);
		},
		subIndex(val) {
			if (this.isShowChild) {
				// this.$nextTick(() => {
				// 	this.$refs['list_city'].style.height = '70%';
				// 	let H = this.$refs['list_city'].offsetHeight;
				// 	let h = this.$refs['list_city_content'].offsetHeight;
				// 	this.$refs['list_city'].style.height = h > H ? '70%' : 'auto'
				// })
			}
		}
	},

	computed: {
		setHeight() {
			let navHeight = document.getElementById('navigator') ? document.getElementById('navigator').clientHeight : 70;
			return { height: this.isShow ? window.screen.height - navHeight - this.tabHeight + 'px' : 'auto' }
		},
		icon() {
			return this.isShow ? 'icon-arrow-up' : 'icon-arrow-down';
		},
		allCity() {
			return `${this.$R('all')}${this.currentData.data[this.subIndex][this.textField]}`;
		},
		childData() {
			return this.currentData.data[this.subIndex][this.listField];
		},
		type() {
			return this.currentData.type || 'area';
		},
		textField() {
			return this.currentData['textField'] || 'text';
		},
		listField() {
			return this.currentData['listField'] || 'children';
		},
	},

	methods: {
		resizeHeight() {
			this.$refs['selector'].style.height = this.isShow ? window.screen.height + 'px' : 'auto';
		},
		open(index) {
			this.isShow = !this.isShow, this.isShowChild = false;

			this.currentIndex = index;
			this.currentData = this.listData[this.currentIndex];
		},

		hideMask() {
			this.isShow = false, this.isShowChild = false;
		},
		selectProvince(index) {
			if (index === 'all') {
				this.subIndex = null, this.isShowChild = false, this.isShow = false;
				this.currentData.text = this.currentData.data[index];
				this.$emit('select', { type: 'area', value: '' });
				return false;
			}
			this.isShowChild = true, this.subIndex = index;
		},
		selectCity(index) {
			this.isShow = false, this.isShowChild = false;
			let item = this.currentData.data[this.subIndex][this.listField][index];
			item = typeof item === 'string' ? item : item[this.textField];
			this.listData[this.currentIndex].text = item;
			this.$emit('select', {
				type: 'area',
				value: [this.currentData.data[this.subIndex][this.textField], item]
			});
		},

		selectOther(index) {
			this.isShow = false;

			this.listData[this.currentIndex].text = index === 'all'
				? this.listData[this.currentIndex].defaultText
				: this.currentData.data[index].text;

			this.$emit('select', {
				type: 'other',
				value: index === 'all' ? '' : this.listData[this.currentIndex].data[index]
			});
		},
		supportCss3(style) {
			var prefix = ['webkit', 'Moz', 'ms', 'o'],
				i,
				humpString = [],
				htmlStyle = document.documentElement.style,
				_toHumb = function (string) {
					return string.replace(/-(\w)/g, function ($0, $1) {
						return $1.toUpperCase();
					});
				};
			for (i in prefix)
				humpString.push(_toHumb(prefix[i] + '-' + style));
			humpString.push(_toHumb(style));
			for (i in humpString)
				if (humpString[i] in htmlStyle) return true;
			return false;
		}
	}
}
</script>
<style>
@import '#/css/var.css';

.list-selector-wrap {
	position: sticky;
	z-index: 18;
	width: 100%;
	left: 0;
	& .select-bar-container {
		height: 39px;
		font-size: .34rem;
		background: #F8F8F8;
		color: #333;
		display: flex;
		align-items: center;
		justify-content: space-around;
		position: relative;
		z-index: 18;
		& .iconfont {
			margin-left: .1rem;
		}

		& .iconfont {
			color: #BFBFBF;
		}

		& .selected {
			color: var(--theme-color);
		}
	}

	& .list-container {
		& .area-list {
			position: absolute;
			background: white;
			width: 100%;
			height: 80%;
		}
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		overflow: hidden;
		& .province-list,
		& .city-list,
		& .other-list {
			position: absolute;
			width: 40%;
			height: 100%;
			overflow-y: scroll;
			& ul {
				background: var(--bg-color);
				& li {
					@apply --border-bottom;
					font-size: var(--default-font-size);
					padding: .15rem 0 .15rem .3rem;
				}
				& .active {
					background: #fff;
					color: var(--theme-color);
					border-left: 0.1rem solid var(--theme-color);
				}

				& .o-active {
					color: var(--theme-color);
				}
			}
		}

		& .city-list {
			right: 0;
			width: 60%;
			& ul {
				background: #fff;
				& .first-name {
					color: #999;
				}
			}
		}
		& .other-list {
			width: 100%;
			& ul {
				text-align: center;
				background: #fff;
			}
		}
	}
}
</style>
