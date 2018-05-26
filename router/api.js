let express = require('express')
let router = express.Router()
let User = require('../models/User')
let Content = require('../models/Content')
let nodemailer = require('nodemailer');

// 统一返回格式
let responseData

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


/**
 * 用户邮箱注册-发送验证码
 *  验证邮箱是否符合规则。
 *  
 *  @return code:
 *    100： 邮箱格式错误
 *    101： 发送成功
 *    102： 发送失败
 */
router.post('/user/emailCheck',function(req,res) {
  
  let validateCode = 0

  let mailTo = req.body.email

  // 邮件验证
  let reg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/;
  if (!mailTo.match(reg)) {
    return res.json({code: 100, message: "邮箱地址不符合规范，请重新输入！"});
  }

  // 随机验证code
  validateCode = Math.floor(Math.random()*10000)
  // session 存储
  req.session.validateCode = validateCode
  // 邮件发送
  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.163.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'wode163_youjian@163.com', // generated ethereal user
            pass: 'wodeyoujian163' // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Blog World👻" <wode163_youjian@163.com>', // sender address
        to: '"User👻 " '+mailTo+'', // list of receivers
        subject: 'Blog Wrold 邮箱验证', // Subject line
        text: '', // plain text body
        html: '<h2>注册验证：</h2><div style="padding: 0 20px;display: flex;line-height: 30px;font-size: 20px;"><p style="margin: 0;">验证码：</p><span style="display: block;">'+validateCode+'</span></div> ' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
            res.json({code: 102 , message: 'error'})
        }
        //console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.json({code: 101 , message: 'ok'})
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});
})

// 进入注册页面
router.get('/user/register',(req,res) => {
  res.render('register/register',{})
})

/*
  用户注册
    |-注册逻辑
      1.用户名不能为空 code:1
      2.密码不能为空   code:2
      3.验证码错误     code:3
      |- 数据库查询
        1.用户是否已经被注册了。 code:4
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
  let validate = parseInt(req.body.validateCode)
  let sessionCode = req.session.validateCode
  /* 
    数据验证
    |- 用户名验证
    |- 密码为空验证
  */
  if( username === '' ) {
    responseData.code = 1
    responseData.message = '用户名不能为空'
    res.render('error/registerError',responseData)
    return false
  } else if (password === '') {
    responseData.code = 2
    responseData.message = '密码不能为空'
    res.render('error/registerError',responseData)
    return false
  } else if ( sessionCode !== validate ) {
    responseData.code = 3
    responseData.message = '验证码错误'
    res.render('error/registerError',responseData)
    return false
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
      res.redirect('/')
    })
  }
})



// 进入登陆页面
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
        res.redirect('/')
        return true
      }
    })
  }
})

/*
  logout
*/
router.get('/user/logout',function(req,res) {
  if( req.cookies.userInfo) {
    res.clearCookie('userInfo')
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
  let content = req.body.content
  content = content.replace(/</g,'&lt;').replace(/>/g,'&gt;')
  // 内容id
  let contentId = req.body.contentid || ''
  let postData = {
    username: req.userInfo.username,
    postTime: new Date(),
    content: content
  }
  // 查询当前这篇内容的信息
  Content.findOne({
    _id: contentId
  }).select('comments').then((content) => {
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