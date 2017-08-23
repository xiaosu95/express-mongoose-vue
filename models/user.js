const mongoose = require('mongoose');
const Schema = mongoose.Schema
// const Information = require('./information');
let userSchema = new Schema({
  username: String,
  password: String,
  nickname: String,
  gender: String,
  avatar: String,
  friends: Array,
  waitFriends: Array,
  status: String,
  createTime: Number,
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
        user.createTime = new Date();
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
    self.findOne({username: user})
    .exec((err, userInfo) => {
      if (err) reject('系统错误');
      else {
        self.find({username: {$ne: user}}, 'username nickname avatar gender status').then(data => {
          resolve({
            allPeople: data.filter(ele => ![...userInfo.friends, ...userInfo.waitFriends].includes(ele.username)),
            friends: data.filter(ele => userInfo.friends.includes(ele.username))
          })
        }, () => {
          reject('系统错误');
        })
      }
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
