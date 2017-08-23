<template>
<div id="blog">
  <div class="main_l">
    <div class="user">
      <img :src="user.avatar" alt="">
      <p>{{user.nickname}}</p>
      <span>创建时间:{{user.createTime/1 | timeFilter2}}</span>
    </div>
    <div class="blogList">
      <h3></h3>
    </div>
  </div>
  <div class="main_r">

  </div>
</div>
</template>

<script type="text/javascript">
import { mapState } from 'vuex'
export default {
  data () {
    return {

    }
  },
  computed: mapState({
    user: state => state.chat.user
  })
}
</script>

<style media="screen" lang="scss" scoped>
#blog {
  padding: 30px 30px 0;
  background: #eee;
  box-sizing: border-box;
  .main_l {
    width: 200px;
    float: left;
    min-height: calc(100% - 30px);
    padding: 20px 10px;
    box-sizing: border-box;
    background: #fff;
    .user {
      color: #505050;
      img {
        display: block;
        width: 100%;
      }
      p {
        line-height: 30px;
      }
      span {
        font-size: 12px;
      }
    }
  }
  .main_r {
    width: calc(100% - 220px);
    height: 100%;
    float: right;
  }
}
</style>
