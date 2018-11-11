<template>
	<div class="page">
		<div class="weixin-tip">
			<p><img style="max-width: 100%; height: auto;" src="../../static/img/share_in_weixin.png" alt="微信打开"/></p>
		</div>
		
		<!--<div class="fab fab-right-bottom color-green">
		    <a href="#">
		      <i class="icon f7-icons">share</i>
		      <i class="icon f7-icons">close</i>
		    </a>
		    <div class="fab-buttons fab-buttons-top">
		      <a href="">收藏</a>
		      <a href="">2</a>
		      <a href="">3</a>
		    </div>
		  </div>-->

		<div class="page-content">
			<div class="head-img" style="position: relative;overflow: hidden;">
				<img style="border-radius: 0;width: 100vw;height: 66.66vw;" 
					:src="$resizeImg(collection.cl_image,460)" />

				<div class="float-icon-nav">
					<div class="float-icon-left">
						<a class="icon-item">
							<i class="icon icon-back color-white link back"></i>
						</a>
					</div>
					<div class="float-icon-right">
						<a class="icon-item">
							<i v-if="!mutCollectionData.liked" @click="$likeItem('collection', collectionID, 'like')" 
								class="icon fa fa-heart-o">
					    		<span v-if="mutCollectionData.cl_like_count" class="badge color-orange">{{mutCollectionData.cl_like_count}}</span>
					    	</i>
					    	<i v-else @click="$likeItem('collection', collectionID, 'unlike')" 
					    		class="icon fa fa-heart color-yellow" >
					    		<span class="badge color-orange">{{mutCollectionData.cl_like_count}}</span>
					    	</i>
				    	</a>
				    	<a v-if="$isWx" class="icon-item">
				    		<i @click="$openShare()"  class="icon material-icons" >share</i>
				    	</a>
				    	<a class="icon-item popover-open"  data-popover=".popover-menu">
				    		<i class="icon material-icons" >more_vert</i>
				    	</a>
					</div>
				</div>
				
				<div class="collection-cover-text">
					<div class="text-color-white" style="padding-top: 30vw;font-size: 1.6rem;font-weight: 600;">
						{{collection.cl_name}}
					</div>
					<div style="padding: 0.5rem 1rem;font-size: 1rem;color: #C0C0C0;">
						{{collection.cl_intro}}
					</div>
				</div>
			</div>

			<div class="collection-content">
				<div v-for="superGroup in collection.cl_group_articles">
					<div class="white-title">{{superGroup.superTitle}}</div>
					
					<div class="list-content">
						<div v-for="group in superGroup.list" class="list">
							
							<div v-if="group.smallTitle" class="sub-list">
								<div class="sub-list-title">{{group.smallTitle}}</div>
								<div v-for="item in group.articleList" class="sub-item">
									<a @click="$redirect('/article-detail/id/' + item.article_id + '/')">
										<img v-lazy="item.article_image ? $resizeImg(item.article_image,460) : $defaultArticleImg" class="left-item "/>
										<div class="right-item">{{item.article_title}}</div>
									</a>
								</div>
							</div>
							
							<div v-else>
								<div v-for="item in group.articleList" class="item">
								<a @click="$redirect('/article-detail/id/' + item.article_id + '/')">
									<div class="collection-opacity-black">
										<img v-lazy="item.article_image ? $resizeImg(item.article_image,460) : $defaultArticleImg" style="width: 100%;max-height: 33vw;"  />
									</div>
									<div class="collection-opacity-subtitle" style="font-weight: 600;">{{item.article_title}}</div>
								</a>
							</div>
							</div>
							
						</div>
					</div>
					
				</div>
				
				<div v-if="collection.cl_circles && collection.cl_circles.length" class="white-title">派友圈</div>
				<div class="list-content">
					<div class="list">
						<div class="circle-sub-list">
							<div v-for="item in collection.cl_circles" class="circle-sub-item">
								<a @click="$redirect('/circle-detail/id/' + item.circle_id + '/')">
									<img v-lazy="$resizeImg(item.circle_img,80,80)" class="left-item "/>
									<div class="right-item">
										<div class="sub-info"> 
											<span v-if="item.circle_mcount" >
											{{item.circle_mcount}}人正在关注
											</span>
											<span v-else >
											火速围观
											</span>
										</div>
										<div class="title">{{item.circle_name}}</div>	
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>
				
				<div v-if="collection.cl_stores && collection.cl_stores.length" class="white-title">店单</div>
				<div id="storesDiv" class="list media-list" style="margin: 0 1rem;">
					<ul style="background-color: #212121;">
						<li v-for="item in collection.cl_stores">
							<a @click="$redirect('/store-detail/id/' + item.store_id + '/')" class="item-content">
								<div class="item-inner">
									<div class="item-row">
										<div class="item-cell col">
											<img style="width: 84vw;height: 24vw;" v-lazy="$resizeImg(item.store_banner, 460,160)"  />
										</div>
									</div>
									<div class="item-title-row">
										<div class="item-title" style="color: #DCDCDC;">{{item.store_title || item.store_jingle || '这应该是一个极好的店'}}</div>
										<div class="item-after"><i class="icon material-icons color-orange">location_on</i>{{item.biz_district_name}}</div>
									</div>
									<div class="item-text">{{item.store_name}}</div>
								</div>
							</a>
						</li>
					</ul>
				</div>
				
				<div v-if="collectionList && collectionList.length" class="white-title">相关牛研所</div>
				<div class="list-content">
					<div class="list">
						<div v-for="item in collectionList" class="item">
							<a @click="$redirect('/collection-detail/id/' + item.cl_id + '/');loadContent(item.cl_id)">
								<div class="collection-opacity-black">
									<img v-lazy="$resizeImg(item.cl_image,460,287)"  style="max-height: 52vw;"/>
								</div>
								<div class="collection-opacity-cat">{{item.cl_channel_name}}</div>
								<div class="collection-opacity-title">{{item.cl_name}}</div>
								<div class="collection-opacity-subtitle">{{item.cl_like_count}}人正在研究</div>
							</a>
						</div>
					</div>
				</div>
				
				<div class="bottm-info row" style="padding: 8vw 30vw;overflow: hidden;text-align: center;color: #fff;">
					<!--<div class="col">
						<div><i class="icon material-icons color-white">share</i></div>
						<div class="text">反馈</div>
					</div>-->
					<div class="col">
				    	<i v-if="!mutCollectionData.liked" @click="$likeItem('collection', collectionID, 'like')" 
							class="icon fa fa-heart-o" style="margin: 0 10px;">
				    		<span v-if="mutCollectionData.cl_like_count" class="badge color-orange">{{mutCollectionData.cl_like_count}}</span>
				    	</i>
				    	<i v-else @click="$likeItem('collection', collectionID, 'unlike')" 
				    		class="icon fa fa-heart color-yellow" style="margin: 0 10px;">
				    		<span class="badge color-orange">{{mutCollectionData.cl_like_count}}</span>
				    	</i>
						
						<div class="text">收藏</div>
					</div>
					<div v-if="$isWx" @click="$openShare()"  class="col">
						<div><i class="icon material-icons color-white">share</i></div>
						<div class="text">分享</div>
					</div>
				
				</div>
			</div>

		</div>
		
		<remote-js v-if="$isWx" @load="loadedWxJs()"  src="//res.wx.qq.com/open/js/jweixin-1.2.0.js"></remote-js>
	</div>

