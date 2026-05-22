import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "eco_heritage_db"

async def reset_posts():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    
    print("🗑️ Dropping Posts Collection...")
    await db.posts.drop()
    print("✅ Collection Dropped. Fresh start.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(reset_posts())
