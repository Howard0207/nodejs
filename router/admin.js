let express = require('express')
let router = express.Router()
// 引入用户模型
let User = require('../models/User')
router.use((req,res,next) => {
  if(!req.userInfo.isAdmin) {
    res.send('对不起，只有管理员才可以进入后台管理')
    return false
  }
  next()
})

router.get('/',(req,res,next) => {
  res.render('admin/index',{})
})

router.get('/user',(req,res,next) => {
  /* 
    从数据库中读取用户数据
    |- 限制获取数据的条数
      limit(Number): 限制获取的数据条数
  */

  User.find().limit(3).then((users) => {
    res.render('admin/user_index',{
      userInfo: req.userInfo,
      users: users
    })
  })
})

module.exports = router