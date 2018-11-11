import Vue from 'vue'

export default {
	SET_SCROLL_TOP(state, {k,v} ) {
		Vue.set(state.position, k, v);
//		state.position = val;
	},
	
	/**
	 * 文章变化数据 记录到state 
	 */
	ADD_ARTICLES_MUT(state, {
		items
	}) {
		//	for (var i=0; i<items.length; i++) {
		//		  let item = state.stateArticles.find(p => p.article_id === items[i].article_id);
		//		  if (undefined == item) {
		//		  	state.stateArticles.push(items[i]);
		//		  }
		//	}
		for(var i = 0; i < items.length; i++) {
			let k = 'k' + items[i].article_id;
			Vue.set(state.mutArticlesState, k, items[i]);
		}
	},
	
	/**
	 * 文章 单项记录值 修改
	 */
	CHANGE_ARTICLE(state, {
		mid,
		type,
		val=1
	}) {
		let item = state.mutArticlesState['k' + mid];
		let update = {}
		switch(type) {
			case 'up':
				update.article_up = item.article_up + val
				update.uped = true
				break;
			case 'unup':
				update.article_up = item.article_up - val
				update.uped = false
				break;
			case 'like':
				update.article_like_count = item.article_like_count + val
				update.liked = true
				break;
			case 'unlike':
				update.article_like_count = item.article_like_count - val
				update.liked = false
				break;
			case 'click':
				update.article_click = item.article_click + 1
				break;	
			case 'reply':
				update.article_comment_count = item.article_comment_count + 1
				break;		
		}

		// Yes, Object.assign can update state and UI component at same time.
		item = Object.assign(item, update)
	},
	
	/**
	 * 文章回复 的变化数据 记录到state 
	 */
	ADD_ARTICLE_REPLIES_MUT(state, {
		items, cover=0
	}) {
		for(var i = 0; i < items.length; i++) {
			let k = 'k' + items[i].reply_id;
			//如果state里有该项数据，则忽略不覆盖
			if (undefined !== state.mutArticleRepliesState[k] && !cover) {
				continue;
			}
			
			let item = {
				reply_up: items[i].reply_up,
				uped: items[i].uped || 0,
			};
			Vue.set(state.mutArticleRepliesState, k, item);
		}
	},

	/**
	 * 文章回复 的记录值 修改
	 */
	CHANGE_ARTICLE_REPLY(state, {
		mid,
		type
	}) {
		let item = state.mutArticleRepliesState['k' + mid];
		let update = {}
		switch(type) {
			case 'up':
				update.reply_up = item.reply_up + 1
				update.uped = true
				break
			case 'unup':
				update.reply_up = item.reply_up - 1
				update.uped = false
				break
		}

		// Yes, Object.assign can update state and UI component at same time.
		item = Object.assign(item, update)
	},
	
	/**
	 * 帖子 的变化数据 记录到state 
	 */
	ADD_COLLECTIONS_MUT(state, {
		items, cover=0
	}) {
		for(var i = 0; i < items.length; i++) {
			let k = 'k' + items[i].cl_id;
			//如果state里有该项数据，则忽略不覆盖
			if (undefined !== state.mutCollectionsState[k] && !cover) {
				continue;
			}
			
			let item = {
				cl_like_count: items[i].cl_like_count,
				liked: items[i].liked || 0,
			};
			Vue.set(state.mutCollectionsState, k, item);
		}
	},
	
	/**
	 * 帖子 的变化数据 记录到state 
	 */
	CHANGE_COLLECTION(state, {
		mid,
		type
	}) {
		let item = state.mutCollectionsState['k' + mid];
		let update = {}
		switch(type) {
			case 'like':
				update.cl_like_count = item.cl_like_count + 1
				update.liked = true
				break
			case 'unlike':
				update.cl_like_count = item.cl_like_count - 1
				update.liked = false
				break
		}

		// Yes, Object.assign can update state and UI component at same time.
		item = Object.assign(item, update)
	},
	
	
	/**
	 * 圈子 的变化数据 记录到state 
	 */
	ADD_CIRCLES_MUT(state, {
		items
	}) {
		for(var i = 0; i < items.length; i++) {
			let k = 'k' + items[i].circle_id;
			//如果state里有该项数据，则忽略不覆盖
			if (undefined !== state.mutCirclesState[k]) {
				continue;
			}
			
			Vue.set(state.mutCirclesState, k, items[i]);
		}
	},
	
	/**
	 * 圈子 的记录值 修改
	 */
	CHANGE_CIRCLE(state, {
		mid,
		type
	}) {
		let item = state.mutCirclesState['k' + mid];
		let update = {}
		switch(type) {
			case 'join':
				update.circle_mcount = item.circle_mcount + 1
				update.joined = true
				break
			case 'unjoin':
				update.circle_mcount = item.circle_mcount - 1
				update.joined = false
				break
		}

		// Yes, Object.assign can update state and UI component at same time.
		item = Object.assign(item, update)
	},
	
	/**
	 * 帖子 的变化数据 记录到state 
	 */
	ADD_THEMES_MUT(state, {
		items, cover=0
	}) {
		for(var i = 0; i < items.length; i++) {
			let k = 'k' + items[i].theme_id;
			//如果state里有该项数据，则忽略不覆盖
			if (undefined !== state.mutThemesState[k] && !cover) {
				continue;
			}
			
			let item = {
				theme_like_count: items[i].theme_like_count,
				theme_up_count: items[i].theme_up_count,
				theme_commentcount: items[i].theme_commentcount,
				liked: items[i].liked || 0,
				uped: items[i].uped || 0,
			};
			Vue.set(state.mutThemesState, k, item);
		}
	},
	
	/**
	 * 帖子 的变化数据 记录到state 
	 */
	CHANGE_THEME(state, {
		mid,
		type,
		val
	}) {
		let item = state.mutThemesState['k' + mid];
		let update = {}
		switch(type) {
			case 'up':
				update.theme_up_count = item.theme_up_count + 1
				update.uped = true
				break
			case 'unup':
				update.theme_up_count = item.theme_up_count - 1
				update.uped = false
				break
			case 'like':
				update.theme_like_count = item.theme_like_count + 1
				update.liked = true
				break
			case 'unlike':
				update.theme_like_count = item.theme_like_count - 1
				update.liked = false
				break
			case 'reply':
				update.theme_commentcount = item.theme_commentcount + 1	
				break
			case 'uped':
				update.uped = item.val;
				break	
			case 'liked':
				update.liked = item.val;
				break	
		}

		// Yes, Object.assign can update state and UI component at same time.
		item = Object.assign(item, update)
	},
	
	/**
	 * 帖子回复 的变化数据 记录到state 
	 */
	ADD_THEME_REPLIES_MUT(state, {
		items
	}) {
		for(var i = 0; i < items.length; i++) {
			let k = 'k' + items[i].reply_id;
			//如果state里有该项数据，则忽略不覆盖
			if (undefined !== state.mutThemeRepliesState[k]) {
				continue;
			}
			
			let item = {
				reply_up: items[i].reply_up,
				uped: 0,
			};
			Vue.set(state.mutThemeRepliesState, k, item);
		}
	},

	/**
	 * 帖子回复 的记录值 修改
	 */
	CHANGE_THEME_REPLY(state, {
		mid,
		type
	}) {
		let item = state.mutThemeRepliesState['k' + mid];
		let update = {}
		switch(type) {
			case 'up':
				update.reply_up = item.reply_up + 1
				update.uped = true
				break
			case 'unup':
				update.reply_up = item.reply_up - 1
				update.uped = false
				break
		}

		// Yes, Object.assign can update state and UI component at same time.
		item = Object.assign(item, update)
	},
	
	/**
	 * 帖子 的变化数据 记录到state 
	 */
	ADD_STORES_MUT(state, {
		items, cover=0
	}) {
		for(var i = 0; i < items.length; i++) {
			let k = 'k' + items[i].store_id;
			//如果state里有该项数据，则忽略不覆盖
			if (undefined !== state.mutStoresState[k] && !cover) {
				continue;
			}
			
			let item = {
//				store_like_count: items[i].store_like_count,
				liked: items[i].liked || 0,
			};
			Vue.set(state.mutStoresState, k, item);
		}
	},
	
	/**
	 * 帖子 的变化数据 记录到state 
	 */
	CHANGE_STORE(state, {
		mid,
		type
	}) {
		let item = state.mutThemesState['k' + mid];
		let update = {}
		switch(type) {
			case 'like':
//				update.theme_like_count = item.theme_like_count + 1
				update.liked = true
				break
			case 'unlike':
//				update.theme_like_count = item.theme_like_count - 1
				update.liked = false
				break
		}

		// Yes, Object.assign can update state and UI component at same time.
		if (!item) {
			let k = 'k' + mid;
			Vue.set(state.mutStoresState, k, update);
		} else {
			item = Object.assign(item, update)
		}
	},
	
	/**
	 * 帖子 的变化数据 记录到state 
	 */
	ADD_GOODS_MUT(state, {
		items, cover=0
	}) {
		for(var i = 0; i < items.length; i++) {
			let k = 'k' + items[i].goods_id;
			//如果state里有该项数据，则忽略不覆盖
			if (undefined !== state.mutGoodsState[k] && !cover) {
				continue;
			}
			
			let item = {
				liked: items[i].liked || 0,
			};
			Vue.set(state.mutGoodsState, k, item);
		}
	},
	
	/**
	 * 帖子 的变化数据 记录到state 
	 */
	CHANGE_GOODS(state, {
		mid,
		type,
		val
	}) {
		let item = state.mutGoodsState['k' + mid];
		let update = {}
		switch(type) {
			case 'like':
//				update.theme_like_count = item.theme_like_count + 1
				update.liked = true
				break
			case 'unlike':
//				update.theme_like_count = item.theme_like_count - 1
				update.liked = false
				break
		}

		// Yes, Object.assign can update state and UI component at same time.
		if (!item) {
			let k = 'k' + mid;
			Vue.set(state.mutGoodsState, k, update);
		} else {
			item = Object.assign(item, update)
		}
	},
}