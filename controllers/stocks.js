const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/', async (req, res) => {
  const allStocks = await db.Stock.find({}, '-_id -transactions')
  res.json({ stocks: allStocks })
})

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

module.exports = router
