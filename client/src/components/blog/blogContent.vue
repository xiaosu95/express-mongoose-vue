<template>
<div id="blogContent">
  <div class="close">
    <h3>{{blogArticleList[$route.query.idx].title}}</h3>
    <div class="set">
      <span class="el-icon-edit edit" @click="openEdit">编辑</span>
      <span class="el-icon-close" @click="$router.push({name: 'BlogList'})"></span>
    </div>
  </div>
  <div class="w-e-text" v-html="blogArticleList[$route.query.idx].content"></div>
  <v-editBlog :editor="editor" :blogForm="blogForm" @saveBlog="saveBlog" :_id="editorId" ref="edit"></v-editBlog>
</div>
</template>

<script type="text/javascript">
import { mapState } from 'vuex'
import EditBlog from '@/components/public/editBlog'
import API from '@/common/api'
import E from 'wangeditor'
export default {
  components: {
    'v-editBlog': EditBlog
  },
  data () {
    return {
      editor: null,
      editorId: 'updateEdit',
      blogForm: {
        title: '',
        type: ''
      }
    }
  },
  methods: {
    openEdit () {
      let vm = this;
      vm.blogForm.title = vm.blogArticleList[vm.$route.query.idx].title;
      vm.blogForm.type = vm.blogArticleList[vm.$route.query.idx].type;
      this.$refs.edit.editBlogDig = true;
      if (!this.editor) {
        setTimeout(function () {
          vm.editor = new E(`#${vm.editorId}`);
          vm.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
          vm.editor.customConfig.uploadFileName = 'blogPhoto';
          vm.editor.customConfig.uploadImgServer = '/blog/upload'  // 上传图片到服务器
          vm.editor.create();
          vm.editor.txt.html(vm.blogArticleList[vm.$route.query.idx].content);
        }, 100)
      }
    },
    saveBlog () {
      let vm = this;
      const json = {
        title: vm.blogForm.title,
        type: vm.blogForm.type,
        _id: vm.blogArticleList[vm.$route.query.idx]._id,
        content: vm.editor.txt.html()
      }
      vm.$axios.post(API.UPDATE_BLOG, json)
      .then(data => {
        if (data.data.isSuccess) {
          vm.$message.success('修改成功');
          vm.$refs.edit.editBlogDig = false;
          vm.blogArticleList[vm.$route.query.idx].content = vm.editor.txt.html();
        } else {
          vm.$message.error('修改失败');
        }
      })
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
    .set {
      position: absolute;
      line-height: 24px;
      right: 20px;
      top: 10px;
      color: #505050;
    }
    span {
      cursor: pointer;
      opacity: 0.6;
      margin-left: 20px;
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
