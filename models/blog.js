const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var blogSchema = new Schema({
  title: String,
  content: String,
  username: String,
  type: String,
  createTime: Number,
  updateTime: Number
})

module.exports = mongoose.model('Blog', blogSchema, 'blog');
