"""
Carbon Tracking API Routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class CarbonCalculation(BaseModel):
    """Carbon calculation request"""
    transport_mode: str
    distance_km: float
    travelers: int = 1


class TripCarbonRequest(BaseModel):
    """Trip carbon calculation request"""
    trip_id: str
    segments: List[dict]


@router.get("/factors")
async def get_carbon_factors():
    """Get carbon emission factors for different transport modes"""
    return {
        "factors": {
            "walking": {"factor": 0.0, "unit": "kg CO2/km", "label": "Walking"},
            "cycling": {"factor": 0.0, "unit": "kg CO2/km", "label": "Cycling"},
            "electric_bus": {"factor": 0.03, "unit": "kg CO2/km", "label": "Electric Bus"},
            "train": {"factor": 0.04, "unit": "kg CO2/km", "label": "Train"},
            "bus": {"factor": 0.08, "unit": "kg CO2/km", "label": "Bus"},
            "car_shared": {"factor": 0.12, "unit": "kg CO2/km", "label": "Shared Car"},
            "car": {"factor": 0.20, "unit": "kg CO2/km", "label": "Car (Solo)"},
            "flight_domestic": {"factor": 0.25, "unit": "kg CO2/km", "label": "Domestic Flight"}
        },
        "average_tourist_daily": 15,
        "eco_tourist_daily": 8
    }


@router.post("/calculate")
async def calculate_carbon(request: CarbonCalculation):
    """Calculate carbon emission for a single journey"""
    factors = {
        "walking": 0.0,
        "cycling": 0.0,
        "electric_bus": 0.03,
        "train": 0.04,
        "bus": 0.08,
        "car_shared": 0.12,
        "car": 0.20,
        "flight": 0.25
    }
    
    factor = factors.get(request.transport_mode.lower(), 0.15)
    total_carbon = request.distance_km * factor * request.travelers
    
    # Compare with alternatives
    alternatives = []
    for mode, f in factors.items():
        if mode != request.transport_mode.lower():
            alt_carbon = request.distance_km * f
            savings = total_carbon / request.travelers - alt_carbon
            if savings > 0:
                alternatives.append({
                    "mode": mode,
                    "carbon": round(alt_carbon, 2),
                    "savings": round(savings, 2)
                })
    
    # Sort alternatives by carbon
    alternatives.sort(key=lambda x: x["carbon"])
    
    return {
        "transport_mode": request.transport_mode,
        "distance_km": request.distance_km,
        "travelers": request.travelers,
        "carbon_kg": round(total_carbon, 2),
        "carbon_per_person_kg": round(total_carbon / request.travelers, 2),
        "eco_alternatives": alternatives[:3]
    }


@router.get("/compare")
async def compare_routes(
    origin: str,
    destination: str,
    distance_km: float
):
    """Compare carbon emissions across all transport modes"""
    factors = {
        "Walking": 0.0,
        "Cycling": 0.0,
        "Electric Bus": 0.03,
        "Train": 0.04,
        "Bus": 0.08,
        "Shared Car": 0.12,
        "Car": 0.20,
        "Flight": 0.25
    }
    
    comparisons = []
    for mode, factor in factors.items():
        carbon = distance_km * factor
        # Estimate time (simplified)
        if mode == "Walking":
            time_hours = distance_km / 5
        elif mode == "Cycling":
            time_hours = distance_km / 15
        elif mode in ["Train", "Bus", "Electric Bus"]:
            time_hours = distance_km / 60
        elif mode in ["Car", "Shared Car"]:
            time_hours = distance_km / 50
        else:
            time_hours = distance_km / 500
        
        comparisons.append({
            "mode": mode,
            "carbon_kg": round(carbon, 2),
            "time_hours": round(time_hours, 1),
            "recommended": mode in ["Train", "Electric Bus", "Cycling"]
        })
    
    # Sort by carbon
    comparisons.sort(key=lambda x: x["carbon_kg"])
    
    return {
        "origin": origin,
        "destination": destination,
        "distance_km": distance_km,
        "comparisons": comparisons
    }


@router.get("/dashboard/{user_id}")
async def get_carbon_dashboard(user_id: str):
    """Get carbon dashboard data for a user"""
    # Mock data - in production, fetch from database
    return {
        "user_id": user_id,
        "total_trips": 8,
        "total_carbon_kg": 156,
        "carbon_saved_kg": 89,
        "avg_sustainability_score": 87,
        "ranking_percentile": 15,
        "monthly_data": [
            {"month": "Aug", "carbon": 25, "avg": 40},
            {"month": "Sep", "carbon": 18, "avg": 38},
            {"month": "Oct", "carbon": 22, "avg": 42},
            {"month": "Nov", "carbon": 15, "avg": 35},
            {"month": "Dec", "carbon": 28, "avg": 45},
            {"month": "Jan", "carbon": 20, "avg": 40}
        ],
        "transport_breakdown": [
            {"mode": "Train", "percentage": 45, "carbon_kg": 25},
            {"mode": "Bus", "percentage": 25, "carbon_kg": 18},
            {"mode": "Walking", "percentage": 20, "carbon_kg": 0},
            {"mode": "Car", "percentage": 10, "carbon_kg": 12}
        ],
        "achievements": [
            {"title": "Eco Explorer", "earned": True},
            {"title": "Rail Rider", "earned": True},
            {"title": "Carbon Warrior", "earned": True},
            {"title": "Planet Protector", "earned": False, "progress": 65}
        ]
    }


@router.get("/offset/options")
async def get_offset_options():
    """Get carbon offset options"""
    return {
        "options": [
            {
                "name": "Plant Trees",
                "description": "Plant native trees in Indian forests",
                "cost_per_kg": 50,
                "partner": "Green India Initiative",
                "impact": "1 tree absorbs ~22kg CO2/year"
            },
            {
                "name": "Solar Energy",
                "description": "Fund solar panels in rural areas",
                "cost_per_kg": 75,
                "partner": "Solar Villages Project",
                "impact": "Powers 1 home for 1 month per 10kg offset"
            },
            {
                "name": "Clean Cooking",
                "description": "Provide clean cooking stoves",
                "cost_per_kg": 60,
                "partner": "Smokeless Kitchens",
                "impact": "Prevents indoor air pollution"
            }
        ]
    }
