import Horoscope from '../views/horoscope';
import HoroscopeDetail from '../views/horoscope/detail';

export default [
	{
		path: '/horoscope', // 星座运势
		component: Horoscope
	},
	{
		path: '/horoscope/detail/:id', // 星座运势详情
		component: HoroscopeDetail
	}
]