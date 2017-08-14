<template>
  <div id="chat">
    <button type="button" name="button" class="socket" @click="socketfun">socket</button>
  </div>
</template>

<script>
export default {
  name: 'Chat',
  data () {
    return {
      socket: null
    }
  },
  mounted () {
    let vm = this;
    this.socket = io.connect() // 与服务器进行连接
    this.socket.on('error', () => {        // 连接失败
      vm.$message.error('请先登录');
      vm.$router.push({name: 'Login'});
    })
    this.socket.emit('join', '123123');
    this.socket.on('getFriends', data => {
      console.log(data)
    })
  },
  methods: {
    socketfun () {
    }
  }
}
</script>

<style scoped lang="scss">

</style>
