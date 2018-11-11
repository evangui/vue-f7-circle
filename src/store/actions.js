import wap from '../js/wap.js'

/**
 * 顶/取消顶 各类资源对象
 */
export function upItem({commit}, {objType, objId, type, callback = () => {} }) {
	let mutation = '';
	let apiUpType = '';
	switch(objType) {
		case 'article':
			mutation = 'CHANGE_ARTICLE';
			apiUpType = 'article';
			break
		case 'article_reply':
			mutation = 'CHANGE_ARTICLE_REPLY';
			apiUpType = 'article_reply';
			break	
		case 'theme':
			mutation = 'CHANGE_THEME';
			apiUpType = 'theme';
			break
		case 'theme_reply':
			mutation = 'CHANGE_THEME_REPLY';
			apiUpType = 'theme_reply';
			break	
	}
	
	let data = {
		obj_id: objId,
		up_type: apiUpType,
	};
	let apiUri = type == 'up' ? 'api/user/memberup/up' : 'api/user/memberup/cancelUp';
	//提前改变本地状态
	commit(mutation, {
	    mid: data.obj_id,
	    type: type	//up or unup
	});
	
	wap.doajax(apiUri, data, function(res) {
		if(res.code != '200' && res.code != '202') {
			//服务端处理失败，反向改变本地状态
			commit(mutation, {
			    mid: data.obj_id,
			    type: type == 'up' ? 'unup' : 'up'	//up or unup
			});
		}
		
		callback(res);
	}, 'v1', true);
}

/**
 * 收藏/取消收藏 各类资源对象
 */
export function likeItem({commit}, {objType, objId, type, callback = () => {} }) {
	let mutation = '';
	let apiUpType = '';
	switch(objType) {
		case 'article':
			mutation = 'CHANGE_ARTICLE';
			apiUpType = 'article';
			break;
		case 'theme':
			mutation = 'CHANGE_THEME';
			apiUpType = 'theme';
			break;
		case 'collection':
			mutation = 'CHANGE_COLLECTION';
			apiUpType = 'collection';
			break;
		case 'store':
			mutation = 'CHANGE_STORE';
			apiUpType = 'store';
			break;
		case 'goods':
			mutation = 'CHANGE_GOODS';
			apiUpType = 'goods';
			break;
	}
	
	let data = {
		obj_id: objId,
		fav_type: apiUpType,
	};
	let apiUri = type == 'like' ? 'api/user/memberfav/fav' : 'api/user/memberfav/cancelFav';
	//提前改变本地状态
	commit(mutation, {
	    mid: data.obj_id,
	    type: type	//like or unlike
	});
	
	wap.doajax(apiUri, data, function(res) {
		if(res.code != '200' && res.code != '202') {
			//服务端处理失败，反向改变本地状态
			commit(mutation, {
			    mid: data.obj_id,
			    type: type == 'like' ? 'unlike' : 'like'	//up or unup
			});
		}
		
		callback(res);
	}, 'v1', true);
}

/**
 * 文章动态变化数据 服务端获取，并写入state
 */
export function getArticleMut({commit}, {data={}, callback = () => {} }) {
	wap.getajax('api/user/cmsarticle/mutDetail', data, function(res, fromCache) {
		if(res.status == 'success') {
			let _item = {
				article_id : res.data.article_id,
				article_like_count : res.data.article_like_count,
				article_click: res.data.article_click,
				article_up: res.data.article_up,
				article_comment_count: res.data.article_comment_count,
				liked: res.data.liked || 0,
				uped: res.data.uped || 0,
			};
			commit('ADD_ARTICLES_MUT', {items: [_item]});
		}
    	callback(res);
		
	}, 'v1', true, 0);
}

/**
 * 文章点击服务端处理，并写入state
 */
export function clickArticle({commit}, {article_id, callback = () => {} }) {
	let data = {article_id: article_id};
	wap.getajax('api/user/cmsarticle/click', data, function(res) {
		if(res.status == 'success') {
			commit('CHANGE_ARTICLE', {
			    mid: article_id,
			    type: 'click',
			});
		}
		callback();
	}, 'v1', true);
}

/**
 * 文章回复列表数据 服务端获取，并将可变化数据写入state
 */
export function getArticleReplies({commit}, {data={}, cacheTime=0, callback = () => {} }) {
	wap.getajax('api/user/articlereply/searchList', data, function(res, fromCache) {
//		debugger
		if(res.status == 'success') {
			commit('ADD_ARTICLE_REPLIES_MUT', {items: res.data.datalist});
	    	callback(res);
		}
		
	}, 'v1', true, cacheTime);
}

/**
 * 圈子数据 服务端获取，并将可变化数据写入state
 */
