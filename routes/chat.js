const express = require('express');
const router = express.Router();
const Userdb = require('../models/user');
const checkLogin = require('../middlewares/check').checkLogin;
const Information = require('../models/information');
const socket = require('../socket/')

router.post('/addFriend', checkLogin, (req, res, next) => {
  const Initiator = req.body.Initiator;
  const targetUser = req.body.targetUser;
  try {
    if (!Number(Initiator) || !Number(targetUser)) throw new Error('格式错误');
    let sort = Initiator > targetUser ? -1 : 1;
    Userdb.find({username: {$in: [Initiator, targetUser]}}).sort({username: sort})
    .populate({path: 'information', model: 'Information'})
    .exec((err, data) => {
      if (err) return next('系统错误')
      console.log(data)
      if (data[0].friends.filter(ele => ele.username == targetUser).length > 0) return next({message: '以添加过'})
      if (data.length < 2) return next({message: '用户不存在'})
      data[0].friends.push({
        username: data[1].username,
        nickname: data[1].nickname,
        avatar: data[1].avatar,
        gender: data[1].gender,
        status: 'wait'
      })
      data[0].save();
      if (data[1].information) {
        data[1].information.requestAddList.push({
          username: data[0].username,
          nickname: data[0].nickname,
          avatar: data[0].avatar
        });
        data[1].information.save();
      } else {
        Information.create({
          _id: data[1].id,
          username: data[1].username,
          requestAddList: [{
            username: data[0].username,
            nickname: data[0].nickname,
            avatar: data[0].avatar
          }]
        })
      }
      if (socket.socketList[data[1].username]) {      // 若在线直接推送
        socket.socketList[data[1].username].emit('systemNotice', {
          username: data[0].username,
          nickname: data[0].nickname,
          avatar: data[0].avatar
        })
      }
      return res.send({
        isSuccess: 1,
        msg: '成功'
      })
    })
  } catch (e) {
    return res.send({
      isSuccess: 0,
      msg: e.message
    })
  }
})

// 获取系统消息
router.post('/getSystemNotice', checkLogin, (req, res, next) => {
  const username = req.body.username;
  Information.findOne({'username': username})
  .then(data => {
    if (data) {
      res.send({
        isSuccess: 1,
        msg: '查询成功',
        data: {
          requestAddList: data.requestAddList,
          systemNotice: data.systemNotice
        }
      })
    } else {
      next((message: '查询不到该用户'));
    }
  }, () => {
    next({message: '系统错误'})
  })
})
module.exports = router;
