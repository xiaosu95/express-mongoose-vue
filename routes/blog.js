const express = require('express');
const router = express.Router();
const Userdb = require('../models/user');
const Blog = require('../models/blog');
const checkLogin = require('../middlewares/check').checkLogin;
const $upload = require('../common/utils').$upload;
const path = require('path');
const fs = require('fs');

// 获取文章
router.get('/getBlog', checkLogin, (req, res, next) => {
  const username = req.query.username;
  const pageSize = req.query.pageSize;
  const pageNum = req.query.pageNum;
  const type = req.query.type;
  try {
    if (!username) throw new Error('用户名不能为空');
    if (!pageSize) throw new Error('pageSize不能为空');
    if (!pageNum) throw new Error('pageNum不能为空');
  } catch (e) {
    next({message: e});
  }
  const filterQuery = {username};
  if (type) filterQuery.type = type;
  let blog = Blog.find(filterQuery);
  const totalNum = blog.length;
  blog.skip(pageSize * (pageNum - 1))
  blog.limit(pageSize)
  blog.exec((err, data) => {
    if (err) return next({message: '系统错误'});
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

// 上传图片
router.post('/upload', checkLogin, $upload('blogPhoto/', ['png', 'jpg']).single('blogPhoto'), (req, res, next) => {
  res.send({
    error: 0,
    data: [req.file.path.split(path.sep).pop()]
  })
})

// 添加新的文章
router.post('/createBlog', checkLogin, (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const username = req.body.username;
  try {
    if (!username) throw new Error('用户名不能为空');
    if (!content) throw new Error('content不能为空');
    if (!title) throw new Error('title不能为空');
  } catch (e) {
    next({message: e});
  }
  Blog.create({
    title,
    content,
    username,
    createTime: new Date()
  })
})

// 删除文章
router.get('/deleteBlog', checkLogin, (req, res, next) => {
  const _id = req.query.blogId;
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
