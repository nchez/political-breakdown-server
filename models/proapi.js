const mongoose = require('mongoose')
const ProApiSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  apiId: String,
  aliases: [{ type: String }],
})

module.exports = mongoose.model('ProApi', ProApiSchema)
