/** * Author: zhulin * */
<template>
	<div>
		<div id="navigator" :class="['nav',{'nav--background':!transparent ,'nav-background-fix':backgroundFix}]">
			<span v-text="leftText" @click.stop.prevent="handleBack" :class="showLeftArrow ? 'nav-left iconfont icon-arrow-left':'nav-left' "></span>
			<!--添加nav-left为默认样式，为了使没有左返回键，只有文字描述的，可以正常显示在左边   wangmingqin 2017-5-27 13:45-->
			<div class="nav-center" :class="{'nav-center_show_left': showLeftArrow || leftText, 'nav-center_show_right': rightButtonLen>1}">
				<slot name="nav-center">
					<span v-text="navTitle"></span>
				</slot>
			</div>
			<div class="nav-right">
				<slot name="nav-right">
					<y-button v-if="menuData && menuData.length > 0" type="text" ref="nav_menu" class="iconfont icon-more"></y-button>
					<y-button @click.native="track" v-if="showMember" type="text" to="/member" class="iconfont icon-users-o-m"></y-button>
					<y-button @click.native="track" v-if="showSearch" type="text" to="/search" class="iconfont icon-search-c"></y-button>
					<y-menu v-if="menuOptions" :menu="menuData" :options="menuOptions"></y-menu>
				</slot>
			</div>
		</div>

		<div class="pdTop"></div>
	</div>
</template>
<script>
import YMenu from '../menu'
let entryComponents = [];

export default {
	components: {
		YMenu
	},
	name: 'y-nav',
	props: {
		showLeftArrow: {
			type: Boolean,
			default: true
		},
		title: String,
		leftText: String,
		beforeBack: Function,
		transparent: Boolean,
		showSearch: Boolean,
		showMember: Boolean,
		menuData: Array
	},
	data() {
		return {
			backgroundFix: false,
			navTitle: this.title,
			menuOptions: null,
			backClicked: false,
		}
	},
	watch: {
		title() {
			this.navTitle = this.title;
		},
		// 监听menuData数据变化，当数据length为0时，隐藏相关按钮  => by yefan
		menuData(newVal) {
			if (newVal && newVal.length > 0) {
				this.menuOptions = {
					trigger: this.$refs.nav_menu,
					fixed: true
				}
			} else {
				this.menuOptions = false;
			}
		}
	},
	computed: {
		devType() { // 机型
			let devType = this.$env.devType;
			if (devType === 0) {
				return 'Andriod';
			} else if (devType === 1) {
				return 'iOS ';
			} else {
				return 'PC';
			}

		},
		rightButtonLen() {
			let len = 0;
			if (this.showSearch) len++;
			if (this.showMember) len++;
			if (this.menuData && this.menuData.length) len++;
			return len;
		}
	},
	methods: {
		resetEntry() {
			entryComponents = [];
		},
		resetEntryIsEntry() {
			if (entryComponents.length === 0)
				return;
			if (entryComponents[entryComponents.length - 1] === this.$route.matched[entryComponents.length - 1].components.default)
				entryComponents = [];
		},

		// 埋点
		track() {
			window.zhuge.track(`[${this.$circle.circleName}]-搜索按钮`, {
				'用户id': this.$env.custId, // 用户id
				'机型': this.devType, // 设备类型 Andriod ios
				'圈子名称': this.$circle.circleName, // 圈子名称
			});
		},

		handleBack() {
			// console.log(entryComponents[entryComponents.length - 1], this.$route.matched[entryComponents.length - 1])	

			if (this.beforeBack && this.beforeBack() === false) {
				return;
			}
			if (!entryComponents.length) {
				return this.$eventBus.$emit('global-message', {
					type: 'goback'
				});

			} else if (entryComponents.length === this.$route.matched.length &&
				entryComponents[entryComponents.length - 1] === this.$route.matched[entryComponents.length - 1].components.default
			) {
				return this.$eventBus.$emit('global-message', {
					type: 'goback'
				})
				// this.$yryz.back();
			} else {
				this.$nextTick(() => {
					this.$router.back();
				})

			}

		},
		changeStatusBar() {
			if (!this.$yryz.isNative()) return;
			let dark = !this.transparent;
			if (!this.$yryz.isIOS()) {
				dark = !dark;
			}
			this.$yryz.statusBar({
				dark
			});
		},

		handleScroll() {
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			if (scrollTop >= 50) {
				this.backgroundFix = true;
				this.navTitle = this.title || this.$circle.circleName
			} else {
				this.backgroundFix = false;
				this.navTitle = this.title
			}
		},

		scroll() {

		},

		reload() {
			// 解决回退浏览器不加载的问题
			// if ((/iphone|ipod|ipad.*os 5/gi).test(window.navigator.appVersion)) {
			// 	if (this.observer)
			// 		return;
			// 	let target = document.getElementById('app');
			// 	let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

			// 	let observer = new MutationObserver(this.scroll);
			// 	this.observer = observer;
			// 	let config = {
			// 		attributes: true,
			// 		childList: true,
			// 		characterData: true,
			// 		subtree: true
			// 	};
			// 	observer.observe(target, config);
			// }
		}
	},
	mounted() {
		this.$yryz.on('nativeBack', this.handleBack);
		this.changeStatusBar();
		this.transparent && window.addEventListener('scroll', this.handleScroll);
		if (this.menuData)
			this.menuOptions = {
				trigger: this.$refs.nav_menu,
				fixed: true
			}
		this.reload();
		this.$eventBus.$on('goBack', this.handleBack)
	},
	activated() {
		this.$yryz.on('nativeBack', this.handleBack);
		this.backClicked = false;
		this.changeStatusBar();
		this.reload();
	},
	deactivated() {
		this.$yryz.off('nativeBack', this.handleBack);
		this.$eventBus.$off('goBack', this.handleBack);
	},
	beforeDestroy() {
		this.$yryz.off('nativeBack', this.handleBack);
		this.$eventBus.$off('goBack', this.handleBack);
		this.transparent && window.removeEventListener('scroll', this.handleScroll);
	},
	created() {
		if (!entryComponents.length && this.$route.matched.length) {
			for (let matched of this.$route.matched) {
				entryComponents.push(matched.components.default);
			}

		}
	}
}
</script>
<style>
@import '#/css/var.css';
.nav {
	height: 1.28rem;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	/* line-height: .88rem; */
	/* text-align: center;  */
	font-size: .36rem;
	color: #fff;
	z-index: 20;
	/* padding: .4rem .3rem 0; */
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding-top: .4rem;
	& .iconfont {
		width: .6rem;
		color: #fff;

		&.button {
			width: .6rem;
		}
	}

	& .button {
		height: .88rem;
		line-height: .88rem;
		padding: 0;
		border-radius: 0;
		float: right;

		&:active {
			background: none;
		}

		&:first-child {
			margin-left: 0.2rem;
		}
	}

	& .menu-item {
		font-size: .28rem;

		& .iconfont {
			width: 0.3rem;
		}
	}

	& .icon-share {
		font-size: var(--default-font-size);
	}
}

