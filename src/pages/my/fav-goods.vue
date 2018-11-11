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
					<a @click="$redirect('/my/fav-goods/', true)" class="col tab-link  tab-link-active">派</a>
					<a @click="$redirect('/my/fav-collection/', true)" class="col tab-link">牛研所</a>
					<a @click="$redirect('/my/fav-circletheme/', true)" class="col tab-link">生活贴</a>
				</div>
			</div>

			<div v-if="!goodsList.length" class="no-content">
				暂无内容
			</div>

			<div class="list media-list">
				<ul style="margin: 2rem 1rem; border-radius: 8px;">
					<li v-for="item in goodsList">
						<a @click="$gotoShop('goods.html?id=' + item.goods_id)" class="item-content">
							<div class="item-media"><img v-lazy="item.goods_img" style="width:80px;height: 80px;" /></div>
							<div class="item-inner">
								<div class="item-title-row">
									<div class="item-title">{{item.goods_name}}</div>
								</div>
								<div class="font-gray-extra" style="font-size: 12px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: block;">{{item.goods_subhead}}</div>
								<div class="item-row">
									<div class="item-text"><span class="text-color-red" style="margin-right: 1rem;">￥{{item.goods_price}}</span> 派价值 ￥{{item.goods_marketprice}}</div>
									<div class="item-after" style="margin-top:6px;"><span class="badge color-green" style="font-size: 12px;">{{10*item.goods_price/item.goods_marketprice|discount}}折</span></div>
								</div>
							</div>
						</a>
					</li>
				</ul>
			</div>

			<div class="preloader infinite-scroll-preloader"></div>
			<div class="bottom-tip infinite-scroll-preloader font-gray-extra" style="display:none;">机智如你，我就是杏运树来的卧底
				<hr>
			</div>
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
				goodsList: [],
			}
		},
		created() {
			this.title = '我的收藏';
			//			this.loadList(1);
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

			self.$f7.preloader.show();
			setTimeout(this.initCoreData, 1);
			
			this.$initGotop();
		},

		methods: {
			initCoreData() {
				var self = this;
				self.loadList(1);
				self.$nextTick(function() {
//					self.$f7.lazy.loadImage('.lazy');
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
					fav_type: 'goods',
					cur_page: page,
					page_size: 20,
					sort_field: 'fav_time',
					sort: 'desc',
				}
				wap.getajax('api/user/memberfav/listMemberFav', data, function(res) {

					if(res.status == 'success') {
						if(page >= res.data.countPage) {
							self.$nextTick(function(){
								self.$f7.infiniteScroll.destroy('.infinite-scroll-content');
								self.$$('.preloader').remove();
							});
							if(self.lastPage > 1) {
								self.$$('.bottom-tip').show();
							}

							self.lastPage = 10000;
						}

						for(var i = 0; i < res.data.datalist.length; i++) {
							if('undefined' == res.data.datalist[i].goods_img || !res.data.datalist[i].goods_img) {
								res.data.datalist[i].goods_img = self.$grayLogoUrl;
							}
							self.goodsList.push(res.data.datalist[i]);
						}
					}
				}, 'v1', true);
				self.lastPage += 1;
				return;
			},

		},
		computed: {},
		components: {}

	}
</script>