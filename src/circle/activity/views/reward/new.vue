<template>
	<div class="reward_new">
		<y-nav title="发布悬赏" ref= "nav">
			<y-publish-button slot="nav-right">发布</y-publish-button>
		</y-nav>

		<y-editor class="join-content" v-model="joinData.contentSource"  :text-max-length="1000" :img-max-length="9" placeholder="请输入悬赏说明..." ref="nativeEditor" ></y-editor>


		<y-list>
			<y-item title="悬赏金额" subtitle="(悠然币)" class="money">
				<y-input type="tel" :maxlength ='4' slot="body" placeholder="请输入至少5悠然币" v-model="showPrice" @keyup.native="verifyNumber"  @focus="handleMoneyFocus"  @blur="handleMoneyBlur" ref="numberEl"></y-input>
			</y-item>
			<y-item title="悬赏时间" class="time">
				<div class="day-item" slot="body">
					<span @click="handleClickTime(index)" :class ="{'active':spanIndex === index}"  v-for="(day,index) in days" :key="index">{{day.text}}</span>
				</div>
			</y-item>
		</y-list>
		<y-list class="reward_new-location">
			<y-check type="checkbox" name="checkbox" v-model="radioChecked"  @click.native="getLocation">定位我的当前的位置</y-check>
			<div class="show-addr" v-if="radioChecked">
				<div class="address-location"><span class="iconfont icon-add-a-c"></span> 
				    <p>{{locationInfo.location || '加载中…'}}</p>
				</div>
				<div class="open-map" @click="openMap">
					<span class="iconfont icon-arrow"></span>导航
				</div>
			</div>
		</y-list>
		<div class="tips" @click="openRule"><span class="iconfont icon-tips-b"></span> 悬赏规则说明</div>
	</div>
