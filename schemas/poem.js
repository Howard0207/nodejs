let mongoose = require('mongoose')

// 分类的表结构
module.exports = new mongoose.Schema({
  id: Number,

  dynasty: String,

  poet: String,

  poem: String,

  poemname: String,

  details: String

})