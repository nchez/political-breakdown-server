const mongoose = require('mongoose')
const PriceSchema = mongoose.Schema({
  symbol: String,
  open: Number,
  high: Number,
  close: Number,
  low: Number,
  volume: Number,
  adjclose: Number,
  date: Date,
})

module.exports = mongoose.model('Price', PriceSchema)
