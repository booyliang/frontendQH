<template>
	<div class="new_novel_page">
		<y-nav :title="$R('book-new-title')">
			<y-publish-button slot="nav-right">{{$R('book-new-book-release')}}</y-publish-button>
		</y-nav>
		<div class="new_novel-tips">{{$R('book-new-tips')}}</div>
		<div class="new_novel_form">
			<y-list class="new_novel_list">
				<y-item :title="$R('book-new-name')">
					<y-input slot="body" v-model="vm.title" :placeholder="$R('book-new-require')" :maxlength="10"></y-input>
				</y-item>
				
				<y-item :title="$R('book-new-cover')"  :subtitle="$R('book-new-unrequire')">
					<div class="new_novel-uploadImg" slot="foot">
						<div class="container" :class="{'imgcon':vm.imgUrl}" @click="uploadImg">
							<template v-if="vm.imgUrl">
								<img :src="vm.imgUrl" class="cover-img">
								<span @click="deleteImg">{{$R('book-new-book-delete')}}</span>
							</template>
							<template v-else>
								<div class="iconfont icon-plus"></div>
								<p>{{$R('book-new-upload-cover')}}</p>
							</template>
						</div>
					</div>
				</y-item>
				<y-item :title="$R('book-new-author')" :subtitle="$R('book-new-require')" vertical>
					<y-input slot="foot" :maxlength="15" :placeholder="$R('book-new-author-placeholder')" v-model="vm.author"></y-input>
				</y-item>
				<!--分类选择-->
				<y-item :title="$R('book-new-classify')" :subtitle="$R('book-new-require')" :placeholder= "classifyValue.name" :clickable="true" id="trigger"></y-item>
				<y-picker v-model="classifyValue" :selects="classifyData" :options="classifyOptions"></y-picker>
				<y-item :title="$R('book-new-booksource')" :subtitle="$R('book-new-require')" vertical>
					<y-input slot="foot" :maxlength="15" :placeholder="$R('book-new-booksource-placeholder')" v-model="vm.bookSource"></y-input>
				</y-item>
				
			</y-list>
			<y-list class="new_novel_ganyan">
				<y-item :title="$R('book-new-bookcontent')" :subtitle="$R('book-new-unrequire')" vertical>
					<!--<y-input type="textarea" slot="foot" :maxlength="1000" :placeholder="$R('book-new-bookcontent-placeholder')" v-model="vm.content"></y-input>-->
					<y-editor slot="body"  v-model="vm.contentSource" :image-enable="false" :text-max-length="1000" ref="editor" :placeholder="$R('book-new-bookcontent-placeholder')"></y-editor>
				</y-item>
			</y-list>

			<div class="action" v-if="status === '1'">
				<y-button block @click.native="handerDelete">{{$R('book-new-book-delete')}}</y-button>
			</div>
			
		</div>
	</div>
</template>

