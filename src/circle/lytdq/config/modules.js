export default {
	'10071': {
		name: "notes",
		link: '/note/:id',
		desc: '游记详情'
	},
	'10072': {
		name: "scenics",
		link: '/scenic/:id',
		desc: '景点详情',

		share(data) {
			return {
				title: `${this.$R("rz-yryz")}${data.name}`
			};
		},

		favorite(data) {
			return {
				infoTitle: data.name
			};
		}
	},
	'10073': {
		name: "notes",
		link: '/notes',
		apiUrl: '/services/app/v1/note/list',
		desc: '游记'
	},
	'10074': {
		name: "scenics",
		link: '/scenics',
		desc: '景点'
	},
	'10075': {
		name: "guides",
		link: '/guides',
		desc: '攻略'
	},
	'10076': {
		name: "sales",
		link: '/sales',
		desc: '惠旅游'
	},
}
