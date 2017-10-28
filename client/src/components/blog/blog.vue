<template>
<div id="blog">
  <div class="main_l">
    <div class="user">
      <img :src="user.avatar" alt="">
      <p>{{user.nickname}}</p>
      <span>创建时间:{{user.createTime | timeFilter2}}</span>
    </div>
    <embed src="http://www.blogclock.cn/swf/S100204334d80e0-9.swf" Width="180px" Height="230px" type="application/x-shockwave-flash" quality="high" wmode="transparent" autostart=true></embed>
    <el-button @click="openEditorElem" style="margin-top:20px; width:100%;" icon="edit">写文章...</el-button>
    <div class="blogList">
      <h3>分类</h3>
      <ul>
        <li @click="chooseMenu(null)">全部</li>
        <li v-for="item in blogType" @click="chooseMenu(item.type)">{{item.type}}({{item.total}})</li>
      </ul>
    </div>
  </div>
  <transition name="fade">
  </transition>
  <router-view class="main_r"></router-view>
<!-- 编辑 -->
  <v-editBlog :editor="editor" :blogForm="newBlogForm" @saveBlog="saveNewBlog" :_id="editorId" ref="edit"></v-editBlog>
</div>
</template>

<script>
import E from 'wangeditor'
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
    this.getBlogClassification();
  },
  mounted () {

  },
  methods: {
    ...mapMutations([
      'getBlogClassification'
    ]),
    openEditorElem () {                 // 打开编辑窗口
      const vm = this;
      this.$refs.edit.editBlogDig = true;
      if (!this.editor) {
        setTimeout(function () {
          vm.editor = new E(`#${vm.editorId}`);
          vm.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
          vm.editor.customConfig.uploadFileName = 'blogPhoto';
          vm.editor.customConfig.uploadImgServer = '/blog/upload'  // 上传图片到服务器
          vm.editor.create();
        }, 100)
      }
    },
    saveNewBlog () {                     // 保存文章
      const vm = this;
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
          vm.getBlogList();
          vm.$emit('refreshList');
          vm.editor.txt.html('');       // 清空内容
          this.$refs.edit.editBlogDig = false;
        } else {
          vm.$message.error('创建失败');
        }
      })
    },
    chooseMenu (type) {
      this.$router.push({name: 'BlogList'});
      this.$emit('chooseMenu', type);
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
  overflow: auto;
  position: relative;
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
}
</style>
