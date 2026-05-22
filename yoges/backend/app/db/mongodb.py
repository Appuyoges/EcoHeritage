from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = "ecoheritage"

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def connect_to_mongo():
    try:
        db.client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=2000)
        # Trigger a connection check
        await db.client.admin.command('ping')
        print(f"Connected to MongoDB at {MONGO_URL}")
    except Exception as e:
        print(f"⚠️ MongoDB connection failed: {e}")
        print("⚠️ Running in MOCK DATA mode.")
        db.client = None

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")

class MockCollection:
    def __init__(self, data=None):
        self.data = data or []

    async def find_one(self, query):
        # Simple mock find_one
        return next((item for item in self.data if str(item.get("id")) == str(query.get("id"))), None)

    def find(self, query):
        # Simple mock find, returns self to allow chaining to_list
        # Filter logic is minimal for demo
        self.filtered = [item for item in self.data if all(str(item.get(k)) == str(v) for k, v in query.items())]
        return self

    async def to_list(self, length):
        return self.filtered if hasattr(self, 'filtered') else self.data

    async def update_one(self, filter_query, update_data):
        # Allow updates in mock mode for testing
        doc = await self.find_one(filter_query)
        if doc:
            # Very basic update implementation for $set
            changes = update_data.get("$set", {})
            doc.update(changes)
            return MockUpdateResult(matched_count=1)
        return MockUpdateResult(matched_count=0)

class MockUpdateResult:
    def __init__(self, matched_count):
        self.matched_count = matched_count

class MockDatabase:
    def __init__(self):
        # Pre-seed with the data we know exists to keep app usable in offline mode
        self.users = MockCollection([
            {
                "id": "user_001",
                "name": "Yogeswaran S (Offline)",
                "email": "yogeswaran@example.com",
                "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
                "level": "Eco Explorer",
                "green_points": 2450,
                "trips_completed": 8,
                "carbon_saved": "156 kg",
                "favorite_sites": 12
            }
        ])
        self.trips = MockCollection([
             {
                "id": "trip_001", "user_id": "user_001", "destination": "Rajasthan Heritage Tour",
                "date": "Jan 15-20, 2026", "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400",
                "carbon_saved": "28 kg", "sustainability": 87, "sites": ["Jaipur", "Pushkar"]
            },
            {
                "id": "trip_002", "user_id": "user_001", "destination": "Hampi Cultural Trail",
                "date": "Dec 10-14, 2025", "image": "https://images.unsplash.com/photo-1600100397990-bc42ee397be2?w=400",
                "carbon_saved": "15 kg", "sustainability": 92, "sites": ["Virupaksha", "Vittala Temple"]
            },
            {
                "id": "trip_003", "user_id": "user_001", "destination": "Kerala Eco Backwaters",
                "date": "Nov 22-26, 2025", "image": "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=400",
                "carbon_saved": "42 kg", "sustainability": 95, "sites": ["Alleppey", "Munnar"]
            },
            {
                "id": "trip_004", "user_id": "user_001", "destination": "Varanasi Spiritual Journey",
                "date": "Oct 12-16, 2025", "image": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400",
                "carbon_saved": "12 kg", "sustainability": 82, "sites": ["Dashashwamedh Ghat", "Sarnath"]
            }
        ])
        self.posts = MockCollection([
            {
                "id": 1, 
                "user": {"name": "System (Offline)", "avatar": "", "level": "Bot"},
                "content": "MongoDB is unreachable. Running in offline mode.",
                "likes": 0, "comments": 0, "time": "Now", "tags": ["Offline"]
            }
        ])

def get_database():
    if db.client is None:
        print("⚠️ Accessing Mock Database (MongoDB unavailable)")
        return MockDatabase()
    return db.client[DB_NAME]
