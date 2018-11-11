<template>
	<div class="page page-with-subnavbar">
		<!-- Views/Tabs container -->
		<div class="navbar color-theme-gray">
			<div class="navbar-inner sliding">
				<div v-if="!$isWx" class="left">
					<a href="#" class="link back">
						<i class="icon icon-back"></i>
					</a>
				</div>
				<form data-search-container=".search-list" data-search-in=".item-title" class="searchbar searchbar-init">
					<div class="searchbar-inner">
						<div class="searchbar-input-wrap">
							<input type="search" placeholder="搜索" :value="keyword"/>
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
				<!-- Subnavbar content, for example tabs buttons -->
				<div class="segmented row hnp-tab">
					<a @click="$redirect('/index/')" class="col tab-link">趣看</a>
					<a @click="$redirect('/article-list/')" class="col tab-link">好文</a>
					<a @click="$redirect('/store-index/')" class="col tab-link tab-link-active">好店</a>
					<a @click="$redirect('/collection-list/')" class="col tab-link">牛研所</a>
					<a @click="$redirect('/circle-list/')" class="col  tab-link">派友圈</a>
				</div>
			</div>
		</div>

		<div class="page-content infinite-scroll-content" style="background-color: #ffffff;" @infinite="loadMore">
			 
			<div v-if="nearbyList.length" @click="$redirect('/store-list/?distanceSort=1')" class="hnp-title" style="font-size: 18px;padding: 1rem 1.5rem;line-height: 1;">
				<i class="icon material-icons color-red" style="font-size: 20px;">location_on</i> 附近
				<span class="font-gray-extra" style="float: right;font-size: 14px;margin-top:0.4rem;font-weight: 500;">查看全部 
					<i class="icon f7-icons" style="margin-left: 0.2rem;font-size: 18px;">right</i>
				</span>
			</div>
			
			<div v-if="nearbyList.length" class="list media-list" style="margin: 0 1rem;">
				<ul>
					<div data-effect="" data-pagination='{"el": ".swiper-pagination", "type": "progressbar"}' data-slides-per-view="2" data-space-between="5" data-centered-slides="" 
						class="swiper-container">
						<div class="swiper-pagination" style="position:static;margin: 0 0 0.3rem 0;height: 2px;"></div>
						<!-- Slides wrapper -->
						<div class="swiper-wrapper">
							<!-- Slides -->
							<li class="swiper-slide" v-for="item in nearbyList">
								<div @click="$redirect('/store-detail/id/' + item.store_id + '/')" class="item-inner">
									<div class="item-row">
										<div class="item-cell col">
											<img v-lazy="$resizeImg(item.store_banner,200, 100)" style="width: 100%;height: 19vw;" />
										</div>
									</div>
									<div class="item-text" style="font-size: 12px;">{{item.store_jingle}}</div>
								</div>
							</li>
		
						</div>
					</div>
					
				</ul>
			</div>
			
			<hr>
			<div class="relate-title" style="font-size: 24px;margin: 1rem 1.5rem;">
					精选餐厅 
				</div>
			
			<div class="list media-list">
				<ul>
					<li v-for="item in storeList">
						<a @click="$redirect('/store-detail/id/' + item.store_id + '/')" href="#" class="item-content">
							<div class="item-inner">
								<div class="item-row">
									<div class="item-cell col">
										<img width="100%" v-lazy="$resizeImg(item.store_banner,460, 230)" class="" />
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
			
			<div class="preloader infinite-scroll-preloader"></div>
			<div class="bottom-tip infinite-scroll-preloader font-gray-extra" style="display:none;">机智如你，我就是杏运树来的卧底<hr></div>
		</div>

	</div>

</template>
<style scoped>
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
	
	.list .item-title-row {
		margin: 1rem 0 0.2rem 0;
	}
	
	.item-cell img {
		max-height: 45vw;
		background-size: cover;
		background-position: center;
		color: #fff;
	}
	
	.ios .list .item-after {
		padding-left: 5px;
		height: 16px;
		TOM TABLE-LIKE LAYOU font-size: 16px;
		line-height: 1.0;
	}
	
	.material-icons {
		font-size: 16px;
		width: 16px;
		height: 16px;
	}
	
	.ios .list .f7-icons {
		font-size: 16px;
		width: 16px;
		height: 16px;
	}
