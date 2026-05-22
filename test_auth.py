import requests
import json

url = "http://localhost:8000/api/community/posts"
headers = {
    "Content-Type": "application/json",
    "x-user-id": "user_123"
}
payload = {
    "content": "Debug Post via Python",
    "tags": ["debug"]
}

try:
    response = requests.post(url, headers=headers, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
