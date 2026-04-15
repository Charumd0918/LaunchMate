import os
from dotenv import load_dotenv
from pymongo import MongoClient
import sys

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    print("Error: MONGO_URI not found in environment variables.")
    sys.exit(1)

try:
    client = MongoClient(MONGO_URI)
    db = client["launchmate_db"]
    ideas_collection = db["ideas"]
    users_collection = db["users"]
    print("Connected to MongoDB successfully.")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
    sys.exit(1)