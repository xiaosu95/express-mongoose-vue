<template>
<div class="menu">
  <img src="./img/bg.jpg" alt="" class="bg">
  <ul>
    <li @click="$router.push({name: 'Chat'})">Chat</li>
    <li @click="goBlog">Blog</li>
  </ul>
</div>
</template>

<script type="text/javascript">
export default {
  methods: {
    goBlog () {
      window.location.href = `${window.location.origin + window.location.pathname}?blogUser=${JSON.parse(sessionStorage.getItem('user')).username}#/blog`
    }
  }
}
</script>

<style media="screen" lang="scss" scoped>
.menu {
  .bg {
    min-width: 100%;
    min-height: 100%;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  ul {
    position: absolute;
    top: 300px;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    padding: 50px;
    background: rgba(255, 255, 255, .3);
    border-radius: 5px;
    li {
      width: 300px;
      height: 250px;
      transition: all .5s;
      background: #efefef;
      font-family: cursive;
      font-size: 50px;
      line-height: 250px;
      text-align: center;
      color: #505050;
      cursor: pointer;
      &:hover {
        transform: translate(-5px, -3px);
      }
      &:nth-of-type(1) {
        float: left;
        &:hover {
          box-shadow: -2px -2px 10px #5f5;
        }
      }
      &:nth-of-type(2) {
        float: right;
        &:hover {
          box-shadow: -2px -2px 10px #1d90e6;
        }
      }
    }
  }
}
</style>
