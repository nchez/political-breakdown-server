const mongoose = require('mongoose')
const TransactionSchema = mongoose.Schema({
  stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
  symbol: String,
  reportDate: Date,
  transactionDate: Date,
  representative: String,
  amount: Number,
  transaction: String,
  range: String,
  house: String,
})

module.exports = mongoose.model('Transaction', TransactionSchema)

/*  this is the format for live trading
"Ticker": "SAP", "Date": "2021-01-26", "Representative": "Mr. Peter Meijer", "Transaction": "Purchase", "Amount": 1001.0, "Options": null, "Option_Type": null, "Expiry": null, "Strike": null, "Range": "$1,001-$15,000
*/
/* this is the format for historical ticker trading
{"ReportDate": "2016-01-12", "TransactionDate": "2016-01-05", "Ticker": "AAPL", "Representative": "Bill Cassidy", "Transaction": "Purchase", "Amount": 1001.0, "House": "Senate", "Range": "$1,001 - $15,000"}
*/
