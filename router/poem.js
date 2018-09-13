let express = require('express')
let router = express.Router()
router.post('/poem',(req,res) => {
  Poem.findOne({id: 1673}).then((content) => {
    if(!content) {
      res.json({code: 100, message: '查询失败'})
      return Promise.reject()
    } else {
      res.json({code: 101, message: content})
    }
  }) 
})

module.exports = router