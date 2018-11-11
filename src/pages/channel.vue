<template>
	<div class="page">
		<div v-if="!$isWx" class="navbar color-theme-gray no-hairline">
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
		
		<!-- Views/Tabs container -->
		<div class="page-content hide-navbar-on-scroll hide-toolbar-on-scroll" style="background-color: #ffffff;">
			<div v-if="channel" class="hnp-title" style="margin: 1.2rem 1.4rem 0;font-size: 26px;font-weight: 600;">
				<div style="margin:1.2rem 0 0.8rem;position: relative;">
					<img v-lazy="$resizeImg(channel.c_image, 120, 120)"  style="display:inline-block;width: 15vw;height: 15vw;border-radius: 10%;" />
					<span style="position:absolute; margin-left:1rem;top:2vw">{{channel.c_name}}</span>
				</div>
				<div class="font-gray-content" style="padding:0 0.4rem;font-size: 16px;">
					{{channel.c_desc}}
				</div>
			</div>

			<div class="index-cat">
				<div data-effect="" data-pagination='{"el": ".swiper-pagination", "type": "progressbar"}' data-slides-per-view="5" data-space-between="10" data-centered-slides="" 
						class="swiper-container swiper-init ">
						<div class="swiper-pagination" style="position:static;margin: 0 0 0.3rem 0;"></div>
						<div class="swiper-wrapper">
							<div class="swiper-slide" v-for="(item,i) in childChannes">
								<div @click="$redirect('/channel/id/' + item.c_id + '/')" class="item-content">
									<div class="cover-mask">
										<img :src="item.c_image">
										<div class="cover-text">
											<div class="text-color-white">{{item.c_name}}</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
			</div>

			<div class="br"></div>
				
			<!--派友圈精选-->
			<div class="br"></div>
			<div v-if="themeList0.length" @click="$redirect('/circle-list/?channel='+channelID)" class="relate-title">
				派友圈精选<span><i class="icon f7-icons font-gray-extra" style="float: right;font-size: 20px;">right</i></span>
			</div>
			
			<!-- 第一个派友圈 -->
			<div v-if="themeList0.length" class="circle-theme-content" style="margin: 0 1rem;">
				<div @click="$redirect('/circle-detail/id/' + circle0.circle_id + '/')" class="sub-title font-gray-content" style="margin: 0.5rem 0.5rem;font-size:15px;font-weight: 600;">
					<i class="icon material-icons text-color-green" style="font-size: 20px;">stars</i> 
					{{circle0.circle_name}}
				</div>

				
				<div id="themes_swiper0" data-loop="true" data-pagination='{"el": ".swiper-pagination", "type": "progressbar"}'
					data-space-between="10" data-slides-offset-after='30' data-slides-per-view="3" data-centered-slides="false" class="swiper-container swiper-init">
					<div class="swiper-pagination" style="position:static;margin: 0 0 0.3rem 0;height: 2px;"></div>	
					<div class="swiper-wrapper">
						<div class="swiper-slide item" v-for="(item,i) in themeList0" style="">
							<div  class="cover-mask">
								<img style="" :src="$resizeImg(item.main_imgs[0],160,160)" >
								<div @click="$redirect('/circletheme-detail/id/' + item.theme_id + '/')" class="cover-text" style="width: 35vw;height: 18vw;border-radius: 10%;">
									<div class="text-color-white" style="font-size:14px;margin-top: 6vw;padding: 0 0.5rem 0.2rem 0.5rem;font-weight: 500;-webkit-line-clamp: 2;word-break: break-all;overflow: hidden;text-overflow: ellipsis;display:-webkit-box;-webkit-box-orient: vertical;">
										{{item.theme_content}}
									</div>
								</div>
							</div>

							<div class="author-info">
								<img style="" :src="$avatar(item.member_id)" >
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
			
			<!-- 第二个派友圈 -->
			<div v-if="themeList1.length" class="circle-theme-content" style="margin: 0 1rem;">
				<div @click="$redirect('/circle-detail/id/' + circle1.circle_id + '/')" class="sub-title font-gray-content" style="margin: 0.5rem 0.5rem;font-size:15px;font-weight: 600;">
					<i class="icon material-icons text-color-green" style="font-size: 20px;">stars</i> 
					{{circle1.circle_name}}
				</div>

				<div id="themes_swiper1" data-loop="true" data-pagination='{"el": ".swiper-pagination", "type": "progressbar"}'
					data-space-between="10" data-slides-offset-after='30' data-slides-per-view="3" data-centered-slides="false" class="swiper-container swiper-init">
					<div class="swiper-pagination" style="position:static;margin: 0 0 0.3rem 0;height: 2px;"></div>	
					<div class="swiper-wrapper">
						<div class="swiper-slide item" v-for="(item,i) in themeList1" style="">
							<div class="cover-mask">
								<img style="" :src="$resizeImg(item.main_imgs[0],160,160)" >
								<div @click="$redirect('/circletheme-detail/id/' + item.theme_id + '/')"  class="cover-text" style="width: 35vw;height: 18vw;border-radius: 10%;">
									<div class="text-color-white" style="font-size:14px;margin-top: 6vw;padding: 0 0.5rem 0.2rem 0.5rem;font-weight: 500;-webkit-line-clamp: 2;word-break: break-all;overflow: hidden;text-overflow: ellipsis;display:-webkit-box;-webkit-box-orient: vertical;">
										{{item.theme_content}}
									</div>
								</div>
							</div>

							<div class="author-info">
								<img style="" :src="$avatar(item.member_id)" >
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
				<div class="br-l"></div>
				<hr>
			</div>
			
			<!--牛研所-->
			<div v-if="collectionList.length">
				<div class="br-l"></div>
				<div @click="$redirect('/collection-list/?channel='+channelID)" class="relate-title">
					牛研所推荐<span><i class="icon f7-icons font-gray-extra" style="float: right;font-size: 20px;">right</i></span>
				</div>
				<div class="list-content collection-content" style="margin: 0 1rem;">
					<div id="collection_div" data-pagination='{"el": ".swiper-pagination"}' data-effect="coverflow" 
						data-slides-per-view="auto" data-space-between="10" data-centered-slides="false" 
						class="swiper-container demo-swiper-multiple demo-swiper-multiple-auto list">
						<div class="swiper-pagination"></div>
						<div class="swiper-wrapper">
							<div @click="$redirect('/collection-detail/id/' + item.cl_id + '/')" class="swiper-slide" v-for="item in collectionList" style="width: 70%;">
								<div class="collection-opacity-black">
									<img v-lazy="$resizeImg(item.cl_image,460,287)"  style="max-height: 40vw;"/>
								</div>
								<a >
									<div class="collection-opacity-cat">{{item.cl_channel_name}}</div>
									<div class="collection-opacity-title">{{item.cl_name}}</div>
								</a>
								<div class="collection-opacity-subtitle">{{item.cl_like_count}}人正在研究</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			

			<div class="br-l"></div>
			<div class="relate-title">
					好文 
					<span @click="$redirect('/article-list/?channel='+channelID)">
						<i class="icon f7-icons font-gray-extra" style="float: right;font-size: 20px;">right</i>
					</span>
				</div>
			<div class="list media-list">
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
										<img :src="img"  />
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
			<div @click="$redirect('/article-list/?channel='+channelID)" class="font-gray-extra bg-color-white-smoke" style="margin:0 1rem;border-radius:15%;line-height:2.5;text-align: center;font-size: 16px;">
				更多好文 <i class="f7-icons" style="font-size: 18px;">arrow_right</i>
			</div>
		</div>
		
		<remote-js v-if="$isWx" @load="loadedWxJs()"  src="//res.wx.qq.com/open/js/jweixin-1.2.0.js"></remote-js>
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
		width: 10vw;
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
	
	.item-cell img {
		/*height: 15.5vw;*/
		width: 100%;
		background-size: cover;
		background-position: center;
		color: #fff;
	}
	
	.item-before {
		font-size: 0.6rem;
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
		padding: 5vw;
	}
	
	.index-cat .item-content {
		border-radius: 8%;
		float: left;
		width: 15.5vw;
		height: 15.5vw;
		display: inline-block;
		margin: 0;
		padding: 1vw 1vw 0 1vw;
	}
	
	.index-cat .cover-mask img {
		border-radius: 8%;
		width: 15.5vw;
		max-height: 15.5vw;
	}
	
	.index-cat .cover-mask .cover-text {
		border-radius: 8%;
		bottom: 0px;
		left: 0;
		width: 15.5vw;
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
	import wap from '../js/wap.js';
	import '../js/jquery-2.2.4.min.js'
	import '../js/wxShare.js'
	export default {
		data() {
			return {
				wxJSLoaded: 0,
				channelID: 0,
				channel: null,
				childChannes: [],
				goodsList: [],
				storeList: [],
				collectionList: [],
				
				circleList: [],
				circle0: [],
				circle1: [],
				themeList0: [],
				themeList1: [],
				
				articleList: [],
			}
		},
		
		created() {
			var self = this;
			document.title = '频道';
			self.channelID = self.$route.params.id;
			
		},
		
		mounted() {
			var self = this;
			var app = this.setF7();
			
			//获取频道详情
			self.channel = wap.getChannelInfo(self.channelID);
			if (!self.channel) {
				self.$toast('频道参数错误', 10000);
				return;
			}
			document.title = '频道-' + self.channel.c_name;
			
			self.wxJSLoaded && self.initShareWx();
			
			this.loadContent(3600);
			this.$initGotop();
		},
		methods: {
			//加载评论
			loadContent(expire) {
				var self = this;
				
				//下拉刷新忽略ajax加载部分
				if (expire > 0) {
					//子频道列表
					wap.getajax('api/user/channel/searchList?channel_id=' + self.channelID, {}, function(res) {
						if(res.status == 'success') {
							self.childChannes = res.data.datalist;
						}
					}, 'v1', false, expire);
				
					//圈子
					self.setCircleThemesData();
					//合集
					self.setCollectionData();
					
					//文章
					//文章。下拉刷新忽略ajax加载
					var data = {
						cur_page: 1,
						page_size: 10,
						channel_id: self.channelID,
					};
					wap.getajax('api/user/cmsarticle/searchList', data, function(res) {
						if(res.status == 'success') {
							self.articleList = res.data.datalist;
						}
//						self.$f7.lazy.create('.page-content');
						
					}, 'v1', true, expire);
				}
				
				return;
			},
			//加载微信js
			loadedWxJs() {
				var self = this;
				self.wxJSLoaded = 1;
				if (self.channel) {
					self.initShareWx();
				}
			},
			
			//初始化微信配置
			initShareWx() {
				var self = this;
				//微信分享，分享数据要在异步获取文章详情后初始化
				if(this.$isWx) {
					setTimeout(_ => {
						this.$wap.setWxConfig();
						//分享对象使用
						var shareData = {
							title: '杏运树趣看-' + self.channel.c_name,
							desc: self.channel.c_desc,
							link: window.location.href,
							imgUrl: $resizeImg(self.channel.c_image, 120, 120),
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
			
			
			//合集列表
			setCollectionData() {
				var self = this;
				
				let data = {
					cur_page: 1,
					page_size: 12,
					channel_id: self.channelID,
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
				let data = {
					cur_page: 1,
					page_size: 2,
					channel_id: self.channelID,
				};
				wap.getajax('api/user/circle/searchList', data, function(res) {
					if(res.status == 'success') {
						self.circleList = res.data.datalist;
						self.circle0 = self.circleList[0];
						self.circle1 = self.circleList[1];
						
						if (self.circleList[0]) {
							self.setThemelistData(0, self.circleList[0].circle_id);
						}
						if (self.circleList[1]) {
							self.setThemelistData(1, self.circleList[1].circle_id);
						}
					}
				}, 'v1', true, 3600);
					
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
					channel_id: self.channelID,
				};
				wap.getajax('api/user/circletheme/searchList', data, function(res) {
					if(res.status == 'success') {
						ret = res.data.datalist;
						if (_index == 0) {
							self.themeList0 = ret;
						} else if (_index == 1) {
							self.themeList1 = ret;
						}
					}
					
					self.$nextTick(function() {
						var swiper = self.$f7.swiper.create('#themes_swiper'+_index, {
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
		},
		computed: {
		},
		components: {}

	}
</script>