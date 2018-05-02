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