export function getCircleMut({commit,getters}, {circleID, callback = () => {} }) {
//	debugger
	//详情
	wap.getajax('api/user/circle/detail?circle_id=' + circleID, {}, function(res) {
		if(!wap.checkLogin(false)) {
			callback(res);
			return;
		}
		
		//关注状态等动态数据
		let mutCircle = getters.getMutCircle(circleID, 0);
		if (undefined != mutCircle) {
			callback(res);
			return;
		}
		
		//如果不存在，则重新获取变化数据
		wap.getajax('api/user/circle/getJoinState?circle_id=' + circleID, {}, function(res2, fromCache) {
			if(res2.status == 'success') {
//				if (!fromCache) {
				let _item = {
					circle_id: res.data.circle_id,
					circle_thcount: res.data.circle_thcount,
					circle_mcount: res.data.circle_mcount,
					joined: res2.data.join_state[0] == 1 ? 1 : 0,
				};
				commit('ADD_CIRCLES_MUT', {items: [_item]});
//				}
		    	callback(res);
			}
		}, 'v1', true, 0);
		
	}, 'v1', true, 3600);
	
}

/**
 * 加入、退出圈子 服务端处理，并写入state
 */
export function joinCircle({commit}, {circle_id,circle_name, type, callback = () => {} }) {
	let data = {
		circle_id: circle_id,
		circle_name: circle_name,
	};
					
	let apiUri = type == 'join' ? 'api/user/circle/join' : 'api/user/circle/quit';
	
	wap.doajax(apiUri, data, function(res) {
		if(res.code == '200' || res.code == '403') {
			commit('CHANGE_CIRCLE', {
			    mid: data.circle_id,
			    type: type	//join or unjoin
			});
		}
		
		callback(res);
	}, 'v1', true);
}

/**
 * 主题帖数据 服务端获取，并将可变化数据写入state
 */
export function getThemes({commit}, {data={}, cacheTime=0, callback = () => {} }) {
	wap.getajax('api/user/circletheme/searchList', data, function(res, fromCache) {
		if(res.status == 'success') {
			commit('ADD_THEMES_MUT', {items: res.data.datalist});
	    	callback(res);
		}
		
	}, 'v1', true, cacheTime);
}


/**
 * 帖子变化数据 服务端获取，并写入state
 */
export function getThemeMut({commit}, {data={}, callback = () => {} }) {
	wap.getajax('api/user/circletheme/mutDetail', data, function(res, fromCache) {
		if(res.status == 'success') {
			let _item = {
				theme_id : res.data.theme_id,
				theme_like_count : res.data.theme_like_count,
				theme_up_count: res.data.theme_up_count,
				theme_commentcount: res.data.theme_commentcount,
				liked: res.data.liked || 0,
				uped: res.data.uped || 0,
			};
			commit('ADD_THEMES_MUT', {items: [_item]});
		}
    	callback(res);
		
	}, 'v1', true, 0);
}


/**
 * 文章回复列表数据 服务端获取，并将可变化数据写入state
 */
export function getThemeReplies({commit}, {data={}, cacheTime=0, callback = () => {} }) {
	wap.getajax('api/user/circlethreply/searchList', data, function(res, fromCache) {
//		debugger
		if(res.status == 'success') {
			commit('ADD_THEME_REPLIES_MUT', {items: res.data.datalist});
	    	callback(res);
		}
		
	}, 'v1', true, cacheTime);
}


/**
 * 主题帖数据 服务端获取，并将可变化数据写入state
 */
export function getCollections({commit}, {data={}, cacheTime=0, callback = () => {} }) {
	wap.getajax('api/user/collection/searchList', data, function(res, fromCache) {
		if(res.status == 'success') {
			commit('ADD_COLLECTIONS_MUT', {items: res.data.datalist});
	    	callback(res);
		}
		
	}, 'v1', true, cacheTime);
}


/**
 * 帖子变化数据 服务端获取，并写入state
 */
export function getCollectionMut({commit}, {data={}, callback = () => {} }) {
	wap.getajax('api/user/collection/mutDetail', data, function(res, fromCache) {
		if(res.status == 'success') {
			let _item = {
				cl_id : res.data.cl_id,
				cl_like_count : res.data.cl_like_count,
				uped: res.data.uped,
				liked: res.data.liked,
			};
			commit('ADD_COLLECTIONS_MUT', {items: [_item]});
		}
    	callback(res);
		
	}, 'v1', true, 300);
}



/**
 * 帖子变化数据 服务端获取，并写入state
 */
export function getStoreMut({commit}, {data={}, callback = () => {} }) {
	wap.getajax('api/user/store/mutDetail', data, function(res, fromCache) {
		if(res.status == 'success') {
			let _item = {
				store_id : res.data.store_id,
				liked: res.data.liked || 0,
				uped: res.data.uped || 0,
			};
			commit('ADD_COLLECTIONS_MUT', {items: [_item]});
		}
    	callback(res);
		
	}, 'v1', true, 300);
}