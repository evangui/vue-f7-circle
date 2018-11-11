// Ponyfill
//import 'es6-object-assign/auto'
//import 'es6-promise/auto'
import 'babel-polyfill';// 或者require('babel-polyfill');

// Import F7 Styles
import Framework7Styles from 'framework7/dist/css/framework7.ios.min.css';

// Import Icons and App Custom Styles
import './css/font-awesome.min.css';
import IconsStyles from './css/icons.css';
//import AliIconsStyles from 'at.alicdn.com/t/font_551867_u8ixrzn4edji3sor.css';
import AppStyles from './css/app.css';

import Vue from 'vue'
import App from './App'
import router from './router'

// Import Vuex store
import store from './store'

Vue.config.productionTip = false

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
