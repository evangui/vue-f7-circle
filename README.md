# vue-f7-circle说明

> vue-f7-circle是一套基于framework7（http://framework7.io/） + Vue全家桶（Vue2.x + Vue-router2.x + Vuex）的用于实际项目的圈子社交系统。

本项目最初是用framework7自整理的Framework7 Vue项目框架http://framework7.io/vue/ 开发，后来发现返回页面时，容易出现页面被挡住的现象，对照官方文档研究两天无法解决。后转为基于vue，将framework7的核心方法与对象作为vue的全局方法与对象，界面交互api与界面样式，还是用的framework7的，体验效果还不错。

[项目演示地址 http://m.cattlepie.com/v2/](http://m.cattlepie.com/v2/)

项目代码所含功能板块为：
1. 圈子，帖子
2. 合集（店铺+文章+圈子组合）
3. 文章
4. 店铺

本项目依赖服务端接口，服务端接口项目后续将整理上传

## main.js
```
    //vue-lazyload
    import VueLazyload from 'vue-lazyload';
    Vue.use(VueLazyload, {
    	  preLoad: 1.3,
    	  error: 'static/img/preload.png',
    	  loading: 'static/img/preload.png',
    	  attempt: 2
    });
    
    //引入vue基础框架
    import base from './js/base.js';
    import config from './js/config.js';
    import wap from './js/wap.js';
    Vue.use(base, config, wap);
    
    //引入f7基础框架
    //import Framework7 from 'framework7/dist/framework7.esm.bundle.js';
    import Framework7 from 'framework7';
    import Swiper from 'framework7/dist/components/swiper/swiper.js';
    import Popup from 'framework7/dist/components/popup/popup.js';
    import Popover from 'framework7/dist/components/popover/popover.js';
    import Preloader from 'framework7/dist/components/preloader/preloader.js';
    import PullToRefresh from 'framework7/dist/components/pull-to-refresh/pull-to-refresh.js';
    import Toast from 'framework7/dist/components/toast/toast.js';
    import PhotoBrowser from 'framework7/dist/components/photo-browser/photo-browser.js';
    import Dialog from 'framework7/dist/components/dialog/dialog.js';
    import Sheet from 'framework7/dist/components/sheet/sheet.js';
    import InfiniteScroll from 'framework7/dist/components/infinite-scroll/infinite-scroll.js';
    
    Framework7.use([Swiper,Popup,Popover,Preloader,PullToRefresh,Toast,PhotoBrowser,Dialog,Sheet,InfiniteScroll]);
    
    import F7Base from './js/f7-base.js'
    Vue.use(F7Base, Framework7);
    
    
    var _hmt = window._hmt || []
    
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
    	store,
      router,
      components: { App },
      template: '<App/>'
    })
```
## f7全局对象与方法注册
```
/**
 * 注册vue的framework7基础全局变量与全局方法
 * 
 * @param {Object} Vue
 * @param {Object} Framework7
 * @param {Object} options
 */
exports.install = function(Vue, Framework7, options) {
	Vue.prototype.$f7 = {};
	Vue.prototype.$$ = {};
	
	/**
	 * 实例化f7对象，模仿f7做一些基本的初始化动作
	 */
	Vue.prototype.setF7 = function() {
		var self = this;
		var app = new Framework7({
			theme: 'ios', // Automatic theme detection
			lazy: {
				threshold: 0,
				sequential: false,
				//laceholder: 'http://m.cattlepie.com/img/login/login_icon.png',
				placeholder: 'static/img/preload.png',
			},
			dialog: {
				// set default title for all dialog shortcuts
				title: '杏运树',
				// change default "OK" button text
				buttonOk: '确定',
				buttonCancel: '取消',
			},
		});
//		app.router.off('touchstart');
		
		this.$f7 = app;
		this.$$ = app.$;
//		console.log(app)
		
		//自动初始化
		if (this.$$('.infinite-scroll-content').length > 0) {
			app.infiniteScroll.create('.infinite-scroll-content');
		}
		if (this.$$('.ptr-content').length > 0) {
			this.$f7.ptr = app.ptr.create('.ptr-content');
		}
		if (this.$$('.link.back').length > 0) {
			this.$$('.link.back').each(function() {
				self.$$(this).on('click', function(e) {
					self.$router.goBack()
//					self.$router.go(-1);
				});
			});
		}
		
		return app;
	};
	
	/**
	 * 基于f7的滚动到顶部
	 * @param {Object} position
	 * @param {Object} duration
	 * @param {Object} callback
	 */
	Vue.prototype.$scrollTop = function(position, duration, callback) {
		return this.$$('.page-content').scrollTop(position, duration, callback);
	},
	
	/**
	 * 基于f7的滚动到固定选择器
	 * @param {Object} selector
	 * @param {Object} speed
	 */
	Vue.prototype.$goAnchor = function(selector, speed) {
		speed = speed || 300;
		let offsetY = this.$$(selector).offset().top + this.$$('.page-content').scrollTop();
		this.$scrollTop(offsetY, speed);
    }
}
```
## 截图演示
![Image text](https://raw.githubusercontent.com/evangui/vue-f7-circle/master/screenshots/index.png)
![](https://raw.githubusercontent.com/evangui/vue-f7-circle/master/screenshots/circlelist.png)
![](https://raw.githubusercontent.com/evangui/vue-f7-circle/master/screenshots/circledetail.png)
![](https://raw.githubusercontent.com/evangui/vue-f7-circle/master/screenshots/circledetail2.png)
![](https://raw.githubusercontent.com/evangui/vue-f7-circle/master/screenshots/circledetail3.png)
![](https://raw.githubusercontent.com/evangui/vue-f7-circle/master/screenshots/articledetail.png)
![](https://raw.githubusercontent.com/evangui/vue-f7-circle/master/screenshots/articledetail2.png)
![](https://raw.githubusercontent.com/evangui/vue-f7-circle/master/screenshots/articledetail3.png)
![](https://raw.githubusercontent.com/evangui/vue-f7-circle/master/screenshots/articlelist.png)
![](https://raw.githubusercontent.com/evangui/vue-f7-circle/master/screenshots/collectiondetail.png)
![](https://raw.githubusercontent.com/evangui/vue-f7-circle/master/screenshots/collectiondetail11.png)
![](https://raw.githubusercontent.com/evangui/vue-f7-circle/master/screenshots/collectiondetail12.png)
![](https://raw.githubusercontent.com/evangui/vue-f7-circle/master/screenshots/post.png)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```


