let express = require('express')
let router = express.Router()
// Category 模型
let Category = require('../models/Category')
let Content = require('../models/Content')
router.get('/',function(req,res) {
  let data = {
    userInfo: req.userInfo,
    categories: [],
    count: 0,
    page : Number(req.query.page || 1),// 实际要判断传递数据的类型是否是number，这里暂不处理
    pages: 0,
    limit: 10,
  }
  // 读取所有分类信息
  Category.find().then((categories) => {
    data.categories = categories
    return Content.count()
  }).then((count) => {
    data.count =  count
    // 计算总页数
    data.pages = Math.ceil(data.count/data.limit)
    // 取值不能超过pages
    data.page = Math.min(data.page,data.pages)
    // 取值不能小于1
    data.page = Math.max(data.page,1)
    
    let skip = (data.page-1)*data.limit

    return Content.find().limit(data.limit).skip(skip).populate(['category','user']).sort({addTime: -1})
   
  }).then((contents) => {
    data.contents = contents
    res.render('main/index',data)
  })
})

module.exports = router