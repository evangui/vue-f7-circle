<template>
	<div class="page">
		<div class="weixin-tip">
			<p><img style="max-width: 100%; height: auto;" src="../../static/img/share_in_weixin.png" alt="微信打开" /></p>
		</div>

		<!--底部评论工具栏-->
		<div class="toolbar">
			<div class="toolbar-inner" style="color: #B2B2B2">
				<div class="comment-bar-input sheet-open" data-sheet=".write-comment-sheet" @click="$toggleBackdrop()">
					<i class='icon material-icons' style="float:left;color: rgb(178, 178, 178);font-size:20px;margin-right: 3px;">edit</i>
					<input readonly="true" disabled type="text" style="font-size:18px;width:65%;float:left;" placeholder="发表高见">
				</div>
				<i @touchstart="$goAnchor('.comments',200)" class="icon material-icons" style="margin: 0 6px;">
		    		chat_bubble_outline
		    		<span v-if="mutArticleData.article_comment_count" class="badge color-orange">{{mutArticleData.article_comment_count}}</span>
		    	</i>
				<i v-if="!mutArticleData.uped" @click="$upItem('article', articleID, 'up')" class="icon fa fa-thumbs-o-up" style="margin: 0 6px;">
		    		<span v-if="mutArticleData.article_up" class="badge color-orange">{{mutArticleData.article_up}}</span>
		    	</i>
				<i v-else @click="$upItem('article', articleID, 'unup')" class="icon fa fa-thumbs-up color-yellow" style="margin: 0 6px;">
		    		<span class="badge color-orange">{{mutArticleData.article_up}}</span>
		    	</i>

				<i v-if="!mutArticleData.liked" @click="$likeItem('article', articleID, 'like')" class="icon fa fa-heart-o" style="margin: 0 6px;">
		    	</i>
				<i v-else @click="$likeItem('article', articleID, 'unlike')" class="icon fa fa-heart color-yellow" style="margin: 0 6px;">
		    	</i>

				<i v-if="$isWx" @click="$openShare()" class="icon material-icons" style="margin: 0 6px 0 6px;">share</i>
			</div>
		</div>

		<!--page-content-->
		<div class="page-content hide-navbar-on-scroll infinite-scroll-content" @infinite="loadMoreComments">
			<!--.header 部分样式须严格遵守-->
			<div class="head-img" style="position: relative;overflow: hidden;">
				<img style="border-radius: 0;width: 100vw;height: 66.66vw;" :src="$resizeImg(article.article_image,460)" />

				<div class="float-icon-nav">
					<div class="float-icon-left">
						<a v-if="!$isWx" @click="$backSpec('/attention/')" class="icon-item">
							<i class="icon icon-back color-white link"></i>
						</a>
					</div>
					<div class="float-icon-right">
						<a class="icon-item popover-open" data-popover=".popover-menu">
							<i class="icon material-icons">more_vert</i>
						</a>
					</div>
				</div>

				<div @click="openPhotoes()" class="collection-cover-text">
					<div class="text-color-white" style="padding-top: 30vw;font-size: 1.6rem;font-weight: 600;">
						{{article.article_title}}
					</div>
					<div style="padding: 0.5rem 1rem;font-size: 1rem;color: #C0C0C0;">
						<div class="subtitle">
							<a></a>
							<!--<time>{{article.article_abstract|substr(60) }}</time>-->
						</div>
					</div>
				</div>
			</div>

			<div class="header">
				<h1>{{article.article_title}}</h1>
				<div class="subtitle">
					<a id="source" class="external">{{article.article_origin}}</a>
					<time>{{article.article_publish_time|friendlytime}} · 浏览：{{mutArticleData.article_click}}</time>
				</div>
			</div>
			<!--正文内容请放在article标签中, 此标签内所有链接都会被过滤-->
			<article id="article-con" v-html="article.article_content" v-lazy-container="{ selector: 'img' }">
			</article>

			<div v-if="article.article_stores && article.article_stores.length" class="relate-title">
				提到的店 <span class="special text-color-red"> {{article.article_stores.length}}</span>
			</div>

			<div v-if="article.article_stores" class="list media-list">
				<ul>
					<li v-for="item in article.article_stores">
						<a class="item-content">
							<div @click="$redirect('/store-detail/id/' + item.store_id + '/')" class="item-media"><img v-lazy="item.store_logo" width="80" /></div>
							<div class="item-inner">
								<div class="item-title-row">
									<div @click="$redirect('/store-detail/id/' + item.store_id + '/')" class="item-title">{{item.store_name}}</div>
									<div class="item-after">
										<i v-if="!getMutStore(item.store_id).liked" @click="$likeItem('store', item.store_id, 'like')" class="icon fa fa-heart-o" style="font-size: 18px;">
								    	</i>
										<i v-else @click="$likeItem('store', item.store_id, 'unlike')" class="icon fa fa-heart color-yellow" style="font-size: 18px;;">
								    	</i>
									</div>
								</div>
								<div @click="$redirect('/store-detail/id/' + item.store_id + '/')">
									<div class="item-text">人均：￥{{item.average_price}} | {{item.biz_district_name}} | {{item.gc_name}}</div>
									<div class="item-text location-info"><i class="icon material-icons color-orange">location_on</i>{{item.store_address}}</div>
								</div>
							</div>
						</a>
					</li>
				</ul>
			</div>

			<div class="comments">
				<div style="color:#A9A9A9;font-size:13px;margin:1rem 0;">本页面由杏运树采用应用内搜索技术自动抓取，在未改变文章原意的情况下对版式做了优化以提升阅读体验。如有疑义，请及时告知我们尽快调整。</div>
				<hr>
				<div v-if="hotComments.length">
					<div class="comment-title">热门评论</div>
					<div class="comment-list">
						<div v-for="item in hotComments" class="comment-item comment-row">
							<div class="pic-detail">
								<img v-lazy="$avatar(item.member_id)" class="avatar " />
							</div>
							<div class="detail">
								<div class="name"><span>{{item.member_name}}</span></div>
								<div class="up">
									<span v-if="!getMutReply(item.reply_id).uped">
										<i @click="$upItem('article_reply', item.reply_id, 'up')" class="icon fa fa-thumbs-o-up" style="font-size: 18px;"></i>
										<font v-if="getMutReply(item.reply_id).reply_up">{{getMutReply(item.reply_id).reply_up}}</font>
										<font v-else>&nbsp;</font>
									</span>
									<span v-else>
										<i @click="$upItem('article_reply', item.reply_id, 'unup')" class="icon fa fa-thumbs-up color-orange" style="font-size: 18px;"></i>
										<font class="text-color-orange">{{getMutReply(item.reply_id).reply_up}}</font>
									</span>
								</div>

								<div class="time"><span>{{item.reply_addtime|friendlytime}}</span></div>
								<div @click="atCommentAuthor(item.reply_id, item.member_name)" class="text"><span>{{item.reply_content}}</span></div>
								<div @click="$redirect('/article-comment-sub/id/' + item.reply_id + '/')" v-if="item.reply.length" class="reply bg-color-white-smoke">
									<div v-for="reply in item.reply">
										<div class="name"><span>{{reply.member_name}}：</span></div>
										<div class="text">
											<span v-if="reply.replied_member_id && reply.replied_replyid!=item.reply_id" class="text-color-green">回复 {{reply.replied_member_name}}：</span>
											<span>{{reply.reply_content}}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<hr>
				</div>

				<div class="comment-title">最新评论</div>
				<div v-if="!allComments.length" style="margin:3rem 0 1rem 0;text-align: center;">
					期待你的神评论
				</div>
				<div class="comment-list">
					<div v-for="item in allComments" class="comment-item comment-row">
						<div class="pic-detail">
							<img v-lazy="$avatar(item.member_id)" class="avatar " />
						</div>
						<div class="detail">
							<div class="name"><span>{{item.member_name}}</span></div>
							<div class="up">
								<span v-if="!getMutReply(item.reply_id).uped">
									<i @click="$upItem('article_reply', item.reply_id, 'up')" class="icon fa fa-thumbs-o-up" style="font-size: 18px;"></i>
									<font v-if="getMutReply(item.reply_id).reply_up">{{getMutReply(item.reply_id).reply_up}}</font>
									<font v-else>&nbsp;</font>
								</span>
								<span v-else>
									<i @click="$upItem('article_reply', item.reply_id, 'unup')" class="icon fa fa-thumbs-up color-orange" style="font-size: 18px;"></i>
									<font class="text-color-orange">{{getMutReply(item.reply_id).reply_up}}</font>
								</span>
							</div>
							<div class="time"><span>{{item.reply_addtime|friendlytime}}</span></div>
							<div @click="atCommentAuthor(item.reply_id, item.member_name)" class="text"><span>{{item.reply_content}}</span></div>
							<div @click="$redirect('/article-comment-sub/id/' + item.reply_id + '/')" v-if="item.reply.length" class="reply bg-color-white-smoke">
								<div v-for="reply in item.reply">
									<div class="name"><span>{{reply.member_name}}：</span></div>
									<div class="text">
										<span v-if="reply.replied_member_id && reply.replied_replyid!=item.reply_id" class="text-color-green">回复 {{reply.replied_member_name}}：</span>
										<span>{{reply.reply_content}}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>

			</div>
			<!--end of comments-->

			<div class="preloader infinite-scroll-preloader"></div>
			<div class="bottom-tip infinite-scroll-preloader font-gray-extra" style="display:none;">机智如你，我就是杏运树来的卧底
				<hr>
			</div>
		</div>
		<!--end of page-content-->

		<!--编辑器-->
		<div class="popover-backdrop backdrop-in" style="display: none;"></div>
		<div class="sheet-modal write-comment-sheet" style="">
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
	@import url("../css/article.css");
