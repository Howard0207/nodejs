let express = require('express')
let app = express()

// 设置静态文件托管
app.use('/public', express.static(__dirname + '/public'))

// 设置监听端口
app.listen(3000)

// 设置模板引擎
app.set('view engine','ejs')

// 开发模式下， 禁用ejs 缓存
app.set('view cache', false);

// 根据功能 划分模块
app.use('/admin',require('./router/admin'))
// app.use('/api',require('./router/api'))
app.use('/',require('./router/main'))

