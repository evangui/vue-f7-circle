export default {
//	checkoutStatus: state => state.checkoutStatus,

	getMutArticle: (state) => (id, init=1) => {
		return state.mutArticlesState['k' + id] || (init ? {
			article_id : 0,
			article_like_count : 0,
			article_click: 0,
			article_up: 0,
			article_comment_count: 0,
			liked: 0,
			uped:0,
		} : undefined);
		
//	   return state.added.map(item => {
//			const product = state.products.all.find(product => product.id === id)
//			return {
//				title: product.title,
//				price: product.price,
//				quantity: item.quantity
//			}
//		})
	},
	
	getMutArticleReply: (state) => (id, init=1) => {
		return state.mutArticleRepliesState['k' + id] || (init ? {
			reply_up : 0,
			uped: 0,
		} : undefined);
		
	},
	
	getMutThemeReply: (state) => (id, init=1) => {
		return state.mutThemeRepliesState['k' + id] || (init ? {
			reply_up : 0,
			uped: 0,
		} : undefined);
		
	},
	
	getMutCollection: (state) => (id, init=1) => {
		return state.mutCollectionsState['k' + id] || (init ? {
			cl_like_count : 0,
			liked: 0,
		} : undefined);
	},
	
	getMutTheme: (state) => (id, init=1) => {
		return state.mutThemesState['k' + id] || (init ? {
			theme_like_count : 0,
			theme_up_count: 0,
			theme_commentcount: 0,
			liked: 0,
			uped: 0,
		} : undefined);
	},
	
	getMutCircle: (state) => (id, init=1) => {
		return state.mutCirclesState['k' + id] || (init ? {
			circle_thcount : 0,
			circle_mcount: 0,
			joined: 0,
		} : undefined);
		
	},
	
	getMutStore: (state) => (id, init=1) => {
		return state.mutStoresState['k' + id] || (init ? {
//			store_like_count : 0,
			liked: 0,
		} : undefined);
	},
	
	getMutGoods: (state) => (id, init=1) => {
		return state.mutGoodsState['k' + id] || (init ? {
//			store_like_count : 0,
			liked: 0,
		} : undefined);
	},

}