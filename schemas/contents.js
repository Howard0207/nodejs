/**
 * Created by GH on 2018/05/01
 */
let mongoose = require('mongoose')

// 分类的表结构
module.exports = new mongoose.Schema({
  // 关联字段-内容分类的id
  category: {
    // 类型
    type: mongoose.Schema.Types.ObjectId,
    // 引用
    ref:'Category'
  },
  // 关联字段-用户
  user: {
    // 类型
    type: mongoose.Schema.Types.ObjectId,
    // 引用
    ref:'User'
  },

  // 添加时间
  addTime:{
    type: Date,
    default: new Date()
  },

  // 阅读量
  views: {
    type: Number,
    default: 0
  },

  // 分类名称
  title: String,
  // 简介
  description: {
    type:String,
    default: ''
  },
  // 内容
  content:{
    type: String,
    default: ''
  }

})