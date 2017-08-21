const Userdb = require('../models/user');
let socketList = {};
exports.socket = function (socketIO) {
  socketIO.on('connection', socket => {         // 客户端与服务端连接
    const url = socket.request.headers.referer;
    const splited = url.split('/');
    const roomID = 123456;                // 总房号
    let userList = [];
    socket.on('join', username => {
      socket.username = username;         // 添加用户名属性
      socketList[username] = socket;         // 存储用户
      userList.push(username)             // 将用户添加进聊天组
      socket.join(roomID);
      Userdb.changeStatus(username, 'online').then(() => {
        // Userdb.getFriends(username).then(data => {
        //   socketIO.emit('getFriends', data);         // 获取好友列表
        // })
        for (let key in socketList) {
          Userdb.getFriends(socketList[key].username).then(data => {
            socketList[key].emit('getFriends', data);         // 获取好友列表
          })
        }
      })
    })
    socket.on('clientSend', data => {     // 接收客户端发来的消息
      data.time = new Date();
      if (data.targetName === 'all') socketIO.to(roomID).emit('serverSend', {
        messager: data.targetName,
        data: data
      });
      else {
        socketList[data.targetName].emit('serverSend', {
          messager: socket.username,
          data: data
        });
        socket.emit('serverSend', {
          messager: socketList[data.targetName].username,
          data: data
        });
      }
    })
    socket.on('disconnect', function(){           // 用户下线
      Userdb.changeStatus(socket.username, 'offline').then(() => {
        for (let key in socketList) {
          Userdb.getFriends(socketList[key].username).then(data => {
            socketList[key].emit('getFriends', data);         // 获取好友列表
          })
        }
      })
    })
  })
}

exports.socketList = socketList;
// 系统推送
exports.systemNotice = function (user, text) {
  if (socketList[user]) {      // 若在线直接推送
    socketList[user].emit('systemNotice', text)
  }
}
