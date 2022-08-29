const mongoose = require('mongoose')
const CongressMemberSchema = mongoose.Schema({
  name: String,
  house: String,
  count: Number,
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
})

module.exports = mongoose.model('CongressMember', CongressMemberSchema)
