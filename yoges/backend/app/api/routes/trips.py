"""
Trips API Routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()


class TripRequest(BaseModel):
    """Trip planning request"""
    destination: str
    start_date: str
    end_date: str
    travelers: int = 2
    budget_type: str = "standard"
    interests: List[str] = []
    eco_preference: str = "balanced"
    food_preference: str = "any"


class DayPlan(BaseModel):
    """Single day plan"""
    day: int
    title: str
    places: List[str]
    carbon_score: int
    transport: str
    food: List[str]
    cost: int


class TripResponse(BaseModel):
    """Generated trip response"""
    destination: str
    total_days: int
    carbon_saved: str
    sustainability_score: int
    estimated_cost: str
    days: List[dict]


@router.post("/plan", response_model=TripResponse)
async def plan_trip(request: TripRequest):
    """
    Generate an optimized, sustainable trip itinerary.
    
    Uses multiple AI agents:
    - Personalization Agent (SVD + BERT)
    - Sustainability Agent (TOPSIS)
    - Itinerary Agent (ACO)
    - Food Agent
    - Budget Agent
    """
    try:
        # Import planner agent
        from app.agents.planner_agent import planner_agent, TripRequest as AgentRequest
        
        # Convert to agent request format
        agent_request = AgentRequest(
            destination=request.destination,
            start_date=request.start_date,
            end_date=request.end_date,
            travelers=request.travelers,
            budget_type=request.budget_type,
            interests=request.interests,
            eco_preference=request.eco_preference,
            food_preference=request.food_preference
        )
        
        # Generate trip plan
        trip_plan = await planner_agent.plan_trip(agent_request)
        
        return TripResponse(
            destination=trip_plan.destination,
            total_days=trip_plan.total_days,
            carbon_saved=trip_plan.carbon_saved,
            sustainability_score=trip_plan.sustainability_score,
            estimated_cost=trip_plan.estimated_cost,
            days=trip_plan.days
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/destinations")
async def get_destinations():
    """Get list of available destinations"""
    return {
        "destinations": [
            {
                "name": "Rajasthan",
                "description": "Forts, Palaces & Desert",
                "icon": "🏰",
                "popular_sites": ["Jaipur", "Udaipur", "Jodhpur", "Pushkar"]
            },
            {
                "name": "Karnataka",
                "description": "Hampi & Mysore",
                "icon": "🛕",
                "popular_sites": ["Hampi", "Mysore", "Badami"]
            },
            {
                "name": "Uttar Pradesh",
                "description": "Taj Mahal & Varanasi",
                "icon": "🕌",
                "popular_sites": ["Agra", "Varanasi", "Lucknow"]
            },
            {
                "name": "Madhya Pradesh",
                "description": "Khajuraho & Sanchi",
                "icon": "🏛️",
                "popular_sites": ["Khajuraho", "Sanchi", "Orchha"]
            },
            {
                "name": "Maharashtra",
                "description": "Ajanta & Ellora",
                "icon": "🗿",
                "popular_sites": ["Aurangabad", "Mumbai", "Pune"]
            },
            {
                "name": "Kerala",
                "description": "Backwaters & Heritage",
                "icon": "🌴",
                "popular_sites": ["Kochi", "Alleppey", "Munnar"]
            }
        ]
    }


@router.get("/sample")
async def get_sample_itinerary():
    """Get a sample itinerary for demonstration"""
    return {
        "destination": "Rajasthan",
        "total_days": 5,
        "carbon_saved": "28 kg",
        "sustainability_score": 87,
        "estimated_cost": "₹45,000",
        "days": [
            {
                "day": 1,
                "title": "Arrival & Jaipur Exploration",
                "places": ["Hawa Mahal", "City Palace", "Jantar Mantar"],
                "carbon_score": 92,
                "transport": "Electric Taxi + Walking",
                "food": ["Laxmi Mishthan Bhandar", "Tapri Central"],
                "cost": 8500
            },
            {
                "day": 2,
                "title": "Amber Fort & Beyond",
                "places": ["Amer Fort", "Jaigarh Fort", "Nahargarh Fort"],
                "carbon_score": 88,
                "transport": "Shared Electric Bus",
                "food": ["1135 AD", "Peacock Rooftop"],
                "cost": 9500
            },
            {
                "day": 3,
                "title": "Pushkar Day Trip",
                "places": ["Pushkar Lake", "Brahma Temple", "Local Market"],
                "carbon_score": 85,
                "transport": "Train + Local Bus",
                "food": ["Sunset Cafe", "Om Shiva Garden"],
                "cost": 7500
            },
            {
                "day": 4,
                "title": "Udaipur - City of Lakes",
                "places": ["City Palace", "Lake Pichola", "Jagdish Temple"],
                "carbon_score": 90,
                "transport": "Train + Walking",
                "food": ["Ambrai", "Savage Garden"],
                "cost": 10500
            },
            {
                "day": 5,
                "title": "Departure",
                "places": ["Local Shopping", "Airport"],
                "carbon_score": 88,
                "transport": "Electric Taxi",
                "food": ["Hotel Breakfast"],
                "cost": 5000
            }
        ]
    }
