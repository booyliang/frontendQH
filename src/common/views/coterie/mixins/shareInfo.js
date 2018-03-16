const INITIAL_TITLE = '圈乎';
const DEFAULT_CONTENT = '圈子有了，一切都有了！进圈乎 玩圈子 共享资源 价值变现';
const DEFAULT_IMAGE = window.location.origin + '/assets/static/sharelogo@2x.png';

export default {
	methods: {
		shareInfo({ title, desc, imgUrl }) {
			let MetaTitle = title ? title.substring(0, 30) : '圈子有了，一切都有了！';
			let shareData = {
				title: '【圈乎】' + MetaTitle,
				desc: desc ? desc.substring(0, 100) : DEFAULT_CONTENT,
				imgUrl: imgUrl || DEFAULT_IMAGE
			}
			if (!this.$yryz.isNative()) {
				document.title = shareData.title;
				createImg(shareData.imgUrl);
				createMeta([
					{ type: 'name', itemprop: 'name', name: 'name', content: shareData.title },
					{ type: 'name', itemprop: 'description', name: 'description', content: shareData.desc },
					{ type: 'name', itemprop: 'image', name: 'image', content: shareData.imgUrl }
				]);
			}
			function createMeta(arr) {
				let headElmt = document.getElementsByTagName('head')[0];
				arr.forEach(item => {
					let metaElmt = document.createElement('meta');
					metaElmt.setAttribute(item.type, item.name || '');
					// metaElmt.setAttribute('itemprop', item.name || '');
					metaElmt.content = item.content || '';
					for (let i = 0; i < headElmt.getElementsByTagName('meta').length; i++) {
						if (headElmt.getElementsByTagName('meta')[i].getAttribute(item.type) === item.name) {
							break;
						}
						headElmt.appendChild(metaElmt);
					};
				})

			}
			function createImg(imgUrl) {
				let shareImg = document.createElement('img');
				shareImg.className = "shareImg";
				shareImg.width = 300;
				shareImg.style.cssText = "overflow:hidden; margin:0 auto; position:absolute; top:-800px;";
				shareImg.src = imgUrl;
				if (!document.body.querySelector('.shareImg')) {
					document.body.insertBefore(shareImg, document.body.childNodes[0]);
				}
			}
		},
	},
	beforeDestroy() {
		window.document.title = INITIAL_TITLE;
		document.body.querySelector('.shareImg') && document.body.querySelector('.shareImg').remove();
		let headElmt = document.getElementsByTagName('head')[0];
		for (let i = 0; i < headElmt.getElementsByTagName('meta').length; i++) {
			let aMeta = headElmt.getElementsByTagName('meta')[i];
			if (aMeta.hasAttribute('property') || aMeta.getAttribute('name') === 'description' || aMeta.getAttribute('name') === 'image') {
				aMeta.remove();
			}
		};
	}
}