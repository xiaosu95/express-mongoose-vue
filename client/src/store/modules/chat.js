const state = {
  userList: Object,
  nowChater: '',
  chatRecord: {}        // 聊天记录

}
const getters = {
  userInfo: () => {             // 用户基本信息
    return JSON.parse(sessionStorage.getItem('user'));
  }
}
const mutations = {
  getUserList (state, list) {
    state.userList = list;
  },
  setNowChater (state, params) {
    state.nowChater = params;
  },
  addChatRecord (state, params) {
    if (!state.chatRecord[params.username]) state.chatRecord[params.username] = new Array(0);
    state.chatRecord[params.username].push(params.data);
  }
}

export default {
  state: state,
  getters: getters,
  mutations: mutations
}
