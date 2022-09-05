const mongoose = require('mongoose')
const CongressMemberSchema = mongoose.Schema({
  name: String,
  house: String,
  count: Number,
  firstName: String,
  lastName: String,
  apiId: String,
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  aliases: [{ type: String }],
})

module.exports = mongoose.model('CongressMember', CongressMemberSchema)
