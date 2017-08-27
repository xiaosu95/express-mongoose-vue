const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let blogSchema = new Schema({
  title: String,
  content: String,
  username: String,
  type: String,
  createTime: String,
  updateTime: String,
  author: String
})

module.exports = mongoose.model('Blog', blogSchema, 'blog');
