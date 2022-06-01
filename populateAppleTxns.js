require('dotenv').config()
const res = require('express/lib/response')
const db = require('./models')
const mongoose = require('mongoose')
const axios = require('axios')

const createStock = async (stockName, symbol) => {
  try {
    const appleStock = await db.Stock.create({
      name: stockName,
      symbol: symbol,
    })
    // res.json({ appleStock })
    return appleStock._id
  } catch (err) {
    console.log(err)
  }
}
// {
//     name: 'Apple Inc',
//     symbol: 'aapl',
//     transactions: [],
//       _id: new ObjectId("62492321ec0c971582481af9"),
//     __v: 0
//   }

const config = {
  headers: {
    accept: 'application/json',
    'X-CSRFToken':
      'TyTJwjuEC7VV7mOqZ622haRaaUr0x0Ng4nrwSRFKQs7vdoBcJlK9qjAS69ghzhFu',
    Authorization: 'Token ' + process.env.QUIV_API_KEY,
  },
}
const url = `https://api.quiverquant.com/beta/historical/congresstrading/aapl`

const populateTxns = async () => {
  // const appleId = await createStock('Apple', 'aapl')
  // const appleStock = await db.Stock.findById(appleId)
  const appleStock = await db.Stock.findById('6297e5f829042cd9c2072638')
  console.log(appleStock)
  const response = await axios.get(url, config)
  const transactions = response.data
  for (let i = 0; i < transactions.length; i++) {
    const newTxn = await db.Transaction.create({
      stock: appleStock._id,
      symbol: transactions[i].Ticker,
      reportDate: new Date(transactions[i].ReportDate),
      transactionDate: new Date(transactions[i].TransactionDate),
      representative: transactions[i].Representative,
      amount: transactions[i].Amount,
      transaction: transactions[i].Transaction,
      house: transactions[i].House,
      range: transactions[i].Range,
    })
    appleStock.transactions.push(newTxn._id)
  }
  appleStock.save()
  console.log('done populating')
}

populateTxns()

// createStock('Apple Inc', 'aapl')
