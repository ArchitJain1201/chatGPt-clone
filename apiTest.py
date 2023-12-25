import requests 
import json 
url = 'https://api-v2.longshot.ai/custom/api/generate/instruct' 
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer 7627f68a87bcf1041235d75c5892115d328216e0'  # Replace <token> with your actual token
}   
data = {
  "text": "Hiii"
} 
response = requests.post(url, headers=headers, data=json.dumps(data)) 
print(response.text)