"""
Budget Agent
Estimates and optimizes trip costs based on budget preferences
"""

from typing import Dict, List
from dataclasses import dataclass


@dataclass
class CostEstimate:
    """Cost estimate breakdown"""
    transport: int
    accommodation: int
    food: int
    entry_fees: int
    activities: int
    misc: int
    total: int


class BudgetAgent:
    """
    Budget Agent for trip cost estimation and optimization.
    
    Features:
    - Cost estimation based on budget tier
    - Breakdown by category (transport, stay, food, etc.)
    - Budget optimization suggestions
    - Price comparisons
    """
    
    def __init__(self):
        self.name = "Budget Agent"
        
        # Base costs per day (per person) in INR
        self.daily_costs = {
            'budget': {
                'transport': 500,
                'accommodation': 1000,
                'food': 600,
                'entry_fees': 300,
                'activities': 200,
                'misc': 400
            },
            'standard': {
                'transport': 1200,
                'accommodation': 3000,
                'food': 1200,
                'entry_fees': 500,
                'activities': 800,
                'misc': 800
            },
            'premium': {
                'transport': 3000,
                'accommodation': 8000,
                'food': 2500,
                'entry_fees': 800,
                'activities': 2000,
                'misc': 1500
            }
        }
        
        # Region-wise cost multipliers
        self.region_multipliers = {
            'Rajasthan': 1.1,  # Slightly expensive (tourist heavy)
            'Karnataka': 0.95,
            'Uttar Pradesh': 0.9,
            'Madhya Pradesh': 0.85,
            'Maharashtra': 1.0,
            'Kerala': 1.15,
            'Goa': 1.2
        }
        
        # Site entry fees (INR, for Indians)
        self.entry_fees = {
            'raj_01': 200,  # Amer Fort
            'raj_02': 50,   # Hawa Mahal
            'raj_03': 130,  # City Palace
            'raj_04': 50,   # Jantar Mantar
            'raj_05': 50,   # Nahargarh Fort
            'raj_06': 10,   # Pushkar Lake
            'kar_01': 40,   # Hampi (various tickets)
            'kar_04': 70,   # Mysore Palace
            'up_01': 50,    # Taj Mahal
            'up_02': 35,    # Agra Fort
            'mp_01': 40,    # Khajuraho
            'mh_01': 40,    # Ajanta
            'mh_02': 40,    # Ellora
        }
    
    async def estimate_costs(
        self,
        itinerary: List[Dict],
        budget_type: str,  # 'budget', 'standard', 'premium'
        travelers: int
    ) -> List[Dict]:
        """
        Estimate costs for the itinerary and add to each day.
        
        Args:
            itinerary: Day-wise itinerary
            budget_type: Budget tier
            travelers: Number of travelers
            
        Returns:
            Itinerary with cost estimates added
        """
        print(f"[{self.name}] Estimating costs for {len(itinerary)} days, {travelers} travelers")
        
        base_costs = self.daily_costs.get(budget_type, self.daily_costs['standard'])
        
        total_trip_cost = 0
        
        for day in itinerary:
            day_estimate = self._estimate_day_cost(
                day,
                base_costs,
                travelers
            )
            
            day['cost'] = day_estimate.total * travelers
            day['cost_breakdown'] = {
                'transport': day_estimate.transport * travelers,
                'accommodation': day_estimate.accommodation * travelers,
                'food': day_estimate.food * travelers,
                'entry_fees': day_estimate.entry_fees * travelers,
                'activities': day_estimate.activities * travelers,
                'misc': day_estimate.misc * travelers
            }
            
            total_trip_cost += day['cost']
        
        return itinerary
    
    def _estimate_day_cost(
        self,
        day: Dict,
        base_costs: Dict,
        travelers: int
    ) -> CostEstimate:
        """Estimate cost for a single day"""
        
        # Calculate entry fees for places visited
        entry_total = 0
        places = day.get('places', [])
        # Note: Would need to map place names to IDs in production
        entry_total = len(places) * base_costs['entry_fees'] // 3
        
        # Adjust transport based on number of places
        transport = base_costs['transport']
        if len(places) > 3:
            transport = int(transport * 1.3)
        
        # Food cost
        food = base_costs['food']
        if len(day.get('food', [])) > 2:
            food = int(food * 1.2)
        
        return CostEstimate(
            transport=transport,
            accommodation=base_costs['accommodation'],
            food=food,
            entry_fees=entry_total or base_costs['entry_fees'],
            activities=base_costs['activities'],
            misc=base_costs['misc'],
            total=transport + base_costs['accommodation'] + food + 
                  (entry_total or base_costs['entry_fees']) + 
                  base_costs['activities'] + base_costs['misc']
        )
    
    async def get_budget_tips(
        self,
        destination: str,
        budget_type: str
    ) -> List[str]:
        """Get budget-saving tips for a destination"""
        
        tips = {
            'budget': [
                "🚂 Book trains 30 days in advance for lowest fares",
                "🏨 Stay in hostels or homestays for authentic experiences",
                "🍛 Eat at local dhabas and street food stalls",
                "🎫 Visit sites on free/discount days",
                "🚌 Use public transport over taxis",
                "📱 Download offline maps to avoid data costs"
            ],
            'standard': [
                "🚂 Book Shatabdi/Rajdhani for speed and comfort",
                "🏨 Try boutique hotels and heritage stays",
                "🍛 Mix local eateries with good restaurants",
                "🎫 Book combo tickets where available",
                "🚗 Share cabs with other travelers"
            ],
            'premium': [
                "✈️ Book flights in advance for best business class deals",
                "🏨 Palace hotels offer unique heritage experiences",
                "🍽️ Try award-winning restaurants with local cuisine",
                "🎫 Book VIP entry to skip queues",
                "🚗 Hire a private chauffeur-driven car"
            ]
        }
        
        return tips.get(budget_type, tips['standard'])
    
    async def compare_options(
        self,
        destination: str,
        days: int,
        travelers: int
    ) -> Dict:
        """Compare costs across budget tiers"""
        
        comparisons = {}
        
        for tier in ['budget', 'standard', 'premium']:
            base = self.daily_costs[tier]
            daily_total = sum(base.values())
            trip_total = daily_total * days * travelers
            
            comparisons[tier] = {
                'daily_per_person': daily_total,
                'trip_total': trip_total,
                'trip_total_formatted': f"₹{trip_total:,}"
            }
        
        return comparisons


# Singleton instance
budget_agent = BudgetAgent()
