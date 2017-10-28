<template>
  <el-dialog title="编辑" v-model="editBlogDig" size="full" class="editBlogDig">
    <el-form :inline="true" :model="blogForm" class="demo-form-inline" :rules="blogFormRules" ref="blogForm">
      <el-form-item label="标题" prop="title">
        <el-input v-model="blogForm.title" placeholder="标题" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-autocomplete
          class="inline-input"
          v-model="blogForm.type"
          :fetch-suggestions="querySearch"
          placeholder="类型"
        ></el-autocomplete>
      </el-form-item>
    </el-form>
    <div :id="_id" class="edit"></div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editBlogDig = false">取 消</el-button>
      <el-button type="primary" @click="saveBlog">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/javascript">
export default {
  props: ['editor', 'blogForm', '_id'],
  data () {
    return {
      editBlogDig: false,
      blogFormRules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请输入文章类型', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    saveBlog () {
      this.$refs.blogForm.validate((valid) => {
        if (valid) {
          this.$emit('saveBlog');
        }
      })
    },
    querySearch (queryString, cb) {           // 类型
      let arr = this.$store.state.blog.blogType.map(ele => {
        return {value: ele.type}
      });
      cb(arr)
    }
  }
}
</script>

<style media="screen" lang="scss">
.editBlogDig {
  .el-dialog__body {
    height: calc(100% - 200px);
  }
  .edit {
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
</style>
