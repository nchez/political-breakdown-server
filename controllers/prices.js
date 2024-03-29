const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/', async (req, res) => {
  const allStocks = await db.Stock.find({}, '-_id -transactions')
  res.json({ stocks: allStocks })
})

// router.get('/:symbol', async (req, res) => {
//   try {
//     // skeleton code for getting historical stock prices
//     console.time('api-call')
//     let aggregatePrices = await db.Price.aggregate([
//       { $match: { symbol: req.params.symbol } },
//       { $sort: { date: -1 } },
//       { $limit: 1000 },
//       {
//         $project: {
//           _id: 0,
//           open: 0,
//           high: 0,
//           low: 0,
//           volume: 0,
//           adjclose: 0,
//           transactions: 0, // might want to keep this to reference transactionIds
//         },
//       },
//       { $sort: { date: 1 } },
//     ])
//     console.timeEnd('api-call')
//     res.json({
//       //   prices: stockPrices.sort((a, b) => a.date - b.date),
//       prices: aggregatePrices,
//     })
//   } catch (error) {
//     console.log(error)
//   }
// })
router.get('/:symbol', async (req, res) => {
  try {
    // skeleton code for getting historical stock prices
    console.time('api-call')
    let aggregatePrices = await db.TestPrice.aggregate([
      { $match: { symbol: req.params.symbol } },
      { $sort: { date: 1 } },
    ])
    console.timeEnd('api-call')
    res.json({
      //   prices: stockPrices.sort((a, b) => a.date - b.date),
      prices: aggregatePrices,
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
