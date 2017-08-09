const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
  username: String,
  password: String
})
// 数据库添加用户
userSchema.statics.addUser = function (user) {
  const self = this;
  return new Promise(function(resolve, reject) {
    self.find({username: user.username})
    .then(data => {
      if (data.length === 0) {
        self.create(user)
        .then(() => {
          resolve(user);
        }, () => {
          reject('系统错误');
        })
      } else {
        reject(`${user.username}以存在`);
      }
    })
  })
}
const User = module.exports = mongoose.model('User', userSchema, 'users');
