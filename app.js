let express = require('express')

let app = express()

let mongoose = require('mongoose')

// 加载body-parser, 用来处理post提交过来的数据
let bodyParser = require('body-parser')

// 设置静态文件托管
app.use('/public', express.static(__dirname + '/public'))

// 数据库连接
mongoose.connect('mongodb://localhost:27018/blog',function(err){
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

// 根据功能 划分模块
app.use('/admin',require('./router/admin'))
app.use('/api',require('./router/api'))
app.use('/',require('./router/main'))

