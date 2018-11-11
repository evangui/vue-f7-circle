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
				<div v-if="keyword" class="segmented row hnp-tab">
					<a @click="$redirect('/index/')" class="col tab-link">趣看</a>
					<a @click="$redirect('/article-list/?k=' + keyword)" class="col tab-link">好文</a>
					<a @click="$redirect('/store-list/?k=' + keyword)" class="col tab-link">好店</a>
					<a @click="$redirect('/collection-list/?k=' + keyword)" class="col tab-link tab-link-active">牛研所</a>
					<a @click="$redirect('/circle-list/?k=' + keyword)" class="col tab-link">派友圈</a>
				</div>
				<div v-else class="segmented row hnp-tab">
					<a @click="$redirect('/index/')" class="col tab-link">趣看</a>
					<a @click="$redirect('/article-list/')" class="col tab-link">好文</a>
					<a @click="$redirect('/store-index/')" class="col tab-link">好店</a>
					<a @click="$redirect('/collection-list/')" class="col tab-link tab-link-active">牛研所</a>
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

			<div v-if="!collectionList.length" class="no-content">
				暂无内容
			</div>
			<div class="list media-list">
				<ul>
					<li v-for="item in collectionList">
						<a @click="$redirect('/collection-detail/id/' + item.cl_id + '/')"  class="item-content">
							<div class="item-inner">
								<div class="item-row">
									<div class="collection-opacity-black">
										<img v-lazy="$resizeImg(item.cl_image,460,287)"  style="max-height:60vw;"/>
									</div>
									<div class="collection-opacity-cat">{{item.cl_channel_name}}</div>
									<div class="collection-opacity-title">{{item.cl_name}}</div>
									<div class="collection-opacity-subtitle">{{item.cl_like_count}}人正在研究</div>
								</div>
							</div>
						</a>
					</li>
				</ul>
			</div>
			
			<div class="preloader infinite-scroll-preloader"></div>
			<div class="bottom-tip infinite-scroll-preloader font-gray-extra" style="display:none;">机智如你，我就是杏运树来的卧底<hr></div>
		</div>

		<remote-js v-if="$isWx" @load="loadedWxJs()"  src="//res.wx.qq.com/open/js/jweixin-1.2.0.js"></remote-js>
	</div>

</template>
<style scoped>
	.collection-opacity-cat {
		width: 68%;
		position: absolute;
		top: 2rem;
		left: 1.7rem;
		color: #FFFFFF;
		font-size: 1.0rem;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.collection-opacity-title {
		width: 84%;
		position: absolute;
		top: 3.7rem;
		left: 1.7rem;
		color: #FFFFFF;
		font-size: 1.4rem;
		font-weight: 800;
		line-height: 1.4;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.collection-opacity-subtitle {
		position: absolute;
		bottom: 2.0rem;
		left: 1.7rem;
		color: #FFFFFF;
		font-size: 1.0rem;
		font-weight: 500;
		line-height: 1.4;
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
				allowInfinite: true,
				lastPage: 1,
				collectionList: [],
				keyword: '',
				channel:0,
			}
		},
		mounted() {
			this.channel = this.$route.query.channel || 0;
			if('undefined' === typeof(this.$route.query.k)) {
				this.keyword = '';
				this.title = '牛研所';
			} else {
				this.keyword = decodeURI(this.$route.query.k);
				this.title = '搜索-牛研所';
			}
			
			var app = this.setF7();
			this.loadList(1);
			
			this.$initGotop();
		},
		
		methods: {
			loadedWxJs() {
				var self = this;
				self.wxJSLoaded = 1;
				self.initShareWx();
			},
			
			initShareWx() {
				var self = this;
				//微信分享，分享数据要在异步获取文章详情后初始化
				if(this.$isWx) {
					setTimeout(_ => {
						this.$wap.setWxConfig();
						//分享对象使用
						var shareData = {
							title: '杏运树牛研所',
							desc: '与杏运树一起发现有趣有调的生活派牛人！',
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
					}, 200);
				}

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
				
		        self.collectionList = [];
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
				
				wap.getajax('api/user/collection/searchList', data, function(res) {

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
							self.collectionList.push(res.data.datalist[i]);
						}
					}
				}, 'v1', true, 1800);
				self.lastPage += 1;
				return;
			},

		},
		computed: {
		},
		components: {}

	}
</script>