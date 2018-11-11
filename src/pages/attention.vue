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

		<div class="toolbar tabbar tabbar-labels toolbar-bottom-md color-theme-yellow">
			<div class="toolbar-inner">
				<a @click="$redirect('/index/')" class="tab-link">
					<!-- Different icons for iOS and MD themes -->
					<i class="icon material-icons">pets</i>
					<!-- Label text -->
					<span class="tabbar-label">趣看</span>
				</a>
				<a href="" class="tab-link tab-link-active">
					<i class="icon material-icons">visibility</i>
					<span class="tabbar-label">发现</span>
				</a>
				<a @click="$gotoShop('')" class="tab-link">
					<i class="icon material-icons">shop</i>
					<span class="tabbar-label">商城</span>
				</a>
				<a @click="$redirect('/mine/')" class="tab-link">
					<i class="icon f7-icons">person_fill</i>
					<span class="tabbar-label">我的</span>
				</a>
			</div>
		</div>

		<!-- Views/Tabs container -->
		
		<div class="page-content ptr-content infinite-scroll-content"  @ptr:refresh="reloadContent" 
			 @infinite="loadMore" style="background-color: #ffffff;">
			<div class="ptr-preloader">
				<div class="preloader"></div>
				<div class="ptr-arrow"></div>
			</div>

			<div v-if="!feedList.length" class="no-content">
				暂无内容
			</div>	
			<div class="attentions">
				<div v-for="item in feedList">
					<!--文章-->
					<div v-if="item.board_type=='article'" class="article">
						<div class="head">
							<div class="logo">
								<i class="icon material-icons text-color-orange" style="font-size: 2rem;">business_center</i>
							</div>
							<div class="who hnp-title">
								{{item.who}}
							</div>
							<div class="action-time font-gray-extra">
								{{item.action_name}}
							</div>
							<div class="why">
								<button class="button button-round border-color-gray text-color-gray">为你推荐</button>
							</div>
						</div>
						<div class="body">
							<a @click="$redirect('/article-detail/id/' + item.board_obj.article_id + '/')" class="item-content">
								<div class="cover-mask">
									<img v-if="item.board_obj.article_image" :src="item.board_obj.article_image">
									<div class="cover-text">
										<div class="text-color-white">{{item.board_obj.article_title}}</div>
									</div>
								</div>
							</a>
						</div>
					</div>
					
					<!--合集-->
					<div v-if="item.board_type=='collection'" class="collection">
						<div class="head">
							<div class="logo">
								<i class="icon material-icons text-color-orange" style="font-size: 2rem;">center_focus_strong</i>
							</div>
							<div class="who hnp-title">
								{{item.who}}
							</div>
							<div class="action-time font-gray-extra">
								{{item.feed_create_time|friendlytime}}
							</div>
							<div class="why">
								<button class="button button-round border-color-gray text-color-gray">为你推荐</button>
							</div>
						</div>
						<div @click="$redirect('/collection-detail/id/' + item.board_obj.cl_id + '/')" class="body" style="position: relative;">
							<div class="collection-opacity-black">
								<img v-lazy="$resizeImg(item.board_obj.cl_image, 460)"  />
							</div>
							<div class="collection-opacity-cat">{{item.board_obj.cl_channel_name}}</div>
							<div class="collection-opacity-title">{{item.board_obj.cl_name}}</div>
							<div class="collection-opacity-subtitle">{{item.board_obj.cl_like_count}}人正在研究</div>
						</div>
					</div>
					
					<!--圈子-->
					<div v-if="item.board_type=='circle'" class="circle">
						<div class="head">
							<div class="logo">
								<i class="icon material-icons text-color-orange" style="font-size: 2rem;">person_pin_circle</i>
							</div>
							<div class="who hnp-title">
								{{item.who}}
							</div>
							<div class="action-time font-gray-extra">
								{{item.feed_create_time|friendlytime}}
							</div>
							<div class="why">
								<button class="button button-round border-color-gray text-color-gray">为你推荐</button>
							</div>
						</div>
						<div class="body">
							<div class="card">
								<div class="card-content card-content-padding">
									<div class="circle-subtitle">{{item.board_obj.circle_mcount}}人正在关注</div>
									<a @click="$redirect('/circle-detail/id/' + item.board_obj.circle_id + '/')">
										<div class="circle-title hnp-title">{{item.board_obj.circle_name}}</div>
									</a>
									<div v-if="item.collection_name" class="circle-extra">来自
										<a @click="$redirect('/collection-detail/id/' + item.board_obj.collection_id + '/')" href="#" class="text-color-green">
											{{item.board_obj.collection_name}}
										</a>
									</div>
									<div v-else-if="item.channel_name" class="circle-extra">来自
										<a @click="$redirect('/channel/id/' + item.board_obj.channel_id + '/')" href="#" class="text-color-green">
											{{item.board_obj.channel_name}}
										</a>
									</div>
									<div v-else class="circle-extra"> &nbsp;
									</div>
									<div @click="$redirect('/circle-detail/id/' + item.board_obj.circle_id + '/')" class="circle-avatar">
										<img v-lazy="$resizeImg(item.board_obj.circle_img, 80, 80)"  />
									</div>
								</div>
							</div>
						</div>
					</div>
					
					
					<!--主题帖-->
					<div v-if="item.board_type=='theme'" class="circle-theme">
						<div class="head">
							<div class="logo">
								<i class="icon material-icons text-color-orange" style="font-size: 2rem;">picture_in_picture</i>
							</div>
							<div class="who hnp-title">
								{{item.who}}
							</div>
							<div class="action-time font-gray-extra">
								{{item.feed_create_time|friendlytime}} {{item.action_name}}
							</div>
							<div class="why">
								<button class="button button-round border-color-gray text-color-gray">推荐关注</button>
							</div>
						</div>
						<div @click="$redirect('/circletheme-detail/id/' + item.board_obj.theme_id + '/')" class="body">
							<img v-if="item.board_obj.main_imgs.length" v-lazy="$resizeImg(item.board_obj.main_imgs[0], 460)" class="avatar ">
							<div class="text" v-html="item.board_obj.theme_content">
							</div>
							<div style="margin: 1rem 0;">
								<span class="font-gray-content">发布者</span> <span class="text-color-green">{{item.board_obj.member_name}}</span>
							</div>
	
							<div class="bottom">
								<span style="float: left;">很牛{{item.board_obj.theme_up_count}} • 评论 {{item.board_obj.theme_commentcount}}</span>
								<span style="float: right;">
									<i class="icon material-icons" style="margin-right: 1rem;">thumb_up</i>
									<i class="icon material-icons" style="">chat_bubble_outline</i>
								</span>
							</div>
						</div>
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
	.card .card-header {
		display: block;
		padding: 10px;
	}
	
	.attentions {
		margin: 0 1.2rem;
	}
	
	.attentions .head {
		position: relative;
		overflow: hidden;
		height: 2.2rem;
		margin: 1.2rem 0;
	}
	
	.attentions .head .who {
		position: absolute;
		top: 0;
		left: 2.5rem;
	}
	
	.attentions .head .action-time {
		position: absolute;
		top: 1.05rem;
		left: 2.5rem;
		font-size: 12px;
	}
	
	.attentions .head .why {
		width: 5.4rem;
		position: absolute;
		top: 0.3rem;
		right: 0;
	}
	
	.attentions .body {
		margin-top: 1rem;
		margin-bottom: 2rem;
	}
	
	.attentions .circle-theme .body img {
		width: 100%;
		height: auto;
	}
	
	.attentions .circle-theme .body .text {
		margin: 1rem 0;
		color: #8e8e93;
		display: -webkit-box;
		/** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical;
		/** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1;
		word-break: break-all;
		/*white-space: nowrap;*/
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.attentions .circle-theme .body .text p {
		margin: 0 0;
	}
	
	.attentions .circle-theme .body .bottom {
		overflow: hidden;
		color: #333333;
		font-weight: 600;
		margin-bottom: 4vw;
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
	
	.cover-mask img {
		border-radius: 15px;
		width: 100%;
		height: auto;
		max-height: 20vw;
	}
	
	.cover-mask .cover-text {
		border-radius: 15px;
		bottom: 0px;
		left: 0;
		height: 10vw;
		text-align: left;
		line-height: 1.6;
		width: 100%;
		/*height: 100%;*/
		background-image: linear-gradient(rgba(33, 33, 33, 0), rgba(33, 33, 33, 0.8));
	}
	
	.cover-mask .cover-text .text-color-white {
		margin: 4% 0 0 5%;
		font-size: 16px;
		font-weight: 600;
	}
	
	.index-cat {
		overflow: hidden;
		padding: 5vw;
	}
	
	.index-cat .item-content {
		border-radius: 8%;
		float: left;
		width: 15.5vw;
		height: 15.5vw;
		display: inline-block;
		margin: 0;
		padding: 1vw 1vw 0 1vw;
	}
	
	.index-cat .cover-mask img {
		border-radius: 8%;
		width: 15.5vw;
		max-height: 15.5vw;
	}
	
	.index-cat .cover-mask .cover-text {
		border-radius: 8%;
		bottom: 0px;
		left: 0;
		width: 15.5vw;
		height: 100%;
		text-align: center;
		line-height: 1.2;
		/*height: 100%;*/
		background-image: linear-gradient(rgba(0, 0, 0, 0.44), rgba(12, 11, 11, 0.25));
	}
	
	.index-cat .cover-mask .cover-text .text-color-white {
		font-size: 16px;
		font-weight: 500;
		padding: 20%;
		margin-top: 10%;
	}
</style>
<script>
	import wap from '../js/wap.js';
	export default {
		data() {
			return {
				allowInfinite: true,
				lastPage: 1,
				feedList: [],
				keyword: '',
			}
		},
		created() {
			this.title = '发现';
		},
		mounted() {
			var app = this.setF7();
			this.loadList(1);
			this.$initGotop();
		},
		
		methods: {
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
				
		        self.feedList = [];
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
				var $ = self.$$;
				var data = {
					keyword : this.keyword,
					cur_page: page,
					page_size: 20,
				}
				wap.getajax('api/user/publicfeed/searchList', data, function(res) {

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
							self.feedList.push(res.data.datalist[i]);
						}
					}
				}, 'v1', false, 300);
				self.lastPage += 1;
				return;
			},

		},
		computed: {
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