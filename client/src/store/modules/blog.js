import API from '@/common/api'
import Axios from 'axios'
// import { Message } from 'element-ui';
import store from '../'
import utils from '@/common/utils'

const state = {
  blogList: {},
  blogType: [],
  blogArticleList: []
}
const getters = {

}
const mutations = {
  getBlogList (state) {                // 获取文章列表
    Axios.get(API.GET_BLOG_LIST, {
      params: {
        username: store.state.chat.user.username
      }
    }).then(data => {
      if (data.data.isSuccess) {
        state.blogType = utils.removal(data.data.data.map(ele => ele.type));
        state.blogType.forEach(ele => {
          state.blogList[ele] = data.data.data.filter(ele2 => ele2.type === ele);
        })
      }
    })
  },
  getBlogArticleList (state, params) {         // 更具类型获取文章
    Axios.get(API.GET_BLOG, {
      params: {
        username: store.state.chat.user.username,
        type: params.type,
        pageSize: params.pageSize,
        pageNum: params.pageNum
      }
    }).then(data => {
      if (data.data.isSuccess) {
        state.blogArticleList = data.data.data;
      }
    })
  }
}

export default {
  state: state,
  getters: getters,
  mutations: mutations
}
