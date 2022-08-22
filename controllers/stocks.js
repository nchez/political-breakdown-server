const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/:symbol', async (req, res) => {
  try {
    const stockTxns = await db.Transaction.find({
      symbol: req.params.symbol,
    }).sort({ transactionDate: 'asc' })
    // skeleton code for getting historical stock prices
    const stockPrices = await db.Price.find({ symbol: req.params.symbol }).sort(
      { date: 'asc' }
    )
    res.json({ stockTxns, stockPrices })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