</template>
<style scoped>
	.ios .list .item-inner:after {
	  background-color: #696969;
	  height: 0px
	}

	.collection-content {
		width: 100%;
		margin: 0;
		background-color: rgb(33, 33, 33);
		overflow: hidden;
		font-size: 16px;
		word-wrap: break-word;
		color: #505050;
		line-height: 1.647
	}
	
	.collection-content .sub-list {
		margin: 1.5rem 1rem 2rem 1rem;
	}
	.collection-content .sub-list .sub-list-title {
	    height: 5vw;
	    background-color: rgb(57,57,57);
	    color: #C0C0C0;
	    border-top-right-radius: 0.6em;
	    border-top-left-radius: 0.6rem;
	    padding: 2vw 3vw;
	    font-size: 1rem;
	}
	
	.collection-content .sub-list .sub-item {
		margin-top: 0.4rem;
	    background-color: rgb(57,57,57);
	    padding: 2vw;
	    overflow: hidden;
	}
	.collection-content .sub-list .sub-item:last-child{
	    border-bottom-right-radius: 0.6em;
	    border-bottom-left-radius: 0.6rem;
	    overflow: hidden;
	}
	
	.collection-content .sub-list .left-item {
		float: left;
	    width: 35%;
	    max-height: 24vw;
	    color: #F5F5F5;
	}
	.collection-content .sub-list .right-item {
		float: left;
		font-size:0.9rem;
	    width: 60%;
	    margin: 2vw 0 0 2vw;
	    color: #F5F5F5;
	}
	
	.collection-content .circle-sub-list {
		margin: 1.5rem 0.5rem 2rem 0.5rem;
	}
	.collection-content .circle-sub-item {
		margin-top: 0.15rem;
	    background-color: rgb(57,57,57);
	    padding: 0.6rem;
	    overflow: hidden;
	}
	
	.collection-content .circle-sub-item:first-child {
		margin-top:1rem;
	    border-top-right-radius: 0.6em;
	    border-top-left-radius: 0.6rem;
	}
	.collection-content .circle-sub-item:last-child {
	    border-bottom-right-radius: 0.6em;
	    border-bottom-left-radius: 0.6rem;
	}
	
	.collection-content .circle-sub-item .left-item {
	    float: left;
	    width: 20%;
	    min-height: 15vw;
	    max-height: 20vw;
	    color: #F5F5F5;
	    border-radius: 12%;
	}
	.collection-content .circle-sub-item .right-item {
		float: left;
	    width: 68%;
	    margin: 0 1rem;
	    color: #FFFFFF;
		font-size: 1.00rem;
		font-weight: 800;
		line-height: 1.4;
	}
	.collection-content .circle-sub-item .right-item .sub-info {
	    color: #C0C0C0;
		font-size: 0.8rem;
		font-weight: 400;
		line-height: 1.4;
		margin-bottom: 0.6rem;
	}
	
	

	.collection-content .item{
		.background-color: rgb(33,33,33);padding: 0.5rem 1rem;position: relative;
	}
	
	
	.collection-content h1,
	h2,
	h3,
	h4 {
		position: relative;
		display: block;
		font-weight: 700;
		word-wrap: break-word;
		margin: 20px 0;
		padding-left: 9px;
		color: #222;
		line-height: normal
	}
	
	.white-title {
		position: relative;
		display: block;
		font-size: 1.4em;
		font-weight: 700;
		word-wrap: break-word;
		margin: 15px 15px 15px 15px;
		color: #F5F5F5;
		line-height: normal;
	}
	
	.list-content {
		margin: 0 15px;
	}
	
	.location-info {
		font-size: 14px!important;
		width: 86%;
		margin: 0 0 0 -4px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
<script>
	import wap from '../js/wap.js';
	import '../js/jquery-2.2.4.min.js'
	import '../js/wxShare.js'
	import {mapState,mapGetters} from 'vuex'
	export default {
		data() {
			return {
				wxJSLoaded: 0,
				collectionID: 0,
				collection: [],
				
				collectionList: [],
			}
		},
		created() {
			var self = this;
			document.title = '牛研所';
			wap.setAppf7(this.$f7);
			var self = this;
			
//			self.collectionID = self.$route.params.id;
			
		},
		
		mounted() {
			var self = this;
			var app = this.setF7();
			
			this.loadContent(self.$route.params.id);
			
			this.$initGotop();
		},
		methods: {
			loadContent(_id) {
				var self = this;
				self.collectionID = _id;
				self.collection = [];
				self.collectionList = [];
				
				self.$f7.preloader.show();
				setTimeout(_ => {
					self.$f7.preloader.hide();
				}, 500);
				
				this.loadCollectionData();
				self.$scrollTop(0);
			},
			
			//加载微信js
			loadedWxJs() {
				var self = this;
				self.wxJSLoaded = 1;
				if (self.collection) {
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
							title: self.collection.cl_name,
							desc: '杏运树牛研所，一起发现有趣有调的生活派牛人！',
							link: window.location.href,
							imgUrl: self.$resizeImg(self.collection.cl_image,460),
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
			
			//加载合集数据
			loadCollectionData() {
				var self = this;
				//详情
				let data = {
					collection_id : self.collectionID,
					member_id: self.$getMemberID()
				};
				
				wap.getajax('api/user/collection/detail', data, function(res, fromCache) {
					if(res.status == 'success') {
						self.collection = res.data;
						self.wxJSLoaded && self.initShareWx();
						
						//关联合集
						self.loadRelatedCollections();
					}
		        	
		        	self.$f7.preloader.hide();
				}, 'v1', true, 300);
	
				//变化数据
				let mutCollection = self.getMutCollection(self.collectionID, 0);
				if (undefined != mutCollection) {
					return;
				}
				//如果不存在，则重新获取变化数据
				this.$store.dispatch('getCollectionMut', {
			        data: data,
			        callback: (res) => {}
			     });
			     
			},
			
			//相关合集=同频道热门合集
			loadRelatedCollections() {
				console.log(this.collection.cl_channel_id)
				var self = this;
				let data = {
					channel_id : self.collection.cl_channel_id,
					cur_page: 1,
					page_size: 6,
					sort: 'desc',
				}
				//apidev.cattlepie.me/api/user/collection/searchList%7B%22cur_page%22:1,%22page_size%22:6,%22sort%22:%22desc%22%7D
				wap.getajax('api/user/collection/searchList', data, function(res) {
					if(res.status == 'success') {
						for(var i = 0; i < res.data.datalist.length; i++) {
							if (res.data.datalist[i].cl_id != self.collectionID) {
								self.collectionList.push(res.data.datalist[i]);
							}
						}
					}
				}, 'v1', true, 7200);
			},
		},
		computed: {
		    ...mapState([
		      'mutCollectionsState',
		    ]),
		    ...mapGetters({
		      getMutCollection: 'getMutCollection',
		    }),
		    mutCollectionData() {
		    	return this.getMutCollection(this.collectionID);
		    }
		  },
		  
		components: {
		}

	}
</script>