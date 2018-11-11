<template>
	<div class="page">
		<div class="page-content">
			<div class="no-content">
				<img style="margin:0 auto;width: 100px;height: auto;display: block" src="static/img/preload.png"> 
				<div>杏运树</div>
				<div><a @click="$redirect('/index/')" class="link">进入首页</a></div>
				<div class="col-25">
					<div class="preloader color-orange"></div>
				</div>
			</div>
		</div>

	</div>
</template>
<style scoped>

</style>

<script>
	export default {
		mounted() {
			var self = this;
			self.$redirect('/index/');
			
			setTimeout(function() {
//				self.$$('.preloader').hide();
//				this.$redirect('');
			}, 3000);
			
			window.onload = function() {
//				var _amap = new myAmap();
//				_amap.reqLocation();
//				_amap.regeocoder([x, y]);
			}
		},
		
		methods: {
		}
	}
</script>