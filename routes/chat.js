const express = require('express');
const router = express.Router();
const Userdb = require('../models/user');
const checkLogin = require('../middlewares/check').checkLogin;
const Information = require('../models/information');
const socket = require('../socket/');
const deleteArray = require('../common/utils').deleteArray;

router.post('/addFriend', checkLogin, (req, res, next) => {
  const Initiator = req.body.Initiator;
  const targetUser = req.body.targetUser;
  try {
    if (!Number(Initiator) || !Number(targetUser)) throw new Error('格式错误');
    let sort = Initiator > targetUser ? -1 : 1;
    Userdb.find({username: {$in: [Initiator, targetUser]}}).sort({username: sort})
    .exec((err, data) => {
      if (err) return next({message: '系统错误'});
      if (data.length < 2) return next({message: '用户不存在'});
      data[0].waitFriends.push(data[1].username);
      data[0].save();
      Information.create({
        username: targetUser,
        initiator: Initiator,
        createTime: new Date(),
        initiatorAvatar: data[0].avatar,
        type: 'addFriend'
      })
      socket.systemNotice(data[1].username, {             // 若在线直接推送
        username: data[0].username,
        nickname: data[0].nickname,
        avatar: data[0].avatar
      })
      return res.send({
        isSuccess: 1,
        msg: '成功'
      })
    });
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
  Information.find({'username': username})
  .then(data => {
    if (data) {
      res.send({
        isSuccess: 1,
        msg: '查询成功',
        data: data
      })
    } else {
      next({message: '查询不到该用户'});
    }
  }, () => {
    next({message: '系统错误'})
  })
})
// 清空系统信息
router.post('/clearSystemNotice', checkLogin, (req, res, next) => {
  const username = req.body.username;
  Information.remove({username: username, type: 'system'})
  .then((data) => {
    res.send({
      isSuccess: 1,
      msg: '删除成功'
    })
  }, () => {
    next({message: '删除失败'});
  })
})

// 验证好友信息
router.post('/verification', checkLogin, (req, res, next) => {
  const status = req.body.status;
  const username = req.body.username;
  const targetUser = req.body.targetUser;
  const msgId = req.body.msgId;
  let sort = username > targetUser ? -1 : 1;
  Userdb.find({username: {$in: [username, targetUser]}}).sort({username: sort})
  .exec((err, data) => {
    if (err) return next({message: '系统错误'});
    if (data.length < 2) return next({message: '用户不存在'});
    if (status) {
      data[0].friends.push(data[1].username);
      data[0].save();
      deleteArray(data[1].waitFriends, data[0].username);
      data[1].friends.push(data[0].username);
      data[1].save();
      socket.systemNotice(data[1].username, `${data[0].nickname}同意添加你为好友`);   // 在线推送
      Information.create({                                      // 添加系统消息
        username: targetUser,
        initiator: '系统',
        createTime: new Date(),
        type: 'system',
        msg: `${data[0].nickname}同意添加你为好友`
      })
    } else {
      deleteArray(data[1].waitFriends, data[0].username);
      data[1].save();
      Information.create({                                      // 添加系统消息
        username: targetUser,
        initiator: '系统',
        createTime: new Date(),
        type: 'system',
        msg: `${data[0].nickname}拒绝添加你为好友`
      })
      socket.systemNotice(data[1].username, `${data[0].nickname}拒绝添加你为好友`);   // 在线推送
    }
    Information.remove({_id: msgId}, function () {});     // 删除该信息
    res.send({
      isSuccess: 1
    })
  })
})

// 清空

module.exports = router;
