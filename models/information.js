const mongoose = require('mongoose');

informationSchema = mongoose.Schema({
  username: String,
  initiator: String,
  createTime: Number,
  type: String,
  msg: String,
  initiatorAvatar: String
});

module.exports = mongoose.model('Information', informationSchema, 'information');
