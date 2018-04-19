let express = require('express')
let router = express.Router()

router.get('/user',function(req,res) {
  res.send('user')
})

module.exports = router