<template>
  <div id="chat">
    <div class="content">
      <div class="list">
        <div class="portrait">
          <img :src="user.avatar" alt="">
          <span>{{user.nickname}}</span>
          <div class="Notice" @click="systemNoticeDig = true; clearSystemNotice()">
            <el-badge is-dot class="badge" :hidden="!systemNotice.length"><i class="iconfont icon-xiaoxi"></i></el-badge>
          </div>
        </div>
        <el-tabs v-model="menuNmae">
          <el-tab-pane label="好友列表" name="first">
            <ul class="user">
              <li @click="setNowChater({username: 'all',nickname: '所有人'})">
                <img src="./img/all.jpg">
                <span>所有人</span>
              </li>
              <li v-for="item in userList.friends" @click="setNowChater(item)">
                <img :src="item.avatar" alt="" :class="{'offline': item.status == 'offline'}">
                <span>{{item.nickname}}</span>
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="未添加" name="second">
            <ul class="user">
              <li v-for="item in userList.allPeople" v-if="item.status == 'online'">
                <img :src="item.avatar">
                <span>{{item.nickname}}</span>
                <el-tooltip class="item" effect="dark" content="添加好友" placement="top-start" v-if="!friendsList.includes(item.username)">
                  <i class="el-icon-plus addFriendBut" @click="addFriend(item)"></i>
                </el-tooltip>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="chatPanel">
        <h3>{{nowChater.nickname}}</h3>
        <section>
          <ul>
            <li v-for="(item, $index) in chatRecord[nowChater.username]" class="clear" :class="{right: item.messenger == user.username}">
              <p class="time" v-if="isShowTime($index)">{{new Date(item.time).toLocaleTimeString()}}</p>
              <img :src="item.messengerAvatar" alt="">
              <div v-html="item.msg">
              </div>
            </li>
          </ul>
          <div class="send">
            <!-- <pre contenteditable=true v-model="message"></pre> -->
            <v-editText v-model="message" class="editText" @enter="send"></v-editText>
            <div class="butBox">
              <span>按下Ctrl+Enter换行</span>
              <el-button class="sendBut" @click="send">发送</el-button>
            </div>
          </div>
        </section>
      </div>
    </div>

    <el-dialog title="系统消息" v-model="systemNoticeDig" size="tiny" class="systemNoticeDig" @close="clearSystemNotice">
      <ul>
        <li class="addfriend" v-for="item in systemNotice">
          <h6>
            <img :src="item.initiatorAvatar" alt="">
            {{item.initiator}}
          </h6>
          <p>{{item.type == 'addFriend' ? `${item.initiator}想加你为好友` : item.msg}}</p>
          <div class="butBox" v-if="item.type == 'addFriend'">
            <el-button type="danger" size="mini" @click="item.status = false; verification(item); systemNoticeDig=false">拒绝</el-button>
            <el-button size="mini" @click="item.status = true; verification(item); systemNoticeDig=false">同意</el-button>
          </div>
        </li>
      </ul>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="systemNoticeDig = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
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
      message: '',
      systemNoticeDig: false,              // 系统消息
      showTimeInterval: 5 * 1000 * 60     // 显示时间线的间隔
    }
  },
  mounted () {
    let vm = this;
    this.socket = io.connect(window.location.origin + ':3000') // 与服务器进行连接
    this.socket.on('error', () => {        // 连接失败
      vm.$message.error('请先登录');
      vm.$router.push({name: 'Login'});
    })
    this.getSystemNotice();
    setTimeout(function () {
      vm.socket.emit('join', vm.user.username);
    }, 1000)
    this.socket.on('getFriends', data => {
      console.log(data)
      vm.getUserList(data);
    })
    this.socket.on('serverSend', data => {
      vm.addChatRecord({
        messager: data.messager,
        data: data.data
      });
      vm.$nextTick(function () {
        vm.$el.querySelector('.chatPanel ul').scrollTop = vm.$el.querySelector('.chatPanel ul').scrollHeight;
      })
    })
    this.socket.on('systemNotice', data => {
      vm.getSystemNotice();
      if (data.type === 'addFriend') {
        vm.$notify.info({
          title: '好友请求',
          message: `${data.info.nickname}想加你为好友`
        });
      } else if (data.type === 'system') {
        vm.$notify.info({
          title: '系统消息',
          message: data.info
        });
      }
    })
  },
  methods: {
    ...mapMutations([
      'getUserList',
      'setNowChater',
      'addChatRecord',
      'addFriend',
      'getSystemNotice',
      'clearSystemNotice',
      'verification'
    ]),
    send () {
      if (this.message === '') {
        this.$message.warning('不能发送空消息');
        return;
      }
      this.socket.emit('clientSend', {
        targetName: this.nowChater.username,
        msg: this.message,
        messenger: this.user.username,
        messengerAvatar: this.user.avatar
      });
      this.message = '';
    },
    isShowTime (idx) {     // 是否显示时间
      if (idx === 0) return 'true';
      else if (new Date(this.chatRecord[this.nowChater.username][idx].time) - new Date(this.chatRecord[this.nowChater.username][idx - 1].time) > this.showTimeInterval) return true;
      else return false;
    }
  },
  computed: mapState({
    ...mapGetters([
    ]),
    user: state => state.user || {},
    userList: state => state.chat.userList,
    nowChater: state => state.chat.nowChater,
    chatRecord: state => state.chat.chatRecord,
    friendsList: state => state.chat.userList.friends.map(ele => ele.username),       // 好友username列表
    systemNotice: state => state.chat.systemNotice        // 系统消息
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
        position: relative;
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
        .Notice {
          position: absolute;
          width: 30px;
          height: 30px;
          top: 15px;
          right: 0;
          line-height: 30px;
          cursor: pointer;
          i {
            color: #fff;
            font-size: 24px;
            opacity: 0.8;
            &:hover{ opacity: 1;}
          }
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
              white-space: pre-wrap;
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
  .systemNoticeDig {
    ul {
      max-height: 500px;
      overflow: auto;
      padding-right: 5px;
    }
    li {
      border-bottom: 1px #efefef solid;
      margin-bottom: 10px;
      h6 {
        font: 14px/40px "微软雅黑";
        img {
          width: 40px;
          height: 40px;
          border: 1px #eee solid;
          border-radius: 50%;
          vertical-align: middle;
          margin-right: 5px;
        }
      }
      p {
        font: 12px/24px "";
      }
      .butBox {
        padding: 10px 0;
        text-align: right;
      }
    }
  }
}
</style>
