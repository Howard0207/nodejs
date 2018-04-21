let express = require('express')

let app = express()

let mongoose = require('mongoose')

// 加载body-parser, 用来处理post提交过来的数据
let bodyParser = require('body-parser')

// 加载cookie
let cookieParser = require('cookie-parser')

// 用户模型
let User = require('./models/User')

// 设置静态文件托管
app.use('/public', express.static(__dirname + '/public'))

// 数据库连接
mongoose.connect('mongodb://localhost:27017/blog',function(err){
  if(err){
    console.log('数据库连接失败')
  } else {
    console.log('数据库连接成功')
    // 设置监听端口
    app.listen(3000)
  }
})

// 设置模板引擎
app.set('view engine','ejs')

// 开发模式下， 禁用ejs 缓存
app.set('view cache', false);

// bodyparser设置
app.use(bodyParser.urlencoded({extended:true}))

// cookie-parser设置
app.use(cookieParser())

app.use((req,res,next) => {
  req.userInfo = {}
  if(req.cookies.userInfo) {
      try {
        req.userInfo = req.cookies.userInfo

        // 获取当前登陆用户信息，是否是管理员
        User.findById(req.cookies.userInfo._uid).then((userInfo) => {
          req.userInfo.isAdmin = Boolean(userInfo.isAdmin)
          next()
          return true
        })
      } catch (e) {
        req.userInfo = {_uid: 0,username:'',isAdmin:false}
        next()
        return true
      }
  } else {
    req.userInfo = {_uid: 0,username:'',isAdmin:false}
    next()
    return true
  }
})
// 根据功能 划分模块
app.use('/admin',require('./router/admin'))
app.use('/api',require('./router/api'))
app.use('/',require('./router/main'))

