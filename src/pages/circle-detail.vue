<template>
	<div class="page">
		<div class="page-content infinite-scroll-content" @infinite="loadMore">
			<div class="navbar color-theme-gray no-hairline">
				<div class="navbar-inner sliding">
					<div class="left">
						<a v-if="!$isWx" href="#" class="link back">
							<i class="icon icon-back"></i>
						</a>
						<a v-else style="width: 24px;"></a>
					</div>
					<div class="title">杏运树-派友圈</div>
					<div class="right">
						<a class="icon-item popover-open" data-popover=".popover-menu">
							<i class="icon material-icons text-color-orange">more_vert</i>
						</a>
					</div>
				</div>
			</div>

			<div class="circle-content">
				<div class="circle-head">
					<div class="circle-subtitle">
						{{mutCircleData.circle_mcount}}人正在关注
					</div>
					<div class="circle-title hnp-title">
						{{circle.circle_name}}
					</div>
					<div class="circle-extra">
						{{circle.circle_notice}}
					</div>
					<div class="circle-avatar">
						<img v-lazy="$resizeImg(circle.circle_img,80,80)">
					</div>
				</div>
				<div class="row" style="margin:4vw 0 8vw; 0">
					<button @click="joinCircle()" v-if="!mutCircleData.joined" class="col-80 button button-fill button-round color-orange">
						关注
					</button>
					<button @click="quitCircle()" v-else class="col-80 button button-fill button-round color-gray" style="background:#8e8e9399;">
						已关注
					</button>
					<button class="col-20 button color-gray button-round popover-open2" style="border-color: #DCDCDC;"><i class="icon material-icons" style="color: #333333;">more_horiz</i></button>
				</div>
				<hr>
			</div>

			<div class="circle-content">
				<div class="content-list">

					<div v-for="item in hotThemeList" class="list-item">
						<div class="item-head">
							<img v-lazy="$avatar(item.member_id)" class="avatar ">
							<div class="head-right">
								<div class="hnp-title" style="width: 100%;">{{item.member_name}}</div>
								<div style="width: 100%;font-size: 14px;line-height: 1;">
									<span class="text-color-green">编辑推荐</span>
								</div>
							</div>
							<div v-if="$getMemberID() == item.member_id" style="float: right;overflow: hidden;margin: 0 1rem;">
								<a @click="$redirect('/circletheme-post/?theme_id=' + item.theme_id)"><i class="icon material-icons" style="">edit</i></a>
							</div>
						</div>
						<div @click="$redirect('/circletheme-detail/id/' + item.theme_id + '/')" class="item-body">
							<img v-if="item.main_imgs.length" v-lazy="$resizeImg(item.main_imgs[0],460)" class="avatar ">
							<div class="text" v-html="item.theme_content">
							</div>
						</div>
						<div class="item-footer">
							<span style="float: left;">
									很牛 {{getMutTheme(item.theme_id).theme_up_count}} • 
									评论 {{getMutTheme(item.theme_id).theme_commentcount}}</span>
							<span style="float: right;">
									
									<i v-if="!getMutTheme(item.theme_id).uped" @click="$upItem('theme', item.theme_id, 'up')"
										class="icon fa fa-thumbs-o-up" style="margin-right: 1rem;">
							    	</i>
							    	<i v-else @click="$upItem('theme', item.theme_id, 'unup')" 
							    		class="icon fa fa-thumbs-up color-yellow" style="margin-right: 1rem;">
							    	</i>
							    	
									<i @click="$redirect('/circletheme-detail/id/' + item.theme_id + '/')"
										class="icon material-icons" style="">chat_bubble_outline</i>
								</span>
						</div>
						<hr>
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
							<img v-if="item.main_imgs.length" v-lazy="$resizeImg(item.main_imgs[0],460)" class="avatar ">
							<div class="text" v-html="item.theme_content">
							</div>
						</div>
						<div class="item-footer">
							<span style="float: left;">
									很牛 {{getMutTheme(item.theme_id).theme_up_count}} • 
									评论 {{getMutTheme(item.theme_id).theme_commentcount}}</span>
							<span style="float: right;">
									<i v-if="!getMutTheme(item.theme_id).uped" @click="$upItem('theme', item.theme_id, 'up')"
										class="icon fa fa-thumbs-o-up" style="margin-right: 1rem;">
							    	</i>
							    	<i v-else @click="$upItem('theme', item.theme_id, 'unup')" 
							    		class="icon fa fa-thumbs-up color-yellow" style="margin-right: 1rem;">
							    	</i>
									<i @click="$redirect('/circletheme-detail/id/' + item.theme_id + '/')"
										class="icon material-icons" style="">chat_bubble_outline</i>
								</span>
						</div>
						<hr>
					</div>

				</div>
			</div>

			<div class="preloader infinite-scroll-preloader"></div>
			<div class="bottom-tip infinite-scroll-preloader font-gray-extra" style="display:none;">机智如你，我就是杏运树来的卧底
				<hr>
			</div>
		</div>

		<!--所属合集-->
		<div v-if="circle.collection" id="top-fab" class="fab fab-right-top color-green lazy lazy-fade-in" style="top:120px;display: none;">
			<div class="float-collection">
				<div class="close" @click="$$('.fab .float-collection').hide()">
					<i class="icon material-icons text-color-black">close</i>
				</div>

				<div class="right">
					<span style="display: block;">推荐牛研所</span>
					<span v-if="circle.collection" @click="$redirect('/collection-detail/id/' + circle.collection.cl_id + '/')" class="text-color-green nowrap" style="display: block;width:113px;">
						{{circle.collection.cl_name}}
					</span>
				</div>
			</div>
		</div>

		<!--编辑帖子-->
		<div class="fab fab-center-bottom color-green">
			<div @click="gotoPost()" class="float-collection" style="width: 50px;border-radius: 25px;">
				<div>
					<a href="#" style="position:absolute;left:25%;top:25%">
						<i class="icon material-icons text-color-orange ">edit</i>
					</a>
				</div>
			</div>
		</div>

		<!--圈子描述-->
		<div class="popover-backdrop backdrop-in" style="display: none;"></div>
		<div class="popover popover-desc modal-in lazy-fade-in lazy-loaded" style="display: none; top: 14.5rem;width: 90%;margin: 0 5%;">
			<div class="popover-angle on-top" style="left: 76vw;"></div>
			<div class="popover-inner">
				<div class="block" style="padding: 0 1.5rem;">
					<div style="margin-bottom: 0.5rem;">
						<i class="icon material-icons text-color-orange" style="margin-right: 1rem;">people</i>
						<span class="hnp-title">圈主</span>
						<span style="float:right">{{circle.circle_mastername}} <i class="icon f7-icons text-color-gray" style="font-size: 14px;">right</i></span>
					</div>
					<hr>
					<div style="margin-top: 0.5rem;">
						<i class="icon material-icons text-color-orange" style="margin-right: 1rem;">insert_comment</i>
						<span class="hnp-title">派友圈描述</span>
						<p style="padding: 0.1rem 3rem;">
							{{circle.circle_desc}}
						</p>

					</div>
				</div>
			</div>
		</div>

		<remote-js v-if="$isWx" @load="loadedWxJs()" src="//res.wx.qq.com/open/js/jweixin-1.2.0.js"></remote-js>
	</div>
