require('dotenv').config()
const fs = require('fs')
const db = require('../models')
const axios = require('axios')
const top500 = fs.readFileSync('top500.txt')
const topStocks = top500.toString().split(/\r?\n/)
topStocks.shift() // remove header row

// config for quiverquant api calls
const config = {
  headers: {
    accept: 'application/json',
    'X-CSRFToken':
      'TyTJwjuEC7VV7mOqZ622haRaaUr0x0Ng4nrwSRFKQs7vdoBcJlK9qjAS69ghzhFu',
    Authorization: 'Token ' + process.env.QUIV_API_KEY,
  },
}

const createStockArr = () => {
  stockArr = []
  for (let i = 0; i < topStocks.length; i++) {
    const commaSeparated = topStocks[i].split(',')
    if (!stockArr.includes(commaSeparated[0].toLowerCase())) {
      // stockArr.push({
      //   name: commaSeparated[1],
      //   symbol: commaSeparated[0].toLowerCase(),
      //   sector: commaSeparated[2],
      // })
      stockArr.push(commaSeparated[0].toLowerCase())
    }
  }
  return stockArr
}

// const stocks = createStockArr()

const getDbStockArr = async () => {
  const stocks = await db.Stock.find({}, '-_id symbol')
  return stocks
}

// populate txns -- input is an array of stock objects {name:, symbol:, sector:}
const populateTxns = async (arr) => {
  arr = await getDbStockArr()
  //   for (let j = 0; j < stocks.length; j++) {
  let count = 1
  for (let j = arr.length - 1; j < arr.length; j++) {
    const foundStock = await db.Stock.findOne({
      symbol: arr[j].symbol,
    })
    const stockSymbol = arr[j].symbol
    const url = `https://api.quiverquant.com/beta/historical/congresstrading/${stockSymbol}`
    const response = await axios.get(url, config)
    const transactions = response.data
    foundStock.transactions = []
    for (let i = 0; i < transactions.length; i++) {
      const newTxn = await db.Transaction.create({
        stock: foundStock._id,
        symbol: stockSymbol,
        reportDate: new Date(transactions[i].ReportDate),
        transactionDate: new Date(transactions[i].TransactionDate),
        representative: transactions[i].Representative.trim(),
        amount: transactions[i].Amount,
        transaction: transactions[i].Transaction,
        house: transactions[i].House,
        range: transactions[i].Range,
      })
      foundStock.transactions.push(newTxn._id)
    }
    foundStock.save()
    console.log(`stock ${count} updated`)
    count++
  }
  console.log('done populating transactions')
}

const populateTxnSingle = async (symb, sect, fullName) => {
  const url = `https://api.quiverquant.com/beta/historical/congresstrading/${symb}`
  const response = await axios.get(url, config)
  const stockId = await db.Stock.create({
    symbol: symb.toLowerCase(),
    name: fullName,
    sector: sect,
  })
  const stockDb = await db.Stock.findById(stockId)
  const transactions = response.data
  for (let i = 0; i < transactions.length; i++) {
    const newTxn = await db.Transaction.create({
      stock: stockDb._id,
      symbol: transactions[i].Ticker.toLowerCase(),
      reportDate: new Date(transactions[i].ReportDate),
      transactionDate: new Date(transactions[i].TransactionDate),
      representative: transactions[i].Representative,
      amount: transactions[i].Amount,
      transaction: transactions[i].Transaction,
      house: transactions[i].House,
      range: transactions[i].Range,
    })
    stockDb.transactions.push(newTxn._id)
  }
  stockDb.save()
  console.log(stockId)
}

const getTxns = async (symbol) => {
  const url = `https://api.quiverquant.com/beta/historical/congresstrading/${symbol}`
  const response = await axios.get(url, config)
  console.log(response.data)
  console.log(response.data.length)
}
// getTxns('aapl')
// populateTxnSingle('MMM', 'Industrials', '3M')
// populateTxns()

