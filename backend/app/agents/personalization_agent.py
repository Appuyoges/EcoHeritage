"""
Personalization Agent
Uses Collaborative Filtering (SVD) and BERT embeddings for personalized recommendations
"""

from typing import Dict, List, Optional
import numpy as np
import json
import os
from dataclasses import dataclass
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from app.models.domain_models import HeritageSite


class PersonalizationAgent:
    """
    Personalization Agent using:
    1. Collaborative Filtering with SVD decomposition (Simulated for now)
    2. BERT/Sentence Transformer embeddings for semantic similarity (Real)
    3. Score fusion for final ranking
    """
    
    def __init__(self):
        self.name = "Personalization Agent"
        self.data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "heritage_sites.json")
        self.heritage_sites = self._load_heritage_sites()
        
        # Load pre-trained Sentence Transformer model
        # 'all-MiniLM-L6-v2' is a small, fast model suitable for this use case
        print(f"[{self.name}] Loading Sentence Transformer model...")
        try:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            self.model_loaded = True
            print(f"[{self.name}] Model loaded successfully.")
            # Pre-compute site embeddings
            self._compute_site_embeddings()
        except Exception as e:
            print(f"[{self.name}] Failed to load model: {e}")
            self.model_loaded = False
        
    def _load_heritage_sites(self) -> List[HeritageSite]:
        """Load heritage sites data from JSON"""
        try:
            with open(self.data_path, 'r') as f:
                data = json.load(f)
                sites = []
                for item in data:
                    # Map JSON fields to HeritageSite object
                    # Calculate a simple sustainability score from metrics if not present
                    metrics = item.get('sustainability_metrics', {})
                    # Simple average of positive metrics (inverted for negative ones)
                    # This is just a placeholder; SustainabilityAgent does the real scoring
                    
                    sites.append(HeritageSite(
                        id=item['id'],
                        name=item['name'],
                        location=item['location'],
                        state=item['state'],
                        category=item['category'],
                        sustainability_score=0.85, # Default, will be updated by SustainabilityAgent
                        crowd_level="medium", # Default
                        features=item['features'],
                        description=item.get('description', ''),
                        best_time=item.get('best_time', 'Oct-Mar'),
                        specialties=item.get('specialties', [])
                    ))
                return sites
        except FileNotFoundError:
            print(f"[{self.name}] Error: Data file not found at {self.data_path}")
            return []

    def _compute_site_embeddings(self):
        """Compute embeddings for all sites based on description and features"""
        if not self.model_loaded:
            return

        print(f"[{self.name}] Computing embeddings for {len(self.heritage_sites)} sites...")
        texts = [f"{site.name} {site.description} {' '.join(site.features)}" for site in self.heritage_sites]
        embeddings = self.model.encode(texts)
        
        for site, embedding in zip(self.heritage_sites, embeddings):
            site.embedding = embedding.tolist()

    async def get_recommendations(
        self,
        destination: str,
        interests: List[str],
        travelers: int,
        top_k: int = 10
    ) -> List[HeritageSite]:
        """
        Get personalized heritage site recommendations.
        """
        print(f"[{self.name}] Getting recommendations for {destination} with interests: {interests}")
        
        # Step 1: Get candidate sites from destination
        candidates = self._get_candidate_sites(destination)
        
        if not candidates:
            print(f"[{self.name}] No candidates found for {destination}")
            return []

        # Step 2: Calculate collaborative filtering scores (simulated SVD)
        cf_scores = self._collaborative_filtering_scores(candidates, travelers)
        
        # Step 3: Calculate semantic similarity with user interests (Real BERT)
        semantic_scores = self._semantic_similarity_scores(candidates, interests)
        
        # Step 4: Fuse scores (weighted combination)
        final_scores = self._score_fusion(cf_scores, semantic_scores)
        
        # Step 5: Rank and return top-k
        ranked_sites = self._rank_sites(candidates, final_scores, top_k)
        
        return ranked_sites
    
    def _get_candidate_sites(self, destination: str) -> List[HeritageSite]:
        """Get candidate sites based on destination"""
        destination_lower = destination.lower()
        candidates = []
        
        # 1. Exact/Substring Match
        for site in self.heritage_sites:
            if site.state.lower() in destination_lower or destination_lower in site.state.lower() or \
               site.location.lower() in destination_lower or destination_lower in site.location.lower():
                candidates.append(site)
        
        # 2. Token-based Match (e.g. "Amber Fort, Jaipur" -> matches "Jaipur")
        if not candidates:
            tokens = [t.strip() for t in destination_lower.split(',')]
            for token in tokens:
                if len(token) < 3: continue # Skip short tokens
                for site in self.heritage_sites:
                    if site not in candidates and (token in site.location.lower() or token in site.state.lower()):
                        candidates.append(site)

        # If still no match, return all (fallback)
        if not candidates:
             print(f"[{self.name}] No candidates found for {destination}, returning all sites.")
             return self.heritage_sites
             
        # Limit to reasonable number to prevent timeouts (e.g. max 10 candidates)
        # return candidates[:10] 
        return candidates
    
    def _collaborative_filtering_scores(
        self, 
        sites: List[HeritageSite], 
        travelers: int
    ) -> Dict[str, float]:
        """
        Calculate collaborative filtering scores using SVD.
        Uses a seeded random simulation to mimic matrix factorization patterns.
        """
        scores = {}
        # Seed based on travelers count to give different results for different groups
        np.random.seed(42 + travelers)
        
        for site in sites:
            # Simulate latent factors
            # User factor (based on travelers count acting as user_id)
            user_factor = np.random.normal(0.7, 0.1, 5)
            
            # Item factor (simulated from site id hash)
            site_hash = hash(site.id) % 1000
            np.random.seed(site_hash)
            item_factor = np.random.normal(0.7, 0.1, 5)
            
            # Predict rating (dot product)
            # Normalize to 0-1 range
            raw_score = np.dot(user_factor, item_factor)
            normalized_score = 1 / (1 + np.exp(-raw_score)) # Sigmoid
            
            # Boost popoular sites slightly
            if "World Heritage" in site.features:
                normalized_score += 0.1
                
            scores[site.id] = min(0.99, max(0.1, normalized_score))
            
        return scores
    
    def _semantic_similarity_scores(
        self, 
        sites: List[HeritageSite], 
        interests: List[str]
    ) -> Dict[str, float]:
        """
        Calculate semantic similarity between user interests and site features.
        Uses real BERT embeddings.
        """
        scores = {}
        
        if not self.model_loaded:
            # Fallback to simple keyword matching if model fails
            print(f"[{self.name}] Model not loaded, falling back to keyword matching")
            interests_set = set(i.lower() for i in interests)
            for site in sites:
                site_features = set(f.lower() for f in site.features)
                intersection = len(interests_set & site_features)
                union = len(interests_set | site_features)
                scores[site.id] = intersection / union if union > 0 else 0
            return scores

        # Encode user interests into a single query vector
        query_text = " ".join(interests)
        query_embedding = self.model.encode([query_text])[0]
        
        for site in sites:
            if site.embedding:
                # Calculate cosine similarity
                sim = cosine_similarity([query_embedding], [site.embedding])[0][0]
                scores[site.id] = float(sim)
            else:
                scores[site.id] = 0.0
            
        return scores
    
    def _score_fusion(
        self, 
        cf_scores: Dict[str, float], 
        semantic_scores: Dict[str, float],
        cf_weight: float = 0.3,
        semantic_weight: float = 0.7
    ) -> Dict[str, float]:
        """
        Fuse collaborative filtering and semantic similarity scores.
        """
        final_scores = {}
        
        for site_id in cf_scores:
            cf = cf_scores.get(site_id, 0)
            semantic = semantic_scores.get(site_id, 0)
            
            # Weighted fusion
            final_scores[site_id] = (cf_weight * cf) + (semantic_weight * semantic)
            
        return final_scores
    
    def _rank_sites(
        self, 
        sites: List[HeritageSite], 
        scores: Dict[str, float],
        top_k: int
    ) -> List[HeritageSite]:
        """Rank sites by final scores and return top-k"""
        site_score_pairs = [(site, scores.get(site.id, 0)) for site in sites]
        site_score_pairs.sort(key=lambda x: x[1], reverse=True)
        
        return [site for site, score in site_score_pairs[:top_k]]


# Singleton instance
personalization_agent = PersonalizationAgent()
