import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = "ecoheritage"

# Mock Data (Taken from our previous mock files)
MOCK_USERS = [
    {
        "id": "user_001",
        "name": "Yogeswaran S",
        "email": "yogeswaran@example.com",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        "level": "Eco Explorer",
        "green_points": 2450,
        "trips_completed": 8,
        "carbon_saved": "156 kg",
        "favorite_sites": 12
    }
]

MOCK_POSTS = [
    {
        "id": 1,
        "user": {"name": "Sarah Jenkins", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", "level": "Eco Warrior"},
        "location": "Machu Picchu, Peru",
        "image": "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600",
        "content": "Finally made it to Machu Picchu! Took the train instead of hiking to save time, but made sure to offset my carbon. The views are breathtaking! 🌿⛰️",
        "likes": 245,
        "comments": 18,
        "time": "2 hours ago",
        "tags": ["Heritage", "SustainableTravel"]
    },
    {
        "id": 2,
        "user": {"name": "David Chen", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", "level": "Heritage Hunter"},
        "location": "Kyoto, Japan",
        "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600",
        "content": "Exploring the ancient temples of Kyoto. The preservation efforts here are incredible. Highly recommend visiting during the off-season to avoid crowds. ⛩️",
        "likes": 189,
        "comments": 12,
        "time": "5 hours ago",
        "tags": ["Japan", "Culture", "EcoTips"]
    },
    {
        "id": 3,
        "user": {"name": "Elena Rodriguez", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", "level": "Green Explorer"},
        "location": "Petra, Jordan",
        "image": "https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=600",
        "content": "Walking through the Siq to see the Treasury was a magical experience. Remember to bring your own water bottle to reduce plastic waste! 💧",
        "likes": 312,
        "comments": 24,
        "time": "1 day ago",
        "tags": ["Petra", "ZeroWaste"]
    }
]

MOCK_TRIPS = [
    {
        "user_id": "user_001",
        "id": "trip_001",
        "destination": "Rajasthan Heritage Tour",
        "date": "Jan 15-20, 2026",
        "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400",
        "carbon_saved": "28 kg",
        "sustainability": 87,
        "sites": ["Jaipur", "Pushkar", "Udaipur"]
    },
    {
        "user_id": "user_001",
        "id": "trip_002",
        "destination": "Karnataka Temples",
        "date": "Dec 5-10, 2025",
        "image": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=400",
        "carbon_saved": "35 kg",
        "sustainability": 92,
        "sites": ["Hampi", "Mysore", "Badami"]
    }
]

async def seed():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("Seeding database...")
    
    # Users
    if await db.users.count_documents({}) == 0:
        await db.users.insert_many(MOCK_USERS)
        print("Inserted users.")
    else:
        print("Users already exist.")
        
    # Posts
    if await db.posts.count_documents({}) == 0:
        await db.posts.insert_many(MOCK_POSTS)
        print("Inserted posts.")
    else:
        print("Posts already exist.")
        
    # Trips
    if await db.trips.count_documents({}) == 0:
        await db.trips.insert_many(MOCK_TRIPS)
        print("Inserted trips.")
    else:
        print("Trips already exist.")

    client.close()
    print("Seeding complete.")

if __name__ == "__main__":
    asyncio.run(seed())
