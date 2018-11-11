<template>
	<div class="page">
		<!-- Views/Tabs container -->
		<div class="navbar color-theme-gray">
			<div class="navbar-inner sliding">
				<form data-search-container=".search-list" data-search-in=".item-title" class="searchbar searchbar-init">
					<div class="searchbar-inner">
						<div class="searchbar-input-wrap">
							<input type="search" placeholder="搜索" />
							<i class="searchbar-icon"></i>
						</div>
						<div @click="doSearch"><i class="f7-icons">search_strong</i></div>
					</div>
				</form>
			</div>
		</div>

		<!-- Subnavbar -->
		<div class="subnavbar no-hairline">
			<div class="subnavbar-inner">
				<div class="segmented row hnp-tab">
					<a @click="$redirect('/index/')" class="col tab-link tab-link-active">精选</a>
					<a @click="$redirect('/article-list/')" class="col tab-link">好文</a>
					<a @click="$redirect('/store-index/')" class="col tab-link">好店</a>
					<a @click="$redirect('/collection-list/')" class="col tab-link">牛研所</a>
					<a @click="$redirect('/circle-list/')" class="col tab-link">派友圈</a>
				</div>
			</div>
		</div>
		<div class="toolbar tabbar tabbar-labels toolbar-bottom-md">
			<div class="toolbar-inner">
				<a href="#tab-1" class="tab-link tab-link-active">
					<!-- Different icons for iOS and MD themes -->
					<i class="icon material-icons">pets</i>
					<!-- Label text -->
					<span class="tabbar-label">趣看</span>
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

		<div class="page-content ptr-content" @ptr:refresh="reloadContent(0)" style="padding-top: 88px;background-color: #ffffff;">
			<div class="ptr-preloader">
				<div class="preloader"></div>
				<div class="ptr-arrow"></div>
			</div>

			<div id='carouselAdsDiv' data-autoplay='true' data-loop="true" data-parallax="true" data-speed="600" data-slides-per-view="1" class="swiper-container">
				<div class="swiper-pagination"></div>
				<!-- Slides wrapper -->
				<div class="swiper-wrapper">
					<!-- Slides -->
					<div v-for="item in carouselAds" class="swiper-slide">
						<a @click="$redirect($getRedirectUrl(item.adv_pic_url, item.adv_url_type))" class="item-content">
							<div class="cover-mask">
								<img :src="$resizeImg(item.adv_pic, 460, 230)">
								<div class="cover-text">
									<div class="text-color-white">{{item.adv_title}}</div>
								</div>
							</div>
						</a>
					</div>
				</div>
			</div>
			<div class="index-cat">

				<a v-for="(item,index) in channnelAds" v-if="index < 5" @click="$redirect($getRedirectUrl(item.adv_pic_url, item.adv_url_type))" class="item-content">
					<div class="cover-mask">
						<img v-lazy="$resizeImg(item.adv_pic, 80, 80)">
						<div class="cover-text">
							<div class="text-color-white" style="font-weight: 600;">{{item.adv_title}}</div>
						</div>
					</div>
				</a>

				<!--<a id="more-cat-btn" href="#" class="item-content" @click="$('#more-cat').fadeIn(500);$('#more-cat-btn').fadeOut(0)">
					<div class="cover-mask">
						<img src="http://m.cattlepie.com/img/index/8.png"  />
						<div class="cover-text">
							<div class="text-color-white">更多频道</div>
						</div>
					</div>
				</a>-->

				<div id="more-cat" class="lazy-loaded lazy-fade-in" style="display: none;">
					<a v-for="(item,index) in channnelAds" v-if="index > 3" @click="$redirect($getRedirectUrl(item.adv_pic_url, item.adv_url_type))" class="item-content">
						<div class="cover-mask">
							<img v-lazy="$resizeImg(item.adv_pic, 80, 80)">
							<div class="cover-text">
								<div class="text-color-white">{{item.adv_title}}</div>
							</div>
						</div>
					</a>

					<a href="#" class="item-content" @click="$('#more-cat').fadeOut(500);$('#more-cat-btn').fadeIn(500)">
						<div class="cover-mask">
							<img src="/static/img/preload.png" />
							<div class="cover-text">
								<div class="text-color-white">
									<<</div>
								</div>
							</div>
					</a>
					</div>
				</div>
				<hr>
				<div class="br"></div>

				<!--今日好派-->
				<div class="relate-title" @click="$gotoShop('faq_detail.html?id=22')">
					<div style="display: inline-block;">
						今日好派 <span class="special text-color-red"> {{goodsList.length}}</span>
						<span style="font-size: 12px;color:#7D7E80;">派是</span>
						<i class="icon f7-icons text-color-orange" style="font-size: 14px;margin: 0 1rem 0 0.1rem;">help</i>
					</div>
					<div style="color:#7D7E80;font-size: 12px;float: right;clear: right;margin-top:0.9rem;max-width: 58%;overflow: hidden;white-space: nowrap;">
						<i class="icon f7-icons" style="font-size: 12px;margin: 0 0.1rem 0 0.5rem;">check_round</i>无使用限制
						<i class="icon f7-icons" style="font-size: 12px;margin: 0 0.1rem 0 0.5rem;">check_round</i>可退款
					</div>
				</div>
				<div id="goodsDiv" class="list media-list">
					<ul>
						<li v-for="item in goodsList">
							<a @click="$gotoShop('goods.html?id=' + item.goods.goods_id)" class="item-content">
								<div class="item-media"><img v-lazy="$resizeImg(item.store_logo, 80, 80)" width="80" /></div>
								<div class="item-inner">
									<div class="item-title-row">
										<div class="item-title">{{item.store_name}}</div>
									</div>
									<div class="font-gray-extra" style="font-size: 12px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: block;">{{item.store_jingle}}</div>
									<div class="item-row">
										<div class="item-text"><span class="text-color-red" style="margin-right: 1rem;">￥{{item.goods.goods_price}}</span> 派价值 ￥{{item.goods.goods_marketprice}}</div>
										<div class="item-after" style="margin-top:6px;"><span class="badge color-green" style="font-size: 12px;">{{item.goods.discount|discount}}折</span></div>
									</div>
								</div>
							</a>
						</li>

					</ul>
				</div>
				<div @click="$gotoShop()" class="font-gray-extra bg-color-white-smoke" style="margin:0 1rem;border-radius:15%;line-height:2.5;text-align: center;font-size: 16px;">
					更多好派 <i class="f7-icons" style="font-size: 18px;">arrow_right</i>
				</div>
				<!--今日好派 end-->

				<!--派友圈精选-->
				<div class="br-l"></div>
				<div @click="$redirect('/circle-list/')" v-if="circleList.length" class="relate-title">
					派友圈精选<span><i class="icon f7-icons font-gray-extra" style="float: right;font-size: 20px;">right</i></span>
				</div>

				<!-- 第一个派友圈 -->
				<div class="circle-theme-content" style="margin: 0 1rem;">
					<div @click="$redirect('/circle-detail/id/' + circle0.circle_id + '/')" class="sub-title font-gray-content" style="margin: 0.5rem 0.5rem;font-size:15px;font-weight: 600;">
						<i class="icon material-icons text-color-green" style="font-size: 20px;">stars</i> {{circle0.circle_name}}
					</div>

					<div id="themes_swiper0" data-loop="true" data-pagination='{"el": ".swiper-pagination", "type": "progressbar"}' data-space-between="10" data-slides-offset-after='30' data-slides-per-view="3" data-centered-slides="false" class="swiper-container swiper-init">
						<div class="swiper-pagination" style="position:static;margin: 0 0 0.3rem 0;height: 2px;"></div>
						<div class="swiper-wrapper">
							<div class="swiper-slide item" v-for="(item,i) in themeList0" style="">
								<div class="cover-mask">
									<img style="" :src="$resizeImg(item.main_imgs[0],160,160)">
									<div @click="$redirect('/circletheme-detail/id/' + item.theme_id + '/')" class="cover-text" style="width: 35vw;height: 18vw;border-radius: 10%;">
										<div class="text-color-white" style="font-size:14px;margin-top: 6vw;padding: 0 0.5rem 0.2rem 0.5rem;font-weight: 500;-webkit-line-clamp: 2;word-break: break-all;overflow: hidden;text-overflow: ellipsis;display:-webkit-box;-webkit-box-orient: vertical;">
											{{item.theme_content}}
										</div>
									</div>
								</div>

								<div class="author-info">
									<img style="" :src="$avatar(item.member_id)">
									<div class="name font-gray-extra">
										<font>{{item.member_name}}</font>
									</div>
								</div>
							</div>
							<!--<div class="swiper-slide more">
								<div @click="$redirect('/circle-detail/id/' + item.circle_id + '/')" class="bg-color-white-smoke more-info" style="">
									<i class="f7-icons text-color-orange" style="margin: 19vw 4vw;">right</i>
								</div>
							</div>-->
						</div>
					</div>
					<div v-if="circle0.collection_id" @click="$redirect('/collection-detail/id/' + circle0.collection_id + '/')" style="margin: 0.5rem 1.2rem;">
						<span class="badge color-green from">来自 {{circle0.collection_name}}</span>
					</div>
					<div class="br"></div>
					<hr>
				</div>
				<div class="br"></div>
				<!-- 第二个派友圈 -->
				<div class="circle-theme-content" style="margin: 0 1rem;">
					<div @click="$redirect('/circle-detail/id/' + circle1.circle_id + '/')" class="sub-title font-gray-content" style="margin: 0.5rem 0.5rem;font-size:15px;font-weight: 600;">
						<i class="icon material-icons text-color-green" style="font-size: 20px;">stars</i> {{circle1.circle_name}}
					</div>

					<div id="themes_swiper1" data-loop="true" data-pagination='{"el": ".swiper-pagination", "type": "progressbar"}' data-space-between="10" data-slides-offset-after='30' data-slides-per-view="3" data-centered-slides="false" class="swiper-container swiper-init">
						<div class="swiper-pagination" style="position:static;margin: 0 0 0.3rem 0;height: 2px;"></div>
						<div class="swiper-wrapper">
							<div class="swiper-slide item" v-for="(item,i) in themeList1" style="">
								<div class="cover-mask">
									<img style="" :src="$resizeImg(item.main_imgs[0],160,160)">
									<div @click="$redirect('/circletheme-detail/id/' + item.theme_id + '/')" class="cover-text" style="width: 35vw;height: 18vw;border-radius: 10%;">
										<div class="text-color-white" style="font-size:14px;margin-top: 6vw;padding: 0 0.5rem 0.2rem 0.5rem;font-weight: 500;-webkit-line-clamp: 2;word-break: break-all;overflow: hidden;text-overflow: ellipsis;display:-webkit-box;-webkit-box-orient: vertical;">
											{{item.theme_content}}
										</div>
									</div>
								</div>

								<div class="author-info">
									<img style="" :src="$avatar(item.member_id)">
									<div class="name font-gray-extra">
										<font>{{item.member_name}}</font>
									</div>
								</div>
							</div>
							<!--<div class="swiper-slide more">
								<div @click="$redirect('/circle-detail/id/' + item.circle_id + '/')" class="bg-color-white-smoke more-info" style="">
									<i class="f7-icons text-color-orange" style="margin: 19vw 4vw;">right</i>
								</div>
							</div>-->
						</div>
					</div>
					<div v-if="circle1.collection_id" @click="$redirect('/collection-detail/id/' + circle1.collection_id + '/')" style="margin: 0.5rem 1.2rem;">
						<span class="badge color-green from">来自 {{circle1.collection_name}}</span>
					</div>
					<div class="br"></div>
					<hr>
				</div>

				<!--牛研所-->
				<div class="br-l"></div>
				<div @click="$redirect('/collection-list/')" class="relate-title">
					牛研所推荐<span><i class="icon f7-icons font-gray-extra" style="float: right;font-size: 20px;">right</i></span>
				</div>
				<div class="list-content collection-content" style="margin: 0 1rem;">
					<div id="collection_div" data-pagination='{"el": ".swiper-pagination"}' data-effect="coverflow" data-slides-per-view="auto" data-space-between="10" data-centered-slides="false" class="swiper-container demo-swiper-multiple demo-swiper-multiple-auto list">
						<div class="swiper-pagination"></div>
						<div class="swiper-wrapper">
							<div @click="$redirect('/collection-detail/id/' + item.cl_id + '/')" class="swiper-slide" v-for="item in collectionList" style="width: 70%;">
								<div class="collection-opacity-black">
									<img v-lazy="$resizeImg(item.cl_image,460,287)" style="max-height: 40vw;" />
								</div>
								<a>
									<div class="collection-opacity-cat">{{item.cl_channel_name}}</div>
									<div class="collection-opacity-title">{{item.cl_name}}</div>
								</a>
								<div class="collection-opacity-subtitle">{{item.cl_like_count}}人正在研究</div>
							</div>
						</div>
					</div>
				</div>
				<div class="br-l"></div>

				<!--好店-->
				<div @click="$redirect('/store-index/')" class="relate-title">
					好店
					<span>
						<i class="icon f7-icons font-gray-extra" style="float: right;font-size: 20px;">right</i>
					</span>
				</div>
				<div id="storesDiv" class="list media-list" style="margin: 0 1rem;">
					<ul>
						<li v-for="item in storeList">
							<a @click="$redirect('/store-detail/id/' + item.store_id + '/')" class="item-content">
								<div class="item-inner">
									<div class="item-row">
										<div class="item-cell col">
											<img style="width: 84vw;height: 24vw;" v-lazy="$resizeImg(item.store_banner, 460,160)" />
										</div>
									</div>
									<div class="item-title-row">
										<div class="item-title">{{item.store_jingle}}</div>
										<div class="item-after"><i class="icon material-icons color-orange">location_on</i>{{item.biz_district_name}}</div>
									</div>
									<div class="item-text">{{item.store_name}}</div>
								</div>
							</a>
						</li>
					</ul>
				</div>
				<div @click="$redirect('/store-index/')" class="font-gray-extra bg-color-white-smoke" style="margin:0 1rem;border-radius:15%;line-height:2.5;text-align: center;font-size: 16px;">
					更多好店 <i class="f7-icons" style="font-size: 18px;">arrow_right</i>
				</div>
				<div class="br-l"></div>

				<!--好文-->
				<div class="relate-title">
					好文
					<span @click="$redirect('/article-list/')">
						<i class="icon f7-icons font-gray-extra" style="float: right;font-size: 20px;">right</i>
					</span>
				</div>
				<div id="articlesDiv" class="list media-list">
					<ul>
						<li v-for="(item,i) in articleList">
							<a @click="$redirect('/article-detail/id/' + item.article_id + '/')" class="item-content">
								<div class="item-inner">
									<div class="item-title-row">
										<div class="item-title">{{item.article_title}}</div>
									</div>
									<div class="item-text">{{item.article_abstract}}</div>

									<div class="item-row">
										<div v-if="item.main_imgs" v-for="img in item.main_imgs" class="item-cell">
											<img v-lazy="$resizeImg(img,460,288)" />
										</div>
									</div>
									<div class="item-title-row">
										<div class="item-before text-color-gray">杏运树 推荐 | {{item.article_click}}阅读</div>
									</div>
								</div>
							</a>
						</li>
					</ul>
				</div>
				<div @click="$redirect('/article-list/')" class="font-gray-extra bg-color-white-smoke" style="margin:0 1rem;border-radius:15%;line-height:2.5;text-align: center;font-size: 16px;">
					更多好文 <i class="f7-icons" style="font-size: 18px;">arrow_right</i>
				</div>
			</div>

			<remote-js v-if="$isWx" @load="initShareWx()" src="//res.wx.qq.com/open/js/jweixin-1.2.0.js"></remote-js>
		</div>