</template>
<script>
import {YPublishButton, PublishMixin} from '@/components/content-publish'
import YEditor from '@/components/content-editor'
import List from '@/components/list';
import YCheck from '@/components/check'
import mapNav from '@/components/map-nav'
import zhuge from '@/js/zhuge';
export default {
	name: "reward-new",
	components: {
		YPublishButton,
		YEditor,
		[List.name]: List,
		[YCheck.name]: YCheck,
	},
	mixins: [PublishMixin],
	data() {
		return {
			radioChecked: false,
			addrChecked: false,
			selectedIndex: null,
			showPrice: null,
			days: [
				{'num': 1, 'text': '1天'},
				{'num': 3, 'text': '3天'},
				{'num': 7, 'text': '7天'},
			],
			joinData: {
				custId: this.$env.custId,
				price: null,
				contentSource: '[]',
				duration: 0, // 悬赏期限(天)
				location: "", // 当前位置
				cityCode: "", // 地区编码
				gps: "", 	
				payPassword: '123456',						
			},
			locationInfo: { // 第一次定位时候缓存定位信息
				location: "", 
				cityCode: "", 
				gps: "", 
			}
		}
	},
	watch: {
		radioChecked(val, oldVal) {
			this.addrChecked = val;
		}
	},
	computed: {
		'spanIndex': function () {
			return this.selectedIndex
		},
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
		content() {
			return this.$refs.nativeEditor.getSummaryData().content;
		},
		
	},
	mounted() {
		window.addEventListener('resize', this.handleWindowResize)
	},
	beforeDestroy() {
		mapNav.hide();
		window.removeEventListener('resize', this.handleWindowResize)
	},
	methods: {
		handleWindowResize() {
			let scrollElement = null;
			if (this.moneyHasFocus) {
				scrollElement = document.querySelectorAll(".money ")[0];
			}
			if	(!scrollElement) 
				return;
			this.$nextTick(() => {
				window.scrollTo(0, 60)
				
			});
		},
		handleMoneyFocus() {
			this.moneyHasFocus = true;
		},
		handleMoneyBlur() {
			this.moneyHasFocus = false;
		},
		verifyNumber() {
			let inputVal = this.$refs.numberEl.$el.querySelector('input').value;
			if (inputVal.toString().startsWith('0') && inputVal.toString().length > 1) {
				if (!document.querySelector('.toast')) {
					this.$toast("悬赏金额无效，首位不能为0");
				}
				this.$refs.numberEl.$el.querySelector('input').value = 0;
				return;
			}
			this.$refs.numberEl.$el.querySelector('input').value = inputVal.replace(/\D/g, '');
		},
		openRule() { // 跳转到悬赏规则
			let url = 'https://static.yryz.com/quanhu/doc/reward_rule/index.html';
			if (this.$yryz.isNative()) {
				this.$yryz.openUrl({url: url});
				return false;
			}
			window.location.href = url;
		},
		openMap() {
			mapNav.init({
				province: '',
				city: '',
				address: this.joinData.location,
				lng: this.joinData.longitude, // 经度
				lat: this.joinData.latitude,  // 纬度
			});
		},
		handleClickTime(index) {
			this.selectedIndex = index;
			// console.log(this.selectedIndex)
			this.joinData.duration = this.days[index].num;
		},
		location() {
			this.$yryz.getLocation().then((res) => {
				this.joinData.location = res.province +  res.city + res.region;	// 当前城市:省 市 区
				this.joinData.cityCode = res.cityCode;
				this.joinData.longitude = res.longitude;
				this.joinData.latitude = res.latitude;
				this.joinData.gps = res.longitude + "," + res.latitude;

				this.locationInfo.location = res.province +  res.city + res.region;	// 缓存当前城市:省 市 区
				this.locationInfo.cityCode = res.cityCode;
				this.locationInfo.gps = res.longitude + "," + res.latitude;

			}).catch(error => {
				// this.$utils.alert(JSON.stringify(error.data))
				this.$toast(error.data)
			})
		},
		async getLocation() {
			if (!this.locationInfo.location) { // 第一次勾选时调原生方法获取定位信息 
				await this.location();
			}
		},
		// 发布时校验
		async validate() {
			this.joinData.price = 100 * this.showPrice;
			// 点击发布 （悬赏） 添加埋点
			window.zhuge.track(`悬赏-发布`, {
				'用户id': this.$env.custId, // 用户id
				'机型': this.devType, // 设备类型 Andriod ios
			});
			
			if (!this.content.trim() || this.content.trim().length < 10) {
				this.$toast("无法发布，请输入至少10个字的悬赏说明");
				return false;
			}
			
			if (!this.showPrice) {
				this.$toast('请输入悬赏金额');
				return false;
			}
			if (parseFloat(this.showPrice) === 0 ) {
				this.$toast('悬赏金额无效，不能为0');
				return false;
			}
			let ex = /^[1-9]+[0-9]*$/;
			this.showPrice = this.showPrice.trim();
			if (!ex.test(this.showPrice)) {
				if (this.showPrice.toString().startsWith("0")) {
					this.$toast("悬赏金额无效，首位不能为0");
					return false;
				} else if (this.showPrice.toString().includes(".")) {
					this.$toast("悬赏金额无效,请输入正整数");
					return false;
				}
				this.$toast("悬赏金额无效,请输入正整数");
				return false;
			} else if (parseInt( this.showPrice) < 5 ) {
				this.$toast('请输入至少5悠然币的悬赏金额');
				return false;
			}
			
			if (!this.joinData.duration) {
				this.$toast('请选择悬赏时间');
				return false;
			}
			var SummaryData = this.$refs.nativeEditor.getSummaryData();
			// 发布二次确认 弹框
			if (this.addrChecked) {
				this.joinData.location = this.locationInfo.location;
				this.joinData.cityCode = this.locationInfo.cityCode;
				this.joinData.gps = this.locationInfo.gps;
			} else {
				this.joinData.location = "";
				this.joinData.cityCode = "";
				this.joinData.gps = "";
			}
			await this.$dialog.confirm('是否确认发布')
			this.postData = {
				...this.joinData,
				...SummaryData,
				moduleEnum: '', 
			}
		
			
		},
		// 发布按钮
		async publish() {	
			try {		
				let orderRes = await this.$openApi.post(`/api/v3/offer/save`, this.postData);
				if (orderRes.data.ret !== 1) {
					throw orderRes
				}
				let orderId = orderRes.data.data.orderId; // 生成的订单号		

				// 生成订单号后调起支付接口
				let payInfo = await this.$yryz.pay({
					payMoney: this.showPrice * 100, 
					orderId
				})

				// 悬赏订单查询接口
				let res = await this.$openApi.post(`/api/v3/offer/orderInfo`, {orderId})
				if (res.data.ret !== 1 ) {
					throw res					
				} 
				if (res.data.ret === 1 &&  res.data.data.orderStatus !== 1 ) {
					this.$toast("发布失败，请重新发布");
					return false;			
				} 
				this.$yryz.broadcast({type: 'nativeRewardRefresh', data: {}})
				this.$refs.nav.resetEntry();
				this.publishSuccess(`/reward/detail/${res.data.data.offerId}`); // 悬赏发布成功后跳回详情页
				
			} catch (error) {
				
				if (error.data &&  error.errMsg !== undefined) {
					// 原生返回
					error.data && this.$toast(error.data);
				

				} else {				
					// 后台返回
					this.$toast(error.data.msg);
					
				}

			
				
			}				
		},
		
	}
}
</script>
<style>
@import '#/css/var.css';
.reward_new{
	background: #f8f8f8;
	min-height: 100vh;
	padding-bottom: 1.2rem;
	& .list{
		margin: .2rem 0 0;
		@apply --border-top;
		@apply --border-bottom;
	}
	& .money input{
		text-align: right;
		font-size: .3rem;
		padding: 0 0 0 .25rem;
	}
	& .time{
		background: #fff;
		& .day-item{
			display: flex;
			justify-content: flex-end;
			& span{
				font-size: .3rem;
				text-align: center;
				color: #aaa;
				border:1px solid #aaa;
				border-radius: .1rem;
				margin: 0 0 0 .2rem;
				max-width: 1.2rem;
				min-width: 1rem;
				overflow-x: hidden;
				height: .5rem;

			}
			& span.active{
				border-color: var(--theme-color);
				color: var(--theme-color);
			}
		}
		
	}
	& .reward_new-location{
		background: #fff;
		padding: .3rem;
		& label{
			font-size: .36rem;
			color: var(--text-primary-color);
		}
		& .show-addr{
			color: var(--text-secondary-color);
    		margin: .2rem 0;
			display: flex;
			justify-content: space-between;
			& span.icon-add-a-c{
				color: var(--text-assist-light);
				margin-right: .1rem;
			}
			& .open-map{
			    flex: 0 0 1rem;
				height:100%;
				color: var(--text-assist-color);
				font-size: .26rem;
				text-align:center;
				border-left: 1px solid #e7e7e7;
				padding-left: .35rem;
				margin-left: .35rem;
				& span{
					display: inline-block;
					width: 100%;
					font-size:.32rem;
					color: #00aff7;
				}

			}
			& .address-location {
               display: flex;
			}
		}
	}
	& .tips{
		font-size: .26rem;
		padding: .3rem;
		color:  var(--theme-color);
		& span{
			color: var(--text-assist-light);
			font-size: .26rem;
		}
	}
	& .content_editor-view{
		padding-bottom: .2rem;
		@apply --border-bottom;
	}
	& .content_editor-tool{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #fff;
	}
	& .rule-content{
		padding: .5rem 0 0;
		& .rule-title{
			font-size: .38rem;
			line-height: .5rem;
			color: #f5cd45;
			text-align: center;
		}
		& .rule-des{
			padding: .3rem .45rem 0;
			font-size: .32rem;
			color: var(--text-secondary-color);
			font-weight: 700;
		}
		& .rule-list{
			padding: .3rem .45rem;
			& li{
				font-size: .32rem;
				line-height: .5rem;
				color: var(--text-secondary-color);
			}
		}
		& .rule-btn{
			display: block;
			text-align: center;
			height: .9rem;
			line-height:.9rem;
			color: var(--text-secondary-color);
			font-size: .32rem;
			background: #f8f8f8;
		}
	}
	& .y-input-wrap .text-length-info {
		& .current-text-length {
	       color: var(--text-assist-color);
		}
		& .text-max-length {
           color: var(--text-assist-light);
		}
	}
	& .item-subtitle {
		font-size: .3rem;
	}
	& .y-input-wrap.y-textarea textarea{
		/* min-height: 10rem; */
	}
}
</style>


