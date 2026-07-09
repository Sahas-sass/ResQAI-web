import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

print("DEBUG URL:", os.environ.get("SUPABASE_URL"))
print("DEBUG KEY:", "FOUND" if os.environ.get("SUPABASE_KEY") else "MISSING")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)