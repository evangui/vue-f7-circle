<template>
	<div class="page">
		<div class="weixin-tip">
			<p><img style="max-width: 100%; height: auto;" src="../../static/img/share_in_weixin.png" alt="微信打开" /></p>
		</div>

		<!--底部评论工具栏-->
		<div class="toolbar">
			<div class="toolbar-inner" style="color: #808080;">
				<div class="comment-bar-input sheet-open" data-sheet=".write-comment-sheet" @click="$toggleBackdrop()" style="width: 70%;">
					<i class='icon material-icons' style="float:left;color: rgb(178, 178, 178);font-size:20px;margin-right: 3px;">edit</i>
					<input readonly="true" disabled type="text" style="font-size:18px;width:65%;float:left;" placeholder="发表高见">
				</div>
				<i @click="$goAnchor('#anchor-comments')" class="icon material-icons" style="margin: 0 10px;">
		    		chat_bubble_outline<span class="badge color-orange">{{mutThemeData.theme_commentcount}}</span>
		    	</i>
				<i v-if="!mutThemeData.uped" @click="$upItem('theme', themeID, 'up')" class="icon fa fa-thumbs-o-up" style="margin: 0 10px;">
		    		<span v-if="mutThemeData.theme_up_count" class="badge color-orange">{{mutThemeData.theme_up_count}}</span>
		    	</i>
				<i v-else @click="$upItem('theme', themeID, 'unup')" class="icon fa fa-thumbs-up color-yellow" style="margin: 0 10px;">
		    		<span class="badge color-orange">{{mutThemeData.theme_up_count}}</span>
		    	</i>
				<i v-if="!mutThemeData.liked" @click="$likeItem('theme', themeID, 'like')" class="icon fa fa-heart-o" style="margin: 0 10px;">
		    		<!--<span v-if="mutThemeData.theme_like_count" class="badge color-orange">{{mutThemeData.theme_like_count}}</span>-->
		    	</i>
				<i v-else @click="$likeItem('theme', themeID, 'unlike')" class="icon fa fa-heart color-yellow" style="margin: 0 10px;">
		    		<!--<span class="badge color-orange">{{mutThemeData.theme_like_count}}</span>-->
		    	</i>
				<i v-if="$isWx" @click="$openShare()" class="icon material-icons" style="margin: 0 10px 0 10px;">share</i>
			</div>
		</div>

		<div class="page-content infinite-scroll-content" @infinite="loadMoreComments">
			<div class="navbar color-theme-gray no-hairline">
				<div class="navbar-inner sliding">
					<div class="left">
						<a v-if="!$isWx" href="#" class="link back">
							<i class="icon icon-back"></i>
						</a>
					</div>
					<div class="title">
						<a @click="$redirect('/circle-detail/id/' + theme.circle_id + '/')" class="text-color-orange">{{theme.circle_name}}</a>的生活贴
					</div>
					<div class="right">

					</div>
				</div>
			</div>

			<div class="circle-content">
				<div class="list-item">
					<div class="item-head">
						<img v-lazy="$avatar(theme.member_id)" class="avatar ">
						<!--<div class="head-right">
							<div class="font-gray-extra" style="font-size: 14px;font-weight: 500;margin-top: 0.5rem;">
								{{theme.member_name}}
							</div>
						</div>-->

						<div class="head-right">
							<div class="hnp-title" style="width: 100%;">{{theme.member_name}}</div>
							<div class="text-color-green" style="width: 100%;font-size: 14px;line-height: 1;">
								<span class="font-gray-extra">{{theme.theme_addtime|friendlytime}}</span>
							</div>
						</div>
						<div v-if="$getMemberID() == theme.member_id" style="float: right;overflow: hidden;margin: 0 1rem;">
							<a @click="$redirect('/circletheme-post/?theme_id=' + theme.theme_id)">
								<i class="icon material-icons" style="">edit</i></a>
						</div>
					</div>
					<div class="item-body" style="width: 100%;clear:left;">
						<div v-if="theme.theme_images" class="swiper-container">
							<div class="swiper-pagination"></div>
							<!-- Slides wrapper -->
							<div class="swiper-wrapper">
								<!-- Slides -->
								<div class="swiper-slide" v-for="(item,index) in theme.main_imgs" style="align-self:center;">
									<img @click="openPhotoes(index)" v-lazy="$resizeImg(item,640,640)" class="avatar ">
								</div>

							</div>
						</div>

						<div v-html="theme.theme_content" class="text font-gray-content" style="margin: 0.8rem;">
						</div>
					</div>
					<hr>
					<div class="item-footer">
						<i v-if="!mutThemeData.uped" @click="$upItem('theme', themeID, 'up')" class="icon fa fa-thumbs-o-up" style="margin: 0.5rem;">
				    		<span v-if="mutThemeData.theme_up_count" class="badge color-orange">{{mutThemeData.theme_up_count}}</span>
				    	</i>
						<i v-else @click="$upItem('theme', themeID, 'unup')" class="icon fa fa-thumbs-up color-yellow" style="margin: 0.5rem;">
				    		<span class="badge color-orange">{{mutThemeData.theme_up_count}}</span>
				    	</i>

						<i v-if="!mutThemeData.liked" @click="$likeItem('theme', themeID, 'like')" class="icon fa fa-heart-o" style="margin: 0 10px;">
				    		<!--<span v-if="mutThemeData.theme_like_count" class="badge color-orange">{{mutThemeData.theme_like_count}}</span>-->
				    	</i>
						<i v-else @click="$likeItem('theme', themeID, 'unlike')" class="icon fa fa-heart color-yellow" style="margin: 0 10px;">
				    		<!--<span class="badge color-orange">{{mutThemeData.theme_like_count}}</span>-->
				    	</i>
						<i class="icon material-icons" style="margin: 0 10px;">chat_bubble_outline
							<span class="badge color-orange">{{mutThemeData.theme_commentcount}}</span></i>
					</div>
					<hr>
				</div>
			</div>

			<div class="circle-content comments">
				<div class="comment-title">评论 ({{mutThemeData.theme_commentcount}})</div>
				<div class="comment-list">
					<a name="anchor-comments" id="anchor-comments"></a>

					<div v-for="item in allComments" class="comment-item comment-row">
						<div class="pic-detail">
							<img v-lazy="$avatar(item.member_id)" class="avatar " />
						</div>
						<div class="detail">
							<div class="name"><span>{{item.member_name}}</span></div>
							<div class="up">
								<span v-if="!getMutReply(item.reply_id).uped">
									<i @click="$upItem('theme_reply', item.reply_id, 'up')" class="icon fa fa-thumbs-o-up" style="font-size: 18px;"></i>
									<font v-if="getMutReply(item.reply_id).reply_up">{{getMutReply(item.reply_id).reply_up}}</font>
									<font v-else>&nbsp;</font>
								</span>
								<span v-else>
									<i @click="$upItem('theme_reply', item.reply_id, 'unup')" class="icon fa fa-thumbs-up color-orange" style="font-size: 18px;"></i>
									<font class="text-color-orange">{{getMutReply(item.reply_id).reply_up}}</font>
								</span>
							</div>
							<div class="time"><span>{{item.reply_addtime|friendlytime}}</span></div>
							<div @click="atCommentAuthor(item.reply_id, item.member_name)" class="reply bg-color-white-smoke">
								<div class="text2">
									<span v-if="item.replied_member_name" class="text-color-green">@{{item.replied_member_name}}</span>
									<span v-html="item.reply_content"></span>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>

			<div class="preloader infinite-scroll-preloader"></div>
			<div class="bottom-tip infinite-scroll-preloader font-gray-extra" style="display:none;">机智如你，我就是杏运树来的卧底
				<hr>
			</div>

		</div>

		<!--编辑器-->
		<div class="popover-backdrop backdrop-in" style="display: none;"></div>
		<div class="sheet-modal write-comment-sheet" style="background-color:#ffffff">
			<div class="toolbar">
				<div class="toolbar-inner" style="padding: 0 16px;">
					<div class="left">
						<div @click="$toggleBackdrop()" class="link sheet-close font-gray-extra">取消</div>
					</div>
					<div class="right">
						<a class="link text-color-orange" @click="sendComment()">发布</a>
					</div>
				</div>
			</div>
			<div class="sheet-modal-inner">
				<div class="page-content">
					<div v-if="atAuthor.id" style="padding: 5px 16px;">
						<span id="atName" class="font-gray-content">@{{atAuthor.name}}</span>
						<i @click="removeAt()" class="icon f7-icons color-red" style="font-size: 16px;">delete_round</i>
					</div>
					<editor :placeholder="'在此发表高见，笑谈风声'" @text:change="editorTextChange" enableTools="emotion,at"></editor>
				</div>
			</div>
		</div>

		<remote-js v-if="$isWx" @load="loadedWxJs()" src="//res.wx.qq.com/open/js/jweixin-1.2.0.js"></remote-js>
	</div>
