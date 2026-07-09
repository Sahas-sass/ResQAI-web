from fastapi import FastAPI, Request
import uvicorn
from db import supabase
from nlp import analyze_sos  # <-- Import your new AI brain

app = FastAPI()

@app.get("/")
def health_check():
    return {"status": "ResQAI Intelligence Engine Online"}

@app.post("/webhook/sos")
async def handle_new_sos(request: Request):
    data = await request.json()
    
    record = data.get("record", {})
    sos_id = record.get("id")
    description = record.get("description")

    if not sos_id or not description:
        return {"error": "Invalid payload"}

    print(f"Received new SOS {sos_id}: {description}")

    # 1. Run the AI Analysis
    severity = analyze_sos(description)
    print(f"AI Calculated Severity: {severity}")
    
    # 2. Update Supabase with the new score (Step 3 of your plan)
    # This automatically bypasses RLS because you are using the service_role key!
    try:
        response = supabase.table("sos_reports").update({"status": severity}).eq("id", sos_id).execute()
        print(f"Successfully updated Supabase: {response.data}")
    except Exception as e:
        print(f"Database update failed: {e}")
        return {"error": "Failed to update database"}
    
    return {"message": "SOS processed", "severity": severity}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)