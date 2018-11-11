<template>
	<div class="page">
		<div v-if="!isWx" class="navbar color-theme-gray no-hairline">
			<div class="navbar-inner sliding" style="margin:0.3rem 1rem">
				<div class="left">
					<a href="#" class="link back">
						<i class="icon icon-back"></i>
					</a>
				</div>
				<div class="right">
				</div>
			</div>
		</div>

		<div class="page-content hide-navbar-on-scroll hide-toolbar-on-scroll">
			<div style="background-color: #ffffff;">
				<div class="hnp-title" style="padding: 0.4rem 0.4rem 0;font-size: 26px;font-weight: 600;">
					<div style="height: 12vw;margin:1.2rem 0 0;position: relative;">
						<span style="position:absolute; margin-left:1rem;top:2vw">关注</span>
					</div>
				</div>
				<div class="row hnp-tab" style="width: 90vw;margin:1vw 5vw">
					<a @click="$redirect('/my/fav-store/')" class="col tab-link tab-link-active">派友圈</a>
					<a @click="$redirect('/my/fav-store/')" class="col tab-link tab-link-active">我关注的人</a>
					<a @click="$redirect('/my/fav-store/')" class="col tab-link tab-link-active">关注者</a>
				</div>
			</div>
			
				
			<div v-for="item in articleList">
				<div class="card">
					<div class="card-content card-content-padding">
						<div class="circle-subtitle">512人正在关注</div>
						<a @click="$redirect('/circle-detail/id/1/')"><div class="circle-title hnp-title">先跑为敬，干了这杯还有下杯</div></a>
						<div class="circle-extra">来自
							<a href="#" class="text-color-green">一人食</a>
						</div>
						<div class="circle-avatar">
							<img data-src="http://img.taopic.com/uploads/allimg/140720/240470-140H00GK190.jpg" class="lazy lazy-fade-in"/>
						</div>
					</div>
				</div>
			</div>
		</div>
		
	</div>

</template>
<style scoped>
	.card .card-header {
		display: block;
		padding: 10px;
	}
	
	.circle-avatar {
		position: absolute;
		top: 1.0rem;
		right: 1.0rem;
		width: 4rem;
		height: 4rem;
	}
	
	.circle-avatar img {
		border-radius: 50%;
		width: 100%;
		height: 100%;
	}
	
	.circle-subtitle {
		margin: 0 4rem 0.2rem 0.2rem;
		font-size: 12px;
		font-weight: 500;
		color: #8e8e93;
	}
	
	.circle-title {
		margin: 0.2rem 4rem 0.2rem 0.2rem;
		font-size: 16px;
		font-weight: 600;
	}
	
	.circle-extra {
		margin: 0.8rem 6rem 0 0.2rem;
		font-size: 14px;
		color: #8e8e93;
	}
</style>
<script>
	import wap from '../../js/wap.js';
	export default {
		data() {
			return {
				articleList: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
				keyword: '',
			}
		},
		mounted() {
			var app = this.setF7();
			console.log(this.$f7);
			console.log(this.$f7.view.current.params);
			document.title = '我的收藏';
		},
		methods: {
			editorTextChange(text) {
				this.text = text
			},
			sendFeedback() {
				this.$f7.alert(this.text)
			}
		},
		computed: {
			isWx() {
				return wap.isWeiXin();
			}
		},
		components: {}

	}
</script>