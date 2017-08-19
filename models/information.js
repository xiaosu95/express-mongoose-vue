const mongoose = require('mongoose');

informationSchema = mongoose.Schema({
  username: String,
  initiator: String,
  createTime: String,
  type: String,
  msg: String,
  initiatorAvatar: String
});

// 添加addFriend信息
// informationSchema.statics.addMsg = function () {
//
// }

module.exports = mongoose.model('Information', informationSchema, 'information');
