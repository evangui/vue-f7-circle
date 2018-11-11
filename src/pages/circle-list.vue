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
					<a @click="$redirect('/store-list/?k=' + keyword)" class="col tab-link">好店</a>
					<a @click="$redirect('/collection-list/?k=' + keyword)" class="col tab-link">牛研所</a>
					<a @click="$redirect('/circle-list/?k=' + keyword)" class="col tab-link tab-link-active">派友圈</a>
				</div>
				<div v-else class="segmented row hnp-tab">
					<a @click="$redirect('/index/')" class="col tab-link">趣看</a>
					<a @click="$redirect('/article-list/')" class="col tab-link">好文</a>
					<a @click="$redirect('/store-index/')" class="col tab-link">好店</a>
					<a @click="$redirect('/collection-list/')" class="col tab-link">牛研所</a>
					<a @click="$redirect('/circle-list/')" class="col  tab-link tab-link-active">派友圈</a>
				</div>
				
			</div>
		</div>

		<div class="page-content infinite-scroll-content" 
			 @infinite="loadMore">
			<div class="ptr-preloader">
				<div class="preloader"></div>
				<div class="ptr-arrow"></div>
			</div>

			<div v-if="!circleList.length" class="no-content">
				暂无内容
			</div>
			<div v-for="item in circleList" class="">
				<div class="card">
					<div class="card-content card-content-padding">
						<div class="circle-subtitle">{{item.circle_mcount}}人正在关注</div>
						<a @click="$redirect('/circle-detail/id/' + item.circle_id + '/')">
							<div class="circle-title hnp-title">{{item.circle_name}}</div>
						</a>
						<div v-if="item.collection_name" class="circle-extra">来自
							<a @click="$redirect('/collection-detail/id/' + item.collection_id + '/')" href="#" class="text-color-green">
								{{item.collection_name}}
							</a>
						</div>
						<div v-else-if="item.channel_name" class="circle-extra">来自
							<a @click="$redirect('/channel/id/' + item.channel_id + '/')" href="#" class="text-color-green">
								{{item.channel_name}}
							</a>
						</div>
						<div v-else class="circle-extra"> &nbsp;
						</div>
						<div @click="$redirect('/circle-detail/id/' + item.circle_id + '/')" class="circle-avatar">
							<img v-lazy="$resizeImg(item.circle_img, 80,80)"  />
						</div>
					</div>
				</div>
			</div>
			
			<div class="preloader infinite-scroll-preloader"></div>
			<div class="bottom-tip infinite-scroll-preloader font-gray-extra" style="display:none;">机智如你，我就是杏运树来的卧底<hr></div>
		</div>

	</div>

</template>
<style scoped>
	.card .card-header {
		display: block;
		padding: 10px;
	}
	
	.circle-avatar {
		position: absolute;
		top: 1.0rem;
		right: 1.0rem;
		width: 4rem;
		height: 4rem;
	}
	
	.circle-avatar img {
		border-radius: 50%;
		width: 100%;
		height: 100%;
	}
	
	.circle-subtitle {
		margin: 0 4rem 0.2rem 0.2rem;
		font-size: 12px;
		font-weight: 500;
		color: #8e8e93;
	}
	
	.circle-title {
		margin: 0.2rem 4rem 0.2rem 0.2rem;
		font-size: 16px;
		font-weight: 600;
	}
	
	.circle-extra {
		margin: 0.8rem 6rem 0 0.2rem;
		font-size: 14px;
		color: #8e8e93;
	}
</style>
<script>
	import wap from '../js/wap.js';
	export default {
		data() {
			return {
				allowInfinite: true,
				lastPage: 1,
				circleList: [],
				keyword: '',
				channel:0,
			}
		},
		created() {
			this.channel = this.$route.query.channel || 0;
		},
		mounted() {
			if('undefined' === typeof(this.$route.query.k)) {
				this.keyword = '';
				this.title = '派友圈';
			} else {
				this.keyword = decodeURI(this.$route.query.k);
				this.title = '搜索-派友圈';
			}
			
			var app = this.setF7();
			this.loadList(1);
			this.$initGotop();
		},
		
		methods: {
			//当前频道搜索
			doSearch: function(e) {
				//关闭键盘
				document.activeElement.blur();
				var _key = this.$$('.searchbar-input-wrap input').val();
				if(!_key) {
//					this.$toast('请输入搜索关键词', 2000, 'bottom', true);
				}

				this.keyword = _key;
				this.reloadContent();
//				this.$redirect(`/circle-list/?k=${_key}`);
			},
			
			//上拉加载更多
			loadMore: function() {
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
				
		        self.circleList = [];
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
			
			//加载列表
			loadList: function(page) {
				var self = this;
				var data = {
					keyword : this.keyword,
					cur_page: page,
					page_size: 10,
					channel_id: this.channel
				}
				
				let cacheTime;
				if (self.$itemCacheFlag('theme-post', self.themeID)) {
					cacheTime = 0;
				} else {
					cacheTime = 1800;
				}
				
				wap.getajax('api/user/circle/searchList', data, function(res) {

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
							self.circleList.push(res.data.datalist[i]);
						}
					}
				}, 'v1', true, cacheTime);
				self.lastPage += 1;
				return;
			},

		},
		computed: {
		},
		components: {}

	}
</script>