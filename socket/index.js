const Userdb = require('../models/user');
module.exports = function (socketIO) {
  let arrList = {};
  socketIO.on('connection', socket => {         // 客户端与服务端连接
    const url = socket.request.headers.referer;
    const splited = url.split('/');
    const roomID = 1231;
    let user = '';
    let userList = [];
    socket.on('join', username => {
      arrList[username] = socket;
      user = username;
      userList.push(user)
      socket.join(roomID);
      socketIO.to(roomID).emit('add', username);
      Userdb.getFriends(username).then(data => {
        socketIO.emit('getFriends', data);         // 获取好友列表
      })
    })
    socket.on('message', msg => {

    })
  })
  socketIO.on('disconnect', socket => {     // 客户端与服务端断开
    Userdb.getFriends(username).then(data => {
      socketIO.emit('getFriends', data)
    })
  })
}
