import Vue from 'vue'
import Vuex from 'vuex'
import Chat from './modules/chat'
import Blog from './modules/blog'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(sessionStorage.getItem('user')) || {}
  },
  getters: {

  },
  mutations: {
    setUser (state, user) {                 // 获取用户信息
      state.user = user;
    }
  },
  modules: {
    chat: Chat,
    blog: Blog
  }
})
