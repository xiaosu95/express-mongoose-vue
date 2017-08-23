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

    }
  },
  components: {

  },
  methods: {
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
