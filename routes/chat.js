const express = require('express');
const router = express.Router();
const Userdb = require('../models/user');
const checkLogin = require('../middlewares/check').checkLogin;

router.post('/addFriend', checkLogin, (req, res) => {
  const Initiator = req.body.Initiator;
  const targetUser = req.body.targetUser;
  try {
    Userdb.findOne({username: Initiator}).then(() => {
      throw new Error('用户不存在');
    })
    Userdb.findOne({username: Initiator}).then(() => {
      throw new Error('用户不存在');
    })
  } catch (e) {

  }
})
