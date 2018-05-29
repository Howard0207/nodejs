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

  // 性别
  gender: {
    type: String,
    default: '1'
  },

  // 工作职务
  post: {
    type: String,
    default: ''
  },

  // 生日
  birthday: {
    type: String,
    default: ''
  },

  // 所在省份
  province: {
    type: String,
    default: '北京市'
  },

  // 所在城市
  city: {
    type: String,
    default: '东城区'
  },

  // 是否是管理员
  isAdmin: {
    type: Boolean,
    default: false
  },

  // 头像
  avatar: {
    type: String,
    default: '/public/imgs/avatar/default.jpg'
  }
})