</template>
<style>
	.list-item .item-body {}
	
	.list-item .item-body img {
		width: 100%;
		height: auto;
		border-radius: 0;
	}
	
	.list-item .item-body .text2 {
		margin: 1rem 0;
	}
	
	.list-item .item-body .text2 p {
		margin: 0 0;
	}
</style>

<style scoped>
	.ios .page-content {
		/*background-color: #ffffff;*/
		width: 100%;
		margin: 0;
		font-size: 16px;
		word-wrap: break-word;
		color: #505050;
		line-height: 1.647
	}
	
	.ios .sheet-modal {
		background: #fff0;
	}
	
	.ios .sheet-modal .toolbar:before {
		content: '';
		position: absolute;
		background-color: #DADADA;
		display: block;
		z-index: 15;
		top: 0;
		right: auto;
		bottom: auto;
		left: 0;
		height: 0px;
		width: 100%;
		-webkit-transform-origin: 50% 0%;
		transform-origin: 50% 0%;
	}
	
	.ios .sheet-modal .toolbar {
		background: #ffffff;
		border-top: 1px #DADADA solid;
		border-bottom: 1px #DADADA solid;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	
	.circle-content {
		margin: 1rem 1rem;
		position: relative;
		background-color: #ffffff;
		border-radius: 10px;
	}
	
	.content-list {}
	
	.list-item .item-head {
		/*float: left;*/
		overflow: hidden;
		margin: 0.8rem;
	}
	
	.list-item .item-head .avatar {
		width: 2.1rem;
		height: 2.1rem;
		border-radius: 50%;
		float: left;
	}
	
	.list-item .head-right {
		float: left;
		overflow: hidden;
		margin: 0 0.5rem;
	}
	
	.list-item .item-footer {
		overflow: hidden;
		color: #333333;
		font-weight: 600;
		margin: 0.3rem 0.8rem;
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
	
	.comments {
		position: relative;
		display: block;
		line-height: normal;
		background: #fff;
		font-size: 16px;
		overflow-x: hidden;
		padding: 0 1rem;
	}
	
	.comments .comment-list {
		overflow: hidden;
	}
	
	.comments .comment-title {
		color: #333;
		font-size: 18px;
		font-weight: 500;
		margin-top: 3rem;
	}
	
	.comments .comment-row {
		border-top: 0px solid #dadada;
		margin: 0.6rem 0;
		font-size: 16px;
	}
	
	.comments .comment-row .pic-detail {
		width: 11%;
		float: left;
		margin-right: 3%;
	}
	
	.comments .comment-row .avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
	}
	
	.comments .detail {
		width: 86%;
		float: left;
	}
	
	.comments .comment-row .name {
		font-size: 14px;
		font-weight: 600;
	}
	
	.comments .comment-row .up {
		float: right;
		font-size: 1rem;
		margin-top: -1rem;
		color: #929292;
	}
	
	.comments .comment-row .time {
		clear: left;
		font-size: 14px;
		color: #929292;
		margin-bottom: 2px 0;
	}
	
	.comments .comment-row .text {
		line-height: 1.6;
		color: #505050;
	}
	
	.comments .comment-row .reply {
		margin: 1rem 0;
		padding: 1rem;
		border-radius: 13px;
		min-width: 20%;
		max-width: 76%;
		display: inline-block;
	}
	
	.comments .comment-row .reply .name {
		margin: 0 0 0.3rem 0;
	}
	
	.comments .comment-row .reply .text {
		margin: 0rem 0;
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
</style>
<script>
	import wap from '../js/wap.js';
	import Editor from '../components/editor.vue'
	import '../js/jquery-2.2.4.min.js'
	import '../js/wxShare.js'
	import { mapState, mapGetters } from 'vuex'
	export default {
		data() {
			return {
				wxJSLoaded: 0,
				allowInfinite: true,
				lastPage: 1,

				themeID: 0,
				theme: {},

				itemList: [1, 2, 3],
				showMod: 1,

				hotComments: [],
				allComments: [],
				newCommentsKeyPre: 'article-comment-new-',

				text: '',
				replyObj2Id: 0,
				atAuthor: {
					id: 0,
					name: '',
				},
			}
		},

		created() {
			document.title = '生活贴';
			wap.setAppf7(this.$f7);
			var self = this;
			self.themeID = self.$route.params.id;
		},

		mounted() {
			var self = this;
			var app = this.setF7();

			self.$f7.preloader.show();
			setTimeout(_ => {
				self.$f7.preloader.hide();
			}, 500);

			//获取与设置文章详情数据
			this.loadThemeData();

			//从state中获取易变化数据，如果不存在，则重新获取变化数据
			this.loadThemeMut();

			//发送浏览记录增加请求

			//所有评论
			this.loadAllComments(1);

			this.$$('.backdrop-in').click(function() {
				self.$toggleBackdrop();
				self.$f7.sheet.close('.write-comment-sheet');
			});

			this.$initGotop();
		},

		methods: {
			//加载微信js
			loadedWxJs() {
				var self = this;
				self.wxJSLoaded = 1;
				if(self.theme) {
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
							title: self.theme.theme_content,
							desc: self.theme.theme_content,
							link: window.location.href,
							imgUrl: self.theme.main_imgs[0] || '',
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

			//获取与设置文章详情数据
			loadThemeData() {
				var self = this;
				//详情
				let data = {
					theme_id: self.themeID
				};
				wap.getajax('api/user/circletheme/detail', data, function(res) {
					if(res.status == 'success') {
						self.theme = res.data;
						self.wxJSLoaded && self.initShareWx();

						var photos = [];
						for(var i in self.theme.main_imgs) {
							photos.push({
								url: self.theme.main_imgs[i],
							});
						}

						self.pb = self.$createPhotoBrowser(photos);
						self.$f7.preloader.hide();

						self.$nextTick(function() {
							var swiper = self.$f7.swiper.create('.swiper-container', {
								autoplay: true,
								speed: 600,
								pagination: {
									el: '.swiper-pagination',
								},
							});
						});
					}
				}, 'v1', true, 3600);

			},

			//从state中获取易变化数据，如果不存在，则重新获取变化数据
			loadThemeMut() {
				var self = this;
				let mutTheme = self.getMutTheme(self.themeID, 0);
				if(undefined != mutTheme) {
					return;
				}

				//如果不存在，则重新获取变化数据
				let data = {
					theme_id: self.themeID,
					member_id: self.$getMemberID()
				};
				this.$store.dispatch('getThemeMut', {
					data: data,
					callback: (res) => {}
				});
			},

			openPhotoes(index) {
				this.pb.open(index);
			},

			editorTextChange(text) {
				this.text = text
			},

			atCommentAuthor(replyId, authorName) {
				this.atAuthor = {
					id: replyId,
					name: authorName,
				};
				//		    	
				$('.comment-bar-input input').attr('placeholder', '@' + authorName);
			},
			removeAt() {
				this.atAuthor = {
					id: 0,
					name: '',
				};
				$('.comment-bar-input input').attr('placeholder', '发表高见');
			},

			//发送评论  
			sendComment() {
				var self = this;
				if(!this.text) {
					self.$toast("请输入评论内容", 2000);
					//					self.$f7.dialog.alert('请输入评论内容');
					return;
				}

				//验证用户登录状态
				if(!wap.checkLogin(false)) {
					self.$f7.dialog.alert('请先登录后再评论', '登录提示', function() {
						self.$gotoShop('login.html');
					});
					return;
				}
				//				self.$f7.preloader.show("评论发布中...");
				self.$f7.dialog.progress('评论发布中...');

				setTimeout(function() {
					self.$f7.dialog.close();
				}, 1500);

				let data = {
					obj_id: self.themeID,
					obj2_id: self.atAuthor.id,
					reply_id: self.atAuthor.id,
					reply_content: self.text,
				};
				wap.doajax('api/user/circlethreply/save', data, function(res) {
					if(res.status == 'success') {
						self.$toast("评论成功", 2000, 'center', true, true);

						let oComment = res.data;
						self.$itemCacheFlag('theme-reply', self.articleID, false);
						self.allComments = [];
						self.loadAllComments(1);
						self.theme.theme_commentcount++;

						self.text = '';
						self.$$('.editor-container textarea').val('');

						self.$store.commit('CHANGE_THEME', {
							mid: self.themeID,
							type: 'reply' //up or unup
						});
					}

					self.$f7.dialog.close();
				}, 'v1', true, 0);
				//					self.$f7.preloader.hide();

				self.$toggleBackdrop();
				self.$f7.sheet.close('.write-comment-sheet');
			},

			//下拉触发更多评论
			loadMoreComments: function() {
				var self = this;
				console.log(self.lastPage)

				if(!self.allowInfinite) return;
				//最多50页请求
				if(self.lastPage >= 50) {
					return;
				}

				self.allowInfinite = false;
				self.loadAllComments(self.lastPage);
				self.allowInfinite = true;
			},

			//按页加载评论
			loadAllComments: function(page) {
				var self = this;
				var data = {
					obj_id: self.themeID,
					page_size: 5,
					cur_page: page,
				};

				//根据是否重置缓存列表标志，来设置缓存时间
				let cacheTime = 0;
				if(self.$itemCacheFlag('theme-reply', self.articleID)) {
					cacheTime = 0;
				} else {
					cacheTime = 1800;
				}

				//获取数据
				this.$store.dispatch('getThemeReplies', {
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
							self.allComments.push(res.data.datalist[i]);
						}
					}
				});

				self.lastPage += 1;
				return;
			},

		},

		computed: {
			...mapState([
				'mutThemesState',
			]),
			...mapGetters({
				getMutReply: 'getMutThemeReply',
				getMutTheme: 'getMutTheme',
			}),
			mutThemeData() {
				return this.getMutTheme(this.themeID);
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
		components: {
			Editor
		}

	}
</script>