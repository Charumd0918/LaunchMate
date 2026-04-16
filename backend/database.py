import os
from dotenv import load_dotenv
from pymongo import MongoClient
import sys

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    print("Error: MONGO_URI not found in environment variables.")
    sys.exit(1)

# Safe Proxy classes for database resilience
class SafeCollection:
    def __init__(self, collection, name):
        self._collection = collection
        self._name = name

    def __getattr__(self, name):
        # Allow access to common attributes that don't need a connection
        if name in ["name", "full_name"]:
            return self._name
            
        if self._collection is None:
            raise ConnectionError(f"Database connection failed. Cannot perform '{name}' on collection '{self._name}'. "
                                  "Please check your MONGO_URI and network connection.")
        return getattr(self._collection, name)

    def __getitem__(self, name):
        if self._collection is None:
             raise ConnectionError(f"Database connection failed. Cannot access sub-element '{name}' on collection '{self._name}'.")
        return self._collection[name]

class SafeDatabase:
    def __init__(self, db_obj):
        self._db = db_obj
    
    def __getitem__(self, name):
        real_col = self._db[name] if self._db is not None else None
        return SafeCollection(real_col, name)

    def __getattr__(self, name):
        if self._db is None:
            raise ConnectionError(f"Database connection failed. Cannot perform '{name}' on database.")
        return getattr(self._db, name)

# Initialization
try:
    # Initialize MongoDB Client with a timeout
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    
    # Select the database (using 'launchmate' as the default)
    raw_db = client["launchmate"]
    
    # Verify connection immediately (optional, but good for logs)
    client.admin.command('ping')
    print("Connected to MongoDB successfully.")
    
    # Wrap in Safe Proxy
    db = SafeDatabase(raw_db)
    
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
    # Initialize with a disconnected SafeDatabase to prevent startup crashes
    db = SafeDatabase(None)

# Pre-defined collection proxies for standard app usage
ideas_collection = db["ideas"]
users_collection = db["users"]