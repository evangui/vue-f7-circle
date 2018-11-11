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
						<span style="position:absolute; margin-left:1rem;top:2vw">关注</span>
					</div>
				</div>
				<div class="row hnp-tab" style="width: 90vw;margin:1vw 5vw">
					<a @click="$redirect('/my/fav-store/')" class="col tab-link tab-link-active">派友圈</a>
					<!--<a @click="$redirect('/my/fav-store/')" class="col tab-link">我关注的人</a>
					<a @click="$redirect('/my/fav-store/')" class="col tab-link">关注者</a>-->
				</div>
			</div>
			
			<div v-if="!circleList.length" class="no-content">
				暂无内容
			</div>
			
			<div style="margin: 2rem 1rem; border-radius: 8px;">
				<div v-for="item in circleList">
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
								<img :src="item.circle_img" class="lazy lazy-fade-in" />
							</div>
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
	import wap from '../../js/wap.js';
	export default {
		data() {
			return {
				allowInfinite: true,
				lastPage: 1,
				circleList: [],
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
			self.$f7.preloader.show();
			setTimeout(this.initCoreData, 1);
			
			this.$initGotop();
		},

		methods: {
			initCoreData() {
				var self = this;
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
					fav_type: 'store',
					cur_page: page,
					page_size: 20,
				}
				wap.getajax('api/user/circle/joinList', data, function(res) {

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
							self.circleList.push(res.data.datalist[i]);
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