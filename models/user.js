const mongoose = require('mongoose');
// const Information = require('./information');
const Schema = mongoose.Schema
let userSchema = new Schema({
  username: String,
  password: String,
  nickname: String,
  gender: String,
  avatar: String,
  friends: Array,
  status: String,
  id: Schema.Types.ObjectId,
  information: Schema.Types.ObjectId
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
    self.find({}, 'username nickname avatar gender status friends').then(data => {
      const allPeople = data.map(ele => {
        return {
          username: ele.username,
          nickname: ele.nickname,
          avatar: ele.avatar,
          gender: ele.gender,
          status: ele.status
        }
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
// 修改用户的状态
userSchema.statics.changeStatus = function (user, status) {
  const self = this;
  return new Promise(function(resolve, reject) {
    let oldValue = {username: user};
    let newValue = {username: user, status: status};
    self.update(oldValue, newValue).then(data => {
      resolve()
    }, () => {
      reject('系统错误');
    })
  })
}

// 添加好友
const User = module.exports = mongoose.model('User', userSchema, 'users');
