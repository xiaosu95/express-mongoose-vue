<template>
<div id="blogList">
  <h3>当前标签:{{params.type || '全部'}}</h3>
  <ul>
    <li v-for="(item, $index) in blogArticleList" @click="$router.push({name: 'BlogContent', query: {idx: $index}})">
      {{item.title}}
      <span>{{item.author}} {{item.createTime | timeFilter}}</span>
    </li>
  </ul>
</div>
</template>

<script type="text/javascript">
import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {
      params: {
        pageSize: 10,
        pageNum: 1,
        type: null,
        totalNum: 0
      }
    }
  },
  created () {
    let vm = this;
    this.getBlogArticleList(this.params);
    this.$parent.$on('chooseMenu', type => {
      vm.params.type = type;
      vm.getBlogArticleList(vm.params)
    })
  },
  methods: {
    ...mapMutations([
      'getBlogArticleList'
    ])
  },
  computed: mapState({
    blogArticleList: state => state.blog.blogArticleList
  })
}
</script>

<style media="screen" lang="scss">
#blogList {
  background: #fff;
  padding: 10px;
  h3 {
    text-align: center;
    line-height: 30px;
    color: #333;
    padding-bottom: 10px;
    border-bottom: 1px #efefef solid;
  }
  li {
    line-height: 50px;
    padding-left: 10px;
    font-size: 20px;
    color: #505050;
    border-bottom: 1px #efefef dashed;
    cursor: pointer;
    span {
      float: right;
      margin-right: 30px;
      font-size: 12px;
    }
    &:hover {
      background: #fafafa;
    }
  }
}
</style>
