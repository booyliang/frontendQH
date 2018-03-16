<template>
	<div class="edit-name">
		<!-- 导航 S-->
		<y-nav title="私圈名片">
			<div slot="nav-right" class="edit-name-btn">
				<y-button type="text" @click.native="keepImage">保存图片</y-button>
			</div>
		</y-nav>
		<!-- 二维码 S-->
		<div class="quickMark-container">
			<div class="quickMark-content">
				<img :src="coterieData.regroupQrUrl" />
			</div>
		</div>
	</div>
</template>
<script>
import YCard from '@/components/card'
import YButton from '@/components/button'
import Toast from '@/components/toast'
export default {
	components: {
		YCard, YButton, Toast,
	},
	name: 'coterie',
	data() {
		return {
			coterieData: {},
		}
	},
	computed: {

	},
	created() {
		this.coterieData = this.$coterie;

		// console.log(this.coterieData.qrUrl)
		// this.toDataURL(this.coterieData.qrUrl)
		// 	.then(dataUrl => {
		// 		console.log('RESULT:', dataUrl)
		// 		this.base64url = dataUrl;
		// 		// return dataUrl;
		// 	});

	},
	methods: {
		// toDataURL(url) {
		// 	return fetch(url, {
		// 		mode: 'no-cors'
		// 	}).then(response => response.blob())
		// 		.then(blob => new Promise((resolve, reject) => {
		// 			const reader = new FileReader()
		// 			console.log(blob)
		// 			reader.onloadend = () => resolve(reader.result)
		// 			reader.onerror = reject
		// 			return reader.readAsDataURL(blob)
		// 		}))
		// },
		keepImage() {
			let params = {
				name: '',
				data: this.coterieData.regroupQrUrl
			}
			this.$yryz.saveImage(params)
				.then((data) => {
					Toast(data)
				})
		},

	}

}	
</script>
<style>
@import "#/css/var.css";
.edit-name {
	color: var(--text-primary-color);
	& .edit-name-btn {
		color: var(--theme-color);
		font-size: .3rem;
	}
	& .y_card {
		margin-top: 19px;
		& .y_card-title {
			font-size: .38rem;
		}
		& p {
			font-size: .28rem;
		}
	}

	& .quickMark-container {
		padding: 1.3rem 0.75rem;
		text-align: center;
		& .quickMark-content {
			width: 6rem;
			height: 9rem;
			background: #fff;
			border-radius: .1rem;
			overflow: hidden;
			& h3 {
				text-align: center;
				font-size: .44rem;
				line-height: 3;
			}
		}
	}
}
</style>