</style>

<style scoped>
	.list .item-title-row {
		margin: 0;
	}
	
	.ios .page-content {
		background-color: #ffffff;
	}
	
	.header {
		display: block;
		margin: 24px 15px;
		padding: 0
	}
	
	.header time,
	.header #source {
		display: inline-block;
		font-size: 11px;
		color: inherit;
		height: auto;
		line-height: 1
	}
	
	.header time {
		padding-left: 6px
	}
	
	article {
		overflow: hidden;
		font-size: 18px;
		word-wrap: break-word;
		text-align: justify;
		margin: 0 15px 20px;
		color: #505050;
		line-height: 1.647
	}
	
	p {
		word-wrap: break-word;
		text-align: justify;
		margin: 0 0 20px;
		color: #505050;
		line-height: 1.7;
		padding: 0
	}
	/*a {
		color: #3c6598;
		text-decoration: none;
		border: 0;
		outline: 0
	}
	
	a.text-link {
		color: #3c6598
	}*/
	
	.relate-title {
		position: relative;
		display: block;
		font-size: 1em;
		font-weight: 700;
		word-wrap: break-word;
		margin: 0px 15px 15px 15px;
		padding-left: 9px;
		color: #333333;
		line-height: normal;
	}
	
	.relate-title:before {
		content: '';
		position: absolute;
		width: 4px;
		height: 84%;
		top: 4px;
		left: 0;
		background: #ff3b30;
		border-radius: 20%;
	}
	
	.relate-title .special {
		font-size: 1.6em;
		font-weight: 700;
		word-wrap: break-word;
		color: #333333;
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
	
	.comments {
		position: relative;
		display: block;
		margin: 0px 15px 15px 15px;
		line-height: normal;
		background: #fff;
		font-size: 16px;
		color: #505050;
		overflow-x: hidden;
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
		overflow: hidden;
	}
	
	.comments .comment-row .pic-detail {
		width: 11%;
		float: left;
		margin-right: 1%;
	}
	
	.comments .comment-row .avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
	}
	
	.comments .detail {
		width: 88%;
		float: left;
	}
	
	.comments .comment-row .name {
		font-size: 16px;
		font-weight: 600;
		color: #333;
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
		color: #5d5d5d;
	}
	
	.comments .comment-row .reply {
		margin: 0.4rem 0;
		padding: 0.5rem;
		border-radius: 2%;
	}
	
	.comments .comment-row .reply .name {
		margin: 0 0 0.3rem 0;
	}
	
	.comments .comment-row .reply .text {
		margin: 0rem 0;
	}
	
	.head-img img {
		border-radius: 0;
	}
	
	.collection-cover-text {
		border-radius: 0px;
		position: absolute;
		bottom: 0px;
		left: 0;
		height: 66.66vw;
		text-align: center;
		line-height: 1.6;
		width: 100%;
		/*height: 100%;*/
		background-image: linear-gradient(rgba(66, 66, 66, 0.00), rgba(66, 66, 66, 1));
	}
