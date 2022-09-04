const mongoose = require('mongoose')
const MissingStockSchema = mongoose.Schema({
  symbol: String,
})

module.exports = mongoose.model('MissingStock', MissingStockSchema)
