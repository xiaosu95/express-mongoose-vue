<template>
<div id="blogContent">
  <div class="close">
    <h3>{{blogArticleList[$route.query.idx].title}}</h3>
    <span class="el-icon-close" @click="$router.push({name: 'BlogList'})"></span>
  </div>
  <div class="w-e-text" v-html="blogArticleList[$route.query.idx].content"></div>
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
    blogArticleList: state => state.blog.blogArticleList
  })
}
</script>

<style media="screen" lang="scss">
#blogContent {
  background: #fff;
  .close {
    position: relative;
    h3 {
      color: #505050;
      text-align: center;
      line-height: 40px;
    }
    span {
      position: absolute;
      line-height: 24px;
      right: 20px;
      top: 10px;
      color: #505050;
      cursor: pointer;
      opacity: 0.6;
      &:hover {
        opacity: 1;
      }
    }
  }
  .w-e-text {
    color: #48576a;
    font-size: 14px;
  }
}
</style>
