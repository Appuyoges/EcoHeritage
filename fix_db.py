import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "eco_heritage_db"

async def fix_data():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    
    print("🔧 Fixing Data...")
    
    # 1. Update documents where 'comments' is missing to be an empty list
    res1 = await db.posts.update_many(
        {"comments": {"$exists": False}},
        {"$set": {"comments": []}}
    )
    print(f"Set missing comments to []: {res1.modified_count}")
    
    # 2. Update documents where 'comments' is NOT an array (e.g. integer 0)
    # Using $not and $type: "array"
    res2 = await db.posts.update_many(
        {"comments": {"$not": {"$type": "array"}}},
        {"$set": {"comments": []}}
    )
    print(f"Fixed invalid comments types: {res2.modified_count}")
            
    client.close()

if __name__ == "__main__":
    asyncio.run(fix_data())
