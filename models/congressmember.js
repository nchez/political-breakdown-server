const mongoose = require('mongoose')
const CongressMemberSchema = mongoose.Schema({
  name: String,
  house: String,
  count: Number,
  lastName: String,
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  aliases: [{ type: String }],
})

module.exports = mongoose.model('CongressMember', CongressMemberSchema)
