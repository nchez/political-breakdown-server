from yahooquery import Ticker
import json

f = open('top500.txt')

top500 = f.readlines()


symbols = []
stock_info = []


final_dict = {}

for i in range(len(top500)):
    if i == 0:
        continue
    line_arr = top500[i].split(',')
    sector = line_arr[2][:-1]
    name = line_arr[1]
    symbol = line_arr[0]
    symbols.append(symbol.lower())
    stock_info.append({'symbol': symbol, 'name': name, 'sector': sector})

# allstocks = Ticker(symbols, asynchronous=True)
# history = allstocks.history()

# aapl = Ticker('aapl')
# aapl_history = aapl.history()
# formatted_history = aapl_history.to_dict('index')

for i in range(len(symbols)):
    if symbols[i] not in final_dict:
        final_dict[symbols[i]] = []
        print(f'{symbols[i]} added to dict')
    temp_ticker = Ticker(symbols[i])
    temp_history = temp_ticker.history(start='2014-07-25', end='2022-08-19')
    try:
        temp_history.to_dict('index')
        for j in temp_history.to_dict('index'):
            temp_obj = temp_history.to_dict('index')
            temp_obj[j]['date'] = j[1]
            final_dict[symbols[i]].append(temp_obj[j])
        print(f'{symbols[i]} price history added')
    except AttributeError:
        print(f'error in {symbols[i]} history')
        continue
    

json_object = json.dumps(final_dict, indent = 4, sort_keys=True, default=str)
  
# Writing to sample.json
with open("historical_stock_prices.json", "w") as outfile:
    outfile.write(json_object)

print('all done')