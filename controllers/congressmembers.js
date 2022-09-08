const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/', async (req, res) => {
  try {
    const allCongress = await db.CongressMember.find({}).sort({
      name: 1,
    })
    res.json({ congress: allCongress })
  } catch (error) {
    console.log(error)
  }
})
router.get('/:member', async (req, res) => {
  try {
    const stockTxns = await db.CongressMember.find({
      name: member,
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
