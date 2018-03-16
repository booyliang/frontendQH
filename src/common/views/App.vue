<template>
	<div id="app">
		<keep-alive :exclude='exclude'>
			<component ref='keepAliveComponent' v-if="$route.meta.keepAlive" v-bind:is="currentView"></component>
		</keep-alive>
		<component v-if="!$route.meta.keepAlive" v-bind:is="currentView"></component>
		<y-control-forward></y-control-forward>

	</div>
</template>
<script>
let needRefreshOnBack = false;
import YControlForward from '@/components/control-forward'
export default {
	components: {
		YControlForward
	},

	beforeRouteLeave(to, from, next) {

		// 导航离开该组件的对应路由时调用
		// 可以访问组件实例 `this`
	},

	watch: {
		'$route'(to, from) {

			this.$eventBus.$emit('router-change');
			console.log("to from", from, to)
			if (needRefreshOnBack && to.meta.keepAlive) {
				needRefreshOnBack = false;

				this.refreshComponents = to.matched[to.matched.length - 1].components.default;
				this.handlePopstate();
				return;
			}
			// if (this.$route.meta.keepAlive) {
			// 	setTimeout(() => {
			// 		let scrollTop = window.document.body.scrollTop;
			// 		window.scrollTo(0, scrollTop + 2);
			// 		window.scrollTo(0, scrollTop)
			// 	}, 1000)

			// }
			if (this.$refs.keepAliveComponent && from.meta.keepAlive) {
				this.refreshComponents = from.matched[from.matched.length - 1].components.default

			} else {
				this.refreshComponents = null;
			}

		}
	},
	mounted() {

	},
	async created() {
		this.$eventBus.$on('global-message', this.handleGlobalMessage)
		window.addEventListener('popstate', this.handlePopstate);
		try {
			if (this.$circleOptions.validateCircle === false) {			
				return;
			}
			let res = await this.$http('/services/app/v1/circle/info');
			this.$env.userId = res.data.data.userId || '';
			for (let key in res.data.data)
				this.$circle[key] = res.data.data[key]
			if (parseInt(res.data.data.shelveFlag) === 1) {
				this.currentView = 'y-removed';
			} 
		
		} catch (ex) {
			console.error("环境初始化出错!", ex);			
		} finally {
			this.$yryz.isNative() && this.$yryz.finishLoading()
			if (!this.currentView)
				this.currentView = 'router-view';
		}

	},
	beforeDestroy() {
		this.$eventBus.$off('global-message', this.handleGlobalMessage);
		window.removeEventListener('popstate', this.handlePopstate);
	},
	data() {
		return {
			currentView: '',
			exclude: '',
			lastComponents: null
		}
	},
	methods: {
		handlePopstate(e) {
			// console.log('this.refreshComponents', this.refreshComponents)
			if (!this.refreshComponents) return;
			// console.log(this.refreshComponents)
			let name = this.refreshComponents.name;
			if (!name) console.error('keepalive 路由组件必须定义name', this.refreshComponents);
			// this.exclude.push(name);
			this.exclude = name;
			// console.log(this.exclude)
			this.$nextTick(() => {
				// this.exclude.pop();
				// console.log(this.exclude, window.location.href)
				this.exclude = ''
			})

		},
		goback() {

			// this.currentView = null;				
			this.$nextTick(this.$yryz.back)

		},
		refresh() {
			let currentView = this.currentView;
			this.currentView = null;

			if (this.$refs.keepAliveComponent) {
				let opts = this.$refs.keepAliveComponent.$vnode.componentOptions
				let name = opts.Ctor.options.name || opts.tag;
				this.exclude = name;
			}
			this.$nextTick(() => {
				this.currentView = currentView;
				this.exclude = ''
			})
		},
		refreshOnBack() {

			needRefreshOnBack = true;
		},
		handleGlobalMessage(message) {
			// console.log('message', message)
			if (typeof message === 'function') {
				message(this);
			} else if (message.action)
				message.action(this);
			else if (this[message.type])
				this[message.type](message)

		}
	}
}
</script>
<style>
@import '../css/global.css';
</style>