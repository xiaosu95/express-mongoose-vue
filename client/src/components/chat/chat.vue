<template>
  <div id="chat">
    <div class="content">
      <div class="list">
        <div class="portrait">
          <img :src="userInfo.avatar" alt="">
          <span>{{userInfo.nickname}}</span>
        </div>
        <el-tabs v-model="menuNmae" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="first">
            <ul class="user">
              <li v-for="item in userList.friends" @click="setNowChater(item)">
                <img :src="item.avatar" alt="" :class="{'offline': item.status == 'offline'}">
                <span>{{item.nickname}}</span>
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="配置管理" name="second">
            <ul class="user">
              <li v-for="item in userList.allPeople" v-if="item.status == 'online'">
                <img :src="item.avatar">
                <span>{{item.nickname}}</span>
                <el-tooltip class="item" effect="dark" content="添加好友" placement="top-start">
                  <i class="el-icon-plus addFriendBut"></i>
                </el-tooltip>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="chatPanel">
        <h3>{{nowChater.nickname}}{{nowChater.username=='all' ? `(${userList.allPeople.length})` : ''}}</h3>
        <section>
          <ul>
            <p class="time">123</p>
            <li v-for="item in chatRecord[nowChater.username]" class="clear">
              <img :src="item.avatar" alt="">
              <div>
                {{item.msg}}
              </div>
            </li>
          </ul>
          <div class="send">
            <!-- <pre contenteditable=true v-model="message"></pre> -->
            <v-editText v-model="message" class="editText"></v-editText>
            <div class="butBox">
              <span>按下Ctrl+Enter换行</span>
              <el-button class="sendBut" @click="send">发送</el-button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import EditText from '@/components/public/editText'
export default {
  name: 'Chat',
  components: {
    'v-editText': EditText
  },
  data () {
    return {
      socket: null,
      menuNmae: 'first',
      message: ''
    }
  },
  created () {
    let vm = this;
    this.socket = io.connect() // 与服务器进行连接
    this.socket.on('error', () => {        // 连接失败
      vm.$message.error('请先登录');
      vm.$router.push({name: 'Login'});
    })
    this.socket.emit('join', vm.userInfo.username);
    this.socket.on('getFriends', data => {
      vm.getUserList(data);
    })
    this.socket.on('serverSend', data => {
      // console.log(data);
      // vm.addChatRecord({
      //   username: vm.nowChater.username,
      //   data: data
      // })
    })
  },
  methods: {
    ...mapMutations([
      'getUserList',
      'setNowChater',
      'addChatRecord'
    ]),
    handleClick (tab) {
      if (tab.name === 'second') {
        this.setNowChater({
          username: 'all',
          nickname: '全部'
        });
      }
    },
    send () {
      let vm = this;
      this.socket.emit('clientSend', {
        targetName: this.nowChater.username,
        msg: this.message,
        messenger: this.userInfo.username,
        messengerAvatar: this.userInfo.avatar
      });
      this.message = '';
      vm.addChatRecord({
        username: vm.nowChater.username,
        data: {
          targetName: this.nowChater.username,
          msg: this.message,
          messenger: this.userInfo.username,
          messengerAvatar: this.userInfo.avatar
        }
      })
    }
  },
  computed: mapState({
    ...mapGetters([
      'userInfo'
    ]),
    userList: state => state.chat.userList,
    nowChater: state => state.chat.nowChater,
    chatRecord: state => state.chat.chatRecord
  })
}
</script>

<style scoped lang="scss">
#chat {
  background: url('https://res.wx.qq.com/a/wx_fed/webwx/res/static/img/2zrdI1g.jpg') no-repeat 50%;
  background-size: cover;
  height: 100%;
  .content {
    width: 60%;
    height: 80%;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    .list {
      width: 280px;
      height: 100%;
      float: left;
      background: #2E3238;
      padding: 0 15px;
      box-sizing: border-box;
      .portrait {
        height: 76px;
        line-height: 76px;
        img {
          display: inline-block;
          width: 40px;
          border-radius: 3px;
          vertical-align: middle;
          margin-right: 10px;
        }
        span {
          color: #fff;
          font-size: 18px;
        }
      }
      .user {
        li {
          padding: 18px 0;
          border-top: 1px #26292e solid;
          cursor: pointer;
          img {
            width: 40px;
            border-radius: 3px;
            vertical-align: top;
            margin-right: 10px;
            &.offline {
              filter: grayscale(100);
            }
          }
          span {
            font-size: 14px;
            color: #fff;
          }
          .addFriendBut {
            float: right;
            color: #efefef;
            line-height: 40px;
            margin-right: 20px;
            cursor: pointer;
          }
        }
      }
    }
    .chatPanel {
      width: calc(100% - 280px);
      height: 100%;
      float: left;
      background: #eee;
      h3 {
        font: 14px/30px "";
        padding: 10px 0;
        margin: 0 20px;
        border-bottom: 1px solid #d6d6d6;
        color: #505050;
        text-align: center;
      }
      section {
        height: calc(100% - 51px);
        ul {
          height: calc(100% - 150px);
          overflow: auto;
          .time {
            text-align: center;
            font-size: 12px;
            color: #888;
            line-height: 30px;
          }
          li {
            padding: 0 20px;
            margin-bottom: 15px;
            img {
              width: 40px;
              height: 40px;
              margin-right: 15px;
              float: left;
              border-radius: 3px;
            }
            & > div {
              float: left;
              position: relative;
              display: inline-block;
              max-width: 70%;
              padding: 10px;
              background: #fff;
              border-radius: 4px;
              font-size: 14px;
              color: #333;
              &:before {
                content: "";
                display: block;
                position: absolute;
                width: 15px;
                height: 15px;
                background: #fff;
                transform-origin: center;
                transform: rotate(45deg);
                left: -6px;
                border-radius: 2px;
              }
            }
          }
          li.right {
            img {
              float: right;
              margin-left: 15px;
            }
            & > div {
              float: right;
              background: #B2E281;
              &:before {
                left: auto;
                right: -6px;
                background: #B2E281;
              }
            }
          }
        }
        .send {
          height: 150px;
          box-sizing: border-box;
          border-top: 1px solid #d6d6d6;
          .editText {
            height: 100px;
            padding: 13px 20px;
            font-size: 14px;
            box-sizing: border-box;
          }
          .butBox {
            height: 50px;
            text-align: right;
            span {
              font-size: 12px;
              color: #888;
            }
          }
          .sendBut {
            margin: 0 20px;
          }
        }
      }
    }
  }
}
</style>
