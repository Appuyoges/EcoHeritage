"""
Database Reset Utility
This script drops all collections in the EcoHeritage MongoDB database,
providing a clean slate for seeding fresh data.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load env variables for MONGODB_URL if present
load_dotenv()

MONGO_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = "ecoheritage"

async def reset_database():
    print("="*50)
    print("ECOHERITAGE DATABASE RESET TOOL")
    print("="*50)
    print(f"Connecting to MongoDB at {MONGO_URL}...")
    
    try:
        client = AsyncIOMotorClient(MONGO_URL)
        # Verify connection
        await client.admin.command('ping')
        db = client[DB_NAME]
        
        # Fetch all existing collections
        collections = await db.list_collection_names()
        
        if not collections:
            print(f"\n[INFO] The database '{DB_NAME}' is already empty.")
        else:
            print(f"\n[INFO] Found {len(collections)} collections in '{DB_NAME}':")
            for c in collections:
                print(f"  - {c}")
                
            print("\nDropping collections...")
            for coll_name in collections:
                await db[coll_name].drop()
                print(f"  [OK] Dropped: {coll_name}")
                
            print("\n[SUCCESS] Database reset complete! All data cleared.")
            print("\nYou can now run your seeding scripts to populate fresh data:")
            print(" -> python seed_heritage_full.py")
            
    except Exception as e:
        print(f"\n[ERROR] Failed to reset database: {e}")
    finally:
        if 'client' in locals() and client:
            client.close()

if __name__ == "__main__":
    import sys
    # Fix event loop policy for Windows environments
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    # Run the event loop
    asyncio.run(reset_database())
