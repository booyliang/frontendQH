<template>
	<div class="broadcast-detail-wrap">
		<y-nav :title="$R('detail')" :showSearch="true" :menuData="menuData"></y-nav>
		<div class="broadcast-detail flow_detail" v-if="broadcastData">
			<div class="broadcast_detail-section">
				<!--标题-->
				<h4 class="broadcast-intro" v-text="broadcastData.title"></h4>
				<!--时间-->
				<p class="broadcast-time">{{broadcastData.createDate | recentTime}}</p>
				<!--主图-->
				<img :src="broadcastData.coverPlanUrl">
				<!--语音播报-->
				<div class="audio-wrap" v-if="broadcastData.audioUrl">
					<y-audio-player :title="$R('listen')" :src="broadcastData.audioUrl" :time="broadcastData.audioTime" :size="broadcastData.audioSize"></y-audio-player>
				</div>
				<!--大事件-->
				<div class="information" v-if="broadcastData.contentIncident">
					<p class="title incident"><i></i>{{$R('incident')}}<b></b></p>
					<p class="content incident" v-html="getTranslateString(broadcastData.contentIncident)"></p>				
				</div>
				<!--投融资-->
				<div class="information" v-if="broadcastData.contentFinancing">
					<p class="title financing"><i></i>{{$R('financing')}}<b></b></p>
					<p class="content financing" v-html="getTranslateString(broadcastData.contentFinancing)"></p>				
				</div>
				<!--新产品-->
				<div class="information" v-if="broadcastData.contentProduct">
					<p class="title product"><i></i>{{$R('product')}}<b></b></p>
					<p class="content product" v-html="getTranslateString(broadcastData.contentProduct)"></p>				
				</div>
			</div>
			<!--点赞-->
			<y-hot :hots="['like']" :data="broadcastData">
				<!--广告-->
				<div slot="foot">
					<y-ad :type="1" keyword="圈子内容"></y-ad>
				</div>
			</y-hot>
			<!--评论-->
			<y-comment :data="broadcastData"></y-comment>
		</div>		
	</div>
</template>

<script>
	import YHot from '@/components/hot'
	import YComment from '@/components/comment/comment'
	import Ad from '@/components/ad'
	import YAudioPlayer from '@/components/audio-player'
	export default {
		components: {
			YHot,
			YComment,
			[Ad.name]: Ad,
			YAudioPlayer
		},
		data() {
			return {
				menuData: ['index', 'copy-url', 'report'],
				broadcastData: {}
			}
		},
		created: function () {
			this.$http.get('/services/app/v1/broadcast/info/detail/' + this.$route.params.id)
				.then((res) => {
					if (res.data.code === "200") {
						let resData = res.data.data;
						resData.content = resData.contentIncident;
						this.broadcastData = resData
					}					
				})
		},
		methods: {
			getTranslateString(value) {
				return value.replace(/\r\n/g, "<br>").replace(/\n/g, "<br>");
			}
		}
	}
</script>

<style>
@import '#/css/var.css';
.broadcast-detail.flow_detail{
	padding: 0 0;

	& .hot-user {
		border-top: 0.2rem solid #f8f8f8;
		margin-top: 0;
	}
}
.broadcast_detail-section {
	background: #fff;
	padding: var(--layout-space);

	& img {
		margin-bottom: 0.3rem;
	}

	& .information {
		margin-top: 0.5rem;

		& .title {
			text-align: center;
			font-size: 17px;
			color: var(--text-primary-color);
			margin-bottom: .2rem;

			& i, & b{
				display: inline-block;
				margin-right: 0.22rem;
				width: 1.4rem;
				height: 0.02rem;
				background: -webkit-linear-gradient(left, #fff, #666);
				position: relative;
				top: -0.1rem;

				&:after {
					content: '';
					position: absolute;
					top: -0.02rem;
					right: 0;
					width: 0.06rem;
					height: 0.06rem;
					border-radius: 0.1rem;
					background: #666;

				}
			}

			& b {
				background: -webkit-linear-gradient(left, #666, #fff);
				margin-left: 0.22rem;

				&:after {
					display: none;
				}

				&:before{
					content: '';
					position: absolute;
					top: -0.02rem;
					left: 0;
					width: 0.06rem;
					height: 0.06rem;
					border-radius: 0.1rem;
					background: #666;
				}
			}
		}

		& .content {
			font-size: 17px;
		}
	}
}
</style>