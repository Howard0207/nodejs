let express = require('express')
let router = express.Router()

router.get('/',function(req,res) {
  let userInfo = {_uid: 0,username:''}
  if(req.cookies.userInfo) {
    userInfo._uid = req.cookies.userInfo._uid
    userInfo.username = req.cookies.userInfo.username
  }
  res.render('main/index',{userInfo: userInfo})
})

module.exports = router