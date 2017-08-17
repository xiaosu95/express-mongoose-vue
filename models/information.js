const mongoose = require('mongoose');

informationSchema = mongoose.Schema({
  requestAddList: Array,
  username: String,
  systemNotice: Array
});

// 添加addFriend信息
informationSchema.statics.addFriendMsg = function (Initiator, targetUser) {
  const self = this;
  self.findOne({username: targetUser}).exec()
}

module.exports = mongoose.model('Information', informationSchema, 'information');
