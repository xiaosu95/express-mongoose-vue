const express = require('express');
const router = express.Router();
const Userdb = require('../models/user');
const checkLogin = require('../middlewares/check').checkLogin;

// 注册
router.post('/register', (req, res) => {
  const params = req.body;
  Userdb.addUser(params)
  .then(data => {
    res.send({
      isSuccess: 0,
      msg: '注册成功'
    })
  }, err => {
    res.send({
      isSuccess: 1,
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
          msg: '登录失败'
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
