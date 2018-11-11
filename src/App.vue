<template>
	<div id="app" class="color-theme-orange  framework7-root">
		<div class="popover popover-menu">
		    <div class="popover-angle"></div>
		    <div class="popover-inner">
		      <div class="list">
		        <ul>
		          <li><a @click="$redirect('/index/')" class="list-button item-link popover-close">
		          	<i class="icon material-icons text-color-orange" style="font-size: 22px;width:22px;">pets</i> 
		          	首页</a></li>
		          <li><a @click="$redirect('/collection-list/')" class="list-button item-link popover-close">
		          	<i class="icon material-icons text-color-orange" style="font-size: 22px;width:22px;">center_focus_strong</i>
		          	牛研所</a></li>
		          <li><a @click="$redirect('/circle-list/')" class="list-button item-link popover-close">
		          	<i class="icon material-icons text-color-orange" style="font-size: 22px;width:22px;">person_pin_circle</i>
		          	派友圈
		          </a></li>
		          <li><a @click="$gotoShop('')" class="list-button item-link popover-close">
		          	<i class="icon material-icons text-color-orange" style="font-size: 19px;width:22px;">shop</i>
		          	商城
		          </a></li>
		          <li><a @click="$redirect('/mine/')" href="/list/" class="list-button item-link popover-close">
		          	<i class="icon f7-icons text-color-orange" style="font-size: 18px;width:22px;">person_fill</i>
		          	我的
		          </a></li>
		        </ul>
		      </div>
		    </div>
		  </div>
		  
		<transition name="slide-right">
			<router-view class="child-view view view-main ios-edges"></router-view>
		</transition>
	</div>
</template>

<script>
	export default {
		name: 'App'
	}
</script>

<style>
	.child-view {
    position: absolute;
    transition: all .4s cubic-bezier(.55,0,.1,1);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    will-change: transform;
  }
  .slide-left-enter, .slide-right-leave-active {
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
    z-index: 1;
  }
  .slide-left-leave-active, .slide-right-enter {
    -webkit-transform: translateX(-50px);
    transform: translateX(-50px);
  }
</style>