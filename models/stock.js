const mongoose = require('mongoose')
const StockSchema = mongoose.Schema({
  name: String,
  symbol: String,
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
})

module.exports = mongoose.model('Stock', StockSchema)
