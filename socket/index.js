const Userdb = require('../models/user');
module.exports = function (socketIO) {
  let arrList = {};
  socketIO.on('connection', socket => {         // 客户端与服务端连接
    const url = socket.request.headers.referer;
    const splited = url.split('/');
    const roomID = 123456;                // 总房号
    let userList = [];
    socket.on('join', username => {
      socket.username = username;         // 添加用户名属性
      arrList[username] = socket;         // 存储用户
      userList.push(username)             // 将用户添加进聊天组
      socket.join(roomID);
      socketIO.to(roomID).emit('add', username);
      Userdb.getFriends(username).then(data => {
        socketIO.emit('getFriends', data);         // 获取好友列表
      })
    })
    socket.on('message', msg => {

    })
    socket.on('disconnect', function(){           // 用户下线
      Userdb.getFriends(socket.username).then(data => {
        Userdb.changeStatus(socket.username, 'offline').then(() => {
          socketIO.emit('getFriends', data);
          console.log(`${socket.username}离开了聊天室`);
        })
      })
    })
  })
}
