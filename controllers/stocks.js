const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/', async (req, res) => {
  const allStocks = await db.Stock.find({}, '-_id -transactions')
  res.json({ stocks: allStocks })
})

/*
router.get('/:symbol', async (req, res) => {
  try {
    // skeleton code for getting historical stock prices
    const stockPrices = await db.Price.find(
      { symbol: req.params.symbol },
      '-_id -open -high -low -volume -adjclose'
    ).sort({ date: '-1' })
    const stockTrades = await db.Transaction.find(
      { symbol: req.params.symbol },
      '-_id -__v'
    ).limit(5)
    res.json({
      prices: stockPrices.sort((a, b) => a.date - b.date),
      trades: stockTrades,
    })
  } catch (error) {
    console.log(error)
  }
})
*/

router.get('/:symbol/info', async (req, res) => {
  try {
    const foundStock = await db.Stock.findOne(
      { symbol: req.params.symbol },
      '-_id -transactions'
    )
    res.json({ stock: foundStock })
  } catch (error) {
    console.log(error)
  }
})

router.get('/:symbol/congress', async (req, res) => {
  try {
    // group by unique id representative and count
    const tradeCounts = await db.Transaction.aggregate([
      {
        $match: { symbol: req.params.symbol },
      },
      { $group: { _id: '$representative', count: { $count: {} } } },
    ])

    res.json({ congressCounts: tradeCounts.sort((a, b) => b.count - a.count) })
  } catch (error) {
    console.log(error)
  }
})

router.get('/:symbol', async (req, res) => {
  try {
    // skeleton code for getting historical stock prices
    const aggregatePrices = await db.TestPrice.findOne(
      {
        symbol: req.params.symbol,
      },
      '-_id -__v -txnCount -sellCount -buyCount -totalVolume'
    ).sort({ date: 1 })
    for (const prop in aggregatePrices) {
      if (Array.isArray(aggregatePrices[prop])) {
        aggregatePrices[prop] = aggregatePrices[prop].slice(-1000)
      }
    }
    aggregatePrices.close = aggregatePrices.close.slice(-1000)
    res.json({
      prices: aggregatePrices,
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
