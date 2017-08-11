<template>
  <div id="app">
    <!-- <button type="button" name="button" class="login" @click="login">login</button>
    <button type="button" name="button" class="but">test</button>
    <button type="button" name="button" class="socket" @click="socket">socket</button> -->
    <router-view class="routeView"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      routeName: '',
      sockets: null
    }
  },
  components: {

  },
  created () {
    this.sockets = io.connect() // 与服务器进行连接
    this.sockets.on('add', data => {
      console.log(data)
    })
  },
  methods: {
    login () {
      $.ajax({
        type: 'post',
        url: '/user/register',
        data: {
          username: 'xiaosu',
          password: '123124'
        },
        success: function (data) {
          console.log(data)
        }
      })
    },
    socket () {
      this.sockets.emit('join', 'xiaosu')
    }
  },
  computed: {

  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
  .routeView {
    height: 100%;
  }
}
</style>
