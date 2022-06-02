const fs = require('fs')
const top500 = fs.readFileSync('top500.json')
const topStocks = JSON.parse(top500)

const createStockArr = () => {
  stockArr = []
  for (let i = 0; i < topStocks.length; i++) {
    stockArr.push({
      name: topStocks[i].Name,
      symbol: topStocks[i].Symbol,
      sector: topStocks[i].Sector,
    })
  }
  return stockArr
}

const stocks = createStockArr()

console.log(stocks)
console.log(stocks.length)
