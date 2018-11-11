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
					<a @click="$redirect('/article-list/?k=' + keyword)" class="col tab-link tab-link-active">好文</a>
					<a @click="$redirect('/store-list/?k=' + keyword)" class="col tab-link">好店</a>
					<a @click="$redirect('/collection-list/?k=' + keyword)" class="col tab-link">牛研所</a>
					<a @click="$redirect('/circle-list/?k=' + keyword)" class="col tab-link">派友圈</a>
				</div>
				<div v-else class="segmented row hnp-tab">
					<a @click="$redirect('/index/')" class="col tab-link">趣看</a>
					<a @click="$redirect('/article-list/')" class="col tab-link tab-link-active">好文</a>
					<a @click="$redirect('/store-index/')" class="col tab-link">好店</a>
					<a @click="$redirect('/collection-list/')" class="col tab-link">牛研所</a>
					<a @click="$redirect('/circle-list/')" class="col  tab-link">派友圈</a>
				</div>
			</div>
		</div>

		<div class="page-content infinite-scroll-content" 
			 @infinite="loadMore">
			<div class="ptr-preloader">
				<div class="preloader"></div>
				<div class="ptr-arrow"></div>
			</div>

			<div v-if="!articleList.length" class="no-content">
				暂无内容
			</div>
			<div class="list media-list">
				<ul>
					<li v-for="item in articleList">
						<a @click="$redirect('/article-detail/id/' + item.article_id + '/')" class="item-content">
							<div class="item-inner">
								<div class="item-title-row">
									<div class="item-title">{{item.article_title}}</div>
								</div>
								<div class="item-text">{{item.article_abstract}}</div>

								<div class="item-row">
									<div v-for="img in item.main_imgs" class="item-cell">
										<img v-lazy="$resizeImg(img,460,288)"  />
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
			
			<div class="preloader infinite-scroll-preloader"></div>
			<div class="bottom-tip infinite-scroll-preloader font-gray-extra" style="display:none;">机智如你，我就是杏运树来的卧底<hr></div>
		</div>
	</div>

</template>
<style scoped>
	.item-cell img {
		/*height: 20vw;*/
		width:100%;
		background-size: cover;
		background-position: center;
		color: #fff;
	}
	.item-before {
		font-size: 0.6rem;
	}
</style>
<script>
	import wap from '../js/wap.js';
	export default {
		data() {
			return {
				allowInfinite: true,
				lastPage: 1,
				articleList: [],
				keyword: '',
				channel:0,
			}
		},
		created() {
			if('undefined' === typeof(this.$route.query.k)) {
				this.keyword = '';
				document.title = '好文';
			} else {
				this.keyword = decodeURI(this.$route.query.k);
				document.title = '搜索-好文';
			}
			
			this.channel = this.$route.query.channel || 0;
			
			wap.setAppf7(this.$f7);
		},
		mounted() {
			var app = this.setF7();
			this.loadList(1);
			this.$initGotop();
		},
		
		methods: {
			//搜索
			doSearch: function(e) {
				//关闭键盘
				document.activeElement.blur();
				var _key = this.$$('.searchbar-input-wrap input').val();
				if(!_key) {
//					this.$toast('请输入搜索关键词', 2000, 'bottom', true);
				}

				this.keyword = _key;
				this.reloadContent();
//				this.$redirect(`/article-list/?k=${_key}`);
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
				
		        self.articleList = [];
				self.lastPage = 1;
				self.loadList(self.lastPage);
				
				setTimeout(function () {
				  self.$f7.ptr.done();
				  self.$toast('数据已重新加载', 2000, 'center', true, true);
				  
				  if (self.$$('.bottom-tip').css('display') == 'block') {
				  	  self.$f7.infiniteScroll.create('.infinite-scroll-content');
				  }
		        }, 500);
			},
			//ajax加载列表
			loadList: function(page) {
				var self = this;
				var data = {
					keyword : this.keyword,
					cur_page: page,
					page_size: 10,
					channel_id: this.channel
				}
				
//				this.$store.dispatch('getArticleList', {
//			        data: data,
//			        callback: (res) => {
//			        	if(res.status == 'success') {
//							if (page >= res.data.countPage) {
//								self.$f7.infiniteScroll.destroy('.infinite-scroll-content');
//								self.$$('.preloader').remove();
//								if (self.lastPage > 1) {
//									self.$$('.bottom-tip').show();
//								}
//								
//								self.lastPage = 10000;
//							}
//							
//							for(var i = 0; i < res.data.datalist.length; i++) {
//								self.articleList.push(res.data.datalist[i]);
//							}
//							
//						}
//			        }
//			     });
				wap.getajax('api/user/cmsarticle/searchList', data, function(res) {

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
							self.articleList.push(res.data.datalist[i]);
						}
						
					}
					
				}, 'v1', true, 600);
				self.lastPage += 1;
				return;
			},

		},
		
		//用state记录离开页面时的滚动位置
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