const express = require('express')
const { isObjectIdOrHexString } = require('mongoose')
const router = express.Router()
const db = require('../models')

router.get('/', async (req, res) => {
  const allTrades = await db.Transaction.find().sort({ transactionDate: 1 })
  res.json({ trades: allTrades })
})

router.get('/congress/:uniqLastName', async (req, res) => {
  try {
    // TO-DO: need to add unique last name field to congress member -- some members have same last name - Lamar Smith, Tina Smith for example. Unique last name would be first name initial plus last name (lsmith, tsmith)
    const foundMember = await db.CongressMember.findOne({
      lastName: req.params.uniqLastName,
    })
    console.time('tradesapicall')
    const memberTrades = await db.Transaction.find({
      _id: { $in: foundMember.transactions },
    }).sort({ transactionDate: 1 })
    console.timeEnd('tradesapicall')
    res.json({ trades: memberTrades })
  } catch (error) {
    console.log(error)
  }
})
router.get('/stocks/:symbol', async (req, res) => {
  try {
    console.time('tradesapicall')
    const stockTrades = await db.Transaction.find({
      symbol: req.params.symbol,
    }).sort({ transactionDate: -1 })
    console.timeEnd('tradesapicall')
    res.json({ trades: stockTrades })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
