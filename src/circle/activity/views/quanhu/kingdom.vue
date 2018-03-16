<template>
<div class="king_dom">
	 <y-nav title="冰雪王国" ></y-nav>
	 <img src="../../static/bxwg_01.jpg"  class="width100" onclick="return false" />
	 <img src="../../static/bxwg_02.jpg"  class="width100" onclick="return false" />
     <div class="menu_list">
         <img src="../../static/bxwg_03.jpg"  class="width100" onclick="return false" />
       
         <div class="databox">
			  <ul class="dataWrap" id="calendar">
				<li :class="{ active: today === item, view_list: isViewList(item) }" v-for="(item, index) in dateArr" :key="index">
					<a @click="goActivity(index)">{{item}}</a>
				</li>
			  </ul>
		 </div>
    </div>
	<img src="../../static/bxwg_04.jpg"  class="width100" onclick="return false" />
	<img src="../../static/bxwg_05.jpg"  class="width100" onclick="return false" />
	<img src="../../static/bxwg_06.jpg"  class="width100" onclick="return false" />	
</div>
</template>

<script>
export default {
	data() {
		return {
			dateArr: ['11月'],
			today: new Date().getDate()
		};
	},
	methods: {
		goActivity(i) {
			let path = this.isViewList(this.dateArr[i]) ? `/platform-activity/vote/${i + 27}/tab/3` : `/platform-activity/vote/${i + 27}`;
			if (i !== 0) {
				this.$router.push({path: path});
			}
			
		},
		isViewList(item) {
			if (item < this.today - 3) {
				if (item === this.today - 4) {
					if (new Date().getHours() >= 15 && new Date().getMinutes() >= 10) {
						return true
					}
					return false
				}
				return true
			}
			return false;
		}
	},
	mounted() {
		for (var i = 0; i < 15; i++) {
			this.dateArr.push(i + 3);
		}
	}
};
</script>

<style>
@import "#/css/var.css";
.king_dom {
  width: 100%;

  & img { 
	vertical-align:bottom; 
	display:block
  }

  & .width100 {
    width: 100%;
  }

  & .databox {
    position: absolute;
    z-index: 2;
    width: 100%;
    top: 0;
    left: 0;
  }

  & .dataWrap {
    overflow: hidden;
  }

  & .dataWrap li {
    box-sizing: border-box;
    float: left;
    width: 17.06%;
    padding-bottom: 17.06%;
    background: #6a85ff;
    border-radius: 100%;
    height: 0;
    position: relative;
    margin: 3% 3.97% 4.5% 3.97%;
    position: relative;
  }

  & .dataWrap li::after {
    content: "";
    position: absolute;
    border: 2px dotted #8b9ee3;
    border-radius: 100%;
    width: 94%;
    height: 94%;
    top: 2px;
    left: 2px;
  }

  & .dataWrap li:first-child {
    background: #faf088;
    border-radius: 100%;
    width: 17.06%;
    padding-bottom: 17.06%;
    color: #6a85ff;
    font-size: 26px;
    font-weight: bold;
    transform: scale(1.1);
    height: 0;
    position: relative;
  }

  & .dataWrap li:first-child a {
    color: #6a85ff;
  }

  & .dataWrap li:first-child::after {
    content: "";
    position: absolute;
    border: 2px dotted #6a85ff;
	transform: scale(1.2);
    border-radius: 100%;
    top: -4px;
    left: -4px;
	transform-origin: 0 0;
  }

  & .dataWrap li a {
    display: block;
    color: #faf088;
    font-size: .48rem;
    font-weight: bold;
	white-space: nowrap;
    text-align: center;
    position :absolute;
    top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
    z-index: 1;
  }

  & .dataWrap li.active {
    background: #fef18a;
  }

  & .dataWrap li.active::after {
    border: 2px dotted #ffc869;
  }

  & .dataWrap li.active a {
    color: #6a85ff;
  }

  & .dataWrap li.view_list {
    width: 17.06%;
    padding-bottom: 17.06%;
    border-radius: 100%;
    height: 0;
    position: relative;
    background: #525d8e url(../../static/view.png) no-repeat;
    background-size: cover;
  }

  & .dataWrap li.view_list a {
    opacity: 0.3;
  }

  & .dataWrap li.view_list::after {
    border-color: #676c7c;
  }

  & .menu_list {
    position: relative;
  }

  & .dataWrap li:nth-child(8n + 5),
  & .dataWrap li:nth-child(8n + 6),
  & .dataWrap li:nth-child(8n + 7),
  & .dataWrap li:nth-child(8n + 8) {
    float: right;
  }
}

</style>