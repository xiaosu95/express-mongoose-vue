<template>
<div id="blogList">
  <h3>当前标签:{{params.type || '全部'}}</h3>
  <div class="list">
    <ul>
      <li v-for="(item, $index) in blogList" @click="$router.push({name: 'BlogContent', query: {_id: item._id}})">
        {{item.title}}
        <span>{{item.author}} {{item.createTime | timeFilter}}</span>
      </li>
    </ul>
  </div>
  <footer>
    <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="params.pageNum"
    :page-size="params.pageSize"
    layout="total, prev, pager, next, jumper"
    :total="params.totalNum">
  </el-pagination>
  </footer>
</div>
</template>

<script type="text/javascript">
import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {
      params: {
        pageSize: 20,
        pageNum: 1,
        type: null,
        totalNum: 0
      }
    }
  },
  created () {
    let vm = this;
    this.getBlogList(this.params);
    this.$parent.$on('chooseMenu', type => {
      vm.params.type = type;
      vm.getBlogList(vm.params)
    })
    this.$parent.$on('refreshList', () => {
      vm.getBlogList(vm.params)
    })
  },
  methods: {
    ...mapMutations([
      'getBlogList'
    ]),
    handleCurrentChange (pageNum) {
      this.params.pageNum = pageNum;
      this.getBlogList(this.params);
    },
    handleSizeChange (pageSize) {
      this.params.pageSize = pageSize;
      this.getBlogList(this.params);
    }
  },
  computed: mapState({
    blogList: state => state.blog.blogList
  })
}
</script>

<style media="screen" lang="scss">
#blogList {
  background: #fff;
  padding: 10px;
  height: calc(100% - 30px);
  h3 {
    text-align: center;
    line-height: 30px;
    color: #333;
    padding-bottom: 10px;
    border-bottom: 1px #efefef solid;
  }
  .list {
    height: calc(100% - 75px);
    overflow: auto;
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
  footer {
    padding-top: 6px;
    text-align: center;
  }
}
</style>
