<template>
	<div class="page">
		<div class="page-content hide-navbar-on-scroll hide-toolbar-on-scroll">
			<div class="head-img" style="z-index: 9999;position: relative;">
				<img :src="store.store_banner"  style="border-radius: 0;width:100%;max-height: 160vw;"  />

				<div class="float-icon-nav">
					<div class="float-icon-left">
						<a @click="$router.back()">
							<i class="icon icon-back color-white"></i>
						</a>
					</div>
					<div class="float-icon-right">
						<i v-if="!mutStoreData.liked" @click="$likeItem('store', storeID, 'like')" 
							class="icon fa fa-heart-o" style="margin: 0 10px;">
				    	</i>
				    	<i v-else @click="$likeItem('store', storeID, 'unlike')" 
				    		class="icon fa fa-heart color-yellow" style="margin: 0 10px;">
				    	</i>
						<a href="#"><i class="icon material-icons color-white">share</i></a>
					</div>
				</div>

				<div class="float-store-intro">
					<div class="float-info1">
					<div class="float-info1-left row">
						<div class="col">
							<div class="first-line">{{store.store_taste_score}}</div>
							<div>口味</div>
						</div>
						<div class="col">
							<div class="first-line">{{distance|distance}}km</div>
							<div>距离</div>
						</div>
						<div v-if="store.average_price" class="col">
							<div class="first-line">￥{{store.average_price}}</div>
							<div>人均</div>
						</div>
						<div v-else class="col">
							&nbsp;
						</div>
					</div>
					<div v-if="store.store_recommend" class="float-info1-right">
						<img src="../../static/img/recomend.png" />
					</div>
					</div>
					
					<div class="float-info2">
						<div class="title nowrap">{{store.store_name}}</div>
						<div class="subtitle">{{store.store_jingle}}</div>
						<div class="subtitle">
							{{store.biz_district_name}}
							| {{store.sc_name}}
						</div>
					</div>
				</div>
			</div>

			<article>
			<!--正文内容请放在article标签中, 此标签内所有链接都会被过滤-->
				<h2 v-if="storyArticle.article_id || relateArticles.length">餐厅故事 </h2>
				<div v-if="storyArticle.article_id" style="overflow: hidden;">					
					<div v-html="storyArticle.article_abstract"></div>
					<div class="float-right clear-both">
						<a @click="$redirect('/article-detail/id/' + storyArticle.article_id + '/')">查看全部</a>
					</div>
				</div>
				<div class="br"></div>
				<h2 v-if="store.store_intro && !storyArticle.article_id">餐厅介绍</h2>
				<div v-if="store.store_intro && !storyArticle.article_id">					
					{{store.store_intro}}
				</div>
				
				<div v-if="relateArticles.length" class="relate-articles bg-color-white-smoke">
					<div style="margin-left:15px;font-weight: 600;padding: 15px 0 0 0;"><i class="icon f7-icons color-red" style="font-size: 18px;">document_text</i> 相关热文</div>
					<div class="list media-list">
						<ul class="bg-color-white-smoke">
						<!-- Slider container -->
						<div id="article_swiper" data-pagination='{"el": ".swiper-pagination"}' data-parallax="true" data-speed="600" 
							class="swiper-container" style="padding: 0 0 0.6rem 0;">
							<div class="swiper-pagination"></div>
						    <!-- Slides wrapper -->
						    <div class="swiper-wrapper">
						        <div v-for="item in relateArticles" class="swiper-slide">
									<li @click="$redirect('/article-detail/id/' + item.article_id + '/')">
										<a href="#" class="item-content">
											<div class="item-media">
												<img v-lazy="item.article_image" style="width: 21vw;"  />
											</div>
											<div class="item-inner">
												<div class="item-title-row">
													<div class="item-title" style="font-size:14px;line-height:1.2;max-height: 15vw;white-space: inherit">
														{{item.article_title}}
													</div>
												</div>
												<div class="item-text" style="font-size:14px;">杏运树 推荐</div>
											</div>
										</a>
									</li>
						        </div>
						       
						    </div>
						</div>
						</ul>
					</div>
					
				</div>
			</article>
			
			<article v-if="dishes.length" style="margin: 0 0 20px;">
				<div @click="openDishPhotoes()" class="relate-title">推荐菜品 
					<span><i class="icon f7-icons font-gray-extra" style="float: right;font-size: 20px;">right</i></span>
				</div>
				<div class="list media-list">
					<ul>
					<!-- Slider container -->
					<div id="dish_swiper" data-pagination='{"el": ".swiper-pagination"}' data-parallax="true" data-speed="600" 
						 data-space-between="0" data-slides-per-view="2" 
						class="swiper-container swiper-init" style="padding: 0 0 0.6rem 0;">
						<div class="swiper-pagination"></div>
					    <!-- Slides wrapper -->
					    <div class="swiper-wrapper">
					        <!-- Slides -->
					        <div v-for="(item,index) in dishes" class="swiper-slide">
									<a href="#" class="item-content">
										<div @click="openDishPhotoes(index)" class="cover-mask">
											<img style="width: 46vw; height: 28.75vw;" :src="item.dish_image">
											<div class="cover-text">
												<div class="text-color-white">{{item.dish_name}}</div>
											</div>
										</div>
									</a>
					        </div>
					         
					    </div>
					</div>
					</ul>
				</div>
			</article>
			
			<article>
				<h2>详细地址 </h2>
				<div @click="openLocation()" class="item-text location-info">
					<i class="icon material-icons color-gray">location_on</i>{{store.store_address}}
				</div>
				<h2>营业时间 </h2>
				<div class="item-text location-info">
					&nbsp;{{store.store_workingtime || '全天'}}
				</div>
				<h2>服务设施 </h2>
				<div class="item-text" style="margin: 8px 15px 25px;">
					<!--<div class="item" style="display:inline-block;width:2rem;height:2rem;text-align:center;margin:0 1rem 1rem 1rem;padding:0.2rem;border-radius: 50%;background-color: #EEEEEE;">
						<i class="icon material-icons color-gray">smoking_rooms</i>
					</div>
					<div class="item" style="display:inline-block;width:2rem;height:2rem;text-align:center;margin:0 1rem 1rem 1rem;padding:0.2rem;border-radius: 50%;background-color: #EEEEEE;">
						<i class="icon material-icons color-gray">usb</i>
					</div>-->
					<span v-if="store.svc && store.svc.svc_smoke_flag" class="badge color-green" style="font-size: 13px;">吸烟区</span>
					<span v-if="store.svc && store.svc.svc_box" class="badge color-green" style="font-size: 13px;">带包间</span>
					<span v-if="store.svc && store.svc.svc_parking" class="badge color-green" style="font-size: 13px;">可停车</span>
					<span class="badge color-green" style="font-size: 13px;">WIFI开放</span>
					
				</div>
				<hr>
			</article>
			
			<div v-if="goods.length" class="relate-title" @click="$gotoShop('faq_detail.html?id=22')">
				可抢的派 <span class="special text-color-red"> {{goods.length}}</span> 
				<span style="font-size: 12px;color:#7D7E80;">派是</span><i class="icon f7-icons text-color-orange" style="font-size: 14px;margin: 0 1rem 0 0.1rem;">help</i>
						
				<div  style="color:#7D7E80;font-size: 12px;float: right;clear: right;margin-top:0.3rem;max-width: 58%;overflow: hidden;white-space: nowrap;">
					<i class="icon f7-icons" style="font-size: 12px;margin: 0 0.1rem 0 0.5rem;">check_round</i>无使用限制
					<i class="icon f7-icons" style="font-size: 12px;margin: 0 0.1rem 0 0.5rem;">check_round</i>可退款
					
				</div>
			</div>
			<div v-if="goods.length" class="list media-list">
				<ul>
					<li v-for="item in goods">
						<a class="item-content">
							<div @click="$gotoShop('goods.html?id=' + item.goods_id)" class="item-media">
								<img v-lazy="store.store_logo" width="80"  />
							</div>
							<div class="item-inner">
								<div class="item-title-row">
									<div @click="$gotoShop('goods.html?id=' + item.goods_id)" class="item-title">
										{{item.goods_name}}
									</div>
									<div class="item-after">
										<i v-if="!getMutGoods(item.goods_id).liked" @click="$likeItem('goods', item.goods_id, 'like')" 
											class="icon fa fa-heart-o" style="font-size: 18px;">
								    	</i>
								    	<i v-else @click="$likeItem('goods', item.goods_id, 'unlike')" 
								    		class="icon fa fa-heart color-yellow" style="font-size: 18px;;">
								    	</i>
									</div>
								</div>
								
								<div @click="$gotoShop('goods.html?id=' + item.goods_id)">
									<div class="font-gray-extra" style="font-size: 12px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: block;">{{item.goods_subhead}}</div>
									<div class="item-row">
										<div class="item-text"><span class="text-color-red" style="margin-right: 1rem;">￥{{item.goods_price}}</span> 派价值 ￥{{item.goods_marketprice}}</div>
										<div class="item-after" style="margin-top:6px;"><span class="badge color-green" style="font-size: 12px;">{{item.discount|discount}}折</span></div>
									</div>
								</div>
								
							</div>
						</a>
					</li>
					
				</ul>
			</div>

		</div>

		<remote-js v-if="$isWx" @load="loadedWxJs()"  src="//res.wx.qq.com/open/js/jweixin-1.2.0.js"></remote-js>
	</div>

