import os
from dotenv import load_dotenv

load_dotenv()

# Monkey-patch supabase JWT validation since publishable keys don't match the old regex check
import supabase._sync.client
import re

original_match = supabase._sync.client.re.match

class DummyMatch:
    def __init__(self):
        pass
    def group(self, *args):
        return ""

def patched_match(pattern, string, flags=0):
    if "A-Za-z0-9-_=" in pattern:
        return DummyMatch()
    return original_match(pattern, string, flags)

supabase._sync.client.re.match = patched_match

from supabase import create_client, Client

print("DEBUG URL:", os.environ.get("SUPABASE_URL"))
print("DEBUG KEY:", "FOUND" if os.environ.get("SUPABASE_KEY") else "MISSING")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)