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
					<a @click="$redirect('/my/fav-collection/', true)" class="col tab-link">牛研所</a>
					<a @click="$redirect('/my/fav-circletheme/', true)" class="col tab-link  tab-link-active">生活贴</a>
				</div>
			</div>
				
			<div class="content-list" style="margin: 2rem 1rem;padding: 1rem; border-radius: 8px;background-color: #ffffff;">
					
				<div v-if="!themeList.length" class="no-content">
					暂无内容
				</div>
				
				<div v-for="item in themeList" class="list-item">
							<div class="item-head">
								<img v-lazy="$avatar(item.member_id)" class="avatar ">
								<div class="head-right">
									<div class="hnp-title" style="width: 100%;">{{item.member_name}}</div>
									<div class="text-color-green" style="width: 100%;font-size: 14px;line-height: 1;">
										<span class="font-gray-extra">{{item.theme_addtime|friendlytime}}</span>
									</div>
								</div>
								<div v-if="$getMemberID() == item.member_id" style="float: right;overflow: hidden;margin: 0 1rem;">
									<a @click="$redirect('/circletheme-post/?theme_id=' + item.theme_id)"><i class="icon material-icons" style="">edit</i></a>
								</div>
							</div>
							<div @click="$redirect('/circletheme-detail/id/' + item.theme_id + '/')" class="item-body">
								<img v-if="item.main_imgs" v-lazy="$resizeImg(item.main_imgs[0], 460)" class="avatar ">
								<div class="text" v-html="item.theme_content">
								</div>
							</div>
							<div class="item-footer">
								<span style="float: left;">很牛{{item.theme_up_count}} • 评论 {{item.theme_commentcount}}</span>
								<span style="float: right;">
									<i class="icon material-icons" style="margin-right: 1rem;">thumb_up</i>
									<i class="icon material-icons" style="">chat_bubble_outline</i>
								</span>
							</div>
							<hr>
					</div>
					
			 
			</div>
			
			<div class="preloader infinite-scroll-preloader"></div>
			<div class="bottom-tip infinite-scroll-preloader font-gray-extra" style="display:none;">机智如你，我就是杏运树来的卧底<hr></div>
		</div>

	</div>

</template>
<style scoped>
	.list-item .item-head {
		float: left;
		overflow: hidden;
		margin: 3vw 0;
	}
	
	.list-item .item-head .avatar {
		width: 2.3rem;
		height: 2.3rem;
		border-radius: 50%;
		float: left;
	}
	
	.list-item .head-right {
		float: left;
		overflow: hidden;
		margin: 0 0.6rem;
	}
	
	.list-item .item-body {}
	
	.list-item .item-body img {
		width: 100%;
		height: auto;
	}
	
	.list-item .item-body .text {
		width: 100%;
		margin: 1rem 0;
		color:#8e8e93;
		display: -webkit-box;
		/** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical;
		/** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 2;
		word-break: break-all;
		/*white-space: nowrap;*/
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.list-item .item-body .text p {
		margin: 0 0;
	}
	
	.list-item .item-footer {
		overflow: hidden;
		color: #333333;
		font-weight: 600;
		margin-bottom: 4vw;
	}
</style>
<script>
	import wap from '../../js/wap.js';
	export default {
		data() {
			return {
				allowInfinite: true,
				lastPage: 1,
				themeList: [],
			}
		},
		created() {
		},
		mounted() {
			this.title = '我的收藏';
			var self = this;
			var app = this.setF7();
			//验证用户登录状态
			if(!wap.checkLogin(false)) {
				self.$f7.dialog.alert('请先登录', '登录提示', function() {
		          self.$gotoShop('login.html');
				});
				return;
			}
			this.initCoreData();
			
			this.$initGotop();
		},

		methods: {
			initCoreData() {
				var self = this;
				self.$f7.preloader.show();
				self.loadList(1);
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
					fav_type: 'theme',
					cur_page: page,
					page_size: 20,
					sort_field: 'fav_time',
					sort: 'desc',
				}
				wap.getajax('api/user/memberfav/listMemberFav', data, function(res) {

					if(res.status == 'success') {
						if (page >= res.data.countPage) {
							self.$nextTick(function(){
								self.$f7.infiniteScroll.destroy('.infinite-scroll-content');
								self.$$('.preloader').remove();
							});
							if (self.lastPage > 1) {
								self.$$('.bottom-tip').show();
							}
							
							self.lastPage = 10000;
						}
						
						for(var i = 0; i < res.data.datalist.length; i++) {
							self.themeList.push(res.data.datalist[i]);
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