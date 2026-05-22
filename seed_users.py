import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "eco_heritage_db"

USERS = [
    {
        "id": "user_123",
        "name": "Yogeswaran S",
        "email": "yoges@example.com",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        "level": "Eco Explorer",
        "green_points": 2450,
        "location": "Chennai, TN"
    },
    {
        "id": "user_456",
        "name": "Alice Green",
        "email": "alice@example.com",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
        "level": "Nature Guardian",
        "green_points": 3120,
        "location": "Bangalore, KA"
    },
    {
        "id": "user_789",
        "name": "Bob Trekker",
        "email": "bob@example.com",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
        "level": "Heritage Hunter",
        "green_points": 1890,
        "location": "Delhi, DL"
    }
]

async def seed_users():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    
    print("🌱 Seeding Users...")
    
    for user in USERS:
        existing = await db.users.find_one({"id": user["id"]})
        if not existing:
            await db.users.insert_one(user)
            print(f"Created: {user['name']}")
        else:
            # Optional: Update existing to match mock data structure if needed
            await db.users.update_one({"id": user["id"]}, {"$set": user})
            print(f"Updated: {user['name']}")
            
    print("✅ Users Seeded Successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_users())
