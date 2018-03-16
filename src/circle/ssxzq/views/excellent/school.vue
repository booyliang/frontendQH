<template>
	<div class="school">
		<y-nav title="详情" :menuData="['index', 'refresh']"></y-nav>
		<div class="schoolDetail" v-if="schoolData">
			<div class="album">
				<img :src="pics[0]" @click="showAlbum"/>
				<span>共{{pics.length}}张图片</span>
			</div> 
			<y-panel :title="schoolData.name" class="info">
				<p class="impress" v-if="schoolData.postCount"><span class="count" v-text="schoolData.postCount"></span>个印象</p>
				<p class="subject" v-if="schoolData.subjects"><span v-for="(item, index) in subjects" v-text="item" :key="index"></span></p>
			</y-panel>
			<y-panel title="所在地" icon="addr-a" class="location">
				<p v-text="getAddress"></p>
			</y-panel>
			<y-panel title="简介" icon="intr" class="intr">
				<p v-text="schoolData.content"></p>
				<y-video v-if="schoolData.videoUrl" :src="schoolData.vidioUrl" :poster="schoolData.videoImgUrl"></y-video>
			</y-panel>
			<y-panel :title="'大家印象 (' + schoolData.postCount + ')'" icon="user" v-if="!!schoolData.postCount">
				<y-flow-list :request="request"></y-flow-list>
			</y-panel>
			<div class="button_focus">
				<div class="reply-bottom" @click="goJoin">
					<span type="text" :disabled="true" >我的印象...</span>
				</div>			
			</div>
		</div>
	</div>
</template>

<script>
	import album from '@/components/album'
	import YVideo from '@/components/video';
	export default {
		components: {
			YVideo
		},
		data() {
			return {
				schoolData: null,
				pics: [],
				subjects: [],
				swiperOptions: {
					initialSlide: 1,
					autoHeight: false,
					height: window.innerHeight,
					zoom: true,
					zoomMax: 4,
					zoomMin: 1,
					zoomToggle: false,
				},
			}
		},
		methods: {
			goJoin() {
				this.$router.push('/excellent/edit/' + this.$route.params.id)
			},
			showAlbum() {
				album.show();
			}
		},
		computed: {
			request() {
				let module = this.$utils.getModule('10231');
				return {
					url: module.apiUrl,
					params: {
						pageNo: 1,
						pageSize: 10,
						schoolId: this.$route.params.id
					}
				}
			},
			getAddress() {
				return this.schoolData.provinceName + this.schoolData.cityName + this.schoolData.addr
			}
		},
		mounted() {
			this.$http.get("/services/app/v1/school/single/" + this.$route.params.id).then(res => {
				if (res.data.code === '200') {
					this.schoolData = res.data.data 
					this.pics = this.schoolData.imgUrl.split(',')
					this.subjects = this.schoolData.subjects.split(',')
					album.init(this.pics, this.swiperOptions);
				}
			})
		},
		beforeDestroy() {
			album.hide();
		}
	}
</script>

<style>
	@import '#/css/var.css';
	.schoolDetail{
		& .iconfont {
			color: lightskyblue;
		}
		& .icon-play {
			color: #fff;
		}
		& .info {
			margin: 0;
			& .panel-head {
				& .panel-title {
					color: var(--text-primary-color);
					font-size: 17px;
				}
			}
			& .panel-body {
				@apply --border-bottom;
				& p.impress {
					color: var(--text-assist-color);
					font-size: 14px;
					margin-bottom: .1rem;
					& .count {
						color: #ff9e13;
					}
				}
				& p.subject {
					& span {
						font-size: 12px;
              			color: var(--theme-color);
	              	 	border: 1px solid var(--theme-color);
	              	 	padding: .05rem .17rem;
	              	 	border-radius: .2rem;
	              	 	margin-right: .1rem;
					}
				}
			}
		}
		& .intr {
			& .video {
				margin-top: 0.2rem;
			}
		}
		& .album{
			position: relative;
			width: 100%;
			height: 4.2rem;
			& img {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
			}
			& span {
				padding: .08rem .1rem;
				font-size: 12px;
				background: color(#000 alpha(.4));
				border-radius: .1rem;
				position: absolute;
				right: .2rem;
				bottom: .2rem;
				color: #fff;
			}
		}
		& .location,& .info {
			& .panel-head {
				border: none;
			}
			& .panel-body {
				padding-top: 0;
			}
		}
		& .button_focus {
			padding-top: 0.95rem;
			 & .reply-bottom {
					position: fixed;
				    height: 1.06rem;
				    bottom: 0;
				    left: 0;
				    right: 0;
				    background: #f4f4f4;
				    padding: 0.18rem 0.3rem;
			    & span {
			    	display: block;
			    	width: 100%;
				    height: 0.7rem;
				    line-height: 0.7rem;
				    border-radius: 0.1rem;
				    background: #fff;
				    color: var(--font-common-color);
				    font-size: 16px;
				    padding: 0 0.2rem;
				    color: var(--text-assist-color);
			    }
			}
		} 
	}
</style>