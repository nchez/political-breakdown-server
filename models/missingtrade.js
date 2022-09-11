const mongoose = require('mongoose')
const MissingTradeSchema = mongoose.Schema({
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
})
module.exports = mongoose.model('MissingTrade', MissingTradeSchema)
