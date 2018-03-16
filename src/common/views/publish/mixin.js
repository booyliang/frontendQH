export default {
	methods: {
		async invokeNative(publicData) {
			// console.log('publicData', JSON.stringify(publicData.category));
			this.classifyId = this.classifyId || 0
			let data = await this.$yryz.publishImageText(publicData);
			let dataSource = data.dataSource;
			if (dataSource.functionType === 2) { // 投票
				this.$localStore.set("publish-data", data);
				this.$router.push(`/voting-edit?classifyId=${this.classifyId}`);
			} else {
				if (this.afterPublish) {
					this.afterPublish(dataSource);
					return;
				};
				// if (parseInt(dataSource.classifyId) === 0) {
				// 	let authConfig = this.config.auth.data;
				// 	authConfig.allowGeneralizeFlag = dataSource.allowGeneralizeFlag;
				// 	authConfig.allowShareFlag = dataSource.allowShareFlag;
				// 	authConfig.contentPrice = dataSource.contentPrice;
				// 	this.$toast(dataSource.classifyId)
				// 	this.$router.replace('all');
				// 	this.$utils.refresh();
				// }
				if (dataSource.classifyItemId) {
					this.classifyItemId = dataSource.classifyItemId;
					if (!publicData.category.editable) {
						this.$utils.refresh();
					}
				} else {
					this.classifyItemId = '1'; // 发布完成默认进入最新tab
				}
			}
		},
		async $saveEntity(dataSource) {
			if (!dataSource) {
				let publishData = this.$localStore.get("publish-data");
				dataSource = publishData && publishData.dataSource;
			}
			if (!dataSource)
				return {};
			let res = await this.$http.post('/services/app/v1/release/info/single', dataSource);
			return res.data;
		},

		back() {
			let publicData = this.$localStore.get("publish-data");
			if (publicData) {
				this.invokeNative(publicData);
			}
		},
		async start(classifyId) {
			this.$localStore.remove("publish-data");
			classifyId = classifyId ? classifyId : 0
			// todo:抓取通用发布配置信息，调起原生编辑器
			let res = await this.$http.get(`/services/app/v1/release/config/template/${classifyId}`);
			const config = res.data.data;
			let response = await this.$http.get(`/services/app/v1/classify/categoryAndItems/${classifyId}`);
			const cate = response.data.data;
			let category = { data: cate.categoryItems, defaultId: 0, defaultText: '', editable: cate.category.itemStyle === "0" };
			if (cate.categoryItems && cate.categoryItems.length) {
				for (let c of cate.categoryItems) {
					if (c.id === parseInt(this.classifyItemId)) {
						category.defaultId = c.id;
						category.defaultText = c.categoryName;
					}
				}
			}
			let dataSource = {};
			dataSource.classifyId = parseInt(classifyId);
			dataSource.moduleEnum = "0091";
			dataSource.createUserId = this.$env.userId;
			let request = {
				url: this.$http.baseUrl + '/services/app/v1/release/info/single',
				method: 'post',
				headers: Object.assign({}, this.$env, { Origin: window.location.origin }),
			}
			let publishData = { config, category, dataSource, request };
			if (this.chagePublishData) {
				this.chagePublishData(publishData);
			}
			this.invokeNative(publishData);
		},
		async saveVoting(vote) {
			try {
				let data = await this.$saveEntity();
				if (data.code && data.code !== '200')
					return this.$toast(this.$R("public-failed"));
				let entity = data.data;
				vote.vote.moduleEnum = "0031"; // 投票id
				if (entity && entity.id) {
					vote.vote.moduleEnum = entity.moduleEnum;
					vote.vote.contentId = entity.id;
				}
				// 0091
				// 保存投票数据
				let res = await this.$http.post("/services/app/v1/vote/publish", vote);
				if (res.data.code !== "200") {
					throw { res, entity };
				}
				return res;
			} catch (ex) {
				if (ex.entity && ex.entity.id) {
					// 删除主实体数据
				}
				return ex.res || ex;
			}
		}
	}
};
