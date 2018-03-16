<template>
	<div class="demo-wrap">
		<y-nav title="demo"></y-nav>
		<div class="buts">
			<y-button v-for="n of 4" :key="n" size="s" @click.native="showDemo(n)">{{'demo'+n}}</y-button>
		</div>

		<y-list-selector v-show="index === 1" :options="options1" @select="getData" ref="area"></y-list-selector>
		<y-list-selector v-show="index === 2" :options="options2" @select="getData" ref="area"></y-list-selector>
		<y-list-selector v-show="index === 3" :options="options3" @select="getData" ref="area"></y-list-selector>
		<y-list-selector v-show="index === 4" :options="options4" @select="getData" ref="area"></y-list-selector>
	</div>
</template>
<script>
import Button from '@/components/button'
import ListSelector from '@/components/list-selector'
import CityData from '@/js/citydata'

export default {
	components: {
		[Button.name]: Button,
		[ListSelector.name]: ListSelector,
	},
	data() {
		return {
			options1: [
				{
					type: 'area',
					defaultText: '请选择地区',
					data: CityData,
					listField: '',            // 城市列表key值 默认 children
					textField: ''             // 省、市名称key  默认 text
				}
			],
			options2: [
				{
					type: 'area',
					defaultText: '请选择地区',
					data: CityData,
					listField: '',            // 城市列表key值 默认 children
					textField: ''             // 省、市名称key  默认 text
				},
				{
					type: 'other',
					defaultText: '分类',
					data: [
						{ id: 1, text: '分类1' },
						{ id: 2, text: '分类2' },
						{ id: 3, text: '分类3' },
						{ id: 4, text: '分类4' },
						{ id: 5, text: '分类5' },
						{ id: 6, text: '分类6' },
						{ id: 7, text: '分类7' },
						{ id: 8, text: '分类8' },
						{ id: 9, text: '分类9' },
						{ id: 10, text: '分类10' },
						{ id: 11, text: '分类11' },
						{ id: 12, text: '分类12' },
						{ id: 13, text: '分类13' },
						{ id: 14, text: '分类14' },
						{ id: 15, text: '分类15' },
					],
					textField: ''             // 分类名称key  默认 text
				}
			],
			options3: [
				{
					type: 'area',
					defaultText: '请选择地区',
					data: CityData,
					listField: '',            // 城市列表key值 默认 children
					textField: ''             // 省、市名称key  默认 text
				},
				{
					type: 'other',
					defaultText: '分类',
					data: [
						{ id: 1, text: '分类1' },
						{ id: 2, text: '分类2' },
						{ id: 3, text: '分类3' },
						{ id: 4, text: '分类4' },
						{ id: 5, text: '分类5' },
						{ id: 6, text: '分类6' },
						{ id: 7, text: '分类7' },
						{ id: 8, text: '分类8' },
						{ id: 9, text: '分类9' },
						{ id: 10, text: '分类10' },
						{ id: 11, text: '分类11' },
						{ id: 12, text: '分类12' },
						{ id: 13, text: '分类13' },
						{ id: 14, text: '分类14' },
						{ id: 15, text: '分类15' },
					],
					textField: ''             // 分类名称key  默认 text
				},
				{
					type: 'other',
					defaultText: '品种',
					data: [
						{ id: 1, text: '品种1' },
						{ id: 2, text: '品种2' },
						{ id: 3, text: '品种3' },
						{ id: 4, text: '品种4' },
						{ id: 5, text: '品种5' },
						{ id: 6, text: '品种6' },
					],
					textField: ''             // 品种名称key  默认 text
				}
			],
			options4: [
				{
					type: 'other',
					defaultText: '分类',
					data: [
						{ id: 1, text: '分类1' },
						{ id: 2, text: '分类2' },
						{ id: 3, text: '分类3' },
						{ id: 4, text: '分类4' },
						{ id: 5, text: '分类5' },
						{ id: 6, text: '分类6' },
						{ id: 7, text: '分类7' },
						{ id: 8, text: '分类8' },
						{ id: 9, text: '分类9' },
					],
					textField: ''             // 分类名称key  默认 text
				},
				{
					type: 'other',
					defaultText: '品种',
					data: [
						{ id: 1, text: '品种1' },
						{ id: 2, text: '品种2' },
						{ id: 3, text: '品种3' },
						{ id: 4, text: '品种4' },
						{ id: 5, text: '品种5' },
						{ id: 6, text: '品种6' },
					],
					textField: ''             // 品种名称key  默认 text
				}
			],

			index: 1
		}
	},

	methods: {
		showDemo(n) {
			this.index = n;
		},
		getData(res) {
			console.log(res);
			switch (res.type) {
				case 'area':
					console.log(res.value);
					break;
				case 'other':
					console.log(res.value);
					break;

			}
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.demo_page {
	padding: 0;
}

.buts {
	display: flex;
	justify-content: space-around;
	position: relative;
	padding: .2rem 0;
	background: #fff;
}
</style>



