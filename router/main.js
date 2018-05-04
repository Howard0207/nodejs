let express = require('express')
let router = express.Router()
// Category 模型
let Category = require('../models/Category')
let Content = require('../models/Content')

let data = {}


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
 * 处理通用的数据
 */
router.use((req,res,next) => {
  data ={
    userInfo: req.userInfo,
    categories: []
  }

  Category.find().then((categories) => {
    data.categories = categories
    next()
  })
})



router.get('/',function(req,res) {

  data.category = req.query.category || ''
  data.count = 0
  data.page =  Number(req.query.page || 1)// 实际要判断传递数据的类型是否是number，这里暂不处理
  data.pages = 0
  data.limit = 6
  let where = {}

  if(data.category) {
    where.category = data.category
  }
  // 读取所有分类信息
  Content.where(where).count().then((count) => {
    data.count =  count
    // 计算总页数
    data.pages = Math.ceil(data.count/data.limit)
    // 取值不能超过pages
    data.page = Math.min(data.page,data.pages)
    // 取值不能小于1
    data.page = Math.max(data.page,1)
    
    let skip = (data.page-1)*data.limit

    return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({addTime: -1})
   
  }).then((contents) => {
   
    for(let i=0,len=contents.length;i<len;i++) {
      let timeStamp = contents[i].addTime
      let day = fillZero(timeStamp.getDate())
      let month = fillZero(timeStamp.getMonth() + 1)
      let year = timeStamp.getFullYear()
      let hours = fillZero(timeStamp.getHours())
      let minutes = fillZero(timeStamp.getMinutes())
      let seconds = fillZero(timeStamp.getSeconds())
      contents[i].addFormateTime = year+'-'+month+'-'+day
    }
    data.contents = contents
    res.render('main/index',data)
  })
})

router.get('/view', (req,res) => {
  let contentId = req.query.contentid || ''
  Content.findOne({
    _id: contentId
  }).populate('user').then((content) => {
    data.content = content
    content.views++
    content.save()
    res.render('main/view',data)
  })
})

module.exports = router