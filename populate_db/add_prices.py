import pymongo
import datetime
from yahooquery import Ticker
from pymongo import MongoClient

#  this will create MongoClient to running mongod instance -- default host and port -> localhost 27017
client = MongoClient()
#  or client = MongoClient('mongodb://localhost:27017/')

# access database
db = client['political-breakdown']

# access collection
stocks_col = db['stocks']
prices_col = db['prices']
txns_col = db['transactions']


# for stock in stocks_col.find():
#     if stock['symbol'] == 'mmm':
#         print(stock)

f = open ('../top500.txt')
top1000 = f.readlines()

symbols = []
now = datetime.datetime.now()
count = 0
for i in range(400, len(top1000)):
    if i == 700:
        break
    line_arr = top1000[i].split(',')
    symbol = line_arr[0].lower()
    ticker = Ticker(symbol)
    history = ticker.history(start='2014-07-25', end ='2022-08-19')
    # history = ticker.history(start='2014-07-25', end ='2014-08-30')
    # print(history.to_dict('index'))

    # try:
    #  j[1] is date
    #     history.to_dict('index')
    #     for j in history.to_dict('index'):
    #         obj = history.to_dict('index')
    #         obj['date'] = j
    try:
        for j in history.to_dict('index'):
            price_doc = {'symbol': symbol, 'close': history.to_dict('index')[j]['close'], 'date': datetime.datetime.combine(j[1], datetime.time.min)}
            prices_col.insert_one(price_doc)
        print(f'finished {symbol}')
        count+=1
    except AttributeError:
        print(f'error in {symbol} history')
        continue
elapsed_time = datetime.datetime.now() - now
print(f'{elapsed_time} for {count} stocks')

