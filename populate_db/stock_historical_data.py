from yahooquery import Ticker
import json

f = open('../top500.json')

top500 = json.load(f)

symbols = []

final_dict = {}

for i in range(len(top500)):
    symbols.append(top500[i]['Symbol'].lower())
    if i == 2:
        break

# allstocks = Ticker(symbols, asynchronous=True)
# history = allstocks.history()

aapl = Ticker('aapl')
aapl_history = aapl.history()
formatted_history = aapl_history.to_dict('index')

for i in range(len(symbols)):
    if symbols[i] not in final_dict:
        final_dict[symbols[i]] = []
    temp_ticker = Ticker(symbols[i])
    temp_history = temp_ticker.history().to_dict('index')
    for j in temp_history:
        temp_history[j]['date'] = j[1]
        final_dict[symbols[i]].append(temp_history[j])

print(final_dict)