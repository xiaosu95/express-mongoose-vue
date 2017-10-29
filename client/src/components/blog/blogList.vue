<template>
<div id="blogList">
  <h3><span class="iconfont icon-biaoqian"></span>{{params.type || '全部'}}. . .</h3>
  <div class="list">
    <ul>
      <li v-for="(item, $index) in blogList" @click="$router.push({name: 'BlogContent', query: {_id: item._id}})">
        {{item.title}}
        <b v-if="!params.type">({{item.type}})</b>
        <i class="el-icon-close" @click.stop="deleteBlog(item._id)"></i>
        <span>{{item.createTime | timeFilter}}</span>
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
import API from '@/common/api'
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
    },
    deleteBlog (_id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const json = {
          _id
        }
        this.$axios.post(API.DELETE_BLOG, json).then(data => {
          if (data.data.isSuccess) {
            this.$message.success('删除成功');
            this.getBlogList(this.params);
            this.$store.commit('getBlogClassification');    // 刷新页面数据
          } else {
            this.$message.error('删除失败');
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
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
  padding: 0 0 10px;
  height: calc(100% - 30px);
  h3 {
    // text-align: center;
    padding-left: 10px;
    line-height: 40px;
    color: #1d90e6;
    border-bottom: 1px #efefef solid;
    background: #e4e8f1;
    span {
      font-size: 20px;
      margin-right: 10px;
    }
  }
  .list {
    height: calc(100% - 75px);
    padding: 10px 10px 0;
    overflow: auto;
    box-sizing: border-box;
    li {
      line-height: 40px;
      padding-left: 10px;
      font-size: 20px;
      color: #505050;
      border-bottom: 1px #efefef dashed;
      cursor: pointer;
      b {
        font-size: 12px;
        margin-left: 15px;
        color: #888;
      }
      span {
        float: right;
        margin-right: 30px;
        font-size: 12px;
      }
      i {
        float: right;
        font-size: 12px;
        line-height: 40px;
        margin-right: 20px;
        &:hover {
          color: #f22;
        }
      }
      &:hover {
        background: #fafafa;
      }
    }
  }
  footer {
    padding-top: 6px;
    text-align: center;
    border-top: 1px #dedede solid;
  }
}
</style>
