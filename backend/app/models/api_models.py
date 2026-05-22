from pydantic import BaseModel
from typing import List, Dict

class TripRequest(BaseModel):
    """Trip planning request model"""
    destination: str
    start_date: str
    end_date: str
    travelers: int
    budget_type: str  # 'budget', 'standard', 'premium'
    interests: List[str]
    eco_preference: str  # 'eco-first', 'balanced', 'comfort'
    food_preference: str  # 'any', 'vegetarian', 'vegan', 'non-veg'


class TripPlan(BaseModel):
    """Generated trip plan model"""
    destination: str
    total_days: int
    carbon_saved: str
    sustainability_score: int
    estimated_cost: str
    summary: str = "A sustainable journey awaits!"
    crowd_metric: str = "Medium"
    days: List[Dict]
