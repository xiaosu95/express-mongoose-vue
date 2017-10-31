<template>
<div id="blog" @scroll="scroll">
  <div class="main_l">
    <div class="user">
      <img :src="blogUser.avatar" alt="">
      <p>{{blogUser.nickname}}</p>
      <span>创建时间:{{blogUser.createTime | timeFilter2}}</span>
    </div>
    <embed src="http://www.blogclock.cn/swf/S100204334d80e0-9.swf" Width="180px" Height="230px" type="application/x-shockwave-flash" quality="high" wmode="transparent" autostart=true></embed>
    <el-button @click="openEditorElem" style="margin-top:20px; width:100%;" icon="edit" v-if="isCanEdit">写文章...</el-button>
    <div class="blogList">
      <h3>分类</h3>
      <ul>
        <li @click="chooseMenu(null)">全部</li>
        <li v-for="item in blogType" @click="chooseMenu(item.type)">{{item.type}}({{item.total}})</li>
      </ul>
    </div>
  </div>
  <span class="gotTop el-icon-caret-top" @click="gotTop" v-show="showGoTop && $route.name == 'BlogContent'"></span>
  <transition name="fade">
  </transition>
  <router-view class="main_r"></router-view>
<!-- 编辑 -->
  <v-editBlog :editor="editor" :blogForm="newBlogForm" @saveBlog="saveNewBlog" :_id="editorId" ref="edit"></v-editBlog>
</div>
</template>

<script>
// import E from 'wangeditor'
import { mapState, mapMutations } from 'vuex'
import API from '@/common/api'
import EditBlog from '@/components/public/editBlog'
export default {
  components: {
    'v-editBlog': EditBlog
  },
  data () {
    return {
      createBlogDig: false,
      editor: null,
      editorId: 'creatEdit',
      editormd: null,         // editormd
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
      },
      showGoTop: false      // goTop按钮
    }
  },
  created () {
    let vm = this;
    this.$store.dispatch('userInit').then(function () {       // 初始化
      vm.$emit('chooseMenu', null);
      vm.getBlogClassification();
    });
  },
  mounted () {
    $('#app').particleground();
  },
  methods: {
    ...mapMutations([
      'getBlogClassification'
    ]),
    scroll (e) {
      e.target.scrollTop > 100 ? this.showGoTop = true : this.showGoTop = false
    },
    openEditorElem () {                 // 打开编辑窗口
      const vm = this;
      this.$refs.edit.editBlogDig = true;
      if (!this.editor) {
        setTimeout(function () {
          // vm.editor = new E(`#${vm.editorId}`);
          // vm.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
          // vm.editor.customConfig.uploadFileName = 'blogPhoto';
          // vm.editor.customConfig.uploadImgServer = '/blog/upload'  // 上传图片到服务器
          // vm.editor.create();
          vm.editormd = editormd('my-editormd', {
            width: '100%',
            height: 'calc(100% - 60px)',
            syncScrolling: 'single',
            path: '/static/editor.md/lib/',       // 注意2：你的路径
            saveHTMLToTextarea: true,       // 注意3：这个配置，方便post提交表单
            imageUpload: true,
            codeFold: true,
            emoji: true,         // emoji表情，默认关闭
            taskList: true,
            tocm: true,       // Using [TOCM]
            tex: true,        // 开启科学公式TeX语言支持，默认关闭
            flowChart: true,        // 开启流程图支持，默认关闭
            sequenceDiagram: true,      // 开启时序/序列图支持，默认关闭,
            imageFormats: ['jpg', 'jpeg', 'gif', 'png'],
            imageUploadURL: '/blog/upload/'       // 注意你后端的上传图片服务地址
          });
        }, 100)
      }
    },
    saveNewBlog () {                     // 创建文章
      const vm = this;
      const json = {
        username: vm.user.username,
        title: vm.newBlogForm.title,
        type: vm.newBlogForm.type,
        content: vm.editormd.getHTML(),
        markdown: vm.editormd.getMarkdown()
      }
      vm.$axios.post(API.CREATE_BLOG, json)
      .then(data => {
        if (data.data.isSuccess) {
          vm.$message.success('创建成功');
          vm.getBlogClassification();
          vm.$emit('refreshList');
          vm.editormd.setMarkdown('');       // 清空内容
          this.$refs.edit.editBlogDig = false;
        } else {
          vm.$message.error('创建失败');
        }
      })
    },
    chooseMenu (type) {
      let vm = this;
      this.$router.push({name: 'BlogList'});
      setTimeout(function () {
        vm.$emit('chooseMenu', type);
      }, 200)
    },
    gotTop () {       // 返回顶部
      $('#blog').animate({
        scrollTop: 0
      }, 500)
    }
  },
  computed: mapState({
    user: state => state.user,
    blogUser: state => state.blog.blogUser,     // 博主信息
    blogList: state => state.blog.blogList,
    blogType: state => state.blog.blogType,
    isCanEdit: state => state.blog.isCanEdit      // 权限
  })
}
</script>

<style media="screen" lang="scss">
#blog {
  padding: 30px 30px 0;
  background: #eee;
  box-sizing: border-box;
  overflow: auto;
  position: relative;
  transition: all .5s;
  .main_l {
    width: 200px;
    float: left;
    position: relative;
    z-index: 2;
    min-height: calc(100% - 30px);
    padding: 20px 10px;
    box-sizing: border-box;
    background: rgba(255,255,255,.8);
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
    position: relative;
    z-index: 2;
    min-height: calc(100% - 30px);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12),0 0 6px 0 rgba(0,0,0,.04);
    box-sizing: border-box;
    float: right;
    transition: opacity .5s, width .5s;
  }
  .fade-enter-active, .fade-leave-active {
    height: calc(100% - 30px);
    overflow: hidden;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0
  }
  .fade-enter-to {
    transform: translateY(-100%);
  }
  .gotTop {
    position: fixed;
    z-index: 100;
    right: 50px;
    bottom: 100px;
    padding: 10px;
    border-radius: 50%;
    background: #aaa;
    color: #fff;
    opacity: .5;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
  }
}
.pg-canvas {
  position: absolute;
  top: 0;
  z-index: 1;
}
</style>
