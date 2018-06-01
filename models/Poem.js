let mongoose = require('mongoose')
let poemSchema = require('../schemas/poem')
module.exports = mongoose.model('Poem',poemSchema)