from dataclasses import dataclass
from typing import List, Optional

@dataclass
class HeritageSite:
    """Heritage site data model"""
    id: str
    name: str
    location: str
    state: str
    category: str
    sustainability_score: float
    crowd_level: str
    features: List[str]
    description: str
    best_time: str = "Oct-Mar"
    specialties: List[str] = None
    embedding: Optional[List[float]] = None

@dataclass
class SustainabilityMetrics:
    """Sustainability metrics for a heritage site"""
    carbon_footprint: float  # kg CO2 to reach and visit
    crowd_density: float  # 0-1, higher = more crowded
    eco_infrastructure: float  # 0-1, higher = better eco facilities
    conservation_status: float  # 0-1, higher = better conserved
    local_impact: float  # 0-1, higher = better for locals
    water_usage: float  # 0-1, lower = better
    waste_management: float  # 0-1, higher = better
