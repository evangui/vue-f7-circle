import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'

import HomePage from '@/pages/home.vue';
import IndexPage from '@/pages/index.vue';
import MinePage from '@/pages/mine.vue';
import StoreIndexPage from '@/pages/store-index.vue';
import ChannelPage from '@/pages/channel.vue';
import AttentionPage from '@/pages/attention.vue';

import NotFoundPage from '@/pages/not-found.vue';

import ArticleListPage from '@/pages/article-list.vue';
import StoreListPage from '@/pages/store-list.vue';
import CollectionListPage from '@/pages/collection-list.vue';
import CircleListPage from '@/pages/circle-list.vue';

import ArticleDetailPage from '@/pages/article-detail.vue';
import ArticleCommentPage from '@/pages/article-comment.vue';
import ArticleCommentSubPage from '@/pages/article-comment-sub.vue';
import StoreDetailPage from '@/pages/store-detail.vue';
import CollectionDetailPage from '@/pages/collection-detail.vue';
import CircleDetailPage from '@/pages/circle-detail.vue';
import CirclethemeDetailPage from '@/pages/circletheme-detail.vue';
import CirclethemePostPage from '@/pages/circletheme-post.vue';

import My_CirclethemePage from '@/pages/my/circletheme.vue';
import My_FavStorePage from '@/pages/my/fav-store.vue';
import My_FavGoodsPage from '@/pages/my/fav-goods.vue';
import My_FavArticlePage from '@/pages/my/fav-article.vue';
import My_FavCirclethemePage from '@/pages/my/fav-circletheme.vue';
import My_FavCollectionPage from '@/pages/my/fav-collection.vue';
import My_FollowCirclePage from '@/pages/my/follow-circle.vue';
import My_FollowMemberPage from '@/pages/my/follow-member.vue';

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}
Vue.use(Router)


const router = new Router({
	routes: [{
			path: "/",
			component: HomePage,
		},
		{
			path: "/index/",
			component: IndexPage,
		},
		{
			path: "/mine/",
			component: MinePage,
		},
		{
			path: '/store-index/',
			component: StoreIndexPage,
		},
		{
			path: '/attention/',
			component: AttentionPage,
		},
		{
			path: '/channel/id/:id/',
			component: ChannelPage,
		},
		{
			path: '/article-list/',
			component: ArticleListPage,
		},
		{
			path: '/store-list/',
			component: StoreListPage,
		},
		{
			path: '/circle-list/',
			component: CircleListPage,
		},
		{
			path: '/collection-list/',
			component: CollectionListPage,
		},

		{
			path: '/article-detail/id/:id/',
			component: ArticleDetailPage,
		},
		{
			path: '/article-comment/id/:id/',
			component: ArticleCommentPage,
		},
		{
			path: '/article-comment-sub/id/:id/',
			component: ArticleCommentSubPage,
		},
		{
			path: '/store-detail/id/:id/',
			component: StoreDetailPage,
		},
		{
			path: '/collection-detail/id/:id/',
			component: CollectionDetailPage,
		},
		{
			path: '/circle-detail/id/:id/',
			component: CircleDetailPage,
		},
		{
			path: '/circletheme-detail/id/:id/',
			component: CirclethemeDetailPage,
		},
		{
			path: '/circletheme-post/',
			component: CirclethemePostPage,
		},

		{
			path: '/my/circletheme/',
			component: My_CirclethemePage,
		},
		{
			path: '/my/fav-store/',
			component: My_FavStorePage,
		},
		{
			path: '/my/fav-goods/',
			component: My_FavGoodsPage,
		},
		{
			path: '/my/fav-article/',
			component: My_FavArticlePage,
		},
		{
			path: '/my/fav-circletheme/',
			component: My_FavCirclethemePage,
		},
		{
			path: '/my/fav-collection/',
			component: My_FavCollectionPage,
		},
		{
			path: '/my/follow-circle/',
			component: My_FollowCirclePage,
		},
		{
			path: '/my/follow-member/',
			component: My_FollowMemberPage,
		},

		//{
		//  path: '/dynamic-route/blog/:blogId/post/:postId/',
		//  component: DynamicRoutePage,
		//},
		{
			path: '(.*)',
			component: NotFoundPage,
		},
	]
})

//百度统计
router.beforeEach((to, from, next) => {
    _hmt.push(['_trackPageview', '/v2/#' + to.path])
    document.title = to.meta.title || '杏运树趣看'
    next()
})

export default router;