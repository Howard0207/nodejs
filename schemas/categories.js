let mongoose = require('mongoose')

// 分类的表结构
module.exports = new mongoose.Schema({
  // 分类名称
  name: String,
  // 关联字段-用户
  user: {
    // 类型
    type: mongoose.Schema.Types.ObjectId,
    // 引用
    ref:'User'
  }

})