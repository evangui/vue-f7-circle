<template>
	<div class="page">
		<div class="page-content">
			<div class="no-content">
				<img style="margin:30px auto;width: 100px;height: auto;display: block" src="static/img/preload.png"> 
				<div class="br"></div>
				<div class="br"></div>
				<div class="br"></div>
				<div>亲，你可能迷路了！</div>
				<div class="br"></div><div class="br"></div>
				<a @click="$gotoShop('user_feedback.html')"><span style="font-size: 16px;font-weight: 500;">问题反馈</span></a>
			</div>
			
		</div>
		
		<div class="toolbar tabbar tabbar-labels toolbar-bottom-md color-theme-yellow">
			<div class="toolbar-inner">
				<a @click="$redirect('/index/')" class="tab-link">
					<!-- Different icons for iOS and MD themes -->
					<i class="icon material-icons">home</i>
					<!-- Label text -->
					<span class="tabbar-label">首页</span>
				</a>
				<a @click="$redirect('/attention/')" class="tab-link">
					<i class="icon material-icons">visibility</i>
					<span class="tabbar-label">发现</span>
				</a>
				<a @click="$gotoShop('')" class="tab-link">
					<i class="icon material-icons">shop</i>
					<span class="tabbar-label">商城</span>
				</a>
				<a @click="$redirect('/mine/')" class="tab-link">
					<i class="icon f7-icons">person_fill</i>
					<span class="tabbar-label">我的</span>
				</a>
			</div>
		</div>

		<!--<remote-js src="//webapi.amap.com/maps?v=1.4.1&key=dd53407385733abecffce9ccf677b75b"></remote-js>-->
	</div>
</template>
<style scoped>

</style>

<script>
	export default {
		mounted() {
//			this.$redirect('/index/');
			
			setTimeout(function() {
//				self.$$('.preloader').hide();
//				this.$redirect('');
			}, 3000);
			
		},
		
		methods: {
		}
	}
</script>