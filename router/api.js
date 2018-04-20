let express = require('express')
let router = express.Router()
let User = require('../models/User')

// 统一返回格式
let responseData;

router.use((req,res,next) => {
  responseData = {
    code : 0,
    message: ''
  }
  next()
})


/*
  用户注册
    |-注册逻辑
      1.用户名不能为空
      2.密码不能为空
      3.两次输入密码必须一致
      |- 数据库查询
        1.用户是否已经被注册了。
*/
router.post('/user/register',function(req,res) {
  /*
    接收数据
      |- 用户名
      |- 密码
      |- 确认密码
  */
  let username = req.body.username
  let password = req.body.password
  let repassword = req.body.repassword

  /* 
    数据验证
    |- 用户名验证
    |- 密码为空验证
    |- 两次密码是否一致验证
  */
  if( username === '' ) {
    responseData.code = 1
    responseData.message = '用户名不能为空'
    res.render('error/registerError',responseData)
    return false;
  } else if (password === '') {
    responseData.code = 2
    responseData.message = '密码不能为空'
    res.render('error/registerError',responseData)
    return false;
  } else if ( repassword !== password ) {
    responseData.code = 3
    responseData.message = '两次输入的密码不一致'
    res.render('error/registerError',responseData)
    return false;
  } else {
    // 用户名是否已经被注册
    User.findOne({
      username: username
    }).then(function(userInfo){
      if(userInfo) {
        // 表示数据库中有记录
        responseData.code = 4
        responseData.message = '用户名已经被注册'
        res.render('error/registerError',responseData)
      } else {
        // 数据库中无记录，保存到数据库中
        let user = new User({
          username: username,
          password: password
        })
        user.save()
        return user.save()
      }
    }).then((newUserInfo) => {
      console.log(newUserInfo)
      res.render('main/index',{})
    })
  }
})

module.exports = router