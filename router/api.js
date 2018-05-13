let express = require('express')
let router = express.Router()
let User = require('../models/User')
let Content = require('../models/Content')
// 统一返回格式
let responseData;

router.use((req,res,next) => {
  responseData = {
    code : 0,
    message: ''
  }
  next()
})

function fillZero(num) {
  if(typeof num !== 'number') {
    throw new Error('access parameter is not a number')
  } else if(num<10) {
    return '0' + num
  } else {
    return num
  }
}

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
      res.cookie('userInfo',{
        _uid: newUserInfo._id,
        username: newUserInfo.username
      })
      res.redirect('/');
    })
  }
})



// 进入登陆注册页面
router.get('/user/login',(req,res) => {
  res.render('login/login',{})
})

/*
  用户登录
    |-登录逻辑
      1.用户名不能为空
      2.密码不能为空
      |- 数据库查询
        1.用户是否存在。
*/
router.post('/user/login',(req,res) => {
  let username = req.body.username
  let password = req.body.password
  if(username === '' || password==='') {
    responseData.code = 1
    responseData.message = '用户名或密码不能为空'
    res.render('error/registerError',responseData)
    return false
  } else {
    // 查询数据库中相同用户名和密码的记录是否存在。
    User.findOne({
      username: username,
      password: password
    }).then((userInfo) => {
      if(!userInfo){
        responseData.code = 2
        responseData.message = '用户名或密码错误'
        res.render('error/registerError',responseData)
        return false
      } else {
        responseData.code = true
        responseData.message = '登录成功'
        responseData.userInfo = {
          _id: userInfo._id,
          username: userInfo.username
        }
        res.cookie('userInfo',{
          _uid: userInfo._id,
          username: userInfo.username
        })
        res.redirect('/');
        // res.render('main/index',{userInfo: responseData.userInfo})
        return true
      }
    })
  }
})

/*
  logout
*/
router.get('/user/logout',function(req,res,next) {
  if( req.cookies.userInfo) {
    res.clearCookie('userInfo');
  }
  res.json({
    code: 1,
    message: '退出成功'
  })
})

/**
 * 获取指定文章的所有评论
 */
router.get('/comment',(req,res) => {
  let contentId = req.query.contentid || ''
  Content.findOne({
    _id: contentId
  }).then((content) => {
    responseData.data = content.comments
    for(let i=0,len=responseData.data.length;i<len;i++) {
      let timeStamp = responseData.data[i].postTime
      let day = fillZero(timeStamp.getDate())
      let month = fillZero(timeStamp.getMonth() + 1)
      let year = timeStamp.getFullYear()
      responseData.data[i].addFormateTime = year+'-'+month+'-'+day
    }
    res.json(responseData)
  })
})


/**
 * 评论提交
 */

router.post('/comment/post', (req,res) => {
  // 内容id
  let contentId = req.body.contentid || ''
  let postData = {
    username: req.userInfo.username,
    postTime: new Date(),
    content: req.body.content
  }
  // 查询当前这篇内容的信息
  Content.findOne({
    _id: contentId
  }).then((content) => {
    content.comments.push(postData)
    return content.save()
  }).then((newContent) => {
    responseData.message = '评论成功'
    responseData.data = newContent
    for(let i=0,len=responseData.data.comments.length;i<len;i++) {
      let timeStamp = responseData.data.comments[i].postTime
      let day = fillZero(timeStamp.getDate())
      let month = fillZero(timeStamp.getMonth() + 1)
      let year = timeStamp.getFullYear()
      responseData.data.comments[i].addFormateTime = year+'-'+month+'-'+day
    }
    res.json(responseData)
  })
})

module.exports = router