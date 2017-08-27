<template>
<div id="blog">
  <div class="main_l">
    <div class="user">
      <img :src="user.avatar" alt="">
      <p>{{user.nickname}}</p>
      <span>创建时间:{{user.createTime | timeFilter2}}</span>
    </div>
    <el-button @click="openEditorElem" style="margin-top:20px; width:100%;" icon="edit">写文章...</el-button>
    <div class="blogList">
      <h3>分类</h3>
      <ul>
        <li @click="chooseMenu(null)">全部</li>
        <li v-for="item in blogType" @click="chooseMenu(item)">{{item}}({{blogList[item].length}})</li>
      </ul>
    </div>
  </div>
  <transition name="fade">
    <router-view class="main_r"></router-view>
  </transition>
<!-- 编辑 -->
  <el-dialog title="编辑" v-model="createBlogDig" size="full" class="createBlogDig">
    <el-form :inline="true" :model="newBlogForm" class="demo-form-inline" :rules="newBlogRules" ref="newBlogForm">
      <el-form-item label="标题" prop="title">
        <el-input v-model="newBlogForm.title" placeholder="标题" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-autocomplete
          class="inline-input"
          v-model="newBlogForm.type"
          :fetch-suggestions="querySearch"
          placeholder="类型"
        ></el-autocomplete>
      </el-form-item>
    </el-form>
    <div id="editorElem"></div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="createBlogDig = false">取 消</el-button>
      <el-button type="primary" @click="saveNewBlog">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import E from 'wangeditor'
import { mapState, mapMutations } from 'vuex'
import API from '@/common/api'
export default {
  data () {
    return {
      createBlogDig: false,
      editor: null,
      newBlogForm: {
        title: '',
        type: ''
      },
      newBlogRules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请输入文章类型', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getBlogList();
  },
  methods: {
    ...mapMutations([
      'getBlogList'
    ]),
    openEditorElem () {                 // 打开编辑窗口
      const vm = this;
      this.createBlogDig = true;
      if (!this.editor) {
        setTimeout(function () {
          vm.editor = new E('#editorElem');
          vm.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
          vm.editor.customConfig.uploadFileName = 'blogPhoto';
          vm.editor.customConfig.uploadImgServer = '/blog/upload'  // 上传图片到服务器
          vm.editor.create();
        }, 100)
      }
    },
    saveNewBlog () {                     // 保存文章
      const vm = this;
      this.$refs.newBlogForm.validate((valid) => {
        if (valid) {
          const json = {
            username: vm.user.username,
            title: vm.newBlogForm.title,
            type: vm.newBlogForm.type,
            content: vm.editor.txt.html()
          }
          vm.$axios.post(API.CREATE_BLOG, json)
          .then(data => {
            if (data.data.isSuccess) {
              vm.$message.success('创建成功');
              vm.$refs.newBlogForm.resetFields();
              vm.getBlogList();
              vm.createBlogDig = false;
            } else {
              vm.$message.error('创建失败');
            }
          })
        }
      })
    },
    chooseMenu (type) {
      this.$router.push({name: 'BlogList'});
      this.$emit('chooseMenu', type);
    },
    querySearch (queryString, cb) {           // 类型
      let arr = this.blogType.map(ele => {
        return {value: ele}
      });
      cb(arr)
    }
  },
  computed: mapState({
    user: state => state.chat.user,
    blogList: state => state.blog.blogList,
    blogType: state => state.blog.blogType
  })
}
</script>

<style media="screen" lang="scss">
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
    border-radius: 3px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12),0 0 6px 0 rgba(0,0,0,.04);
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
    .blogList {
      margin-top: 20px;
      h3 {
        color: #333;
        padding-bottom: 10px;
        border-bottom: 1px #efefef solid;
        margin-bottom: 5px;
      }
      li {
        line-height: 30px;
        color: #666;
        cursor: pointer;
        &:hover {
          color: #333;
        }
      }
    }
  }
  .main_r {
    width: calc(100% - 220px);
    min-height: calc(100% - 30px);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12),0 0 6px 0 rgba(0,0,0,.04);
    box-sizing: border-box;
    float: right;
  }
  .createBlogDig {
    .el-dialog__body {
      height: calc(100% - 200px);
    }
    #editorElem {
      height: calc(100% - 60px);
      .w-e-text-container {
        height: 100% !important;
      }
      .w-e-text-container {
        li {
          list-style: initial;
        }
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .8s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    transition: opacity .8s;
    opacity: 0
  }
  .fade-enter-to {
    transform: translateY(-100%);
  }
}
</style>
