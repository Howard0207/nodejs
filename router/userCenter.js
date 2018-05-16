let express = require('express')
let router = express.Router()
// User 模型
let User = require('../models/User')

let data = {}

// 登陆检测
router.use((req, res, next) => {
  if (!req.userInfo._uid) {
    res.send('对不起，只有管理员才可以进入后台管理')
    return false
  }
  next()
})

router.get('/basic',(req,res) => {
  res.render('userCenter/settings',{
    userInfo:req.userInfo
  })
})

module.exports = router