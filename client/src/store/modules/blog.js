import API from '@/common/api'
import Axios from 'axios'
// import { Message } from 'element-ui';
// import store from '../'
import utils from '@/common/utils'

const state = {
  blogType: [],         // 文章类型列表
  blogList: [],          // 文章具体类型列表
  blogUser: {},            // 用户
  isCanEdit: false        // 是否可以编辑
}
const getters = {

}
const mutations = {
  getBlogClassification (state) {                // 获取文章列表
    Axios.get(API.GET_BLOG_CLASSIFICATION, {
      params: {
        username: state.blogUser.username
      }
    }).then(data => {
      if (data.data.isSuccess) {
        // state.blogType = utils.removal(data.data.data.map(ele => ele.type));
        // state.blogType.forEach(ele => {
        //   state.blogList[ele] = data.data.data.filter(ele2 => ele2.type === ele);
        // })
        state.blogType = data.data.data;
      }
    })
  },
  getBlogList (state, params) {         // 更具类型获取文章
    Axios.get(API.GET_BLOG_LIST, {
      params: {
        username: state.blogUser.username,
        type: params.type,
        pageSize: params.pageSize,
        pageNum: params.pageNum
      }
    }).then(data => {
      if (data.data.isSuccess) {
        state.blogList = data.data.data;
        params.totalNum = data.data.totalNum;
      }
    })
  }
}
const actions = {
  userInit ({ commit, state }) {              // 获取博主信息
    return new Promise((resolve, reject) => {
      const blogUser = utils.getUrlParam('blogUser') || JSON.parse(sessionStorage.getItem('user')).username;
      Axios.get(API.GET_BLOG_USER, {
        params: {
          blogUser: blogUser
        }
      }).then(data => {
        if (data.data.isSuccess) {
          state.blogUser = data.data.data;
          sessionStorage.getItem('user') ? state.isCanEdit = !!(JSON.parse(sessionStorage.getItem('user')).username === state.blogUser.username) : false;
          resolve()
        }
      })
    })
  }
}
export default {
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
}
