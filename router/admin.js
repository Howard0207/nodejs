let express = require('express')
let router = express.Router()
// 引入用户模型
let User = require('../models/User')
let Category = require('../models/Category')
let Content = require('../models/Content')

function fillZero(num) {
  if (typeof num !== 'number') {
    throw new Error('access parameter is not a number')
  } else if (num < 10) {
    return '0' + num
  } else {
    return num
  }
}

router.use((req, res, next) => {
  if (!req.userInfo.isAdmin) {
    res.send('对不起，只有管理员才可以进入后台管理')
    return false
  }
  next()
})

router.get('/', (req, res, next) => {
  res.render('admin/index', { userInfo: req.userInfo })
})

router.get('/user', (req, res, next) => {
  /* 
    从数据库中读取用户数据
    |- 限制获取数据的条数
      limit(Number): 限制获取的数据条数
      skip(2): 忽略数据的条数
    每页显示2条
    1： 1-2 skip：0 -> (当前页-1) *limit
    2： 3-4 skip：2
  */
  let page = Number(req.query.page) || 1 // 实际要判断传递数据的类型是否是number，这里暂不处理
  let pages = 0
  let limit = 2
  User.count().then((count) => {
    // 计算总页数
    pages = Math.ceil(count / limit)
    // 取值不能超过pages
    page = Math.min(page, pages)
    // 取值不能小于1
    page = Math.max(page, 1)
    // 计算跳过的页数
    let skip = (page - 1) * limit

    User.find().limit(limit).skip(skip).then((users) => {
      res.render('admin/user_index', {
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


/**
 * 分类首页
 */
router.get('/category', (req, res, next) => {
  let page = Number(req.query.page) || 1 // 实际要判断传递数据的类型是否是number，这里暂不处理
  let pages = 0
  let limit = 10
  Category.count().then((count) => {
    // 计算总页数
    pages = Math.ceil(count / limit)
    // 取值不能超过pages
    page = Math.min(page, pages)
    // 取值不能小于1
    page = Math.max(page, 1)
    // 计算跳过的页数
    let skip = (page - 1) * limit
    /**
     * sort() 数据排序，
     *  1：升序
     * -1：降序
     */
    Category.find().sort({ _id: -1 }).limit(limit).skip(skip).then((categories) => {
      res.render('admin/category_index', {
        userInfo: req.userInfo,
        categories: categories,
        page: page,
        limit: limit,
        count: count,
        pages: pages
      })
    })
  })
})

/**
 * 分类的添加
 */
router.get('/category/add', (req, res, next) => {
  res.render('admin/category_add', {
    userInfo: req.userInfo
  })
})


/**
 * 分类的保存
 */

router.post('/category/add', (req, res, next) => {
  let name = req.body.name || ''
  if (name === '') {
    res.render('error/category', {

    })
    return
  }

  // 数据库中是否已经存在同名分类名称
  Category.findOne({
    name: name
  }).then((rs) => {
    if (rs) {
      res.render('error/category', {
        userInfo: req.userInfo,
        message: '分类已经存在'
      })
    } else {
      // 数据库中不存在该分类，可以保存
      return new Category({
        name: name
      }).save()
    }
  }).then((newCategory) => {
    res.render('success/category', {
      userInfo: req.userInfo,
      message: '分类保存成功',
      url: '/admin/category'
    })
  })
})


/**
 * 分类的修改
 */
router.get('/category/edit', (req, res) => {
  let id = req.query.id || ''
  Category.findOne({
    _id: id
  }).then((category) => {
    if (!category) {
      res.render('error/category', {
        userInfo: req.userInfo,
        message: '分类信息不存在'
      })
    } else {
      res.render('admin/category_edit', {
        userInfo: req.userInfo,
        category: category
      })
    }
  })
})

/**
 * 分类的i需改保存
 */
router.post('/category/edit', (req, res) => {
  let id = req.query.id || ''
  let name = req.body.name || ''
  Category.findOne({
    _id: id
  }).then((category) => {
    if (!category) {
      res.render('error/category', {
        userInfo: req.userInfo,
        message: '分类信息不存在'
      })
      return Promise.reject()
    } else {
      // 当用户没有做任何修改提交的时候
      //要修改的分类名称是否已经在数据库中存在
      if (name === category.name) {
        res.render('success/category', {
          userInfo: req.userInfo,
          message: '修改成功',
          url: '/admin/category'
        })
        return Promise.reject()
      } else {
        // 要修改的分类名称是否已经在数据库中存在
        return Category.findOne({
          _id: { $ne: id },
          name: name
        })
      }
    }
  }).then((sameCategory) => {
    if (sameCategory) {
      res.render('error/category', {
        userInfo: req.userInfo,
        message: '数据库已经存在同名分类'
      })
    } else {
      Category.update({
        _id: id
      }, {
          $set: { name: name }
        }, (error) => {
          if (error) {
            res.render('error/category', {
              userInfo: req.userInfo,
              message: '修改失败'
            })
          } else {
            res.render('success/category', {
              userInfo: req.userInfo,
              message: '修改成功',
              url: '/admin/category'
            })
          }
        })
    }
  })
})
/**
 * 分类的删除
 */

router.get('/category/delete', (req, res) => {
  //获取要删除的分类的id
  let id = req.query.id || ''
  Category.remove({
    _id: id
  }).then(() => {
    res.render('success/category', {
      userInfo: req.userInfo,
      message: '删除成功',
      url: '/admin/category'
    })
  })
})



/**
 * 内容首页
 */

router.get('/content', (req, res) => {
  let page = Number(req.query.page) || 1 // 实际要判断传递数据的类型是否是number，这里暂不处理
  let pages = 0
  let limit = 20
  Content.count().then((count) => {
    // 计算总页数
    pages = Math.ceil(count / limit)
    // 取值不能超过pages
    page = Math.min(page, pages)
    // 取值不能小于1
    page = Math.max(page, 1)
    // 计算跳过的页数
    let skip = (page - 1) * limit
    /**
      * sort() 数据排序，
      *  1：升序
      * -1：降序
      */
    Content.find().sort({ _id: -1 }).limit(limit).skip(skip).populate(['category', 'user']).then((contents) => {
      for (let i = 0, len = contents.length; i < len; i++) {
        let timeStamp = contents[i].addTime
        let day = fillZero(timeStamp.getDate())
        let month = fillZero(timeStamp.getMonth() + 1)
        let year = timeStamp.getFullYear()
        let hours = fillZero(timeStamp.getHours())
        let minutes = fillZero(timeStamp.getMinutes())
        let seconds = fillZero(timeStamp.getSeconds())
        contents[i].addFormateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
      }
      res.render('admin/content_index', {
        userInfo: req.userInfo,
        contents: contents,
        page: page,
        limit: limit,
        count: count,
        pages: pages
      })
    })
  })
})


/**
 * 内容添加页面
 */
router.get('/content/add', (req, res) => {
  Category.find().sort({ _id: -1 }).then((categories) => {
    res.render('admin/content_add', {
      userInfo: req.userInfo,
      categories: categories
    })
  })
})


/**
 * 内容保存
 */
router.post('/content/add', (req, res) => {
  if (req.body.category === '') {
    res.render('error/category', {
      userInfo: req.userInfo,
      message: '内容分类不能为空'
    })
    return
  } else if (req.body.title === '') {
    res.render('error/category', {
      userInfo: req.userInfo,
      message: '内容标题不能为空'
    })
    return
  } else {
    // 保存数据导数据库
    new Content({
      category: req.body.category,
      title: req.body.title,
      user: req.userInfo._uid,
      description: req.body.description,
      content: req.body.content
    }).save().then((rs) => {
      res.render('success/category', {
        userInfo: req.userInfo,
        message: '内容保存成功',
        url: '/admin/content'
      })
    })
  }
})

/**
 * 修改内容
 */
router.get('/content/edit', (req, res) => {
  let id = req.query.id || ''
  let categories = []
  Category.find().sort({ _id: -1 }).then((rs) => {
    categories = rs
    return Content.findOne({
      _id: id
    }).populate('category')
  })
    .then((content) => {
      if (!content) {
        res.render('error/category', {
          userInfo: req.userInfo,
          message: '指定的内容不存在'
        })
        return Promise.reject()
      } else {
        res.render('admin/content_edit', {
          userInfo: req.userInfo,
          content: content,
          categories: categories
        })
      }
    })
})

router.get('/content/edit/info', (req, res) => {
  let id = req.query.id || ''
  Content.findOne({
    _id: id
  })
  .populate('category')
  .then((content) => {
    if (!content) {
      res.json({
        userInfo: req.userInfo,
        message: '指定的内容不存在'
      })
      return Promise.reject()
    } else {
      res.json({
        userInfo: req.userInfo,
        content: content
      })
    }
  })
})

/**
 * 保存修改内容
 */
router.post('/content/edit', (req, res) => {
  let id = req.query.id || ''
  if (req.body.category === '') {
    res.render('error/category', {
      userInfo: req.userInfo,
      message: '内容分类不能为空'
    })
    return
  } else if (req.body.title === '') {
    res.render('error/category', {
      userInfo: req.userInfo,
      message: '内容标题不能为空'
    })
    return
  } else {
    Content.update({
      _id: id
    }, {
        $set: {
          category: req.body.category,
          title: req.body.title,
          description: req.body.description,
          content: req.body.content
        }
      }, (error) => {
        if (error) {
          res.render('error/category', {
            userInfo: req.userInfo,
            message: '修改失败'
          })
        } else {
          res.render('success/category', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content/edit?id=' + id
          })
        }
      })
  }
})
/**
 * 内容删除
 */
router.get('/content/delete', (req, res) => {
  let id = req.query.id || ''
  Content.remove({
    _id: id
  }).then(() => {
    res.render('success/category', {
      userInfo: req.userInfo,
      message: '删除成功',
      url: '/admin/content'
    })
  })
})
module.exports = router