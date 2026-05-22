"""
Itinerary Optimization Agent
Uses Ant Colony Optimization (ACO) for carbon-minimized route planning
"""

from typing import Dict, List, Tuple
import numpy as np
import random
from dataclasses import dataclass


@dataclass
class RouteSegment:
    """A segment of the travel route"""
    from_site: str
    to_site: str
    distance_km: float
    transport_mode: str
    carbon_kg: float
    duration_hours: float


class AntColonyOptimizer:
    """
    Ant Colony Optimization for route planning.
    
    Minimizes total carbon footprint while visiting all selected sites.
    
    Parameters:
    - n_ants: Number of ants (solutions per iteration)
    - n_iterations: Number of optimization iterations
    - alpha: Pheromone importance factor
    - beta: Heuristic (distance/carbon) importance factor
    - evaporation_rate: Pheromone evaporation rate
    - q: Pheromone deposit factor
    """
    
    def __init__(
        self,
        n_ants: int = 20,
        n_iterations: int = 100,
        alpha: float = 1.0,
        beta: float = 2.0,
        evaporation_rate: float = 0.5,
        q: float = 100
    ):
        self.n_ants = n_ants
        self.n_iterations = n_iterations
        self.alpha = alpha
        self.beta = beta
        self.evaporation_rate = evaporation_rate
        self.q = q
    
    def optimize(
        self,
        sites: List[str],
        carbon_matrix: np.ndarray,
        distance_matrix: np.ndarray
    ) -> Tuple[List[int], float]:
        """
        Run ACO to find optimal route.
        
        Args:
            sites: List of site IDs
            carbon_matrix: Matrix of carbon costs between sites
            distance_matrix: Matrix of distances between sites
            
        Returns:
            Tuple of (optimal route indices, total carbon)
        """
        n_sites = len(sites)
        
        if n_sites <= 2:
            return list(range(n_sites)), np.sum(carbon_matrix[:n_sites, :n_sites])
        
        # Initialize pheromone matrix
        pheromone = np.ones((n_sites, n_sites))
        
        # Heuristic: inverse of carbon (higher for lower carbon routes)
        heuristic = np.where(carbon_matrix > 0, 1 / carbon_matrix, 1)
        
        best_route = None
        best_carbon = float('inf')
        
        for iteration in range(self.n_iterations):
            routes = []
            route_carbons = []
            
            # Each ant builds a solution
            for ant in range(self.n_ants):
                route = self._build_route(n_sites, pheromone, heuristic)
                total_carbon = self._calculate_route_carbon(route, carbon_matrix)
                routes.append(route)
                route_carbons.append(total_carbon)
                
                # Update best solution
                if total_carbon < best_carbon:
                    best_carbon = total_carbon
                    best_route = route.copy()
            
            # Update pheromones
            pheromone = self._update_pheromones(pheromone, routes, route_carbons)
        
        return best_route if best_route else list(range(n_sites)), best_carbon
    
    def _build_route(
        self,
        n_sites: int,
        pheromone: np.ndarray,
        heuristic: np.ndarray
    ) -> List[int]:
        """Build a route for one ant using probabilistic selection"""
        route = [0]  # Start from first site
        unvisited = set(range(1, n_sites))
        
        current = 0
        while unvisited:
            # Calculate probabilities for next site
            probs = []
            candidates = list(unvisited)
            
            for next_site in candidates:
                tau = pheromone[current, next_site] ** self.alpha
                eta = heuristic[current, next_site] ** self.beta
                probs.append(tau * eta)
            
            # Normalize probabilities
            total = sum(probs)
            if total > 0:
                probs = [p / total for p in probs]
            else:
                probs = [1 / len(candidates)] * len(candidates)
            
            # Select next site
            next_site = random.choices(candidates, weights=probs)[0]
            route.append(next_site)
            unvisited.remove(next_site)
            current = next_site
        
        return route
    
    def _calculate_route_carbon(
        self,
        route: List[int],
        carbon_matrix: np.ndarray
    ) -> float:
        """Calculate total carbon for a route"""
        total = 0
        for i in range(len(route) - 1):
            total += carbon_matrix[route[i], route[i + 1]]
        return total
    
    def _update_pheromones(
        self,
        pheromone: np.ndarray,
        routes: List[List[int]],
        route_carbons: List[float]
    ) -> np.ndarray:
        """Update pheromone matrix based on ant solutions"""
        # Evaporation
        pheromone *= (1 - self.evaporation_rate)
        
        # Deposit pheromones
        for route, carbon in zip(routes, route_carbons):
            if carbon > 0:
                deposit = self.q / carbon
                for i in range(len(route) - 1):
                    pheromone[route[i], route[i + 1]] += deposit
                    pheromone[route[i + 1], route[i]] += deposit
        
        return pheromone


