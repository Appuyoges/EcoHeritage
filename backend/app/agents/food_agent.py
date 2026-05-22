"""
Food & Cuisine Agent
Recommends local authentic foods and restaurants integrated with heritage routes
"""

from typing import Dict, List
from dataclasses import dataclass


@dataclass
class FoodPlace:
    """Food place data model"""
    id: str
    name: str
    location: str
    type: str  # 'restaurant', 'street_food', 'cafe', 'dhaba'
    cuisine: List[str]
    specialty: str
    price_range: str  # 'budget', 'mid', 'premium'
    vegetarian: bool
    vegan_options: bool
    sustainability_score: float  # Support for local, organic, waste reduction
    rating: float
    near_sites: List[str]


class FoodAgent:
    """
    Food & Cuisine Agent for local food recommendations.
    
    Features:
    - Authentic local cuisine recommendations
    - Dietary preference matching
    - Sustainability-focused (local sourcing, waste reduction)
    - Integration with heritage routes
    - Hidden gems and street food
    """
    
    def __init__(self):
        self.name = "Food Agent"
        self.food_database = self._load_food_data()
    
    def _load_food_data(self) -> Dict[str, List[FoodPlace]]:
        """Load food places data organized by region"""
        return {
            "Rajasthan": [
                FoodPlace("raj_f01", "Laxmi Mishthan Bhandar", "Jaipur", "restaurant",
                         ["Rajasthani", "Sweets"], "Ghewar & Pyaaz Kachori", "budget",
                         True, False, 0.85, 4.7, ["raj_01", "raj_02", "raj_03"]),
                FoodPlace("raj_f02", "Rawat Kachori", "Jaipur", "street_food",
                         ["Rajasthani", "Snacks"], "Pyaaz Kachori", "budget",
                         True, False, 0.90, 4.8, ["raj_02", "raj_04"]),
                FoodPlace("raj_f03", "1135 AD", "Jaipur", "restaurant",
                         ["Rajasthani", "Royal"], "Dal Baati Churma", "premium",
                         True, False, 0.75, 4.6, ["raj_01"]),
                FoodPlace("raj_f04", "Tapri Central", "Jaipur", "cafe",
                         ["Cafe", "Fusion"], "Masala Chai", "mid",
                         True, True, 0.88, 4.5, ["raj_02", "raj_05"]),
                FoodPlace("raj_f05", "Peacock Rooftop", "Jaipur", "restaurant",
                         ["Multi-cuisine"], "Rooftop Dining", "mid",
                         True, True, 0.80, 4.4, ["raj_01"]),
                FoodPlace("raj_f06", "Saffron", "Jaipur", "restaurant",
                         ["Rajasthani", "North Indian"], "Laal Maas", "premium",
                         False, False, 0.82, 4.7, ["raj_03"]),
                FoodPlace("raj_f07", "Sunset Cafe", "Pushkar", "cafe",
                         ["Multi-cuisine", "Vegetarian"], "Israeli Food", "budget",
                         True, True, 0.92, 4.5, ["raj_06"]),
                FoodPlace("raj_f08", "Om Shiva Garden", "Pushkar", "restaurant",
                         ["Vegetarian", "Organic"], "Thali", "budget",
                         True, True, 0.95, 4.6, ["raj_06"]),
                FoodPlace("raj_f09", "Ambrai", "Udaipur", "restaurant",
                         ["Rajasthani", "Continental"], "Lake View Dining", "premium",
                         True, False, 0.78, 4.8, ["raj_07", "raj_08"]),
                FoodPlace("raj_f10", "Savage Garden", "Udaipur", "restaurant",
                         ["Multi-cuisine", "Organic"], "Farm to Table", "mid",
                         True, True, 0.90, 4.5, ["raj_07"]),
            ],
            "Karnataka": [
                FoodPlace("kar_f01", "Mango Tree", "Hampi", "restaurant",
                         ["South Indian", "Multi-cuisine"], "Thali", "budget",
                         True, True, 0.95, 4.6, ["kar_01", "kar_02", "kar_03"]),
                FoodPlace("kar_f02", "Laughing Buddha", "Hampi", "cafe",
                         ["Multi-cuisine", "Israeli"], "Traveler Food", "budget",
                         True, True, 0.88, 4.4, ["kar_01"]),
                FoodPlace("kar_f03", "Chill Out", "Hampi", "cafe",
                         ["Multi-cuisine"], "Sunset Views", "budget",
                         True, True, 0.92, 4.3, ["kar_02"]),
                FoodPlace("kar_f04", "Vinayaka Mylari", "Mysore", "restaurant",
                         ["South Indian"], "Masala Dosa", "budget",
                         True, True, 0.90, 4.8, ["kar_04"]),
                FoodPlace("kar_f05", "Hotel RRR", "Mysore", "restaurant",
                         ["South Indian"], "Andhra Meals", "budget",
                         False, False, 0.85, 4.5, ["kar_04"]),
                FoodPlace("kar_f06", "Badami Court", "Badami", "restaurant",
                         ["North Karnataka"], "Jowar Roti Thali", "budget",
                         True, False, 0.92, 4.2, ["kar_05"]),
            ],
            "Uttar Pradesh": [
                FoodPlace("up_f01", "Pind Balluchi", "Agra", "restaurant",
                         ["Mughlai", "North Indian"], "Biryani", "mid",
                         False, False, 0.75, 4.3, ["up_01", "up_02"]),
                FoodPlace("up_f02", "Esphahan", "Agra", "restaurant",
                         ["Mughlai", "Awadhi"], "Dum Biryani", "premium",
                         False, False, 0.80, 4.7, ["up_01"]),
                FoodPlace("up_f03", "Mama Chicken", "Agra", "street_food",
                         ["Mughlai"], "Chicken Biryani", "budget",
                         False, False, 0.70, 4.5, ["up_01"]),
                FoodPlace("up_f04", "Blue Lassi", "Varanasi", "street_food",
                         ["Sweets", "Beverages"], "Lassi", "budget",
                         True, False, 0.88, 4.8, ["up_03"]),
                FoodPlace("up_f05", "Kashi Chat Bhandar", "Varanasi", "street_food",
                         ["Chaat", "Street Food"], "Tamatar Chaat", "budget",
                         True, True, 0.85, 4.6, ["up_03"]),
                FoodPlace("up_f06", "Canton Royale", "Varanasi", "cafe",
                         ["Multi-cuisine", "Cafe"], "Rooftop Ganga View", "mid",
                         True, True, 0.82, 4.4, ["up_03"]),
            ],
            "Madhya Pradesh": [
                FoodPlace("mp_f01", "Raja's Cafe", "Khajuraho", "cafe",
                         ["Multi-cuisine"], "Traveler Cafe", "budget",
                         True, True, 0.90, 4.3, ["mp_01"]),
                FoodPlace("mp_f02", "Mediterraneo", "Khajuraho", "restaurant",
                         ["Italian", "Multi-cuisine"], "Pizza", "mid",
                         True, True, 0.82, 4.2, ["mp_01"]),
                FoodPlace("mp_f03", "Gateway Cafeteria", "Sanchi", "cafe",
                         ["North Indian", "Snacks"], "Thali", "budget",
                         True, False, 0.88, 4.0, ["mp_02"]),
            ],
            "Maharashtra": [
                FoodPlace("mh_f01", "MTDC Restaurant", "Aurangabad", "restaurant",
                         ["Maharashtrian", "North Indian"], "Thali", "budget",
                         True, False, 0.85, 4.1, ["mh_01", "mh_02"]),
                FoodPlace("mh_f02", "Kream N Krunch", "Aurangabad", "cafe",
                         ["Multi-cuisine", "Cafe"], "Coffee & Snacks", "mid",
                         True, True, 0.80, 4.3, ["mh_01"]),
            ],
        }
    
    async def add_food_recommendations(
        self,
        itinerary: List[Dict],
        food_preference: str,
        destination: str
    ) -> List[Dict]:
        """
        Add food recommendations to the itinerary.
        
        Args:
            itinerary: Day-wise itinerary from Itinerary Agent
            food_preference: 'any', 'vegetarian', 'vegan', 'non-veg'
            destination: Target destination/state
            
        Returns:
            Itinerary with food recommendations added
        """
        print(f"[{self.name}] Adding food recommendations for {destination}")
        
        # Get food places for the destination
        food_places = self._get_food_places(destination)
        
        # Filter by dietary preference
        filtered_places = self._filter_by_preference(food_places, food_preference)
        
        # Add to each day
        for day in itinerary:
            places = day.get('places', [])
            day_foods = self._match_food_to_sites(places, filtered_places)
            day['food'] = day_foods[:3]  # Max 3 food places per day
        
        return itinerary
    
    def _get_food_places(self, destination: str) -> List[FoodPlace]:
        """Get food places for a destination"""
        dest_lower = destination.lower()
        
        for region, places in self.food_database.items():
            if region.lower() in dest_lower or dest_lower in region.lower():
                return places
        
        # Return all if no match
        all_places = []
        for places in self.food_database.values():
            all_places.extend(places)
        return all_places
    
    def _filter_by_preference(
        self,
        places: List[FoodPlace],
        preference: str
    ) -> List[FoodPlace]:
        """Filter food places by dietary preference"""
        if preference == 'any':
            return places
        elif preference == 'vegetarian':
            return [p for p in places if p.vegetarian]
        elif preference == 'vegan':
            return [p for p in places if p.vegan_options]
        elif preference == 'non-veg':
            return [p for p in places if not p.vegetarian]
        return places
    
    def _match_food_to_sites(
        self,
        places: List[str],
        food_places: List[FoodPlace]
    ) -> List[Dict]:
        """Match food places to visited heritage sites"""
        matched = []
        used = set()
        
        # Sort by sustainability and rating
        sorted_places = sorted(
            food_places,
            key=lambda x: (x.sustainability_score, x.rating),
            reverse=True
        )
        
        for food_place in sorted_places:
            if food_place.name not in used:
                matched.append({
                    "name": food_place.name,
                    "specialty": food_place.specialty,
                    "type": food_place.type
                })
                used.add(food_place.name)
                if len(matched) >= 3:
                    break
        
        return matched
    
    async def get_food_trails(
        self,
        destination: str,
        preference: str = 'any',
        limit: int = 5
    ) -> List[Dict]:
        """
        Get food trail recommendations for a destination.
        
        Returns a curated food trail with local specialties.
        """
        places = self._get_food_places(destination)
        filtered = self._filter_by_preference(places, preference)
        
        # Sort by sustainability and rating
        sorted_places = sorted(
            filtered,
            key=lambda x: (x.sustainability_score * 0.4 + x.rating / 5 * 0.6),
            reverse=True
        )[:limit]
        
        return [
            {
                'name': p.name,
                'type': p.type,
                'specialty': p.specialty,
                'price_range': p.price_range,
                'rating': p.rating,
                'sustainability': int(p.sustainability_score * 100),
                'vegetarian': p.vegetarian
            }
            for p in sorted_places
        ]


# Singleton instance
food_agent = FoodAgent()
