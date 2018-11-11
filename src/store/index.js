import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import mutations from './mutations'
import getters from './getters'

import vuexAlong from  'vuex-along';

Vue.use(Vuex)
//vuexAlong.watch(['localNum'],true);
//vuexAlong.watchSession(['sessionNum'],true);
vuexAlong.onlySession(true);


const state = {
  position: {},
  mutArticlesState: {a:1},
  mutArticleRepliesState: {a:1},
  
  mutCollectionsState: {a:1},
  mutCirclesState: {a:1},
  mutThemesState: {a:1},
  mutThemeRepliesState: {a:1},
  mutStoresState: {},
  mutGoodsState: {},
}

export default new Vuex.Store({
//	strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  actions,
  mutations,
  plugins: [vuexAlong]
})