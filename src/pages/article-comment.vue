<template>
	<div class="page">
		<div v-if="!$isWx" class="navbar color-theme-gray no-hairline">
			<div class="navbar-inner sliding">
				<div class="left">
					<a href="#" class="link back">
						<i class="icon icon-back"></i>
					</a>
				</div>
			</div>
		</div>
		<div class="toolbar">
		    <div class="toolbar-inner" style="color: #808080;">
		    	<div class="comment-bar-input  sheet-open" data-sheet=".write-comment-sheet" style="width:95%" @click="$toggleBackdrop()">
		    		<i class='icon material-icons' style="float:left;color: rgb(178, 178, 178);font-size:20px;margin-right: 3px;">edit</i>
		    		<input readonly="true" disabled  type="text" style="font-size:18px;width:80%;float:left;" placeholder="有何高见，展开讲讲">
		    	</div>
		    </div>
		</div>
		 
		 <div class="page-content infinite-scroll-content" @infinite="loadMoreComments">
			<div class="comments">
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
								<div @click="$redirect('/article-comment-sub/id/' + item.reply_id + '/')" 
									v-if="item.reply.length" class="reply bg-color-white-smoke">
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
				<div v-if="!allComments.length" class="no-content">
					暂无评论
					<div class="br"></div>
					神评论靠你了
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
							<div @click="$redirect('/article-comment-sub/id/' + item.reply_id + '/')" 
								v-if="item.reply.length" class="reply bg-color-white-smoke">
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
			</div> <!--end of comments-->
			<div class="preloader infinite-scroll-preloader"></div>
			<div class="bottom-tip infinite-scroll-preloader font-gray-extra" style="display:none;">机智如你，我就是杏运树来的卧底<hr></div>
		</div><!--end of page-content-->

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
	        		<span  id="atName" class="font-gray-content">@{{atAuthor.name}}</span>
	        		<i @click="removeAt()" class="icon f7-icons color-red" style="font-size: 16px;">delete_round</i>
	        	</div>
	        	<editor :placeholder="'在此发表高见，笑谈风声'" @text:change="editorTextChange" enableTools="emotion,at"></editor>
	        </div>
	      </div>
	    </div>
	    
	</div>

</template>
<style scoped>
	.list .item-title-row {
		margin: 0;
	}
	
	.ios .page-content {
		background-color: #ffffff;
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
	.comments .comment-list{
		overflow: hidden;
	}
	
	.comments .comment-title {
		color: #333;
		font-size: 18px;
		font-weight: 500;
		margin-top:2rem;
	}
	
	.comments .comment-row {
    	border-top: 0px solid #dadada;
	    margin: 0.6rem 0;
	    font-size: 16px;
	    overflow: hidden;
    }
    
	.comments .comment-row .pic-detail {
	    width: 11%;
	    float:left;
	    margin-right: 1%;
    }
    .comments .comment-row .avatar{
	    width: 2rem;
	    height: 2rem;
	    border-radius: 50%;
    }
    
	.comments .detail {
		width:88%;
		float:left;
    }
    
    .comments .comment-row .name {
    	font-size: 16px;
    	font-weight: 600;
    	color: #333;
    }
    .comments .comment-row .up {
    	float:right;
    	font-size:1rem;
    	margin-top:-1rem;
    	color: #929292;
    }
    .comments .comment-row .time {
    	clear:left;
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
	.comments .comment-row .reply .name{
		margin: 0 0 0.3rem 0;
	}
	.comments .comment-row .reply .text{
		margin: 0rem 0;
	}
	
</style>
<script>
	import Editor from '../components/editor.vue'
	import {mapState,mapGetters} from 'vuex'

	export default {
		data() {
			return {
				allowInfinite: true,
				lastPage: 1,
				
				articleID: 0,
				hotComments: [],
				newComments: [],
				allComments: [],
				
				text:'',
				replyObj2Id: 0,
				atAuthor: {
					id: 0,
					name: '',
				},
			}
		},
		created() {
			document.title = '评论回复';
			var self = this;
			self.articleID = self.$route.params.id;
		},
		
		mounted() {
			var self = this;
			var app = this.setF7();
			//推荐评论
			this.loadHotComments();
			//所有评论
			this.loadAllComments(1);
			
			this.$$('.backdrop-in').click(function() {
//				self.$$('.sheet-modal').hide();
				self.$toggleBackdrop();
				self.$f7.sheet.close('.write-comment-sheet');
			});
			
			this.$initGotop();
		},
		
		methods: {
			editorTextChange(text) {
		      this.text = text
		    },
		    
		    atCommentAuthor(replyId, authorName) {
		    	this.atAuthor = {
		    		id: replyId,
		    		name: authorName,
		    	};
//		    	
		    	$('.comment-bar-input input').attr('placeholder', '@'+authorName);
		    },
		    removeAt() {
		    	this.atAuthor = {
		    		id: 0,
		    		name: '',
		    	};
		    	$('.comment-bar-input input').attr('placeholder', '有何高见，展开讲讲');
		    },
		  
		  /**
		   * 发送评论触发事件处理
		   */
			sendComment() {
				var self = this;
				if (!this.text) {
					self.$toast("请输入评论内容", 2000);
//					self.$f7.dialog.alert('请输入评论内容');
					return;
				}
				
				//验证用户登录状态
				if(!this.$wap.checkLogin(false)) {
					self.$f7.dialog.alert('请先登录后再评论', '登录提示', function () {
		          		self.$gotoShop('login.html');
			        });
					return;
				}
//				self.$f7.preloader.show("评论发布中...");
				self.$f7.dialog.progress('评论发布中...');
				
				setTimeout(function(){
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
						self.$toast('评论成功', 3000, 'center', true, true);
						
						var oComment = res.data;

						self.$itemCacheFlag('article-reply', self.articleID, false);
						self.allComments = [];
						self.loadAllComments(1);
						
						self.text = '';
						self.$$('.editor-container textarea').val('');
						
						//文章回复数增加
						self.$store.commit('CHANGE_ARTICLE', {
						    mid: self.articleID,
						    type: 'reply'	//up or unup
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
				if (self.$itemCacheFlag('article-reply', self.articleID)) {
					cacheTime = 0;
				} else {
					cacheTime = 1800;
				}
				console.log(cacheTime);
				
				//获取数据
				this.$store.dispatch('getArticleReplies', {
			        data: data,
			        cacheTime: cacheTime,
			        callback: (res) => {
			        	if(res.status != 'success') {
			        		return;
			        	}
			        	
						if (page >= res.data.countPage) {
							self.$f7.infiniteScroll.destroy('.infinite-scroll-content');
							self.$$('.preloader').remove();
							if (self.lastPage > 2) {
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
			        cacheTime: 600,
			        callback: (res) => {
			        	self.hotComments = res.data.datalist;
			        }
			     });
			},
			
		},
		
		computed: {
		    ...mapState([
		      'mutArticleRepliesState',
		    ]),
		    ...mapGetters({
		      getMutReply: 'getMutArticleReply',
		      getMutArticle: 'getMutArticle',
		    }),
		  },
		  
		components: {
			Editor
		}

	}
</script>