class ItineraryAgent:
    """
    Itinerary Optimization Agent using Ant Colony Optimization.
    
    Creates optimized multi-day itineraries that minimize carbon footprint
    while covering all recommended sites.
    
    Flow:
    1. Receive ranked heritage sites from Personalization + Sustainability agents
    2. Build distance/carbon matrices
    3. Run ACO to find optimal visiting order
    4. Distribute sites across days
    5. Add transport recommendations
    """
    
    def __init__(self):
        self.name = "Itinerary Agent"
        self.aco = AntColonyOptimizer()
        
        # Transport mode selection based on distance
        self.distance_thresholds = {
            'walking': 2,      # Up to 2km
            'cycling': 10,     # 2-10km
            'electric_bus': 30,  # 10-30km
            'train': 300,      # 30-300km
            'flight': float('inf')  # 300km+
        }
        
        # Carbon emission factors (kg CO2 per km)
        self.carbon_factors = {
            'walking': 0.0,
            'cycling': 0.0,
            'electric_bus': 0.03,
            'train': 0.04,
            'bus': 0.08,
            'car': 0.15,
            'flight': 0.25
        }
        
        # Site distances (simplified - in km)
        self.site_distances = self._load_site_distances()
    
    def _load_site_distances(self) -> Dict[Tuple[str, str], float]:
        """Load distances between sites (simplified data)"""
        # Format: (site1_id, site2_id): distance_km
        return {
            # Jaipur internal
            ("raj_01", "raj_02"): 12,
            ("raj_01", "raj_03"): 11,
            ("raj_02", "raj_03"): 2,
            ("raj_02", "raj_04"): 1,
            ("raj_03", "raj_05"): 15,
            ("raj_04", "raj_05"): 12,
            
            # Jaipur to Pushkar
            ("raj_01", "raj_06"): 145,
            ("raj_02", "raj_06"): 140,
            
            # Pushkar to Udaipur
            ("raj_06", "raj_07"): 280,
            ("raj_07", "raj_08"): 3,
            
            # Karnataka internal
            ("kar_01", "kar_02"): 2,
            ("kar_02", "kar_03"): 3,
            ("kar_01", "kar_03"): 4,
            ("kar_01", "kar_04"): 350,
            ("kar_04", "kar_05"): 130,
            
            # Maharashtra internal
            ("mh_01", "mh_02"): 30,
        }
    
    async def optimize_route(
        self,
        sites: List[Tuple],  # List of (site, sustainability_score)
        days: int,
        eco_preference: str
    ) -> List[Dict]:
        """
        Optimize route using ACO and distribute across days.
        
        Args:
            sites: List of (HeritageSite, sustainability_score) tuples
            days: Number of days for the trip
            eco_preference: User's eco preference
            
        Returns:
            List of day-wise itinerary dictionaries
        """
        print(f"[{self.name}] Optimizing route for {len(sites)} sites over {days} days")
        
        # Extract site objects
        site_list = [s[0] for s in sites]
        site_ids = [s.id if hasattr(s, 'id') else f"site_{i}" for i, s in enumerate(site_list)]
        
        # Build matrices
        n = len(site_ids)
        carbon_matrix = np.zeros((n, n))
        distance_matrix = np.zeros((n, n))
        
        for i in range(n):
            for j in range(n):
                if i != j:
                    dist = self._get_distance(site_ids[i], site_ids[j])
                    distance_matrix[i, j] = dist
                    carbon_matrix[i, j] = self._calculate_carbon(dist, eco_preference)
        
        # Run ACO optimization
        optimal_order, total_carbon = self.aco.optimize(
            site_ids, carbon_matrix, distance_matrix
        )
        
        # Reorder sites according to optimal route
        ordered_sites = [site_list[i] for i in optimal_order] if optimal_order else site_list
        
        # Distribute across days
        itinerary = self._distribute_sites(ordered_sites, sites, days, eco_preference)
        
        print(f"[{self.name}] Route optimized with total carbon: {total_carbon:.2f} kg")
        
        return itinerary
    
    def _get_distance(self, site1_id: str, site2_id: str) -> float:
        """Get distance between two sites"""
        key = (site1_id, site2_id)
        if key in self.site_distances:
            return self.site_distances[key]
        
        # Try reverse
        key_rev = (site2_id, site1_id)
        if key_rev in self.site_distances:
            return self.site_distances[key_rev]
        
        # Default distance based on same region or not
        if site1_id[:3] == site2_id[:3]:
            return 20  # Same state, assume 20km avg
        else:
            return 200  # Different states
    
    def _calculate_carbon(self, distance_km: float, eco_preference: str) -> float:
        """Calculate carbon for a distance based on eco preference"""
        transport = self._select_transport(distance_km, eco_preference)
        factor = self.carbon_factors.get(transport, 0.1)
        return distance_km * factor
    
    def _select_transport(self, distance_km: float, eco_preference: str) -> str:
        """Select appropriate transport mode"""
        if eco_preference == 'eco-first':
            # Prefer lower carbon options
            if distance_km <= 3:
                return 'walking'
            elif distance_km <= 15:
                return 'cycling'
            elif distance_km <= 50:
                return 'electric_bus'
            else:
                return 'train'
        elif eco_preference == 'comfort':
            # Allow more carbon for comfort
            if distance_km <= 1:
                return 'walking'
            elif distance_km <= 20:
                return 'car'
            elif distance_km <= 500:
                return 'car'
            else:
                return 'flight'
        else:  # balanced
            if distance_km <= 2:
                return 'walking'
            elif distance_km <= 10:
                return 'cycling'
            elif distance_km <= 300:
                return 'train'
            else:
                return 'flight'
    
    def _distribute_sites(
        self,
        ordered_sites: List,
        original_sites: List[Tuple],
        days: int,
        eco_preference: str
    ) -> List[Dict]:
        """Distribute sites across days"""
        sites_per_day = max(1, len(ordered_sites) // days)
        extra = len(ordered_sites) % days
        
        itinerary = []
        site_idx = 0
        
        # Create map of site id to sustainability score
        score_map = {}
        for site, score in original_sites:
            site_id = site.id if hasattr(site, 'id') else str(site)
            score_map[site_id] = score
        
        for day in range(1, days + 1):
            # Calculate sites for this day
            n_sites = sites_per_day + (1 if day <= extra else 0)
            day_sites = ordered_sites[site_idx:site_idx + n_sites]
            site_idx += n_sites
            
            # Build day details
            places = [s.name if hasattr(s, 'name') else str(s) for s in day_sites]
            
            # Get average sustainability score
            day_scores = []
            for s in day_sites:
                site_id = s.id if hasattr(s, 'id') else str(s)
                day_scores.append(score_map.get(site_id, 85))
            avg_score = int(sum(day_scores) / len(day_scores)) if day_scores else 85
            
            # Estimate transport and carbon
            transport = self._get_day_transport(day_sites, eco_preference)
            carbon_kg = len(day_sites) * 5 if eco_preference == 'balanced' else len(day_sites) * 3
            
            day_entry = {
                'day': day,
                'title': f"Day {day}: {places[0] if places else 'Exploration'}",
                'places': places,
                'site_details': [
                    {
                        "name": s.name if hasattr(s, "name") else str(s),
                        "best_time": s.best_time if hasattr(s, "best_time") else "Oct-Mar",
                        "specialties": s.specialties if hasattr(s, "specialties") else []
                    } for s in day_sites
                ],
                'carbon_score': avg_score,
                'transport': transport,
                'carbon_kg': carbon_kg,
                'cost': 8000 + (len(places) * 2000),
                'food': []  # Will be filled by Food Agent
            }
            
            itinerary.append(day_entry)
        
        return itinerary
    
    def _get_day_transport(self, sites: List, eco_preference: str) -> str:
        """Get recommended transport mode for a day"""
        if not sites:
            return "Walking"
        
        if eco_preference == 'eco-first':
            return "Walking + Electric Bus"
        elif eco_preference == 'comfort':
            return "Private Car"
        else:
            return "Walking + Public Transport"


# Singleton instance
itinerary_agent = ItineraryAgent()
