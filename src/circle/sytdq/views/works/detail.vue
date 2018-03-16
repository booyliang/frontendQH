<template>
	<div class="works_detail">
		<y-nav title="详情" :menuData="['index']">
		</y-nav>
		<div class="works_detail-content">
			<y-flow-detail :data="detailData">
				<ul slot="assist" class="pic_box">
					<li class="pic" v-for="(pic, index) of pics" :key="index" @click="showAlbum(index)">
						<img :src="pic" alt="" class="oneImg">
					</li>
				</ul>
			</y-flow-detail>
			<y-hot :data="detailData" :hots="['like', 'forward']"></y-hot>
			<y-comment :data="detailData"></y-comment>
		</div>
	</div>
</template>
<script>
import YFlowDetail from '@/components/flow-detail'
import YHot from '@/components/hot'
import YComment from '@/components/comment'
import album from '@/components/album'
export default {
	components: {
		YFlowDetail,
		YHot,
		YComment
	},
	data() {
		return {
			detailData: {},
			pics: [],
			swiperOptions: {
				initialSlide: 1,
				autoHeight: false,
				height: window.innerHeight,
				zoom: true,
				zoomMax: 4,
				zoomMin: 1,
				zoomToggle: false,
			},
		};
	},
	mounted() {
		this.$http.get('/services/app/v1/appreciation/single/' + this.$route.params.id).then(response => {
			if (response.data.code === '200') {
				this.detailData = response.data.data;
				this.pics = this.detailData.imgUrl.split(',');
				if (this.pics.length === 1) {
					this.$nextTick(() => {
						let img = document.querySelector('.oneImg');
						img.style.width = '100%';
						img.style.height = '100%';
					})
				}
				album.init(this.pics, this.swiperOptions);
			}
		})
	},
	beforeDestroy() {
		album.hide();
	},
	methods: {
		showAlbum(index) {
			album.show(index);
		}
	}
}
</script>
<style type="text/css">
.works_detail{
	& .image-box {
		display: none;
	}
	& .pic_box {
		margin-top: 0.2rem;
		& .pic {
			padding: 0 0.04rem 0.08rem 0.04rem;
			display: inline-block;
			font-size: 0;
			& img {
				width: 2.22rem;
				height: 2.22rem;
			}
		}
	}
}

</style>