</style>
<script>
	import wap from '../js/wap.js';
	import AMap from 'AMap'
	import myAmap from '../js/myAmap.js';

	export default {
		data() {
			return {
				allowInfinite: true,
				lastPage: 1,
				storeList: [],
				nearbyList: [],
				keyword: '',
				loc: {
					lat: 114.40005,
					lng: 30.50069,
				},
			}
		},
		created() {
			this.title = '好店';
		},
		mounted() {
			var self = this;
			var app = this.setF7();
			
			//精选店铺列表
			self.loadList(1);
			this.initMap();
			
			this.$initGotop();
		},
		
		methods: {
			//坐标距离计算
			initMap: function() {
				var self = this;
				//获取定位
				var _loc = wap.getLocation() || '';
				if (_loc) {
					self.loc = _loc;
					//附近店铺列表
					self.loadNearby();
					return;
				}
				
				setTimeout(_ => {
					new myAmap().reqLocation(function(data) {
						console.log(data)
						var _lng = data.position.getLng();
						var _lat = data.position.getLat();
						
						wap.setLocation(_lng, _lat, 300);	//5分钟过期
						self.loc = {
							lat: _lat,
							lng: _lng,
						};
						//附近店铺列表
						self.loadNearby();
					}, function(data) {
						//定位失败
	//					alert(JSON.stringify(data));
						self.loadNearby();
					});
				}, 300);	
			},
			
			doSearch: function(e) {
				//关闭键盘
				document.activeElement.blur();
				var _key = this.$$('.searchbar-input-wrap input').val();
				if(!_key) {
					this.$toast('请输入搜索关键词', 2000, 'center', true, false);
					return;
				}

				this.$redirect('/store-list/?k=' + _key)
			},
			//上拉加载更多
			loadMore: function() {
				console.log(this.lastPage)
				var self = this;
				
				if(!self.allowInfinite) return;
				//最多50页请求
				if(self.lastPage >= 50) {
					return;
				}
				
				self.allowInfinite = false;
				self.loadList(self.lastPage);
				self.allowInfinite = true;
			},
			
			//下拉刷新
			reloadContent: function(e) {
				var self = this;
				setTimeout(function () {
		          self.storeList = [];
				  self.lastPage = 1;
				  self.loadList(self.lastPage, 0);
				  
				  self.loadNearby(0);
				  
				  self.$f7.ptr.done();
		          self.$toast('数据已重新加载', 2000, 'center', true, true);
		        }, 500);
		        
			},
			
			//ajax加载附近列表
			loadNearby: function(cacheTime=7200) {
				cacheTime = arguments[0] ? arguments[0] : 0;
				
				var self = this;
				var data = {
					keyword : '',
					cur_page: 1,
					page_size: 12,
				}
				data.sort_field = 'distance';
				data.sort = 'asc';
				data.lat = self.loc.lat;
				data.lng = self.loc.lng;
				
				wap.getajax('api/user/store/searchRecordList', data, function(res) {
					if(res.status == 'success') {
						for(var i = 0; i < res.data.datalist.length; i++) {
							self.nearbyList.push(res.data.datalist[i]);
						}
					}
					
					self.$nextTick(function() {
						var swiper = self.$f7.swiper.create('.swiper-container', {
						    speed: 400,
						    spaceBetween: 100,
						    slidesPerView: 2,
						    spaceBetween: 5,
						    pagination: {
							    el: '.swiper-pagination',
							    type: 'progressbar',
							  },
						});
					});
				}, 'v1', true, cacheTime);
				return;
			},
			
			//ajax加载列表
			loadList: function(page, cacheTime=7200) {
				cacheTime = arguments[1] ? arguments[1] : 0;
				
				var self = this;
				var $ = self.$$;
				var data = {
					keyword : '',
					cur_page: page,
					page_size: 12,
				}
				wap.getajax('api/user/store/searchRecordList', data, function(res) {
					if(res.status == 'success') {
						if (page >= res.data.countPage) {
							self.$nextTick(function(){
								self.$f7.infiniteScroll.destroy('.infinite-scroll-content');
								self.$$('.infinite-scroll-preloader').remove();
							});
							if (self.lastPage > 1) {
								self.$$('.bottom-tip').show();
							}
							
							self.lastPage = 10000;
						}
						
						for(var i = 0; i < res.data.datalist.length; i++) {
							self.storeList.push(res.data.datalist[i]);
						}
					}
				}, 'v1', true, cacheTime);
				self.lastPage += 1;
				return;
			},

		},
		computed: {
		},
		beforeRouteEnter (to, from, next) {
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
	  
	    beforeRouteLeave (to, from, next) {
	    	let top = document.querySelector('.page-content') ? document.querySelector('.page-content').scrollTop : 0;
			console.log('leave detail:' + top)
			this.$store.commit('SET_SCROLL_TOP', {k: this.hashkey, v: top});
			next();
	    },
		components: {}

	}
</script>