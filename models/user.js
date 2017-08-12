const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
  username: String,
  password: String,
  nickname: String,
  gender: String,
  avatar: String,
  friends: Array,
  status: String
})
// 数据库添加用户
userSchema.statics.addUser = function (user) {
  const self = this;
  return new Promise(function(resolve, reject) {
    self.findOne({username: user.username})
    .then(data => {
      if (data) {
        reject(`${user.username}以存在`);
      } else {
        self.create(user)
        .then(() => {
          resolve(user);
        }, () => {
          reject('系统错误');
        })
      }
    })
  })
}
// 获取用户列表和好友列表
userSchema.statics.getFriends = function (user) {
  const self = this;
  return new Promise(function(resolve, reject) {
    self.find({}, 'username nickname avatar gender friends').then(data => {
      const allPeople = data.map(ele => {
        delete ele.friends;
        return ele
      });
      resolve({
        allPeople: allPeople,
        friends: data.filter(ele => ele.username === user)[0].friends
      })
    }, () => {
      reject('系统错误');
    })
  })
}
const User = module.exports = mongoose.model('User', userSchema, 'users');