</template>
<style scoped>
	/* Swipers Demo */
	
	.circle-theme-content {}
	
	.circle-theme-content .item {
		position: relative;
		padding: 0.5rem 1rem;
		width: 35vw;
	}
	
	.circle-theme-content .item .cover-mask img {
		width: 35vw;
		height: 35vw;
		border-radius: 10%;
	}
	
	.circle-theme-content .item .author-info {
		margin: 0.6rem 0 0 0;
		height: 30px;
		position: relative;
	}
	
	.circle-theme-content .item .author-info img {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		display: inline-block;
	}
	
	.circle-theme-content .item .author-info .name {
		position: absolute;
		top: 7px;
		left: 40px;
		width: 70%;
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.circle-theme-content .more {
		position: relative;
		padding: 0.5rem 1rem;
	}
	
	.circle-theme-content .more .more-info {
		width: 100vw;
		height: 44vw;
		border-radius: 10%;
		margin-left: -3px;
	}
	
	.circle-theme-content .from {
		line-height: 22px;
		font-weight: 600;
		font-size: 12px;
		padding: 2px 12px;
		height: 26px;
		max-width: 150px;
	}
	
	.relate-title {
		position: relative;
		display: block;
		font-size: 1.4em;
		font-weight: 700;
		word-wrap: break-word;
		margin: 0px 15px 15px 15px;
		padding-left: 9px;
		color: #333;
		line-height: normal;
	}
	
	.relate-title:before {
		content: '';
		position: absolute;
		width: 4px;
		height: 84%;
		top: 4px;
		left: 0;
		background: #ff9500
	}
	
	.relate-title .special {
		font-size: 1.6em;
		font-weight: 700;
		word-wrap: break-word;
		color: #222;
		line-height: normal;
	}
	
	.cover-mask img {
		border-radius: 0;
		width: 100vw;
		height: 50vw;
	}
	
	.cover-mask .cover-text {
		border-radius: 0;
		bottom: 0px;
		left: 0;
		height: 14vw;
		text-align: center;
		line-height: 1.6;
		width: 100%;
		/*height: 100%;*/
		background-image: linear-gradient(rgba(33, 33, 33, 0), rgba(33, 33, 33, 0.8));
	}
	
	.cover-mask .cover-text .text-color-white {
		margin-top: 2vw;
		font-size: 16px;
		font-weight: 600;
	}
	
	.index-cat {
		overflow: hidden;
		padding: 2vw;
	}
	
	.index-cat .item-content {
		border-radius: 8%;
		float: left;
		width: 17.6%;
		height: 17.6%;
		display: inline-block;
		margin: 0;
		padding: 1vw 1vw 0 1vw;
	}
	
	.index-cat .cover-mask img {
		border-radius: 8%;
		width: 100%;
		max-height: 16vw;
	}
	
	.index-cat .cover-mask .cover-text {
		border-radius: 8%;
		bottom: 0px;
		left: 0;
		width: 100%;
		height: 100%;
		text-align: center;
		line-height: 1.2;
		/*height: 100%;*/
		background-image: linear-gradient(rgba(0, 0, 0, 0.44), rgba(12, 11, 11, 0.25));
	}
	
	.index-cat .cover-mask .cover-text .text-color-white {
		font-size: 16px;
		font-weight: 500;
		padding: 20%;
		margin-top: 10%;
	}
</style>

<script>
	import wap from '../js/wap.js'
	import '../js/jquery-2.2.4.min.js'
	import '../js/wxShare.js'
	//	import Swiper from 'swiper';

	export default {
		data() {
			return {
				carouselAds: [],	//滚动图
				channnelAds: [],	//频道
				goodsList: [],		//商品列表
				storeList: [],		//店铺列表
				collectionList: [],	//合集列表

				circleList: [],		//圈子列表
				circle0: [],
				circle1: [],
				themeList0: [],
				themeList1: [],

				articleList: [],	//文章列表
			}
		},
		created() {
			this.$ = $;
			var app = this.setF7();

			document.title = '杏运树-趣看精选';
			wap.setAppf7(this.$f7);

			var self = this;
		},

		mounted() {
			var self = this;
			self.$f7.preloader.show();
			setTimeout(_ => {
				self.$f7.preloader.hide();
			}, 500);

			this.loadContent(3600);

			this.$initGotop();
		},
		methods: {
			//刷新页面数据
			reloadContent(expire) {
				var self = this;
				setTimeout(_ => {
					self.loadContent(expire);
					self.$f7.ptr.done();
				}, 100);
			},

			//加载所有页面数据
			loadContent(expire) {
				var self = this;

				//下拉刷新忽略ajax加载部分
				if(expire > 0) {
					//频道
					wap.getajax('api/user/adv/advlist?ap_name=v2index_catnav_pics', {}, function(res) {
						if(res.status == 'success') {
							self.channnelAds = res.data;
						}
					}, 'v1', true, expire);

					//派推荐
					wap.getajax('api/user/store/recommend?cur_page=1&page_size=2', {}, function(res) {
						if(res.status == 'success') {
							self.goodsList = res.data.datalist;
						}
					}, 'v1', true, expire);

					//圈子
					self.setCircleThemesData();
					//轮播图
					self.setCarouselData();
					//合集
					self.setCollectionData();

					//店铺
					wap.getajax('api/user/store/searchRecordList?cur_page=1&page_size=2', {}, function(res) {
						if(res.status == 'success') {
							self.storeList = res.data.datalist;
						}
						//						self.$f7.lazy.create('.page-content');

					}, 'v1', true, expire);

					//文章
					wap.getajax('api/user/cmsarticle/searchList?cur_page=1&page_size=10', {}, function(res) {
						if(res.status == 'success') {
							self.articleList = res.data.datalist;
						}
						//						self.$f7.lazy.create('.page-content');

					}, 'v1', true, expire);
				}

				return;
			},

			//初始化微信分享等配置
			initShareWx() {
				var self = this;
				//微信分享
				if(this.$isWx) {
					setTimeout(_ => {
						wap.setWxConfig();
						//分享对象使用
						var shareData = {
							title: '杏运树__一个好玩、好吃、好实惠的平台',
							desc: '让美食与运动成为一种健康习惯，让吃货用更佳的方式享悦生活！',
							link: window.location.href,
							imgUrl: '//m.cattlepie.com/img/login/logo.png',
							success: function() {
								self.$toast("分享成功", 2000, 'center', true, true);
							},
							//用户取消
							cancel: function() {
								self.$toast('分享取消');
							}
						}
						var share = new wxShare(shareData);
						share.bind();
					}, 500);
				}
			},

			//顶部轮播图
			setCarouselData() {
				var self = this;
				wap.getajax('api/user/adv/advlist?ap_name=v2index_top_catnav_carousel', {}, function(res) {
					if(res.status == 'success') {
						self.carouselAds = res.data;
					}

					self.$nextTick(_ => {
						var swiper = self.$f7.swiper.create('#carouselAdsDiv', {
							speed: 600,
							//						    effect: 'fade',
							parallax: true,
							autoplay: true,
							loop: true,
							loadPrevNext: true,
							pagination: {
								el: '.swiper-pagination',
							},
						});

						//						self.$f7.lazy.create('.page-content');
					});

					self.$f7.preloader.hide();
				}, 'v1', true, 3600);
			},

			//合集列表
			setCollectionData() {
				var self = this;

				let data = {
					cur_page: 1,
					page_size: 12,
				};
				wap.getajax('api/user/collection/searchList', data, function(res) {
					if(res.status == 'success') {
						self.collectionList = res.data.datalist;
					}

					self.$nextTick(function() {
						var swiper = self.$f7.swiper.create('#collection_div', {
							freeMode: false,
							effect: 'coverflow',
							slidesPerView: 'auto',
							spaceBetween: 10,
							//						    centeredSlides: true,
							pagination: {
								el: '.swiper-pagination',
							},
						});

						//						self.$f7.lazy.create('.page-content');
					});
				}, 'v1', true, 3600);
			},

			//圈子帖
			setCircleThemesData() {
				var self = this;
				wap.getajax('api/user/circle/searchList?cur_page=1&page_size=2', {}, function(res) {
					if(res.status == 'success') {
						self.circleList = res.data.datalist;
						self.circle0 = self.circleList[0];
						self.circle1 = self.circleList[1];

						self.setThemelistData(0, self.circleList[0].circle_id);
						self.setThemelistData(1, self.circleList[1].circle_id);

						for(var i = 0; i < self.circleList.length; i++) {
							//							self.circleList[i]['themelist'] = self.getThemelistByCircleID(self.circleList[i].circle_id);
						}
					}
				}, 'v1', true, 3600);

			},

			//根据圈子ID获取帖子列表
			getThemelistByCircleID(circleID) {
				//				circleID = 1;
				var ret = [];
				var data = {
					circle_id: circleID,
					cur_page: 1,
					page_size: 20,
					commend: 1,
				};
				wap.getajax('/api/user/circletheme/searchList', data, function(res) {
					if(res.status == 'success') {
						ret = res.data.datalist;
					} else {
						ret = [];
					}
				}, 'v1', false, 1800);
				return ret;
			},

			//根据圈子ID获取帖子列表
			setThemelistData(_index, circleID) {
				var self = this;

				var ret = [];
				var data = {
					circle_id: circleID,
					cur_page: 1,
					page_size: 12,
					commend: 1,
				};
				wap.getajax('api/user/circletheme/searchList', data, function(res) {
					if(res.status == 'success') {
						ret = res.data.datalist;

						if(_index == 0) {
							self.themeList0 = ret;
						} else if(_index == 1) {
							self.themeList1 = ret;
						}

						//						self.circleList[_index]['themelist'] = res.data.datalist;
						//						console.log(self.circleList)
					}

					self.$nextTick(_ => {
						var swiper = self.$f7.swiper.create('#themes_swiper' + _index, {
							speed: 600,
							//						    effect: 'fade',
							loop: true,
							freeMode: false,
							spaceBetween: 10,
							slidesPerView: 3,
							slidesOffsetAfter: 30,
							centeredSlides: false,
							pagination: {
								el: '.swiper-pagination',
								type: 'progressbar'
							},
						});
					});

				}, 'v1', true, 1800);

				return ret;
			},

			doSearch: function(e) {
				//关闭键盘
				document.activeElement.blur();
				var _key = this.$$('.searchbar-input-wrap input').val();
				if(!_key) {
					this.$toast('请输入搜索关键词', 2000, 'center', true, false);
					return;
				}

				this.$redirect('/article-list/?k=' + _key)
			},
		},

		//根据state记录的原页面离开位置，自动滚动
		beforeRouteEnter(to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			next(vm => {
				vm.hashkey = location.hash;

				let position = vm.$store.state.position[vm.hashkey] //返回页面取出来
				setTimeout(_ => {
					console.log('enter detail:' + position)
					vm.$$('.page-content').scrollTop(position, 200);
				}, 1);
			})
		},

		//用state记录离开页面时的滚动位置
		beforeRouteLeave(to, from, next) {
			let top = document.querySelector('.page-content') ? document.querySelector('.page-content').scrollTop : 0;
			console.log('leave detail:' + top)
			this.$store.commit('SET_SCROLL_TOP', {
				k: this.hashkey,
				v: top
			});
			next();
		},
		components: {}

	}
</script>