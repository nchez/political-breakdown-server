import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

url = "https://api.quiverquant.com/beta/live/housetrading"
headers = {'accept': 'application/json',
'X-CSRFToken': 'TyTJwjuEC7VV7mOqZ622haRaaUr0x0Ng4nrwSRFKQs7vdoBcJlK9qjAS69ghzhFu',
'Authorization': f'Token {os.getenv("QUIV_API_KEY")}'}
r = requests.get(url, headers=headers)
print(r.content)