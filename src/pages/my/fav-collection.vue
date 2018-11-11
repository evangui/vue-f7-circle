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

		<div class="page-content hide-navbar-on-scroll infinite-scroll-content" @infinite="loadMore">
			<div style="background-color: #ffffff;">
				<div class="hnp-title" style="padding: 0.4rem 0.4rem 0;font-size: 26px;font-weight: 600;">
					<div style="height: 12vw;margin:1.2rem 0 0;position: relative;">
						<span style="position:absolute; margin-left:1rem;top:2vw">我的收藏</span>
					</div>
				</div>
				<div class="row hnp-tab" style="width: 90vw;margin:1vw 5vw">
					<a @click="$redirect('/my/fav-article/', true)" class="col tab-link">文章</a>
					<a @click="$redirect('/my/fav-store/', true)" class="col tab-link">店铺</a>
					<a @click="$redirect('/my/fav-goods/', true)" class="col tab-link">派</a>
					<a @click="$redirect('/my/fav-collection/', true)" class="col tab-link tab-link-active">牛研所</a>
					<a @click="$redirect('/my/fav-circletheme/', true)" class="col tab-link">生活贴</a>
				</div>
			</div>
			
			<div v-if="!collectionList.length" class="no-content">
				暂无内容
			</div>
			<div class="list media-list" >
					<ul style="margin: 2rem 1rem; border-radius: 8px;">
						<li v-for="item in collectionList">
						<a @click="$redirect('/collection-detail/id/' + item.cl_id + '/')"  class="item-content">
							<div class="item-inner">
								<div class="item-row">
									<div class="collection-opacity-black">
										<img v-lazy="$resizeImg(item.cl_image,460)"  />
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
		
	</div>

</template>
<style scoped>
	
</style>
<script>
	import wap from '../../js/wap.js';
	export default {
		data() {
			return {
				allowInfinite: true,
				lastPage: 1,
				collectionList: [],
			}
		},
		created() {
			this.title = '我的收藏';
		},
		mounted() {
			var self = this;
			var app = this.setF7();
			//验证用户登录状态
			if(!wap.checkLogin(false)) {
				self.$f7.dialog.alert('请先登录', '登录提示', function() {
		          self.$gotoShop('login.html');
				});
				return;
			}
			this.loadList(1);
			
			this.$initGotop();
		},

		methods: {
			initCoreData() {
				var self = this;	
				self.loadList(1);
				self.$nextTick(function() {
					self.$f7.lazy.loadImage('.lazy');
				});
						
				self.$f7.preloader.hide();
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
			
			loadList: function(page) {
				var self = this;
				var $ = self.$$;
				var data = {
					fav_type: 'collection',
					cur_page: page,
					page_size: 20,
					sort_field: 'fav_time',
					sort: 'desc',
				}
				wap.getajax('api/user/memberfav/listMemberFav', data, function(res) {

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
				});
				self.lastPage += 1;
				return;
			},

		},
		computed: {},
		components: {}

	}
</script>