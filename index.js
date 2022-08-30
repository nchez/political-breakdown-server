require('./models')
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./models')
const fs = require('fs')

// const req = require("express/lib/request");

const app = express()
const PORT = process.env.PORT || 3001

// middlewares
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ msg: 'heyyy buddddy' })
})

// app.get('/:symbol', async (req, res) => {
//   // const stockTxns = await db.Transaction.find({
//   //   symbol: req.params.symbol.toUpperCase(),
//   //   function(err, arr) {
//   //     console.log(err)
//   //     arr.sort((a, b) => {
//   //       return a.transactionDate - b.transactionDate
//   //     })
//   //   },
//   // })
//   // console.log(applePricesCsv)
//   // csvToArray(applePricesCsv)
//   res.json({ msg: 'Hey Buddy' })
// })

// controllers
// app.use("/users", require("./controllers/users"));
// app.use("/congressmembers", require("./controllers/congressmembers"));
app.use('/stocks', require('./controllers/stocks'))

app.listen(PORT, () =>
  console.log(`listening to the smooth sounds of port ${PORT} in the morning`)
)
