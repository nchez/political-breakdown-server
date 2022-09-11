require('dotenv').config()
const db = require('../models')

const populateTestPrices = async () => {
  const allStocks = await db.Stock.find({})
  const trades = await db.Transaction.find()
  for (let i = 0; i < allStocks.length; i++) {
    const newStock = await db.TestPrice.create({
      txnCount: [],
      sellCount: [],
      buyCount: [],
      totalVolume: [],
      buyVolume: [],
      sellVolume: [],
      transactions: [],
    })
    const prices = await db.Price.find({ symbol: allStocks[i].symbol }).sort({
      date: 1,
    })
    for (let j = 0; j < prices.length; j++) {
      // this for block eliminates lines 25 through 32 ?
      for (const prop in newStock) {
        newStock[prop].push(prices[j][prop])
      }
      newStock.close.push(prices[j].close)
      newStock.txnCount.push(prices[j].txnCount)
      newStock.sellCount.push(prices[j].sellCount)
      newStock.buyCount.push(prices[j].buyCount)
      newStock.totalVolume.push(prices[j].totalVolume)
      newStock.buyVolume.push(prices[j].buyVolume)
      newStock.sellVolume.push(prices[j].sellVolume)
      newStock.date.push(prices[j].date)
      console.log(j)
      for (let j = 0; j < prices.length; j++) {
        newStock.close.push(prices[j].close)
        newStock.txnCount.push(prices[j].txnCount)
        newStock.sellCount.push(prices[j].sellCount)
        newStock.buyCount.push(prices[j].buyCount)
        newStock.totalVolume.push(prices[j].totalVolume)
        newStock.buyVolume.push(prices[j].buyVolume)
        newStock.sellVolume.push(prices[j].sellVolume)
        newStock.date.push(prices[j].date)
        console.log(j)
      }
      newStock.save()
      console.log(i)
    }
    console.log('function done')
  }
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
    }
    foundPrice = decrementPrice || incrementPrice
    const testPrice = await db.TestPrice.find({ symbol: foundPrice.symbol })
    const dates = testPrice.dates
    const datesIndex = testPrice.dates.indexOf(foundPrice.date)
    foundPrice.save()
    console.log(i)
  }

  console.log('function done')
}

// for stocks with counts or volume equal to 0 (num), change to null so bar graph does not display anything for that value
const zeroValuetoNull = async () => {
  const updatedZeroStocks = await db.TestPrice.updateMany(
    {
      txnCount: 0,
      sellCount: 0,
      buyCount: 0,
      totalVolume: 0,
      buyVolume: 0,
      sellVolume: 0,
      transactions: 0,
    },
    {
      $set: {
        txnCount: null,
        sellCount: null,
        buyCount: null,
        totalVolume: null,
        buyVolume: null,
        sellVolume: null,
        transactions: null,
      },
    }
  )
  console.log(updatedZeroStocks)
}

const initArrOfArrTxnsReps = async () => {
  const testPrices = await db.TestPrice.find()
  for (let i = 0; i < testPrices.length; i++) {
    testPrices[i].transactions = Array.apply(
      null,
      Array(testPrices[i].date.length)
    ).map(function () {
      return []
    })
    testPrices[i].representatives = Array.apply(
      null,
      Array(testPrices[i].date.length)
    ).map(function () {
      return []
    })
    testPrices[i].save()
    console.log(i)
  }
  console.log('function done')
}

function addDays(date, days) {
  var result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const addToStocks = async () => {
  const stocks = await db.TestPrice.find({}, '-_id symbol date')
  for (let i = 0; i < stocks.length; i++) {
    const symbol = stocks[i].symbol
    const stockTrades = await db.Transaction.find(
      { symbol: symbol },
      '-stock -symbol -reportDate -amount -transaction -range -house'
    )
    const dateArr = stocks[i].date.map((e) => {
      return e.toString()
    })
    for (let j = 0; j < stockTrades.length; j++) {
      console.log(j, symbol)
      const txn = stockTrades[j]
      let k = 0
      let [closestIncTradeDate, closestDecTradeDate] = [
        txn.transactionDate,
        txn.transactionDate,
      ]
      while (
        !dateArr.includes(closestIncTradeDate.toString()) &&
        !dateArr.includes(closestDecTradeDate.toString())
      ) {
        k++
        if (k > 5) {
          break
        }
        ;[closestIncTradeDate, closestDecTradeDate] = [
          addDays(closestIncTradeDate, k),
          addDays(closestDecTradeDate, -k),
        ]
      }
      if (k > 5) {
        const missingTrade = await db.MissingTrade.create({
          transactionId: txn._id,
        })
        console.log(
          'could not accurately add trade data due to lack of price data'
        )
        continue
      }
      const date = dateArr.includes(closestIncTradeDate.toString())
        ? closestIncTradeDate
        : closestDecTradeDate
      const testPrice = await db.TestPrice.findOne({ symbol: symbol })
      const testDatesArr = testPrice.date.map((e) => {
        return e.toString()
      })
      const datesIndex = testDatesArr.indexOf(date.toString())

      const tradesArr = testPrice.transactions[datesIndex].slice()
      const repArr = testPrice.representatives[datesIndex].slice()
      tradesArr.push(txn._id)
      repArr.push(txn.representative)
      testPrice.transactions.set(datesIndex, tradesArr)
      testPrice.representatives.set(datesIndex, repArr)
      testPrice.markModified(`transactions.${datesIndex}`)
      testPrice.markModified(`representatives.${datesIndex}`)
      await testPrice.save()
      console.log(testPrice.transactions[datesIndex])
      console.log(j, ` txn _id ${txn._id} pushed to ${testPrice._id}`)
    }

    console.log('function done for ' + `${i}` + ` ${symbol}`)
  }
}
addToStocks()
// initArrOfArrTxnsReps()

const findNonZeroStocks = async () => {
  const applePrice = await db.TestPrice.find({ symbol: 'aapl' })
  const tradeArr = applePrice[0].transactions
  console.log(...tradeArr)
  const filtered = tradeArr.filter((e) => e.length > 0)
  console.log(filtered)
}
