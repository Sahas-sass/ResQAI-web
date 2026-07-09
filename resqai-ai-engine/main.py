from fastapi import FastAPI, Request
import uvicorn
from db import supabase

app = FastAPI()

@app.get("/")
def health_check():
    return {"status": "ResQAI Intelligence Engine Online"}

@app.post("/webhook/sos")
async def handle_new_sos(request: Request):
    # This receives the payload from the Supabase Database Webhook
    data = await request.json()
    
    # Extract the SOS report ID and the description
    # Adjust this based on your exact Supabase table schema
    record = data.get("record", {})
    sos_id = record.get("id")
    description = record.get("description")

    print(f"Received new SOS {sos_id}: {description}")

    # Step 2 & 3 will go here: 
    # 1. NLP Processing
    # 2. Update Supabase with severity score
    
    return {"message": "SOS received and queued for analysis"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)