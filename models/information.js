const mongoose = require('mongoose');
// 系统消息
informationSchema = mongoose.Schema({
  username: String,
  initiator: String,
  createTime: String,
  type: String,
  msg: String,
  initiatorAvatar: String
});

module.exports = mongoose.model('Information', informationSchema, 'information');