</style>
<script>
	import Editor from '../components/editor.vue'
	import { mapState, mapGetters } from 'vuex'
	import wap from '../js/wap.js';
	import '../js/jquery-2.2.4.min.js'
	import '../js/wxShare.js'

	export default {
		data() {
			return {
				wxJSLoaded: 0,	//微信js是否已加载完毕
				article: [],	//当前文章

				allowInfinite: true,	//是否允许无限加载
				lastPage: 1,

				articleID: 0,
				hotComments: [],	//热门评论
				allComments: [],	//所有评论

				text: '',
				replyObj2Id: 0,
				atAuthor: {
					id: 0,
					name: '',
				},
			}
		},

		created() {
			var self = this;
			self.articleID = self.$route.params.id;
			document.title = '杏运树-文章详情';
		},

		mounted() {
			var self = this;
			var app = this.setF7();
			self.$f7.preloader.show();
			setTimeout(_ => {
				self.$f7.preloader.hide();
			}, 500);

			//获取与设置文章详情数据
			this.loadArticleData();

			//从state中获取易变化数据，如果不存在，则重新获取变化数据
			this.loadArticleMut();

			//发送浏览记录增加请求

			//推荐评论
			this.loadHotComments();
			//所有评论
			this.loadAllComments(1);

			this.$$('.backdrop-in').click(function() {
				//				self.$$('.sheet-modal').hide();
				self.$toggleBackdrop();
				self.$f7.sheet.close('.write-comment-sheet');
			});

			setTimeout(_ => {
				$('#article-con a').each(function() {
					$(this).addClass('external');
				});

				//图片查看器
				$('#article-con img').each(function() {
					$(this).click(_ => {
						console.log(this.src);
						self.$openOnePhoto(this.src);
					});
				});

			}, 1200);

			this.$initGotop();
		},

		methods: {
			loadedWxJs() {
				var self = this;
				self.wxJSLoaded = 1;
				if(self.article) {
					self.initShareWx();
				}
			},

			//初始化微信分享，从服务端获取当前微信配置参数
			initShareWx() {
				var self = this;
				//微信分享，分享数据要在异步获取文章详情后初始化
				if(this.$isWx) {
					setTimeout(_ => {
						this.$wap.setWxConfig();
						//分享对象使用
						var shareData = {
							title: self.article.article_title,
							desc: self.article.article_abstract,
							link: window.location.href,
							imgUrl: self.article.article_image,
							success: function() {
								self.$toast('分享成功', 2000, 'center', false, true);
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
			loadArticleData() {
				var self = this;
				let data = {
					article_id: self.articleID
				};

				//获取详情数据
				this.$wap.getajax('api/user/cmsarticle/detail', data, function(res, fromCache) {
					if(res.status == 'success') {
						if(res.status == 'success') {
							self.article = res.data;
							var photos = [];
							for(var i in self.article.all_images) {
								photos.push({
									url: self.article.all_images[i],
								});
							}

							self.pb = self.$createPhotoBrowser(photos);
							self.$f7.preloader.hide();

							self.wxJSLoaded && self.initShareWx();
						}
					}

					self.$f7.preloader.hide();
				}, 'v1', true, 7200);
			},

			//从state中获取易变化数据，如果不存在，则重新获取变化数据
			loadArticleMut() {
				var self = this;
				let mutArticle = self.getMutArticle(self.articleID, 0);
				if(undefined != mutArticle) {
					self.clickArticle();
					return;
				}

				//如果不存在，则重新获取变化数据
				let data = {
					article_id: self.articleID,
					member_id: self.$getMemberID()
				};
				this.$store.dispatch('getArticleMut', {
					data: data,
					callback: (res) => {
						self.clickArticle();
					}
				});
			},

			//打开相册
			openPhotoes(index) {
				this.pb.open(index);
			},

			clickArticle() {
				var self = this;
				this.$store.dispatch('clickArticle', {
					article_id: self.articleID,
					callback: (res) => {}
				});
			},

			editorTextChange(text) {
				this.text = text
			},
			//添加回复某人的at信息
			atCommentAuthor(replyId, authorName) {
				this.atAuthor = {
					id: replyId,
					name: authorName,
				};
				//		    	
				$('.comment-bar-input input').attr('placeholder', '@' + authorName);
			},
			//移除评论At回复人
			removeAt() {
				this.atAuthor = {
					id: 0,
					name: '',
				};
				$('.comment-bar-input input').attr('placeholder', '发表高见');
			},
			//发送评论事件处理
			sendComment() {
				var self = this;
				if(!this.text) {
					self.$toast("请输入评论内容", 2000);
					//					self.$f7.dialog.alert('请输入评论内容');
					return;
				}

				//验证用户登录状态
				if(!this.$wap.checkLogin(false)) {
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

				var data = {
					obj_id: self.articleID,
					obj2_id: self.atAuthor.id,
					reply_id: self.atAuthor.id,
					reply_content: self.text,
				};
				this.$wap.doajax('api/user/articlereply/save', data, function(res) {

					if(res.status == 'success') {
						self.$toast("评论成功", 3000, 'center', true, true);

						var oComment = res.data;
						self.$itemCacheFlag('article-reply', self.articleID, false);
						self.allComments = [];
						self.loadAllComments(1);

						self.text = '';
						self.$$('.editor-container textarea').val('');

						//文章回复数增加
						self.$store.commit('CHANGE_ARTICLE', {
							mid: self.articleID,
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
					obj_id: self.articleID,
					page_size: 5,
					cur_page: page,
				};

				//根据是否重置缓存列表标志，来设置缓存时间
				let cacheTime = 0;
				if(self.$itemCacheFlag('article-reply', self.articleID)) {
					cacheTime = 0;
				} else {
					cacheTime = 1800;
				}

				//获取数据
				this.$store.dispatch('getArticleReplies', {
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

			//推荐评论
			loadHotComments: function() {
				var self = this;
				let data = {
					obj_id: self.articleID,
					page_size: 6,
					cur_page: 1,
					commend: 1,
				};

				//获取数据
				this.$store.dispatch('getArticleReplies', {
					data: data,
					cacheTime: 1800,
					callback: (res) => {
						self.hotComments = res.data.datalist;
					}
				});

			},
		},

		computed: {
			...mapState([
				'mutArticlesState',
			]),
			...mapGetters({
				getMutReply: 'getMutArticleReply',
				getMutArticle: 'getMutArticle',
				getMutStore: 'getMutStore',
			}),
			mutArticleData() {
				return this.getMutArticle(this.articleID);
			}
		},

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