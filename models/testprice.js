const mongoose = require('mongoose')
const TestPriceSchema = mongoose.Schema({
  symbol: String,
  close: [Number],
  txnCount: [Number],
  sellCount: [Number],
  buyCount: [Number],
  totalVolume: [Number],
  buyVolume: [Number],
  sellVolume: [Number],
  transactions: [
    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  ],
  representatives: [[String]],
  buyVolume: [Number],
  sellVolume: [Number],
  date: [Date],
})

module.exports = mongoose.model('TestPrice', TestPriceSchema)
