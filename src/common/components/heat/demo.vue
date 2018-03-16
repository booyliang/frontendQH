<template>
	<div>
		<y-heat :heat="['comment', 'like']" :data="data"></y-heat>
		<y-heat :heat="['favorite', 'view']" :data="data"></y-heat>
	</div>
</template>

<script type="text/javascript">
	import Heat from './';

	export default {
		components: {
			[Heat.name]: Heat
		},

		data() {
			return {
				data: {
					"answerCount": 1,
					"authStatus": "测试内容7d8d",
					"commentCount": 1,
					"content": "",
					"contentSource": "",
					"createDate": "",
					"createUserId": "",
					"delFlag": 1,
					"favoriteCount": 1,
					"heat": 1,
					"id": 1,
					"imgUrl": "",
					"lastUpdateDate": "",
					"lastUpdateUserId": "",
					"likeCount": 1,
					"moduleEnum": "",
					"myAnswerId": 1,
					"nickName": "",
					"recommend": 1,
					"shareCount": 1,
					"shelveFlag": 1,
					"targetId": "",
					"title": "",
					"type": 1,
					"userImg": "",
					"viewCount": 1
				}
			};
		}
	};
</script>