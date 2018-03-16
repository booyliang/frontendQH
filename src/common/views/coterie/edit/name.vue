<template>
	<div class="edit-name">
		<!-- 导航 S-->
		<y-nav title="修改私圈名字">
			<div slot="nav-right" class="edit-name-btn">
				<y-button type="text" @click.native="submitIntr">完成</y-button>
			</div>
		</y-nav>

		<!-- 修改 -->
		<y-input v-model="data.name" :maxlength="7" placeholder="请输入私圈名字"></y-input>
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
		}
	},
	created() {
		this.$http.get(`/services/app/v1/coterie/info/single/${this.$route.params.coterieId}`).then(res => {
			this.data = res.data.data;
		});
	},
	methods: {
		submitIntr() {
			let parms = {
				name: this.data.name
			}
			if (!this.data.name) {
				Toast("私圈名字不能为空！")
			} else {
				this.$http.put(`/services/app/v1/coterie/info/single/${this.$coterie.coterieId}`, parms).then(res => {
					if (res.data.code === '200') {
						let promise = Toast("修改成功！");
						promise.then(() => {
							this.$coterie.name = this.data.name;
							this.$router.back();
						})

					}
					else {
						Toast(res.data.msg)
					}

				})
			}
		}
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
	& .y-input-wrap {
		margin-top: 0.2rem;
	}
	& .coterie-set {
		margin-top: 0.2rem;
	}
}
</style>