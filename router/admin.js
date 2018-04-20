let express = require('express')
let router = express.Router()

router.post('/user/register',function(req,res) {
  console.log('register')
  res.end()
})

module.exports = router