<template>
	<div class="jkys-permit">
		<y-nav title="填写认证信息" :beforeBack="leftBack"></y-nav>
		<div class="jkys-attestation-require">
			<h2>职业/称号证明材料要求：</h2>
			<p>1、可上传名片、工牌、工作说明、合同等；</p>
			<p>2、公司企业需为国家工商行政管理总局备案公司企业；</p>
			<p>3、图片需清晰无遮盖</p>
			<p>4、合同需要上传含有个人姓名、职业、公司名、盖章页</p>
		</div>
		<div class="jkys-attestation-upimg">
			<div v-if='!src' class="uping-card"></div>
			<img v-else :src="src" />
		</div>
		<y-button block @click.native="selectImg" class="jkys-attestation-button">上传图片</y-button>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import List from '@/components/list';
import Item from '@/components/item';
import Button from '@/components/button';

export default {
	components: {
		YNav,
		[List.name]: List,
		[Item.name]: Item,
		[Button.name]: Button
	},
	data() {
		return {
			vm: {
				data: {}
			},
			src: '',
		}
	},
	mounted() {
		this.vm = this.$localStore.get('petDeta');
		this.src = this.vm.data.certificationMaterialsImg;
		//			this.src = 'http://imgsrc.baidu.com/baike/pic/item/e4dde71190ef76c604622df99816fdfaae5167b4.jpg'
	},
	methods: {
		selectImg() {
			this.$yryz.uploadPics({
				picNum: 1
			}).then((data) => {
				this.src = data.picUrls[0];
			})
			this.vm.data.certificationMaterialsImg = this.src;
		},
		leftBack() {
			this.vm.data.certificationMaterialsImg = this.src;
			console.log('this.permitData.imgsrc1', this.vm.data.certificationMaterialsImg);
			this.$router.replace(`/shoot/perfect/${this.$route.params.id}`)
			return false;
		}
	}
}
</script>

<style>
@import "#/css/var.css";

.jkys-attestation-require {
	margin: 0.3rem;
	background: #fffef1;
	border-radius: 0.1rem;
	border: 0.02rem dashed #d1c852;
	padding: 0.24rem 0.2rem;
	color: var(--text-secondary-color);
	line-height: 1.5;

	& h2 {
		font-size: 17px;
	}
}

.jkys-attestation-upimg {
	margin: 0 0.3rem;
	border-radius: 0.1rem;
	height: 4rem;
	background: #fff;
	overflow: hidden;

	& .uping-card {
		background: url(../../assets/eg03@2x.png) no-repeat center;
		background-size: 100% auto;
		height: 4rem;
	}

	& .uping-id {
		background: url(../../assets/eg02@2x.png) no-repeat center;
		background-size: 100% auto;
		height: 4rem;
	}

	& .uping-pic {
		background: url(../../assets/eg01@2x.png) no-repeat center;
		background-size: 100% auto;
		height: 4rem;
	}
}

.jkys-attestation-button {
	border-radius: 0.1rem;
	margin-top: 1rem;
	font-size: 17px;
}
</style>