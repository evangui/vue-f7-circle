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
				<div v-if="keyword" class="segmented row hnp-tab">
					<a @click="$redirect('/index/')" class="col tab-link">趣看</a>
					<a @click="$redirect('/article-list/?k=' + keyword)" class="col tab-link">好文</a>
					<a @click="$redirect('/store-list/?k=' + keyword)" class="col tab-link tab-link-active">好店</a>
					<a @click="$redirect('/collection-list/?k=' + keyword)" class="col tab-link">牛研所</a>
					<a @click="$redirect('/circle-list/?k=' + keyword)" class="col tab-link">派友圈</a>
				</div>
				<div v-else class="segmented row hnp-tab">
					<a @click="$redirect('/index/')" class="col tab-link">趣看</a>
					<a @click="$redirect('/article-list/')" class="col tab-link">好文</a>
					<a @click="$redirect('/store-index/')" class="col tab-link  tab-link-active">好店</a>
					<a @click="$redirect('/collection-list/')" class="col tab-link">牛研所</a>
					<a @click="$redirect('/circle-list/')" class="col  tab-link">派友圈</a>
				</div>
			</div>
		</div>

		<div class="page-content infinite-scroll-content" 
			 @infinite="loadMore">
			<div v-if="!storeList.length" class="no-content">
				暂无内容
			</div>
			<div class="list media-list">
				<ul>
					<li v-for="item in storeList">
						<a @click="$redirect('/store-detail/id/' + item.store_id + '/')" href="#" class="item-content">
							<div class="item-inner">
								<div class="item-row">
									<div class="item-cell col">
										<img width="100%" v-lazy="$resizeImg(item.store_banner,460, 230)"  />
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
	  height:16px;TOM TABLE-LIKE LAYOU
	  font-size: 16px;
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
				keyword: '',
				distanceSort: 0,
				loc: {
					lat: 114.40005,
					lng: 30.50069,
				},
			}
		},
		created() {
			if('undefined' === typeof(this.$route.query.k)) {
				this.keyword = '';
				this.title = '派友圈';
			} else {
				this.keyword = decodeURI(this.$route.query.k);
				this.title = '搜索-派友圈';
			}
			//附近店铺
			if('undefined' !== typeof(this.$route.query.distanceSort)) {
				this.distanceSort = parseInt(this.$route.query.distanceSort)
			}
		},
		mounted() {
			
			var app = this.setF7();
			if (this.distanceSort) {
				this.initMap();
			} 
			this.storeList = [];
			this.loadList(1);
			
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
					self.loadList(1);
					return;
				}
				
				setTimeout(_ => {
					new myAmap().reqLocation(function(data) {
						var _lng = data.position.getLng();
						var _lat = data.position.getLat();
						
						wap.setLocation(_lng, _lat, 300);	//5分钟过期
						self.loc = {
							lat: _lat,
							lng: _lng,
						};
						self.storeList = [];
						self.loadList(1);
						
					}, function(data) {
	//					alert(JSON.stringify(data));
					});
				}, 300);	
			},
			
			doSearch: function(e) {
				//关闭键盘
				document.activeElement.blur();
				var _key = this.$$('.searchbar-input-wrap input').val();
				if(!_key) {
//					this.$toast('请输入搜索关键词', 2000, 'bottom', true);
				}

				this.keyword = _key;
				this.reloadContent();
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
				  self.loadList(this.lastPage);
				  
				  self.$f7.ptr.done();
		          self.$toast('数据已重新加载', 2000, 'center', true, true);
		        }, 500);
			},
			//ajax加载列表
			loadList: function(page) {
				var self = this;
				var data = {
					keyword : this.keyword,
					cur_page: page,
					page_size: 12,
				}
				//附近店铺参数处理
				if (self.distanceSort) {
					data.sort_field = 'distance';
					data.sort = 'asc';
					data.lat = self.loc.lat;
					data.lng = self.loc.lng;
				}
				wap.getajax('api/user/store/searchRecordList', data, function(res) {

					if(res.status == 'success') {
						if (page >= res.data.countPage) {
							self.$f7.infiniteScroll.destroy('.infinite-scroll-content');
							self.$$('.preloader').remove();
							if (self.lastPage > 1) {
								self.$$('.bottom-tip').show();
							}
							
							self.lastPage = 10000;
						}
						
						for(var i = 0; i < res.data.datalist.length; i++) {
							self.storeList.push(res.data.datalist[i]);
						}
					}
				}, 'v1', true, 7200);
				self.lastPage += 1;
				return;
			},

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
	    
		computed: {
		},
		components: {}

	}
</script>