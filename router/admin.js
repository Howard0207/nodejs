let express = require('express')
let router = express.Router()
// 引入用户模型
let User = require('../models/User')
let category = require('../models/Category')

router.use((req,res,next) => {
  if(!req.userInfo.isAdmin) {
    res.send('对不起，只有管理员才可以进入后台管理')
    return false
  }
  next()
})

router.get('/',(req,res,next) => {
  res.render('admin/index',{})
})

router.get('/user',(req,res,next) => {
  /* 
    从数据库中读取用户数据
    |- 限制获取数据的条数
      limit(Number): 限制获取的数据条数
      skip(2): 忽略数据的条数
    每页显示2条
    1： 1-2 skip：0 -> (当前页-1) *limit
    2： 3-4 skip：2
  */
  let page = Number(req.query.page)||1 // 实际要判断传递数据的类型是否是number，这里暂不处理
  let pages = 0
  let limit = 2
  User.count().then((count) => {
    // 计算总页数
    pages = Math.ceil(count / limit)
    // 取值不能超过pages
    page = Math.min(page,pages)
    // 取值不能小于1
    page = Math.max( page, 1)
    // 计算跳过的页数
    let skip = (page -1)*limit

    User.find().limit(limit).skip(skip).then((users) => {
      res.render('admin/user_index',{
        userInfo: req.userInfo,
        users: users,
        page: page,
        limit: limit,
        count: count,
        pages: pages
      })
    })
  })

  
})

router.get('/category',(req,res,next) => {
  res.render('admin/category_index',{
    userInfo:req.userInfo
  })
})

/**
 * 分类的添加
 */
router.get('/category/add',(req,res,next) => {
  res.render('/admin/category_add',{
    userInfo: req.userInfo
  })
})


/**
 * 分类的保存
 */

router.post('/category/add',(req,res,next) => {
  let name = req.body.name || ''
  if(name === '') {
    res.render('error/category',{

    })
    return
  }

  // 数据库中是否已经存在同名分类名称
  category.findOne({
    name: name
  }).then((rs) => {
    if(rs) {
      res.render('error/category',{
        userInfo: req.userInfo,
        message: '分类已经存在'
      })
    } else {
      // 数据库中不存在该分类，可以保存
      return new category({
        name:name
      }).save()
    }
  }).then((newCategory) => {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'分类保存成功',
      url:'/admin/category'
    })
  })
})

module.exports = router