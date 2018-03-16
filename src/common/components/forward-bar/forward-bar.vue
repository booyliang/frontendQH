/**
*	Author: aiqingmin
*/
<template>
	<div class="forward-bar">
		<y-card :data="user" assist="打赏了">
			<div class="card-assist">{{ data.createTime | recentTime }}</div>
		</y-card>
		<div class="forward-bar-from">来自{{ data.circleName }}</div>
	</div>
</template>

<script type="text/javascript">
	import YCard from '@/components/card'
	export default {
		components: { YCard },
		name: 'y-forward-bar',

		props: {
			data: Object
		},

		data() {
			return {
				user: {
					name: this.data.user.custNname,
					avatar: this.data.user.custImg
				}
			};
		}
	};
</script>

<style type="text/css">
	@import '#/css/var.css';

	.forward-bar {
		@apply --layout;
		@apply --display-flex;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 100;
		justify-content: space-between;
		background: white;
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;

		& .card-name {
			color: #1bc2b8;

			&,
			& + .card-assist {
				display: inline-block;
			}
			& + .card-assist {
				color: var(--text-tips-color);
			}
		}
	}

	.forward-bar-from {
		font-size: 0.24rem;
		color: var(--text-assist-color);
	}
</style>