const countTxns = async () => {
  const stocks = await getDbStockArr()
  for (let i = 0; i < stocks.length; i++) {
    const foundStock = await db.Stock.findOne({
      symbol: stocks[i].symbol,
    })
    foundStock.txnCount = foundStock.transactions.length
    foundStock.save()
  }
  console.log('counts updated')
}

// check stocks in top500.txt vs the stocks in the db
const checkStocks = async (arr) => {
  const dbStocks = await getDbStockArr()
  const dbStockArr = []
  let missingStocks = []
  for (let i = 0; i < dbStocks.length; i++) {
    dbStockArr.push(dbStocks[i].symbol)
    if (!arr.includes(dbStocks[i].symbol)) {
      missingStocks.push(dbStocks[i].symbol)
    }
  }
  console.log(missingStocks)
  missingStocks = []
  for (let i = 0; i < arr.length; i++) {
    if (!dbStockArr.includes(arr[i])) {
      missingStocks.push(arr[i])
    }
  }
  console.log(missingStocks)
  return missingStocks
}

const populateSpartz = async () => {
  const txns = await db.Transaction.find({ representative: 'Victoria Spartz' })
  const spartz = await db.CongressMember.findOne({ name: 'Victoria Spartz' })
  for (let i = 0; i < txns.length; i++) {
    spartz.transactions.push(txns[i]._id)
    spartz.count = txns.length
  }
  spartz.save()
}

function addDays(date, days) {
  var result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const checkFunction = async () => {
  const foundPrice = await db.Transaction.findOne({ symbol: 'aapl' })
  console.log(foundPrice.transactionDate)
  console.log(addDays(foundPrice.transactionDate, 1))
}

const addCountsToStocks = async () => {
  const txns = await db.Transaction.find()
  // const prices = await db.Price.find()
  for (let i = 0; i < txns.length; i++) {
    console.log(i)
    const txn = txns[i]
    let foundPrice = await db.Price.findOne({
      symbol: txn.symbol,
      date: txn.transactionDate,
    })
    let [decrementPrice, incrementPrice] = [foundPrice, foundPrice]
    const missingPrice = await db.Price.findOne({ symbol: txn.symbol })
    if (!missingPrice) {
      const findMissingStock = await db.MissingStock.findOne({
        symbol: txn.symbol,
      })
      if (!findMissingStock) {
        await db.MissingStock.create({ symbol: txn.symbol })
        console.log('missing stock added')
      }
      continue
    }
    if (!foundPrice) {
      let j = 0
      while (!decrementPrice && !incrementPrice) {
        j++
        console.log(`j is ${j}`)
        if (j > 5) {
          const findMissingStock = await db.MissingStock.findOne({
            symbol: txn.symbol,
          })
          if (!findMissingStock) {
            await db.MissingStock.create({ symbol: txn.symbol })
            console.log('missing more than 5 (not business) days of data added')
            break
          }
          break
        }
        ;[decrementPrice, incrementPrice] = await Promise.all([
          db.Price.findOne({
            symbol: txn.symbol,
            date: addDays(txn.transactionDate, -j),
          }),
          db.Price.findOne({
            symbol: txn.symbol,
            date: addDays(txn.transactionDate, j),
          }),
        ])
      }
      if (!decrementPrice && !incrementPrice) {
        continue
      }
      console.log(decrementPrice, incrementPrice)
    }
    foundPrice = decrementPrice || incrementPrice
    foundPrice.txnCount++
    if (txn.transaction.toLowerCase() === 'sale') {
      foundPrice.sellCount++
    }
    if (txn.transaction.toLowerCase() === 'purchase') {
      foundPrice.buyCount++
    }
    foundPrice.save()
    console.log(i)
  }
  console.log('function done')
}

/*
// July 25th, 2014 is the 'oldest' transaction from quiver (in the top 500 companies)
populatePricesDB(prices)
*/
console.log('all done')
