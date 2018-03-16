<template>
<div class="wrapper_main">
	<y-nav title="2017圈乎杯巅峰之战之王者荣耀" ></y-nav>
    <img src="../../static/wzry_01.jpg" alt="2017圈乎杯巅峰之战之王者荣耀" class="width100" onclick="return false" />
    <img src="../../static/wzry_02.jpg" alt="2017圈乎杯巅峰之战之王者荣耀" class="width100" onclick="return false" />
    <div class="join_us">
         <img src="../../static/wzry_03.jpg" alt="2017圈乎杯巅峰之战之王者荣耀" class="width100" onclick="return false" />
         <i></i> 
         <div class="link_list" id="trigger" v-text="value.name"></div>
         <y-button class="join_btn" id="join_btn" @click.native="toActivity">我要报名</y-button>
    </div>
    <img src="../../static/wzry_04.jpg" alt="2017圈乎杯巅峰之战之王者荣耀" class="width100" onclick="return false" />
    <img src="../../static/wzry_05.jpg" alt="2017圈乎杯巅峰之战之王者荣耀" class="width100" onclick="return false" />
    <img src="../../static/wzry_06.jpg" alt="2017圈乎杯巅峰之战之王者荣耀" class="width100" onclick="return false" />
    <img src="../../static/wzry_07.jpg" alt="2017圈乎杯巅峰之战之王者荣耀" class="width100" onclick="return false" />
    <img src="../../static/wzry_08.jpg" alt="2017圈乎杯巅峰之战之王者荣耀" class="width100" onclick="return false" />
    <img src="../../static/wzry_09.jpg" alt="2017圈乎杯巅峰之战之王者荣耀" class="width100" onclick="return false" />
    <img src="../../static/wzry_10.jpg" alt="2017圈乎杯巅峰之战之王者荣耀" class="width100" onclick="return false" />
    <img src="../../static/wzry_11.jpg" alt="2017圈乎杯巅峰之战之王者荣耀" class="width100" onclick="return false" />
    <img src="../../static/wzry_12.jpg" alt="2017圈乎杯巅峰之战之王者荣耀" class="width100" onclick="return false" />
    <img src="../../static/wzry_13.jpg" alt="2017圈乎杯巅峰之战之王者荣耀" class="width100" onclick="return false" />
	<y-picker v-model="value" :selects="selects" :options="options"></y-picker>
</div>
</template>
<script>
import YPicker from '@/components/picker'
export default {
	components: {
		YPicker,
	},
	data() {
		return {
			link: "https://m.quanhu365.com/activity/platform-activity/vote/",
			schoolList: [
				{ name: "湖北财税学校", id: "2" },
				{ name: "武汉交通职业学院", id: "3" },
				{ name: "长江工程职业技术学院", id: "54" },
				{ name: "武汉科技大学城市学院", id: "44" },
				{ name: "武汉理工大学", id: "1" },
				{ name: "江汉大学文理学院", id: "45" },
				{ name: "湖北大学", id: "46" },
				{ name: "湖北大学知行学院", id: "47" },
				{ name: "武汉科技大学", id: "50" },
				{ name: "武汉工商学院", id: "51" },
				{ name: "武汉纺织大学", id: "52" },
				{ name: "中南财经政法大学", id: "53" }
			],
			value: {
				name: '选择学校',
			},
			selects: [
				{
					name: 'name',
					options: [
						'湖北财税学校',
						'武汉交通职业学院',
						'长江工程职业技术学院',
						'武汉科技大学城市学院',
						'武汉理工大学',
						'江汉大学文理学院',
						'湖北大学',
						'湖北大学知行学院',
						'武汉科技大学',
						'武汉工商学院',
						'武汉纺织大学',
						'中南财经政法大学',
					]
				}
			],
			options: {
				trigger: '#trigger'
			}
		}
	},
	watch: {
		'value.name'(val) {
			if (!val) this.value.name = '选择学校';
		}
	},
	methods: {
		toActivity() {
			if (this.value.name === '选择学校') return;
			let index = this.schoolList.filter((item) => item.name === this.value.name)[0].id;
			this.$router.push({path: `/platform-activity/vote/${index}`})
		}
	}
};
</script>
<style>
@import "#/css/var.css";
.wrapper_main {
  background: #27216a;
  padding: 0;
  margin: 0;

  & img { 
	vertical-align:bottom; 
	display:block
  }

  & .width100 {
    width: 100%;
  }
  & .join_us {
    position: relative;
  }
  & .join_us i {
    position: absolute;
    display: inline-block;
    background: url(../../static/arrow_ico.png) no-repeat;
    width: 0.28rem;
    height: 0.32rem;
    right: 0.7rem;
    top: 48.8%;
    background-size: cover;
  }
  & .join_btn {
    display: inline-block;
    width: 3.37rem;
    height: 1.2rem;
    text-indent: -9999px;
    background: url(../../static/join_btn.png) no-repeat;
    background-size: cover;
    position: absolute;
    left: 50%;
    bottom: 0.3rem;
    margin-left: -1.685rem;
  }

  & .select_value {
    width: 110%;
    background: transparent;
    border: none;
    color: #dfdfdf;
    padding: 3px 0;
    -webkit-appearance: none;
    outline: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    font-size: 0.32rem;
  }
  & .link_list {
    width: 74%;
	height: .6rem;
	color: #FFF;
    position: absolute;
    left: 18%;
    top: 47.5%;
    overflow: hidden;
    -webkit-appearance: none;
    outline: none;
    z-index: 10;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  & .select_value option {
    color: #333;
  }
}
@media screen and (min-width: 750px) {
  .wrapper_main {
    width: 7.5rem;
    min-height: 100vh;
    margin: auto;

    & .join_btn {
      cursor: pointer;
    }

    & .select_value option {
      font-size: 0.16rem;
    }
  }
}
</style>