<script>
import YList from '@/components/list'
import YItem from '@/components/item'
import YInput from '@/components/input'
import YEditor from '@/components/content-editor'
import { YPublishButton, PublishMixin } from "@/components/content-publish"
import Picker from '@/components/picker';
export default {
	components: {
		YList, YItem, YInput, YEditor, YPublishButton,
		[Picker.name]: Picker,
	},
	mixins: [PublishMixin],
	data() {
		return {
			menuData: ['index'],
			categoryArr: [], // 分类
			vm: {
				title: '',
				imgUrl: '',
				author: "",
				bookSource: "",
				content: "",
				classifyId: "",
				categoryName: '',
				contentSource: '[]',
	
			},
			status: this.$route.params.status, // 0 发布 1 修改编辑
			classifyValue: {
				name: '',
				
			},
			classifyData: [
				{
					name: 'name',
					options: [],
				},
			],
			classifyOptions: {
				trigger: '#trigger'
			}
		}
	},
	created() {
		let bookCategory = this.$localStore.get('bookCategory') || [];  // 图书分类缓存数据
	
		this.categoryArr = bookCategory.map(item => item.text)
		
		this.classifyData[0].options = this.categoryArr;
		console.log(this.classifyData[0].options); 
		if (this.status === '1') {  // 0 发布 1 修改编辑
			this.vm = this.$localStore.get('bookData') || {};
			this.classifyValue.name = this.vm.categoryName;
		} 
	},
	computed: {

	},
	methods: {
		uploadImg() { // 上传头像
			this.$yryz.uploadPics({ picNum: 1 })
				.then(data => {
					this.vm.imgUrl = data.picUrls[0];					
				})
		},
		deleteImg() { // 删除头像
			this.vm.imgUrl = "";	
		},				
		// 删除发布的书籍推荐
		handerDelete() {
			this.$dialog.confirm('确认删除此推荐书籍？').then(() => {
				this.$http.delete(`/services/app/v1/book/single/${this.$localStore.get("bookData").id}`)
				.then(res => {
					let data = res.data;
					if (data.msg === 'success') {
						this.$localStore.set("editnovel", this.vm.classifyId)
						this.publishSuccess(`/article-novel/${this.$localStore.get("parentId")}`);
						
					} else {
						this.publishError(data.msg);
					}
				}).catch(error => {
					// this.$toast('可能出了一点小问题');
					console.log(error);
				})
			}).catch(() => {})


		},
		// 发布内容时校验
		validate() {
			
			
			if (this.vm.title === '') {
				this.$toast( this.$R('validate-book-name') );
				return false;
			}
	
			if (this.vm.author === '') {
				this.$toast(this.$R('validate-book-author'));
				return false;
			}
			

			if (this.classifyValue.name === '') {
				this.$toast(this.$R('validate-book-classify'));
				return false;
			}
			// console.log(this.classifyValue, this.$localStore.get('bookCategory'))
			let bookCategory = this.$localStore.get('bookCategory') || [];
			let selectItem = bookCategory.find((item) => item.text === this.classifyValue.name)
			// console.log('selectItem', selectItem)
			this.vm.classifyId = selectItem ? selectItem.id : ""; // 清除分类时 selectItem为空了
			this.vm.referrerId = this.$env.userId;

			if (this.vm.classifyId === '') {
				this.$toast(this.$R('validate-book-classify'));
				return false;
			}
			
			
			if (this.vm.bookSource === '') {
				this.$toast(this.$R('validate-book-booksource'));
				return false;
			}

			var SummaryData = this.$refs.editor.getSummaryData();
			SummaryData.imgUrl = this.vm.imgUrl; // 封面图字段imgUrl被y-editor中图片字段覆盖
			this.postData = {
				...this.vm,
				...SummaryData,
				moduleEnum: '10081',
			}
			if (this.status === '1') {
				this.postData.id = this.$localStore.get("bookData").id;
				
			}
		},

		/**
		 * 活动发布
		 */
		publish() {
			console.log(JSON.stringify(this.postData))
			if (this.status === '0') {  // 发布新书
				this.$http.post(`/services/app/v1/book/single`, this.postData)
					.then(res => {
						let data = res.data;
						if (data.msg === 'success') {
							this.publishSuccess(`/article-novel/${this.$localStore.get("parentId")}`);
							this.$localStore.set("editnovel", this.vm.classifyId)
						} else {
							this.publishError(data.msg);
						}
					})
					.catch(msg => {
						this.publishError(msg);
					})
			} else {  // 编辑书籍
				this.$http.put(`/services/app/v1/book/single`, this.postData)
					.then(res => {
						let data = res.data;
						if (data.msg === 'success') {
							this.publishSuccess(`/article-novel/${this.$localStore.get("parentId")}`);
							this.$localStore.set("editnovel", this.vm.classifyId)
						} else {
							this.publishError(data.msg);
						}
					})
					.catch(msg => {
						this.publishError(msg);
					})
			}

		}
	
	}
}
</script>

<style>
@import "#/css/var.css";

.new_novel_page {
	& .new_novel-tips {
		padding: .2rem .3rem;
		font-size: 14px;
		color: var(--text-assist-color);
	}
	& .new_novel_form {
		& .text-length-info {
			padding-right: 0;
		}
		& input::placeholder ,& .item-subtitle {
    		font-size: var(--default-font-size);
   		}
		& .new_novel_list .item:first-child {
			& .item-title { 
				margin-right: .1rem; 
			}
			& .text-length-info {
				margin-right: -.25rem;
			}
		}
		
		& .new_novel-uploadImg {
			height: 100px;
			width: 70px;
			border: 1px solid #dedede;
			border-radius: .1rem;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align:center;
			& .container {
				font-size: 12px;
				color: var(--text-tips-color);
				& .iconfont {
					text-align: center;
					font-size: 16px;
				}	
			}
			& .container.imgcon {
				height: 100px;
				width: 70px;
				position: relative;
				text-align: center;
				& .cover-img {
					height: 100px;
					width: 70px;
					border-radius: .1rem;
				}
				& span {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 26px;
					line-height:26px;
					color: #fff;
					background: rgba(0, 0, 0, 0.3);
					font-size: 14px;
					border-top-right-radius: 10px;
					border-top-left-radius: 10px;
				}
			}

		}
		& .action { 
			margin: 0 auto;
			padding: .5rem 0;
			background-color: #fff;
		}
	}
	& .new_novel_ganyan {
		margin-top: .2rem;
		@apply --border-bottom;

		& textarea::placeholder {
           font-size: var(--default-font-size);
		}
	}
}
</style>


