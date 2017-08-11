const Userdb = require('../models/user');
module.exports = function (socketIO) {
  let arrList = {};
  socketIO.on('connection', socket => {
    const url = socket.request.headers.referer;
    const splited = url.split('/');
    const roomID = 1231;
    let user = '';
    let userList = [];
    socket.on('join', username => {
      arrList[username] = socket;
      user = username;
      console.log(username)
      userList.push(user)
      socket.join(roomID);
      socketIO.to(roomID).emit('add', username);
      Userdb.getFriends(username).then(data => {
        socket.emit('getFriends', data);         // 获取好友列表    
      })
    })
    socket.on('message', msg => {

    })
  })
}
