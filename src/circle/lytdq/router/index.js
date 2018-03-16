import BlankRouterView from '@/views/blank-router-view';

import Places from '../views/place/places';
import Place from '../views/place/place';

import Scenics from '../views/scenic/scenics';
import Scenic from '../views/scenic/scenic';

import Notes from '../views/note/notes';
import Note from '../views/note/note';
import NewNote from '../views/note/new-note';

import Sales from '../views/sale/sales';

export default [
	// 攻略
	{
		name: 'guides',
		path: '/guides',
		component: Places
	},

	// 地点
	{
		path: '/place/:placeId',
		component: BlankRouterView,
		children: [
			{
				name: 'place',
				path: '',
				component: Place
			},

			// 该地点的景点列表
			{
				name: 'place-scenics',
				path: 'scenics',
				component: Scenics
			},

			// 该地点的游记列表
			{
				name: 'place-notes',
				path: 'notes',
				component: Notes
			},
		]
	},

	// 景点
	{
		name: 'scenics',
		path: '/scenics',
		component: Scenics
	},
	{
		name: 'scenic',
		path: '/scenic/:scenicId',
		component: Scenic
	},

	// 游记
	{
		name: 'notes',
		path: '/notes',
		component: Notes
	},
	{
		path: '/note',
		component: BlankRouterView,
		children: [
			{
				path: 'new',
				component: BlankRouterView,
				children: [
					{
						name: 'new-note',
						path: '',
						component: NewNote
					},
					{
						name: 'new-note-field',
						path: ':fieldName',
						component: NewNote
					}
				]
			},
			{
				name: 'note',
				path: ':noteId',
				component: Note
			},
		]
	},

	// 惠旅游
	{
		name: 'sales',
		path: '/sales',
		component: Sales
	}
]