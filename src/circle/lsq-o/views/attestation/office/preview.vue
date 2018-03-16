<template>
	<div class="lsq_main">
		<y-nav :title="$R('lawyer-preview')"></y-nav>
		<div class="lsq_user_info">
		<!-- <y-card v-if='headImg' :title="vm.data.lawFirmTitle" :src='headImg' img-size="large"></y-card> -->

		<div class="flow_item-body">
			<div class="flow_item-cover y_card-text">
				<img v-if='headImg' class="flow_item-thumb" :src="headImg | imageResize(1)" />
				<div class='flow_item-right' v-if='vm.data.lawFirmTitle'>
					<div class="flow_item-title" v-text="vm.data.lawFirmTitle"></div>
				</div>
			</div>
		</div>


		<div v-if='vm.data.lawFirmTel' class="lsq_user_info--con">
			<i class="iconfont icon-phone-b"></i>
			<span>{{$R('telephone')}} </span>
			<label>{{vm.data.lawFirmTel}}</label>
		</div>
		<div v-if='vm.data.lawFirmAddress' class="lsq_user_info--con">
			<i class="iconfont icon-addr"></i>
			<span>{{$R('area')}} </span>
			<label>{{vm.data.lawFirmAddress}}</label>
		</div>
		<div v-if='vm.data.lawFirmUrl' class="lsq_user_info--con">
			<i class="iconfont icon-website"></i>
			<span>{{$R('website')}} </span>
			<label>{{vm.data.lawFirmUrl}}</label>
		</div>
		</div>
		<y-panel :title="$R('intro')" icon="intr" v-if='vm.data.introduction'>
			<p v-text="vm.data.introduction"></p>
		</y-panel>
		<y-panel :title="$R('case-show')" icon="case" v-if='vm.data.caseShow'>
			<p v-text="vm.data.caseShow"></p>
		</y-panel>
		<y-panel :title="$R('recruitment-information')" icon="users-b" v-if='vm.data.recruitmentInformation'>
			<p v-text="vm.data.recruitmentInformation"></p>
		</y-panel>
	</div>
</template>

<script>
	import {YNav} from '@/components/nav';
	import YCard from '@/components/card';
	import YPanel from '@/components/panel';
	export default {
		components: {
			YNav,
			YCard,
			YPanel
		},
		data() {
			return {
				vm: {
					data: {}
				},
				headImg: '',
				assist: '',
				tags: []
			}
		},
		mounted() {
			this.vm = this.$localStore.get('petDeta');
			this.headImg = this.vm.data.lawFirmLogo;
		}
	}
</script>

<style>
@import '#/css/var.css';
.lsq_main {
	.y_avatar-img {
		border-radius: initial;
	}
	& .lsq_user_info {
		background-color: #fff;
		padding: .3rem .14rem 0;
		margin-bottom: .2rem;

		& .lsq_user_info--con {
			@apply --border-bottom;
			padding: .3rem 0;
			@apply --display-flex;

			&:last-child {
				border:none;
			}

			& span {
				color: var(--theme-color);
				font-size: 16px;
			}

			& .iconfont {
				color: var(--theme-color);
				margin-left: .15rem;
			}

			& label {
               flex: 1;
               text-align: right;
               margin-left: .2rem;
               padding-right: .16rem;
			}
		}
	}
}
</style>