const express = require('express');
const router = express.Router();
const Userdb = require('../models/user');
const sha1 = require('sha1');
const checkLogin = require('../middlewares/check').checkLogin;
const $upload = require('../common/utils').$upload;

// 注册
router.post('/register', $upload('upload/').single('avatar'), (req, res) => {
  const username = req.body.username;
  const nickname = req.body.nickname;
  const password = req.body.password;
  const repassword = req.body.repassword;
  const gender = req.body.gender;
  const avatar = req.file.path;
  console.log(avatar)
  try {
    if (!(username.length >= 1 && username.length <= 10)) throw new Error('名字请限制在 1-10 个字符');
    if (!['b', 'g'].find(gender)) throw new Error('性别只能是 b、g');
    if (!(password.length >= 6 && password.length <= 18)) throw new Error('密码长度为6-18位');
    if (password !== repassword) throw new Error('两次密码不一致');
  } catch (e) {
    return res.send({
      isSuccess: 0,
      msg: e
    })
  }
  Userdb.addUser(params)
  .then(data => {
    res.send({
      isSuccess: 1,
      msg: '注册成功'
    })
  }, err => {
    res.send({
      isSuccess: 0,
      msg: err
    })
  })
})

router.post('/login', (req, res) => {
  const params = req.body;
  Userdb.find({username: params.username})
  .then(data => {
    if (data.length > 0) {
      if (data[0].password === params.password) {
        req.session.user = data[0].username;
        res.send({
          isSuccess: 1,
          msg: '登录成功'
        });
      } else {
        res.send({
          isSuccess: 0,
          msg: '密码错误'
        });
      }
      // res.cookie('isLogin', '1', { expires: new Date(Date.now() + 10000 * 60 * 60 * 24 * 7) });
    } else {
      res.send({
        isSuccess: 0,
        msg: '查询不到该用户'
      });
    }
  })
})

module.exports = router;
