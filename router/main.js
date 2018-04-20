let express = require('express')
let router = express.Router()

router.get('/',function(req,res) {
  res.render('main/index',{news:[]})
})

module.exports = router