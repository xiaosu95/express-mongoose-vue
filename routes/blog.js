const express = require('express');
const router = express.Router();
const Userdb = require('../models/user');
const Blog = require('../models/blog');
const checkLogin = require('../middlewares/check').checkLogin;
const $upload = require('../common/utils').$upload;
const path = require('path');
const fs = require('fs');
const removal = require('../common/utils').removal;       // 去重
const createQiniuToken = require('../common/utils').createQiniuToken    // 生成七牛tolen

// 获取用户信息
router.get('/getBolgUser', (req, res, next) => {
  const username = req.query.blogUser;
  Userdb.findOne({username}, 'username nickname gender avatar createTime').then(data => {
    res.send({
      isSuccess: 1,
      data: data,
      msg: '获取成功'
    })
  }, () => {
    next({message: '系统错误'});
  })
})

// 获取分类文章列表
router.get('/getBlogList', (req, res, next) => {
  const username = req.query.username;
  const pageSize = Number(req.query.pageSize);
  const pageNum = Number(req.query.pageNum);
  const type = req.query.type;
  try {
    if (!username) throw new Error('用户名不能为空');
    if (!pageSize) throw new Error('pageSize不能为空');
    if (!pageNum) throw new Error('pageNum不能为空');
  } catch (e) {
    next({message: e});
  }
  let filterQuery = {username};
  if (type) filterQuery.type = type;
  let blog = Blog.find(filterQuery, 'title createTime type');
  blog.skip(pageSize * (pageNum - 1))
  blog.limit(pageSize)
  blog.exec((err, data) => {
    if (err) return next({message: '系统错误'});
    Blog.find(filterQuery).then(totalData => {      // 获取总数
      const totalNum = totalData.length;
      res.send({
        isSuccess: 1,
        totalNum,
        pageSize,
        pageNum,
        data: data,
        msg: '获取成功'
      })
    })
  })
})

// 获取文章内容
router.get('/getBlog_content', (req, res, next) => {
  const _id = req.query._id;
  if (!_id) next({message: 'ID不能为空'});
  Blog.findOne({_id})
  .then(data => {
    res.send({
      isSuccess: 1,
      data: data,
      msg: '获取成功'
    })
  }, () => {
    next({message: '系统错误'});
  })
})

// 获取文章分类列表
router.get('/getBlog_classification', (req, res, next) => {
  const username = req.query.username;
  if (!username) next({message: '用户名不能为空'});
  Blog.find({username: username}, 'type')
  .then(data => {
    const typeList = removal(data.map(ele => ele.type));
    let blogList = new Array();
    typeList.forEach(ele => {
      blogList.push({
        type: ele,
        total: data.filter(ele2 => ele2.type == ele).length
      })
    })
    res.send({
      isSuccess: 1,
      data: blogList,
      msg: '获取成功'
    })
  }, () => {
    next({message: '系统错误'});
  })
})

// 上传图片
// router.post('/upload', checkLogin, $upload('blogPhoto/', ['png', 'jpg']).single('blogPhoto'), (req, res, next) => {
//   res.send({
//     errno: 0,
//     data: [req.file.path.split(path.sep).pop()]
//   })
// })
router.post('/upload', checkLogin, $upload('blogPhoto/', ['jpg', 'jpeg', 'gif', 'png']).single('editormd-image-file'), (req, res, next) => {
  res.send({
    success: 1,
    message: '上传成功',
    url: [req.file.path.split(path.sep).pop()]
  })
})

// 获取七牛token
router.get('/getQiniuToken', checkLogin, (req, res, next) => {
  res.send({
    isSuccess: 1,
    message: '获取成功',
    data: createQiniuToken('blog')
  })
})

// 添加新的文章
router.post('/createBlog', checkLogin, (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const username = req.body.username;
  const type = req.body.type;
  const author = req.session.user.nickname;
  const markdown = req.body.markdown;
  try {
    if (!username) throw new Error('用户名不能为空');
    if (!content) throw new Error('content不能为空');
    if (!markdown) throw new Error('markdown不能为空');
    if (!title) throw new Error('title不能为空');
    if (!type) throw new Error('type不能为空');
  } catch (e) {
    next({message: e});
  }
  Blog.create({
    title,
    content,
    username,
    markdown,
    type,
    author,
    createTime: Date.now()
  }).then(() => {
    res.send({
      isSuccess: 1,
      msg: '创建成功'
    })
  }, () => {
    next({message: '创建失败'});
  })
})

// 编辑文章
router.post('/updateEdit', checkLogin, (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const username = req.session.user.username;
  const type = req.body.type;
  const _id = req.body._id;
  const markdown = req.body.markdown;
  Blog.update({username: username, _id: _id}, {title, content, markdown, type, updateTime: Date.now()})
  .exec((err, data) => {
    if (err) next({message: '编辑失败'});
    else {
      res.send({
        isSuccess: 1,
        msg: '修改成功'
      })
    }
  })
})

// 删除文章
router.post('/deleteBlog', checkLogin, (req, res, next) => {
  const _id = req.body._id;
  const username = req.session.user.username;
  Blog.remove({username, _id})
  .then(() => {
    res.send({
      isSuccess: 1,
      msg: '删除成功'
    })
  }, () => {
    next({message: '删除失败'});
  })
})
module.exports = router;
