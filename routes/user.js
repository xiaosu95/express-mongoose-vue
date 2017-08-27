const express = require('express');
const router = express.Router();
const Userdb = require('../models/user');
const sha1 = require('sha1');
const checkLogin = require('../middlewares/check').checkLogin;
const $upload = require('../common/utils').$upload;
const path = require('path');
const fs = require('fs');

// 注册
router.post('/register', $upload('uploads/', ['png', 'jpg']).single('avatar'), (req, res) => {
  const username = req.body.username;
  const nickname = req.body.nickname;
  const password = req.body.password;
  const repassword = req.body.repassword;
  const gender = req.body.gender;
  const avatar = req.file.path.split(path.sep).pop();
  let user = req.body;
  try {
    if (!(username.length >= 1 && username.length <= 10)) throw new Error('名字请限制在 1-10 个字符');
    if (!['b', 'g'].includes(gender)) throw new Error('性别只能是 b、g');
    if (!(password.length >= 6 && password.length <= 18)) throw new Error('密码长度为6-18位');
    if (password !== repassword) throw new Error('两次密码不一致');
  } catch (e) {
    fs.unlink(req.file.path);       // 失败删除图片
    return res.send({
      isSuccess: 0,
      msg: e.message
    })
  }
  user.avatar = avatar;
  user.password = sha1(password);
  Userdb.addUser(user)             // 操作数据库
  .then(data => {
    delete user.password;
    req.session.user = user;
    res.send({
      isSuccess: 1,
      msg: '注册成功',
      data: user
    })
  }, err => {
    fs.unlink(req.file.path);      // 失败删除图片
    res.send({
      isSuccess: 0,
      msg: err
    })
  })
})

// 登录
router.post('/login', (req, res) => {
  const params = req.body;
  Userdb.findOne({username: params.username, password: sha1(params.password)}, 'username nickname gender avatar createTime')
  .then(data => {
    if (data) {
      req.session.user = data;
      res.send({
        isSuccess: 1,
        msg: '登录成功',
        data: data
      });
    } else {
      res.send({
        isSuccess: 0,
        msg: '账号或密码错误'
      });
    }
    // res.cookie('isLogin', '1', { expires: new Date(Date.now() + 10000 * 60 * 60 * 24 * 7) });
  })
})

router.get('/logout', (req, res) => {
  delete req.session.user;
  console.log(req.session)
  res.send({
    isSuccess: 1
  })
})
module.exports = router;
