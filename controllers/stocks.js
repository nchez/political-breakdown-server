const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/:symbol', async (req, res) => {
  try {
    const stockTxns = await db.Transaction.findAll({ stock: req.params.symbol })
    res.json({ stockTxns })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