</template>
<style>
	.list-item .item-body .text {
		width: 100%;
		margin: 1rem 0;
		color: #8e8e93;
		/*display: -webkit-box;*/
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
</style>
<style scoped>
	.list-item .item-body {}
	
	.list-item .item-body img {
		width: 100%;
		height: auto;
	}
	
	.fab .float-collection {
		width: 160px;
		height: 50px;
		-webkit-box-shadow: -5px 0px 20px 4px rgba(0, 0, 0, 0.13);
		box-shadow: -5px 0px 20px 4px rgba(0, 0, 0, 0.13);
		/* border-radius: 25px; */
		border-top-left-radius: 25px;
		border-bottom-left-radius: 25px;
		font-weight: 600;
		color: #8e8e93;
		background-color: #ffffff;
	}
	
	.fab .float-collection .close {
		position: absolute;
		left: 16%;
		top: 50%;
		-webkit-transform: translate3d(-50%, -50%, 0) rotate(0deg) scale(1);
		transform: translate3d(-50%, -50%, 0) rotate(0deg) scale(1);
		-webkit-transition: 300ms;
		transition: 300ms;
	}
	
	.fab .float-collection .right {
		position: absolute;
		padding-left: 5px;
		left: 79%;
		top: 50%;
		-webkit-transform: translate3d(-50%, -50%, 0) rotate(0deg) scale(1);
		transform: translate3d(-50%, -50%, 0) rotate(0deg) scale(1);
		-webkit-transition: 300ms;
		transition: 300ms;
		color: #69B076 !;
		width: 100%;
		height: auto;
		border-left: 2px #e6e6e6 solid;
	}
	
	.ios .page-content {
		background-color: #ffffff;
		width: 100%;
		margin: 0;
		background-color: rgb(255, 255, 255);
		font-size: 16px;
		word-wrap: break-word;
		color: #505050;
		line-height: 1.647
	}
	
	.circle-content {
		margin: 0 15px;
		position: relative;
	}
	
	.content-list {}
	
	.list-item .item-head {
		/*float: left;*/
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
	
	.list-item .item-footer {
		overflow: hidden;
		color: #333333;
		font-weight: 600;
		margin-bottom: 4vw;
	}
	
	.circle-avatar {
		position: absolute;
		top: 1vw;
		right: 0;
	}
	
	.circle-avatar img {
		border-radius: 50%;
		width: 5rem;
		height: 5rem;
		max-width: 6rem;
		max-height: 6rem;
	}
	
	.circle-subtitle {
		margin: 1.4rem 1rem 0.1rem 0;
		font-size: 12px;
		font-weight: 500;
		color: #8e8e93;
	}
	
	.circle-title {
		margin: 1rem 1.6rem 0.1rem 0.1rem;
		font-size: 18px;
		font-weight: 600;
	}
	
	.circle-extra {
		margin: 1.2rem 1rem 0.4vw 0.4vw;
		width: 60vw;
		font-size: 14px;
		color: #8e8e93;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.circle-content h1,
	h2,
	h3,
	h4 {
		position: relative;
		display: block;
		font-weight: 700;
		word-wrap: break-word;
		margin: 20px 0;
		padding-left: 9px;
		color: #333333;
		line-height: normal
	}
	
	.white-title {
		position: relative;
		display: block;
		font-size: 1.4em;
		font-weight: 700;
		word-wrap: break-word;
		margin: 15px 15px 15px 15px;
		color: #fff;
		line-height: normal;
	}
	
	.location-info {
		font-size: 14px!important;
		width: 86%;
		margin: 0 0 0 -4px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.ios .button.button-round,
	.ios .button.button-round-ios {
		border-radius: 10px;
	}
	
	.ios .fab[class*="fab-right"] {
		right: 0px;
	}
</style>
<script>
	import wap from '../js/wap.js'
	import { mapState, mapGetters } from 'vuex'
	import '../js/jquery-2.2.4.min.js'
	import '../js/wxShare.js'
	export default {
		data() {
			return {
				wxJSLoaded: 0,
				showMod: 0,
				circleID: 0,
				circle: {},

				allowInfinite: true,
				lastPage: 1,
				themeList: [],
				hotThemeList: [],
				joinState: 400,
			}
		},

		created() {
			document.title = '';
			var self = this;
			self.circleID = self.$route.params.id;
		},

		mounted() {
			var self = this;
			var app = this.setF7();

			self.$f7.preloader.show();
			setTimeout(_ => {
				self.$f7.preloader.hide();
			}, 300);

			//详情核心数据
			self.loadCircleData();

			self.loadHotList();

			//最新帖子列表
			if(!self.hotThemeList) {
				setTimeout(_ => {
					self.loadList(1);
				}, 200);
			} else {
				self.loadList(1);
			}

			self.closePopup();

			self.$$('.backdrop-in').click(function() {
				self.closePopup();
			});
			self.$$('.popover-open2').click(function() {
				self.openPopup();
			});

			this.$initGotop();
		},
		methods: {
			//加载微信js
			loadedWxJs() {
				var self = this;
				self.wxJSLoaded = 1;
				if(self.circle) {
					self.initShareWx();
				}
			},

			//初始化微信分享配置参数
			initShareWx() {
				var self = this;
				//微信分享，分享数据要在异步获取文章详情后初始化
				if(this.$isWx) {
					setTimeout(_ => {
						this.$wap.setWxConfig();
						//分享对象使用
						var shareData = {
							title: self.circle.circle_name,
							desc: self.circle.circle_desc,
							link: window.location.href,
							imgUrl: self.$resizeImg(self.circle.circle_img, 80, 80),
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

			//初始化核心数据（取详情和用户关注状态）
			loadCircleData() {
				var self = this;

				this.$store.dispatch('getCircleMut', {
					circleID: self.circleID,
					callback: (res) => {
						if(res.status == 'success') {
							self.circle = res.data;
							self.wxJSLoaded && self.initShareWx();
						}

						if(self.circle.collection) {
							setTimeout(function() {
								self.$$('#top-fab').show();
							}, 4000);
						}
						self.$f7.preloader.hide();
					}
				});

			},

			//转到发帖界面
			gotoPost() {
				var self = this;
				//验证用户登录状态
				if(!wap.checkLogin(false)) {
					self.$f7.dialog.alert('请先登录', '登录提示', function() {
						self.$gotoShop('login.html');
					});
					return;
				}

				if(self.mutCircleData.joined) {
					self.$redirect(`/circletheme-post/?circle_id=${self.circleID}&circle_name=${self.circle.circle_name}`);
					return;
				}

				self.$f7.dialog.confirm(`亲，发帖前需要先加入圈子,确定加入该派友圈吗?`, '入圈提示', _ => {

					self.$f7.dialog.progress('正在处理中...');
					self.$store.dispatch('joinCircle', {
						circle_id: self.circle.circle_id,
						circle_name: self.circle.circle_name,
						type: 'join',
						callback: (res) => {
							self.$f7.dialog.close();
							if(res.code == '200' || res.code == '202') {
								self.$toast("已成功关注派友圈", 1000, 'center', true, true);
								self.joinState = 1;
								setTimeout(_ => {
									self.$redirect(`/circletheme-post/?circle_id=${self.circleID}&circle_name=${self.circle.circle_name}`);
								}, 1000);
								return;
							} else {
								self.$toast("网络错误，请稍后再试", 2000, 'center', true, false);
							}

						}
					});
				});
				return;
			},

			//加入圈子
			joinCircle() {
				var self = this;
				//验证用户登录状态
				if(!wap.checkLogin(false)) {
					self.$f7.dialog.alert('请先登录', '登录提示', function() {
						self.$gotoShop('login.html');
					});
					return;
				}

				self.$f7.dialog.confirm(`亲，做好准备关注"${self.circle.circle_name}"了吗?`, '入圈提示', _ => {

					self.$f7.dialog.progress('正在处理中...');
					self.$store.dispatch('joinCircle', {
						circle_id: self.circle.circle_id,
						circle_name: self.circle.circle_name,
						type: 'join',
						callback: (res) => {
							if(res.code == '200' || res.code == '202') {
								self.$toast('已成功关注派友圈', 3000, 'center', true, true);
								self.joinState = 1;
							} else {
								self.$toast('网络错误，请稍后再试', 2000, 'center', true, false);
							}
							self.$f7.dialog.close();
						}
					});

				});
				return;
			},

			//离开圈子
			quitCircle() {
				var self = this;
				//验证用户登录状态
				if(!wap.checkLogin(false)) {
					self.$f7.dialog.alert('请先登录', '登录提示', function() {
						self.$gotoShop('login.html');
					});
					return;
				}

				self.$f7.dialog.confirm(`确认离开"${self.circle.circle_name}"了吗?`, '离圈提示', _ => {

					self.$f7.preloader.show("正在处理中...");
					setTimeout(function() {
						self.$f7.preloader.hide();
					}, 2000);

					self.$store.dispatch('joinCircle', {
						circle_id: self.circle.circle_id,
						circle_name: self.circle.circle_name,
						type: 'unjoin',
						callback: (res) => {
							if(res.code == '200' || res.code == '202') {
								self.$toast('已成功离开派友圈', 3000, 'center', true, true);
								self.joinState = 400;

							} else {
								self.$toast("网络错误，请稍后再试", 2000, 'center', true, false);
							}
							self.$f7.preloader.hide();
						}
					});
				});

				return;
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
			//ajax加载列表
			loadList: function(page) {
				var self = this;
				var data = {
					circle_id: self.circleID,
					page_size: 10,
					cur_page: page,
				};

				//根据是否重置缓存列表标志，来设置缓存时间
				let cacheTime = 0;
				if(self.$itemCacheFlag('circletheme', self.circleID)) {
					cacheTime = 0;
				} else {
					cacheTime = 1800;
				}

				//获取数据
				this.$store.dispatch('getThemes', {
					data: data,
					cacheTime: cacheTime,
					callback: (res) => {
						if(res.status != 'success') {
							return;
						}

						if(page >= res.data.countPage) {
							self.$f7.infiniteScroll.destroy('.infinite-scroll-content');
							self.$$('.preloader').remove();
							if(self.lastPage > 2) {
								self.$$('.bottom-tip').show();
							}
							self.lastPage = 10000;
						}

						for(var i = 0; i < res.data.datalist.length; i++) {
							let item = self.hotThemeList.find(p => p.theme_id === res.data.datalist[i].theme_id);
							if(undefined == item) {
								res.data.datalist[i].theme_content = res.data.datalist[i].theme_content.substr(0, 100) + '...';
								self.themeList.push(res.data.datalist[i]);
							}
						}
					}
				});
				self.lastPage += 1;

				return;
			},
			//热门推荐列表
			loadHotList: function() {
				var self = this;
				//热门推荐
				let data = {
					circle_id: self.circleID,
					//					commend: 1,
					stick: 1,
					sort_field: 'weight',
					sort: 'desc',
					page_size: 4,
					cur_page: 1,
				};

				//获取数据
				this.$store.dispatch('getThemes', {
					data: data,
					cacheTime: 1800,
					callback: (res) => {
						if(res.status == 'success') {
							for(var i = 0; i < res.data.datalist.length; i++) {
								res.data.datalist[i].theme_content = res.data.datalist[i].theme_content.substr(0, 80) + '...';
								self.hotThemeList.push(res.data.datalist[i]);
							}

						}
					}
				});

			},
			//打开圈主
			openPopup: function() {
				if(!this.showMod) {
					this.$$('.backdrop-in').show(500);
					this.$$('.popover-desc').show(500);
					this.showMod = 1;
					console.log(this.$$('.backdrop-in'));
				}
			},
			closePopup: function() {
				if(this.showMod) {
					this.$$('.backdrop-in').hide(500);
					this.$$('.popover-desc').hide(500);
					this.showMod = 0;
				}
			},
		},

		computed: {
			...mapState([
				'mutCirclesState',
			]),
			...mapGetters({
				getMutCircle: 'getMutCircle',
				getMutTheme: 'getMutTheme',
			}),
			mutCircleData() {
				return this.getMutCircle(this.circleID);
			}
		},

		//根据state记录的原页面离开位置，自动滚动
		beforeRouteEnter(to, from, next) {
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

		//用state记录离开页面时的滚动位置
		beforeRouteLeave(to, from, next) {
			let top = document.querySelector('.page-content') ? document.querySelector('.page-content').scrollTop : 0;
			console.log('leave detail:' + top)
			this.$store.commit('SET_SCROLL_TOP', {
				k: this.hashkey,
				v: top
			});
			next();
		},
		components: {}

	}
</script>