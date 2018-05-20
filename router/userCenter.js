/*eslint no-console: ["error", { allow: ["warn", "error","info"] }] */
const express = require('express')
const router = express.Router()
const fs = require('fs')
const formidable = require('formidable')
// User 模型


const cacheFolder = '../public/imgs/cacheFolder/temp'

// 清空缓存文件夹
let emptyDir = function (fileUrl) {

  let files = fs.readdirSync(fileUrl)//读取该文件夹
  files.forEach(function (file) {
    let stats = fs.statSync(fileUrl + '/' + file)
    if (stats.isDirectory()) {
      emptyDir(fileUrl + '/' + file)
    } else {
      fs.unlinkSync(fileUrl + '/' + file)
      console.info('删除文件' + fileUrl + '/' + file + '成功')
    }
  })
  fs.rmdirSync(fileUrl)
}




// 登陆检测
router.use((req, res, next) => {
  if (!req.userInfo._uid) {
    res.send('对不起，只有管理员才可以进入后台管理')
    return false
  }
  next()
})

router.get('/basic', (req, res) => {
  res.render('userCenter/settings', {
    userInfo: req.userInfo
  })
})

router.get('/changepwd', (req, res) => {
  res.render('userCenter/rebuildPwd', {
    userInfo: req.userInfo
  })
})

router.get('/changeemail', (req, res) => {
  res.render('userCenter/rebuildEmail', {
    userInfo: req.userInfo
  })
})


router.post('/save_avatar', function (req, res) {
  let form = new formidable.IncomingForm() //创建上传表单
  form.encoding = 'utf-8'//设置编辑
  form.uploadDir = cacheFolder //设置上传目录
  form.keepExtensions = true //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024 //文件大小
  form.type = true
  form.parse(req, function (err, fields) {
    // 获取图片的base64信息
    let imgData = fields.imgData
    let base64Data = imgData.replace(/^data:image\/\w+;base64,/, '')

    // 获取图片的大小 判断是否合规
    let len = base64Data.length
    let size = len - (len / 8) * 2
    console.info(size)

    // 将base64 写入buffer
    let dataBuffer = new Buffer(base64Data, 'base64')

    // 将buffer写入文件
    let path = './public/avatar/' + Date.now() + '.jpg'
    fs.writeFile(path, dataBuffer, function (err) {
      if (err) {
        res.json({
          code: 400,
          msg: '图片上传失败'
        })
      } else {
        res.json({
          code: 200,
          msg: '上传成功',
          urlLogo: path
        })
      }
    })
  })
})


router.post('/upload_avatar', function (req, res) {
  if (!fs.existsSync(cacheFolder)) {
    fs.mkdirSync(cacheFolder)
  }
  let form = new formidable.IncomingForm() //创建上传表单
  form.encoding = 'utf-8' //设置编辑
  form.uploadDir = cacheFolder //设置上传目录
  form.keepExtensions = true //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024 //文件大小
  form.type = true
  form.parse(req, function (err, fields, files) {
    if (err) {
      res.send(err)
      return
    }
    let extName = '' //后缀名
    let imgFile = files.file

    //判断图片后缀名类型
    switch (imgFile.type) {
    case 'image/pjpeg':
      extName = 'jpg'
      break
    case 'image/jpeg':
      extName = 'jpg'
      break
    case 'image/png':
      extName = 'png'
      break
    case 'image/x-png':
      extName = 'png'
      break
    }


    // 判断文件是否合规
    if (extName.length === 0) {
      res.send({
        code: 202,
        msg: '只支持png和jpg格式图片',
      })
      return
    } else {

      // 清空缓存文件夹
      setTimeout(function () {
        emptyDir(cacheFolder)
      }, 10000)

      // 返回请求结果
      res.send({
        code: 200,
        msg: '上传成功',
        urlLogo: imgFile.path
      })
    }
  })
})

module.exports = router