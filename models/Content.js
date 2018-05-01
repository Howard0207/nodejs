let mongoose = require('mongoose')
let categoriesSchema = require('../schemas/contents')
module.exports = mongoose.model('Content',categoriesSchema)