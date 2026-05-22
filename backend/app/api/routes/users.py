"""
Users API Routes
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.db.mongodb import get_database

router = APIRouter()

class UserProfile(BaseModel):
    """User profile model"""
    id: str
    name: str
    email: str
    avatar: Optional[str] = None
    bio: Optional[str] = "Eco-traveler | Heritage Enthusiast"
    location: Optional[str] = "India"
    social_links: Optional[dict] = {}
    join_date: Optional[str] = "January 2025"
    level: str = "Eco Explorer"
    green_points: int = 0
    trips_completed: int = 0
    carbon_saved: str = "0 kg"
    favorite_sites: int = 0

class Achievement(BaseModel):
    """Achievement model"""
    id: str
    title: str
    description: str
    icon: str
    earned: bool
    earned_date: Optional[str] = None
    progress: Optional[int] = None

# Mock Achievements (Keep these static or move to DB later)
MOCK_ACHIEVEMENTS = [
    {"id": "eco_warrior", "title": "Eco Warrior", "description": "Saved 100kg CO₂", "icon": "Leaf", "earned": True, "earned_date": "Dec 2025"},
    {"id": "heritage_hunter", "title": "Heritage Hunter", "description": "Visited 10 sites", "icon": "MapPin", "earned": True, "earned_date": "Nov 2025"},
    {"id": "green_champion", "title": "Green Champion", "description": "Top 10% eco traveler", "icon": "Trophy", "earned": True, "earned_date": "Jan 2026"},
    {"id": "goal_setter", "title": "Goal Setter", "description": "Completed 5 trips", "icon": "Target", "earned": True, "earned_date": "Oct 2025"},
    {"id": "rising_star", "title": "Rising Star", "description": "First trip completed", "icon": "Star", "earned": True, "earned_date": "Aug 2025"},
    {"id": "world_explorer", "title": "World Explorer", "description": "Visit all states", "icon": "Globe", "earned": False, "progress": 45},
    {"id": "speed_planner", "title": "Speed Planner", "description": "Plan trip in 5 mins", "icon": "Zap", "earned": False, "progress": 80},
    {"id": "community_hero", "title": "Community Hero", "description": "Help 50 travelers", "icon": "Heart", "earned": False, "progress": 30}
]

@router.put("/{user_id}")
async def update_user_profile(user_id: str, profile_update: UserProfile, db=Depends(get_database)):
    """Update user profile"""
    # Create update dictionary, excluding unset fields if needed, 
    # but here we update whatever is passed.
    update_data = profile_update.dict(exclude={"id"}, exclude_unset=True) # Don't update ID, ignore defaults
    
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"message": "Profile updated successfully", "user": profile_update}

@router.get("/{user_id}/achievements")
async def get_user_achievements(user_id: str):
    """Get user achievements"""
    return {"achievements": MOCK_ACHIEVEMENTS}

@router.get("/{user_id}/trips")
async def get_user_trips(user_id: str, db=Depends(get_database)):
    """Get user's past trips"""
    cursor = db.trips.find({"user_id": user_id})
    trips = await cursor.to_list(length=100)
    for t in trips:
        t.pop("_id", None)
    return {"trips": trips}

@router.get("/{user_id}/stats")
async def get_user_stats(user_id: str):
    """Get user statistics"""
    return {
        "total_trips": 8,
        "total_sites_visited": 24,
        "total_carbon_saved": "156 kg",
        "total_green_points": 2450,
        "ranking": "Top 15%",
        "level": "Eco Explorer",
        "next_level": "Green Guardian",
        "points_to_next_level": 550,
        "favorite_state": "Rajasthan",
        "most_sustainable_trip": "Karnataka Temples (92%)"
    }

@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10, db=Depends(get_database)):
    """Get eco leaderboard sorted by green points"""
    cursor = db.users.find({}).sort("green_points", -1).limit(limit)
    users = await cursor.to_list(length=limit)
    
    leaderboard = []
    for i, user in enumerate(users):
        leaderboard.append({
            "rank": i + 1,
            "name": user.get("name", "Merry Traveler"),
            "points": user.get("green_points", 0),
            "avatar": user.get("avatar", "https://i.pravatar.cc/150"),
            "level": user.get("level", "Eco Explorer"),
            "is_current_user": user.get("id") == "user_123" # consistent mock ID
        })
        
    return {"leaderboard": leaderboard}

@router.get("/stats/global")
async def get_global_stats():
    """Get global platform statistics"""
    return {
        "heritage_sites": "1,200+",
        "carbon_saved": "45 Tons",
        "travelers": "50K+",
        "rating": "4.9★"
    }

@router.get("/{user_id}")
async def get_user_profile(user_id: str, db=Depends(get_database)):
    """Get user profile"""
    print(f"Fetching profile for {user_id}...") # Debug Log
    user = await db.users.find_one({"id": user_id})
    if not user:
        # Fallback to creating a default user if not found (auto-registration logic for demo)
        if user_id == "user_001":
            return {
                "id": "user_001",
                "name": "Yogeswaran S",
                "email": "yogeswaran@example.com",
                "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
                "level": "Eco Explorer",
                "green_points": 2450,
                "trips_completed": 8,
                "carbon_saved": "156 kg",
                "favorite_sites": 12,
                "bio": "Passionate about sustainable travel and exploring India's rich heritage.",
                "location": "Chennai, Tamil Nadu",
                "social_links": {"twitter": "@yoges", "instagram": "@yoges_travels"},
                "join_date": "January 2025"
            }
        raise HTTPException(status_code=404, detail="User not found")
    
    # Mongo returns _id, we need to remove it or map it. Pydantic ignores extra fields by default but let's be safe.
    user.pop("_id", None)
    return user

@router.post("/{user_id}/green-points")
async def add_green_points(user_id: str, points: int, reason: str):
    """Add green points to user"""
    return {
        "success": True,
        "points_added": points,
        "reason": reason,
        "new_total": 2450 + points
    }
