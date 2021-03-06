require('dotenv').config()
const fs = require('fs')
const db = require('./models')
const axios = require('axios')
const top500 = fs.readFileSync('top500.json')
const topStocks = JSON.parse(top500)

const createStockArr = () => {
  stockArr = []
  for (let i = 0; i < topStocks.length; i++) {
    stockArr.push({
      name: topStocks[i].Name,
      symbol: topStocks[i].Symbol.toLowerCase(),
      sector: topStocks[i].Sector,
    })
  }
  return stockArr
}

const stocks = createStockArr()

const config = {
  headers: {
    accept: 'application/json',
    'X-CSRFToken':
      'TyTJwjuEC7VV7mOqZ622haRaaUr0x0Ng4nrwSRFKQs7vdoBcJlK9qjAS69ghzhFu',
    Authorization: 'Token ' + process.env.QUIV_API_KEY,
  },
}

const populateTxns = async (arr) => {
  //   for (let j = 0; j < stocks.length; j++) {
  let count = 1
  for (let j = 0; j < stocks.length; j++) {
    const stockId = await db.Stock.create({
      name: stocks[j].name,
      symbol: stocks[j].symbol.toLowerCase(),
      sector: stocks[j].sector,
    })
    const stockSymbol = stocks[j].symbol.toLowerCase()
    const url = `https://api.quiverquant.com/beta/historical/congresstrading/${stockSymbol}`
    const stockDb = await db.Stock.findById(stockId)
    const response = await axios.get(url, config)
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
    console.log(`stock ${count} updated`)
    count++
  }
  console.log('done populating transactions')
}

// populateTxns()

const countTxns = async (arr) => {
  const txnArr = []
  for (let i = 0; i < arr.length; i++) {
    const foundStock = await db.Stock.findOne({
      symbol: arr[i].symbol,
    })
    txnArr.push({
      name: foundStock.name,
      numberOfTxns: foundStock.transactions.length,
    })
    // if (foundStock && foundStock['transactions']) {
    //   console.log(foundStock['transactions'].length)
    // } else {
    //   continue
    // }
  }

  console.log(
    txnArr.sort(function (a, b) {
      return b.numberOfTxns - a.numberOfTxns
    })
  )
}
// countTxns(stocks)

const priceJson = fs.readFileSync('./populate_db/historical_stock_prices.json')

const convertJsonToObj = (jsonObj) => {
  return JSON.parse(jsonObj)
}

const prices = convertJsonToObj(priceJson)

for (const key in prices) {
  for (let i = 0; i < prices[key].length; i++) {
    prices[key][i].date = new Date(
      parseInt(prices[key][i].date.slice(0, 4)),
      parseInt(prices[key][i].date.slice(5, 7)) - 1,
      parseInt(prices[key][i].date.slice(8, 10))
    )
    prices[key][i]['symbol'] = key
    delete prices[key][i]['dividends']
  }
}

const populatePricesDB = async (pricesObj) => {
  for (const symbol in pricesObj) {
    const symbolId = await db.Price.create(pricesObj[symbol])
  }
}

// July 25th, 2014 is the 'oldest' transaction from quiver (in the top 500 companies)

populatePricesDB(prices)

console.log('all done')
