
module.exports = function (socketIO) {
  socketIO.on('connection', socket => {
    const url = socket.request.headers.referer;
    const splited = url.split('/');
    const roomID = 1231;
    let user = '';
    let userList = [];
    socket.on('join', username => {
      user = username;
      console.log(username)
      userList.push(user)
      socket.join(roomID);
      socketIO.to(roomID).emit('add', username)
    })
    socket.on('message', msg => {

    })
  })
}
