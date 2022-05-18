const mongoose = require('mongoose')
const TransactionSchema = mongoose.Schema({
  stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  symbol: String,
  reportDate: Date,
  transactionDate: Date,
  representative: String,
  Amount: Number,
  House: String,
  Range: String,
})

module.exports = mongoose.model('Transaction', TransactionSchema)
