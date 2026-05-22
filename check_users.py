import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pprint import pprint

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "eco_heritage_db"

async def check_users():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    
    print("🔎 Checking Users Collection...")
    cursor = db.users.find({})
    users = await cursor.to_list(length=100)
    
    if not users:
        print("❌ No users found! Collection is empty.")
    else:
        print(f"✅ Found {len(users)} users:")
        for u in users:
            print(f"- {u.get('name')} (ID: {u.get('id')})")
            
    client.close()

if __name__ == "__main__":
    asyncio.run(check_users())
