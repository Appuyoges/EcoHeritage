"""
Sustainability Agent
Uses TOPSIS multi-criteria decision-making for sustainability scoring
"""

from typing import Dict, List, Tuple
import numpy as np
from dataclasses import dataclass


from app.models.domain_models import SustainabilityMetrics, HeritageSite


class SustainabilityAgent:
    """
    Sustainability Agent using TOPSIS (Technique for Order of Preference 
    by Similarity to Ideal Solution) for multi-criteria sustainability scoring.
    
    Criteria (with weights):
    - Carbon Footprint (negative, 25%)
    - Crowd Density (negative, 15%)
    - Eco Infrastructure (positive, 20%)
    - Conservation Status (positive, 15%)
    - Local Community Impact (positive, 15%)
    - Water Usage (negative, 5%)
    - Waste Management (positive, 5%)
    
    TOPSIS Algorithm:
    1. Normalize the decision matrix
    2. Apply weights to criteria
    3. Determine ideal best and worst solutions
    4. Calculate distance to ideal solutions
    5. Calculate relative closeness (sustainability score)
    """
    
    def __init__(self):
        self.name = "Sustainability Agent"
        
        # Weights for each criterion (must sum to 1)
        self.weights = {
            'carbon_footprint': 0.25,
            'crowd_density': 0.15,
            'eco_infrastructure': 0.20,
            'conservation_status': 0.15,
            'local_impact': 0.15,
            'water_usage': 0.05,
            'waste_management': 0.05
        }
        
        # Whether higher is better (True) or lower is better (False)
        self.criteria_direction = {
            'carbon_footprint': False,  # Lower carbon is better
            'crowd_density': False,      # Less crowded is better
            'eco_infrastructure': True,  # More eco facilities is better
            'conservation_status': True, # Better conserved is better
            'local_impact': True,        # More local benefit is better
            'water_usage': False,        # Less water usage is better
            'waste_management': True     # Better waste management is better
        }
        
        # Site sustainability data (simulated)
        self.site_metrics = self._load_site_metrics()
    
    def _load_site_metrics(self) -> Dict[str, SustainabilityMetrics]:
        """Load sustainability metrics for heritage sites"""
        return {
            # Rajasthan
            "raj_01": SustainabilityMetrics(12.0, 0.7, 0.6, 0.8, 0.7, 0.4, 0.6),
            "raj_02": SustainabilityMetrics(8.0, 0.5, 0.7, 0.85, 0.8, 0.3, 0.7),
            "raj_03": SustainabilityMetrics(8.5, 0.5, 0.75, 0.8, 0.75, 0.35, 0.65),
            "raj_04": SustainabilityMetrics(7.5, 0.3, 0.8, 0.9, 0.85, 0.2, 0.8),
            "raj_05": SustainabilityMetrics(9.0, 0.3, 0.85, 0.88, 0.9, 0.25, 0.75),
            "raj_06": SustainabilityMetrics(10.0, 0.4, 0.9, 0.85, 0.95, 0.3, 0.85),
            "raj_07": SustainabilityMetrics(11.0, 0.5, 0.7, 0.82, 0.8, 0.4, 0.7),
            "raj_08": SustainabilityMetrics(6.0, 0.45, 0.8, 0.9, 0.88, 0.35, 0.8),
            
            # Karnataka
            "kar_01": SustainabilityMetrics(5.0, 0.2, 0.95, 0.95, 0.9, 0.15, 0.9),
            "kar_02": SustainabilityMetrics(4.5, 0.25, 0.9, 0.92, 0.88, 0.2, 0.85),
            "kar_03": SustainabilityMetrics(4.8, 0.2, 0.92, 0.94, 0.9, 0.18, 0.88),
            "kar_04": SustainabilityMetrics(8.0, 0.55, 0.75, 0.85, 0.8, 0.3, 0.75),
            "kar_05": SustainabilityMetrics(5.5, 0.15, 0.88, 0.9, 0.92, 0.12, 0.85),
            
            # Uttar Pradesh
            "up_01": SustainabilityMetrics(15.0, 0.9, 0.5, 0.75, 0.6, 0.6, 0.5),
            "up_02": SustainabilityMetrics(10.0, 0.6, 0.6, 0.8, 0.7, 0.45, 0.6),
            "up_03": SustainabilityMetrics(18.0, 0.85, 0.4, 0.65, 0.5, 0.7, 0.4),
            "up_04": SustainabilityMetrics(7.0, 0.25, 0.85, 0.88, 0.85, 0.2, 0.8),
            
            # Madhya Pradesh
            "mp_01": SustainabilityMetrics(6.0, 0.2, 0.9, 0.92, 0.88, 0.15, 0.9),
            "mp_02": SustainabilityMetrics(5.5, 0.15, 0.92, 0.95, 0.9, 0.12, 0.92),
            "mp_03": SustainabilityMetrics(5.0, 0.1, 0.95, 0.93, 0.95, 0.1, 0.88),
            
            # Maharashtra
            "mh_01": SustainabilityMetrics(6.5, 0.2, 0.9, 0.92, 0.88, 0.18, 0.88),
            "mh_02": SustainabilityMetrics(7.0, 0.25, 0.88, 0.9, 0.85, 0.2, 0.85),
        }
    
    async def score_sites(
        self,
        sites: List[HeritageSite],  # List of HeritageSite objects
        eco_preference: str  # 'eco-first', 'balanced', 'comfort'
    ) -> List[Tuple]:
        """
        Score heritage sites for sustainability using TOPSIS.
        
        Args:
            sites: List of HeritageSite objects
            eco_preference: User's eco preference level
            
        Returns:
            List of (site, sustainability_score) tuples, sorted by score
        """
        print(f"[{self.name}] Scoring {len(sites)} sites for sustainability")
        
        # Adjust weights based on eco preference
        adjusted_weights = self._adjust_weights(eco_preference)
        
        # Build decision matrix
        decision_matrix, site_ids = self._build_decision_matrix(sites)
        
        if len(decision_matrix) == 0:
            return [(site, 85) for site in sites]  # Default score
        
        # Apply TOPSIS algorithm
        scores = self._topsis(decision_matrix, adjusted_weights)
        
        # Map scores back to sites
        scored_sites = []
        for i, site in enumerate(sites):
            site_id = site.id if hasattr(site, 'id') else f"site_{i}"
            if site_id in site_ids:
                idx = site_ids.index(site_id)
                score = int(scores[idx] * 100)  # Convert to 0-100
            else:
                score = 85  # Default
            scored_sites.append((site, score))
        
        # Sort by score descending
        scored_sites.sort(key=lambda x: x[1], reverse=True)
        
        return scored_sites
    
    def _adjust_weights(self, eco_preference: str) -> Dict[str, float]:
        """Adjust weights based on user's eco preference"""
        weights = self.weights.copy()
        
        if eco_preference == 'eco-first':
            # Increase eco-related weights
            weights['carbon_footprint'] = 0.35
            weights['eco_infrastructure'] = 0.25
            weights['crowd_density'] = 0.10
        elif eco_preference == 'comfort':
            # Reduce eco weights, increase comfort
            weights['carbon_footprint'] = 0.15
            weights['eco_infrastructure'] = 0.15
            weights['crowd_density'] = 0.20
        # 'balanced' uses default weights
        
        # Normalize to ensure sum = 1
        total = sum(weights.values())
        return {k: v/total for k, v in weights.items()}
    
    def _build_decision_matrix(self, sites: List) -> Tuple[np.ndarray, List[str]]:
        """Build the decision matrix for TOPSIS"""
        site_ids = []
        matrix_rows = []
        
        for site in sites:
            site_id = site.id if hasattr(site, 'id') else None
            if site_id and site_id in self.site_metrics:
                metrics = self.site_metrics[site_id]
                row = [
                    metrics.carbon_footprint,
                    metrics.crowd_density,
                    metrics.eco_infrastructure,
                    metrics.conservation_status,
                    metrics.local_impact,
                    metrics.water_usage,
                    metrics.waste_management
                ]
                matrix_rows.append(row)
                site_ids.append(site_id)
        
        if not matrix_rows:
            return np.array([]), []
            
        return np.array(matrix_rows), site_ids
    
    def _topsis(self, matrix: np.ndarray, weights: Dict[str, float]) -> np.ndarray:
        """
        Apply TOPSIS algorithm to calculate sustainability scores.
        
        Steps:
        1. Normalize matrix
        2. Apply weights
        3. Find ideal best and worst
        4. Calculate distances
        5. Calculate relative closeness
        """
        if matrix.size == 0:
            return np.array([])
            
        # Step 1: Normalize using vector normalization
        norm_divisor = np.sqrt(np.sum(matrix ** 2, axis=0))
        norm_divisor[norm_divisor == 0] = 1  # Avoid division by zero
        normalized = matrix / norm_divisor
        
        # Step 2: Apply weights
        weight_array = np.array([
            weights['carbon_footprint'],
            weights['crowd_density'],
            weights['eco_infrastructure'],
            weights['conservation_status'],
            weights['local_impact'],
            weights['water_usage'],
            weights['waste_management']
        ])
        weighted = normalized * weight_array
        
        # Step 3: Find ideal best (A+) and worst (A-)
        directions = [
            self.criteria_direction['carbon_footprint'],
            self.criteria_direction['crowd_density'],
            self.criteria_direction['eco_infrastructure'],
            self.criteria_direction['conservation_status'],
            self.criteria_direction['local_impact'],
            self.criteria_direction['water_usage'],
            self.criteria_direction['waste_management']
        ]
        
        ideal_best = np.zeros(weighted.shape[1])
        ideal_worst = np.zeros(weighted.shape[1])
        
        for i, is_benefit in enumerate(directions):
            if is_benefit:
                ideal_best[i] = np.max(weighted[:, i])
                ideal_worst[i] = np.min(weighted[:, i])
            else:
                ideal_best[i] = np.min(weighted[:, i])
                ideal_worst[i] = np.max(weighted[:, i])
        
        # Step 4: Calculate Euclidean distances
        dist_to_best = np.sqrt(np.sum((weighted - ideal_best) ** 2, axis=1))
        dist_to_worst = np.sqrt(np.sum((weighted - ideal_worst) ** 2, axis=1))
        
        # Step 5: Calculate relative closeness (sustainability score)
        total_dist = dist_to_best + dist_to_worst
        total_dist[total_dist == 0] = 1  # Avoid division by zero
        
        scores = dist_to_worst / total_dist
        
        return scores
    
    def calculate_carbon_emission(
        self,
        transport_mode: str,
        distance_km: float
    ) -> float:
        """
        Calculate CO2 emissions for a transport mode.
        
        Carbon emission factors (kg CO2 per km per person):
        - Walking: 0
        - Cycling: 0
        - Electric Bus: 0.03
        - Train: 0.04
        - Bus: 0.08
        - Car (shared): 0.12
        - Car (solo): 0.20
        - Flight: 0.25
        """
        emission_factors = {
            'walking': 0.0,
            'cycling': 0.0,
            'electric_bus': 0.03,
            'train': 0.04,
            'bus': 0.08,
            'car_shared': 0.12,
            'car': 0.20,
            'flight': 0.25
        }
        
        factor = emission_factors.get(transport_mode.lower(), 0.15)
        return round(distance_km * factor, 2)


# Singleton instance
sustainability_agent = SustainabilityAgent()
