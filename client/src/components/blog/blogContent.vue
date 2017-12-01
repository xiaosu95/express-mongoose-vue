<template>
<div id="blogContent" v-loading.body="!blogContent.title">
  <div class="close">
    <h3>{{blogContent.title}}</h3>
    <div class="set">
      <span class="el-icon-arrow-left" @click="$router.push({name: 'BlogList'})"></span>
    </div>
  </div>
  <!-- <div class="w-e-text" v-html="blogContent.content"></div> -->
  <div id="editormd-view">
    <textarea style="display:none;" name="test-editormd-markdown-doc"></textarea>
  </div>
  <v-editBlog :editor="editor" :blogForm="blogContent" @saveBlog="saveBlog" :_id="editorId" ref="edit"></v-editBlog>
  <span class="el-icon-edit editbut" @click="openEdit" v-if="isCanEdit"></span>
</div>
</template>

<script type="text/javascript">
import { mapState } from 'vuex'
import EditBlog from '@/components/public/editBlog'
import API from '@/common/api'
// import E from 'wangeditor'
export default {
  components: {
    'v-editBlog': EditBlog
  },
  data () {
    return {
      editor: null,
      editormd: null,
      editorId: 'updateEdit',
      blogContent: {}
    }
  },
  mounted () {
    this.$axios.get(API.GET_BLOG_CONTENT, {
      params: { _id: this.$route.query._id }
    }).then(data => {
      if (data.data.isSuccess) {
        this.blogContent = data.data.data;
        editormd.markdownToHTML('editormd-view', {
          htmlDecode: 'style,script,iframe|on*',  // you can filter tags decode
          emoji: true,
          markdown: this.blogContent.markdown,
          taskList: true,
          tex: true,  // 默认不解析
          flowChart: true,  // 默认不解析
          sequenceDiagram: true  // 默认不解析
        });
      }
    })
  },
  methods: {
    openEdit () {
      let vm = this;
      this.$refs.edit.editBlogDig = true;
      if (!this.editor) {
        setTimeout(function () {
          // vm.editor = new E(`#${vm.editorId}`);
          // vm.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
          // vm.editor.customConfig.uploadFileName = 'blogPhoto';
          // vm.editor.customConfig.uploadImgServer = '/blog/upload'  // 上传图片到服务器
          // vm.editor.create();
          // vm.editor.txt.html(vm.blogContent.content);
          vm.editormd = editormd('my-editormd', {
            width: '100%',
            height: 'calc(100% - 60px)',
            htmlDecode: 'style,script,iframe|on*',
            syncScrolling: 'single',
            path: 'static/editor.md/lib/',       // 注意2：你的路径
            saveHTMLToTextarea: true,       // 注意3：这个配置，方便post提交表单
            emoji: true,         // emoji表情，默认关闭
            taskList: true,
            tocm: true,       // Using [TOCM]
            tex: true,        // 开启科学公式TeX语言支持，默认关闭
            codeFold: true,
            markdown: vm.blogContent.markdown,
            flowChart: true,        // 开启流程图支持，默认关闭
            sequenceDiagram: true,      // 开启时序/序列图支持，默认关闭,
            imageUpload: true,
            imageFormats: ['jpg', 'jpeg', 'gif', 'png'],
            imageUploadURL: '/blog/upload/',       // 注意你后端的上传图片服务地址
            onload: function () {
              // vm.editormd.setMarkdown(vm.blogContent.markdown)
            }
          });
        }, 100)
      }
    },
    saveBlog () {
      let vm = this;
      const json = {
        title: vm.blogContent.title,
        type: vm.blogContent.type,
        _id: vm.blogContent._id,
        content: vm.editormd.getHTML(),
        markdown: vm.editormd.getMarkdown()
      }
      vm.$axios.post(API.UPDATE_BLOG, json)
      .then(data => {
        if (data.data.isSuccess) {
          vm.$message.success('修改成功');
          vm.$refs.edit.editBlogDig = false;
          vm.blogContent.markdown = vm.editormd.getMarkdown();
          vm.$el.querySelector('#editormd-view').innerHTML = `<textarea style="display:none;" name="test-editormd-markdown-doc"></textarea>`
          editormd.markdownToHTML('editormd-view', {
            htmlDecode: 'style,script,iframe',  // you can filter tags decode
            emoji: true,
            markdown: this.blogContent.markdown,
            taskList: true,
            tex: true,  // 默认不解析
            flowChart: true,  // 默认不解析
            sequenceDiagram: true  // 默认不解析
          });
        } else {
          vm.$message.error('修改失败');
        }
      })
    }
  },
  computed: mapState({
    isCanEdit: state => state.blog.isCanEdit
  })
}
</script>

<style media="screen" lang="scss">
#blogContent {
  background: #fff;
  position: relative;
  .close {
    position: relative;
    h3 {
      color: #505050;
      text-align: center;
      line-height: 40px;
      border-bottom: 1px #efefef solid;
    }
    .set {
      position: absolute;
      line-height: 24px;
      font-size: 20px;
      left: 0px;
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
  .editbut {
    position: absolute;
    top: 80px;
    right: 20px;
    font-size: 20px;
    background: rgba(0,0,0,.5);
    color: #fff;
    padding: 10px;
    cursor: pointer;
    opacity: .3;
    border-radius: 3px;
    &:hover {
      opacity: 1;
    }
  }
  .w-e-text {
    color: #48576a;
    font-size: 14px;
  }
  #editormd-view {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