</template>
<style scoped>
	
	.float-bg-text-info {
		background: rgb(0, 0, 0);
	    -webkit-filter: blur(0px) opacity(0.65) brightness(1) grayscale(0.0) contrast(1);
	    overflow: hidden;
	    position: absolute;
	    bottom: 0;
	    width: 43vw;
	    /*height: 42vw;*/
	    color: #F5F5F5;
	    padding: 0.4vw 0vw;
	    text-align: center;
	}

	.relate-articles {
		width: 100%;
	}
	
	
	.list .item-title-row {
		margin: 0;
	}
	
	.ios .page-content {
		background-color: #ffffff;
	}
	
	p {
		word-wrap: break-word;
		text-align: justify;
		margin: 0 0 10px;
		line-height: 1.7;
		padding: 0
	}
	
	article {
		overflow: hidden;
		font-size: 16px;
		word-wrap: break-word;
		text-align: justify;
		margin: 0 15px 20px;
		color: #505050;
		line-height: 1.647
	}
	
	article h1,
	h2,
	h3,
	h4 {
		position: relative;
		display: block;
		font-weight: 700;
		word-wrap: break-word;
		margin: 20px 0;
		padding-left: 9px;
		color: #333333;
		line-height: normal
	}
	
	article h1 {
		font-size: 1.1em;
	}
	
	article h2 {
		font-size: 1em;
	}
	
	article h3 {
		font-size: 1em;
		padding-left: 0;
		text-align: left;
	}
	
	article h4 {
		font-size: 1em;
		padding-left: 0;
		text-align: center;
	}
	
	article h5 {
		font-size: 0.9em;
		text-align: center;
	}
	
	article h1:before,
	article h2:before {
		content: '';
		position: absolute;
		width: 4px;
		height: 100%;
		top: 0;
		left: 0;
		background: #ff9500
	}
	
	.relate-title {
		position: relative;
		display: block;
		font-size: 1em;
		font-weight: 700;
		word-wrap: break-word;
		margin: 0px 15px 15px 15px;
		padding-left: 9px;
		color: #333333;
		line-height: normal;
	}
	
	.relate-title:before {
		content: '';
		position: absolute;
		width: 4px;
		height: 84%;
		top: 4px;
		left: 0;
		background: #ff3b30
	}
	
	.relate-title .special {
		font-size: 1.6em;
		font-weight: 700;
		word-wrap: break-word;
		color: #333333;
		line-height: normal;
	}
	
	.location-info {
		font-size: 14px!important;
		width: 86%;
		margin: 0 0 0 -4px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
<script>
	import wap from '../js/wap.js';
	import AMap from 'AMap'
	import myAmap from '../js/myAmap.js';
	import {mapState,mapGetters} from 'vuex'
	import '../js/wxShare.js'
	export default {
		data() {
			return {
				wxJSLoaded: 0,
				storeID: 0,
				store: [],
				goods: [],
				storyArticle: [],
				relateArticles: [],
				dishes: [],
				pb: null,
				hasFav: false,
				distance: 0,
			}
		},
		created() {
			var self = this;
			document.title = '店铺详情';
			wap.setAppf7(this.$f7);
			var self = this;
			self.storeID = self.$route.params.id;
		},
		mounted() {
			var app = this.setF7();
			var self = this;	
			
			self.$f7.preloader.show();
			setTimeout(function() {
				self.$f7.preloader.hide();
			}, 1000);
			
			//店铺详情数据
			self.setStoreData();
			
			//相关文章列表(注意，swiper的内容填充，要放在mounted里)
			var data = {
				store_id: self.storeID,
				cur_page: 1,
				page_size: 8,
				commend: 1,
			};
			wap.getajax('api/user/cmsarticle/searchList', data, function(res) {
				if(res.status == 'success') {
					self.relateArticles = res.data.datalist;
					console.log(res.data.datalist)
					
					self.$nextTick(function() {
						var swiper = self.$f7.swiper.create('#article_swiper', {
						    freeMode: false,
						    parallax: true,
						    pagination: {
							    el: '.swiper-pagination',
							  },
						});
					});
				}
			}, 'v1', true, 7200);
			
			//菜品列表(注意，swiper的内容填充，要放在mounted里)
			var data = {
				store_id: self.storeID,
				cur_page: 1,
				page_size: 8,
			};
			wap.getajax('api/user/storedish/searchList', data, function(res) {
				if(res.status == 'success') {
					self.dishes = res.data.datalist;
					
					//菜品轮播
					self.$nextTick(function() {
						var swiper = self.$f7.swiper.create('#dish_swiper', {
						    freeMode: false,
						    parallax: true,
						    spaceBetween: 0,
						    slidesPerView: 2,
						    speed: 600,
						    pagination: {
							    el: '.swiper-pagination',
							  },
						});
					});
					
					//菜品图片查看器
					var photos = [];
					for (var i in self.dishes) {
						photos.push({
							url: self.dishes[i].dish_image,
							caption: self.dishes[i].dish_name,
						});
					}
					self.pb = self.$createPhotoBrowser(photos);
				}
			}, 'v1', true, 7200);
			
//			wap.loadJS('//webapi.amap.com/maps?v=1.4.1&key=dd53407385733abecffce9ccf677b75b', _=> {
//				self.initMap();	
//			});
			this.initMap();
			
			this.$initGotop();
		},
		methods: {
			loadedWxJs() {
				var self = this;
				self.wxJSLoaded = 1;
				if (self.wxJSLoaded && self.store) {
					self.initShareWx();
				}
			},
			
			initShareWx() {
				var self = this;
				//微信分享，分享数据要在异步获取文章详情后初始化
				if(this.$isWx) {
					setTimeout(_ => {
						this.$wap.setWxConfig();
						//分享对象使用
						var shareData = {
							title: self.store.store_name,
							desc: self.store.store_jingle,
							link: window.location.href,
							imgUrl: self.store.store_logo,
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
					}, 200);
				}

			},
			
			calcDistance: function() {
				var self = this;
				//获取定位
				var _loc = wap.getLocation() || '';
				if (_loc) {
					self.distance = self.$getDistance(_loc.lat, _loc.lng, self.store.store_latitude, self.store.store_longitude);
					return true;
				} else {
					return false;
				}
			},
			
			//坐标距离计算
			initMap: function() {
				var self = this;
				if (self.calcDistance()) {
					return ;
				}
				
				setTimeout(_ => {
					new myAmap().reqLocation(function(data) {
						console.log(data);
						var _lng = data.position.getLng();
						var _lat = data.position.getLat();
						
						wap.setLocation(_lng, _lat, 300);	//5分钟过期
						
						if ('undefined' !== typeof(self.store.store_latitude)) {
							self.distance = self.$getDistance(_lat, _lng, self.store.store_latitude, self.store.store_longitude);
						}
	
					}, function(data) {
						//定位失败
	//					alert(JSON.stringify(data));
					});
					
				}, 400);
				
				
			},
			
			setStoreData() {
				var self = this;	
				//店铺详情
				let data = {
					store_id: self.storeID,
					member_id: self.$getMemberID()
				};
				wap.getajax('api/user/store/detail', data, function(res) {
					if(res.status == 'success') {
						self.store = res.data;
						self.goods = self.store.goods;
						
						//餐厅故事详情
						wap.getajax('api/user/cmsarticle/detail?article_id=' + self.store.story_article_id, {}, function(res) {
							if(res.status == 'success') {
								self.storyArticle = res.data;
							}
						}, 'v1', true, 7200);
						
						if (!self.distance) {
							self.calcDistance();
						}
						if (self.wxJSLoaded) {
							self.initShareWx();
						}
						
					}
					self.$f7.preloader.hide();
				}, 'v1', true, 3600);
				
				//变化数据
				let mutStore = self.getMutStore(self.storeID, 0);
				if (undefined != mutStore) {
					return;
				}
				//如果不存在，则重新获取变化数据
				this.$store.dispatch('getStoreMut', {
			        data: data,
			        callback: (res) => {}
			     });
				
			},
			//打开店铺地图定位
			openLocation() {
				var params = 'store_longitude=' + this.store.store_longitude + '&store_latitude=' + this.store.store_latitude;
				this.$gotoShop("shopmap.html?" + params);
				return;
			},
			
			openDishPhotoes(index) {
				this.pb.open(index);
			},
			sendFeedback() {
				this.$f7.alert(this.text)
			}
		},
		computed: {
		    ...mapState([
		      'mutArticlesState',
		    ]),
		    ...mapGetters({
		      getMutGoods: 'getMutGoods',
		      getMutStore: 'getMutStore',
		    }),
		    mutStoreData() {
		    	return this.getMutStore(this.storeID);
		    }
		  },
		  
		components: {
		}

	}
</script>