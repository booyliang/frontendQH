<template>
	<div class="edit-name">
		<!-- 导航 S-->
		<y-nav :title="this.permission === 100?'修改私圈简介':'私圈简介'">
			<div slot="nav-right" class="edit-name-btn">
				<y-button v-if="this.permission === 100" type="text" @click.native="submitIntr">完成</y-button>
			</div>
		</y-nav>

		<!-- 修改 -->
		<y-input v-if="this.permission === 100" v-model="data.intro" :maxlength="200" :minlength="10" type="textarea" placeholder="私圈简介"></y-input>
		<div v-if="this.permission !== 100" class="edit-content">{{data.intro}}</div>
	</div>
</template>
<script>
import YButton from '@/components/button'
import Toast from '@/components/toast'
export default {
	components: {
		YButton, Toast
	},
	name: 'coterie',
	data() {
		return {
			data: {},
			permission: Number
		}
	},
	created() {
		this.permission = this.$coterie.permission;
		this.$http.get(`/services/app/v1/coterie/info/single/${this.$route.params.coterieId}`).then(res => {
			this.data = res.data.data;
		});
	},
	methods: {
		submitIntr() {
			let parms = {
				intro: this.data.intro
			}
			if (!this.data.intro) {
				Toast("私圈简介不能为空！")
			} else if (this.data.intro.length < 10) {
				Toast("私圈简介不能少于10个字！")
			} else {
				this.$http.put(`/services/app/v1/coterie/info/single/${this.$coterie.coterieId}`, parms).then(res => {
					if (res.data.code === '200') {
						let promise = Toast("修改成功！");
						promise.then(() => {
							this.$coterie.intro = this.data.intro;
							this.$router.back();
						})						
					} else {
						Toast(res.data.msg)
					}
				})
			}
		}
	}
}	
</script>
<style>
@import '#/css/var.css';
.edit-name {
	color: var(--text-primary-color);

	& .edit-name-btn {
		color: var(--theme-color);
		font-size: .3rem;
	}

	& .y-input-wrap {
		margin-top: 0.2rem;
	}
	& .coterie-set {
		margin-top: 0.2rem;
	}
}

.edit-content {
	height: 2rem;
	background: #fff;
	font-size: .34rem;
	color: var(--text-primary-color);
	margin-top: 0.2rem;
	padding: 0.1rem 0.2rem;
}
</style>