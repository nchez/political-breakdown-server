const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)

const db = mongoose.connection

db.once('open', () => console.log(`connect to mongo @ ${db.host}:${db.port}`))

db.on('error', (err) => {
  console.log(`data center has burned down -- hehe`)
  console.log('err')
})

// module.exports.User = require("./user");
// module.exports.User = require("./congressmember");
module.exports.Stock = require('./stock')
module.exports.Transaction = require('./transaction')
module.exports.CongressMember = require('./congressmember')
module.exports.Price = require('./price')
module.exports.MissingStock = require('./missingStock')
module.exports.ProApi = require('./proapi')
module.exports.TestPrice = require('./testprice')
module.exports.MissingTrade = require('./missingtrade')
