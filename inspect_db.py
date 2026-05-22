import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pprint import pprint

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "eco_heritage_db"

async def inspect():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    
    print("Inpecting Posts...")
    # Get latest post
    cursor = db.posts.find({}).sort("created_at", -1).limit(5)
    posts = await cursor.to_list(length=5)
    
    for p in posts:
        print(f"ID: {p.get('_id')}")
        user = p.get('user', {})
        print(f"User: {user.get('name')} (ID: {user.get('id')})")
        print(f"Details: {user}")
        print("-" * 20)
            
    client.close()

if __name__ == "__main__":
    asyncio.run(inspect())
