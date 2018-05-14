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

  Category.where({user:req.userInfo._uid}).find().then((categories) => {
    data.categories = categories
    next()
  })
})



router.get('/index',function(req,res) {
  if(!req.userInfo._uid){
    res.redirect('/user/login')
    return;
  }
  data.category = req.query.category || ''
  data.count = 0
  data.page =  Number(req.query.page || 1)// 实际要判断传递数据的类型是否是number，这里暂不处理
  data.pages = 0
  data.limit = 6
  let where = {
    user : req.userInfo._uid
  }

  if(data.category) {
    where.category = data.category
  }


  // let whereU = {user:'5ad9b60617612a114d968ffd'};
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

    // return Content.where(whereU).find().limit(data.limit).skip(skip).populate(['category','user']).sort({addTime: -1})

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
    res.render('main/self_index',data)
  })
})


router.get('/',function(req,res) {
  data.category = req.query.category || ''
  data.count = 0
  data.page =  Number(req.query.page || 1)// 实际要判断传递数据的类型是否是number，这里暂不处理
  data.pages = 0
  data.limit = 6
  let where = {
    user : req.userInfo._uid
  }

  if(data.category) {
    where.category = data.category
  }


  // let whereU = {user:'5ad9b60617612a114d968ffd'};
  // 读取所有分类信息
  Content.count().then((count) => {
    data.count =  count
    // 计算总页数
    data.pages = Math.ceil(data.count/data.limit)
    // 取值不能超过pages
    data.page = Math.min(data.page,data.pages)
    // 取值不能小于1
    data.page = Math.max(data.page,1)
    
    let skip = (data.page-1)*data.limit

    return Content.find().limit(data.limit).skip(skip).populate(['category','user']).sort({views: -1})
   
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
    res.render('main/self_index',data)
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
    let timeStamp = data.content.addTime
    let day = fillZero(timeStamp.getDate())
    let month = fillZero(timeStamp.getMonth() + 1)
    let year = timeStamp.getFullYear()
    data.content.addFormateTime = year+'-'+month+'-'+day
    res.render('main/view',data)
  })
})

module.exports = router