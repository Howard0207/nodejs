let mongoose = require('mongoose')

module.exports = new mongoose.Schema({
  // 用户名
  username: String,
  // 密码
  password: String,
  
  // 昵称
  nickname: {
    type: String,
    default: 'gest'+ new Date().getTime()
  },

  // 是否是管理员
  isAdmin: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: '/public/imgs/avatar/default.jpg'
  }
})