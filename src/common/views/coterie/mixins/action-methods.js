import Dialog from "@/components/dialog";
export default {
	data() {
		return {
			isDeleted: false,
			hasCollected: null
		};
	},
	methods: {
		// 收藏
		async handleCollect(data) {
			await this.$user.login();
			if (!data || !data.id || !data.moduleEnum || !this.$env.userId) return;
			let shareTitle = data.title ? data.title.substring(0, 20) : "";
			let imgUrl = data.coverPlanUrl || data.videoThumbnailUrl;
			if (!imgUrl) {
				if (data.audioUrl) {
					// 含有音频，显示音频默认图片
					imgUrl = `${window.location.origin}/assets/static/audio-cover.png`;
				} else {
					imgUrl = data.imgUrl || "";
				}
			}
			let imgArray = imgUrl ? imgUrl.split(",") : [];
			if (imgArray.length > 3) {
				imgArray = imgArray.splice(0, 3);
			}
			let imgStr = imgArray.join(",");
			let shareData = {
				// RAP上接口定义要传的参数
				authorId: data.createUserId,
				coterieId: data.coterieId,
				infoDesc: data.description ?
					data.description :
					data.content.substring(0, 70),
				infoId: data.id,
				infoPic: imgStr,
				infoThumbnail: "",
				infoTitle: shareTitle,
				infoVideo: "",
				moduleEnum: data.moduleEnum,
				resourceId: data.resourceId,
				storeUrl: this.$utils.getShareUrl(),
				targetResourceId: data.resourceId,
				// 自定义附加的参数
				createUserId: this.$env.userId,
				userId: this.$env.custId
			};
			let res = await this.$http.post("/services/app/v1/store/single", shareData)
			if (res.data.code === "200") {
				this.hasCollected = true;
				this.$toast("已收藏");
			} else {
				this.$toast(res.data.msg);
			}
		},

		// 取消收藏
		handleUncollect(data) {
			if (!data || !data.id || !data.moduleEnum || !this.$env.userId) return;
			this.$http.post("/services/app/v1/store/single/del", {
				infoId: data.id,
				moduleEnum: data.moduleEnum,
				targetResourceId: data.resourceId
			}).then(res => {
				if (res.data.code === "200") {
					this.hasCollected = false;
					this.$toast("取消收藏成功");
				} else {
					this.$toast(res.data.msg);
				}
			});
		},
		// 置顶
		handleStick(data) {
			if (!data.coterieId || !data.resourceId) return;
			let params = {
				coterieId: data.coterieId,
				resourceId: data.resourceId
			};
			this.$http.put("/services/app/v1/coterie/dynamic/top", params).then(res => {
				if (res.data.code === "200") {
					data.stickFlag = 1;
					this.$emit("stick", data);
					this.$toast("设置置顶成功");
				} else {
					this.$toast(res.data.msg);
				}
			});
		},

		// 取消置顶
		handleUnstick(data) {
			if (!data.coterieId || !data.resourceId) return;
			let params = {
				coterieId: data.coterieId,
				resourceId: data.resourceId
			};
			this.$http.put("/services/app/v1/coterie/dynamic/cancel", params).then(res => {
				if (res.data.code === "200") {
					data.stickFlag = 0;
					this.$emit("unstick", data);
					this.$toast("取消置顶成功");
				} else {
					this.$toast(res.data.msg);
				}
			});
		},

		// 举报
		async handleReport(id) {
			await this.$user.login();
			await this.$yryz.report({
				type: "2",
				sourceId: id
			});
		},

		/* 删除
		 * id：内容id
		 * requestUrl： 对应的删除接口  
		 * pageType：页面类型; 列表页传入'list'; 详情页传入'detail'
		 */
		handleDelete(id, requestUrl, pageType) {
			Dialog.confirm({ message: "删除后将不可恢复，确定删除该内容？" },
				{
					okText: "确定",
					cancleText: "取消"
				}).then(() => {
					this.$http.delete(requestUrl + id).then(res => {
						if (res.data.code === "200") {
							if (pageType === "list") {
								this.isDeleted = true;
							} else {
								let promise = this.$toast("删除成功！");
								promise.then(() => {
									this.$utils.goBack();
								});
							}
						} else {
							this.$toast(res.data.msg);
						}
					});
				})
				.catch(() => {
					return false;
				});
		}
	}
};