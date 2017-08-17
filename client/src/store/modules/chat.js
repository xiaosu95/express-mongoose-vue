import API from '@/common/api'
import Axios from 'axios'
import { Message } from 'element-ui';

const state = {
  userList: Object,
  nowChater: '',
  systemNotice: {},   // 系统信息
  chatRecord: {}        // 聊天记录
}
const getters = {
  userInfo: () => {             // 用户基本信息
    return JSON.parse(sessionStorage.getItem('user'));
  }
}
const mutations = {
  getUserList (state, list) {               // 获取用户列表
    state.userList = list;
  },
  setNowChater (state, params) {            // 设置当前聊天对象
    state.nowChater = params;
  },
  addChatRecord (state, params) {           // 添加聊天记录
    if (!state.chatRecord[params.username]) state.chatRecord[params.username] = new Array(0);
    state.chatRecord[params.username].push(params.data);
  },
  addFriend (state, targetUser) {           // 添加好友
    let json = {
      Initiator: JSON.parse(sessionStorage.getItem('user')).username,
      targetUser: targetUser.username
    }
    Axios.post(API.ADD_FRIEND, json)
    .then(data => {
      if (data.data.isSuccess) {
        Message.success('已发送添加好友请求');
        targetUser.status = 'wait';
      } else {
        Message.error(data.data.msg);
      }
    })
  },
  getSystemNotice (state) {             // 获取系统信息
    Axios.post(API.GET_SYSTEM_NOTICE, {username: JSON.parse(sessionStorage.getItem('user')).username})
    .then(data => {
      if (data.data.isSuccess) {
        state.systemNotice = data.data.data;
      } else {
        Message.error(data.data.msg);
      }
    })
  }
}

export default {
  state: state,
  getters: getters,
  mutations: mutations
}
