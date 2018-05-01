let express = require('express')
let router = express.Router()
// Category 模型
let Category = require('../models/Category')
router.get('/',function(req,res) {
  Category.find().then((categories) => {
    res.render('main/index',{
      userInfo: req.userInfo,
      categories: categories
    })
  })
})

module.exports = router