.nav--background {
	background: #fff;
	color: var(--text-secondary-color);
	border-bottom: 1px solid #e5e5e5;
}

.nav-left {
	text-align: left;
	font-size: var(--default-font-size);
	position: absolute;
	left: 0.3rem;
	/* top: 0.4rem; */
}

.nav-right {
	text-align: right;
	position: absolute;
	right: 0.3rem;
	/* top: 0.4rem; */
}

.nav-center {
	/* display: inline-block;   */
	@apply --text-cut;
	padding: 0 .3rem;
}

.nav-center_show_left {
	padding: 0 1rem;
}
.nav-center_show_right {
	padding: 0 1.5rem;
}

.nav.nav--background .iconfont {
	color: var(--text-assist-color);
}

.nav .menu-item .iconfont {
	color: #fff;
}

.nav .nav-right--search {
	height: 0.54rem;
	line-height: 0.5rem;
	position: relative;
	border-radius: 0.3rem;
	border: .02rem solid #f4f4f4;
	background: var(--bg-color);
	position: relative;
	margin-left: -.3rem;

	& .icon-search-c {
		font-size: var(--default-font-size)!important;
		color: #bfbfbf;
		position: absolute;
		left: 0.1rem;
		top: 0.02rem;
	}

	& .nav-right--search_input {
		width: 100%;
		padding: 0 1rem 0 0.7rem;
		font-size: .28rem;
		color: var(--text-assist-color);
		position: relative;
		top: -.02rem;

		&::placeholder {
			color: var(--text-tips-color);
		}
	}

	&>span {
		width: 0.32rem;
		height: 0.32rem;
		display: block;
		text-align: center;
		line-height: 0.32rem;
		border-radius: 32rem;
		position: absolute;
		top: 0.1rem;
		right: 0.2rem;
		background: #bfbfbf;
		&.icon-close {
			font-size: 6px;
			color: #fff;
		}
	}
}

.nav-background-fix {
	background: var(--theme-color);
	&.nav--background {
		color: #fff;
	}
	& .iconfont {
		color: #fff;
	}
}


.nav .iconfont {
	display: inline-block;

	&.icon-arrow-left {
		font-size: .32rem;
	}

	&.icon-more {
		font-size: .4rem;
	}

	&.icon-search-c {
		font-size: .36rem;
	}

	&.icon-users-o-m {
		font-size: .46rem;
		position: relative;
		/*top: -6px;*/
	}
}

.nav-right .nav-right {
	float: right;
}

.nav-left .button.button--text {
	color: var(--text-secondary-color);
	font-size: var(--default-font-size);
}

.pdTop {
	padding-top: 1.28rem;
}
</style>