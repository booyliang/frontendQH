export default {
	"10091": {
		name: 'shop',
		link: '/shop/index',
		desc: '精品铺子',
		listItem: require('../views/shop/flow-item-shop')
	},
	"10092": {
		name: 'snack',
		link: '/snack/detail/:id',
		desc: '每日五小食',
		share(data) {
			let title = this.$R("rz-yryz") + data.refName.substring(0, 20);
			let content = data.breif.substring(0, 75);
			return { title, content }
		}
	}
}

