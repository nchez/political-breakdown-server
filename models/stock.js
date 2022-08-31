const mongoose = require('mongoose')
const StockSchema = mongoose.Schema({
  name: String,
  symbol: String,
  sector: String,
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  txnCount: Number,
})

module.exports = mongoose.model('Stock', StockSchema)
