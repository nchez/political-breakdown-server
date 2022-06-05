const mongoose = require('mongoose')
const PriceSchema = mongoose.Schema({
  symbol: String,
  open: Number,
  close: Number,
  adjclose: Number,
  high: Number,
  volume: Number,
  date: Date,
})

module.exports = mongoose.model('Price', PriceSchema)
