import urllib.request
import json

# ⚠️ REPLACE THIS with a real ID from your Supabase sos_reports table
TEST_SOS_ID = "c016c31b-29db-4d58-b8cf-878959229ef7"

# The URL where your FastAPI server is listening
url = "http://localhost:8000/webhook/sos"

# The dummy payload that mimics what Supabase will send
payload = {
    "record": {
        "id": TEST_SOS_ID,
        "description": "There was a massive crash on the highway, a car is on fire and someone is trapped inside!"
    }
}

# Convert payload to JSON
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

print("Sending test SOS to AI Engine...")
try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode())
        print(f"Server Status Code: {response.getcode()}")
        print(f"Server Response: {result}")
except Exception as e:
    print(f"Error connecting to server: {e}")