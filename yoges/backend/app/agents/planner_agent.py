"""
Planner Agent - Central Orchestrator
Coordinates all other agents to generate optimized travel plans
"""

from typing import Dict, List, Optional
from pydantic import BaseModel
from datetime import datetime

from .personalization_agent import PersonalizationAgent
from .sustainability_agent import SustainabilityAgent
from .itinerary_agent import ItineraryAgent
from .food_agent import FoodAgent
from .budget_agent import BudgetAgent
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser


from app.models.api_models import TripRequest, TripPlan


class PlannerAgent:
    """
    Central Planner Agent - Coordinates all specialized agents
    to generate personalized, sustainable travel itineraries.
    """
    
    def __init__(self):
        self.personalization_agent = PersonalizationAgent()
        self.sustainability_agent = SustainabilityAgent()
        self.itinerary_agent = ItineraryAgent()
        self.food_agent = FoodAgent()
        self.budget_agent = BudgetAgent()
        # Import dynamically to avoid circular imports if any
        from .crew_agent import crew_supervisor
        self.crew_supervisor = crew_supervisor
        
        self.name = "Planner Agent"
        self.api_key = os.getenv("GOOGLE_API_KEY")
        
        if self.api_key:
            self.llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=self.api_key)
        else:
            print(f"[{self.name}] Warning: GOOGLE_API_KEY not found. Running in mock mode.")
            self.llm = None
        
    async def plan_trip(self, request: TripRequest) -> TripPlan:
        """
        Main orchestration method - coordinates all agents to generate a trip plan.
        """
        
        # Step 1: Get personalized recommendations
        print(f"[{self.name}] Starting trip planning for {request.destination}")
        personalized_sites = await self.personalization_agent.get_recommendations(
            destination=request.destination,
            interests=request.interests,
            travelers=request.travelers
        )
        print(f"[{self.name}] Got {len(personalized_sites)} personalized recommendations")
        
        # Step 2: Score for sustainability
        scored_sites = await self.sustainability_agent.score_sites(
            sites=personalized_sites,
            eco_preference=request.eco_preference
        )
        print(f"[{self.name}] Sustainability scoring complete")
        
        # Step 3: Optimize itinerary
        days = self._calculate_days(request.start_date, request.end_date)
        optimized_route = await self.itinerary_agent.optimize_route(
            sites=scored_sites,
            days=days,
            eco_preference=request.eco_preference
        )
        print(f"[{self.name}] Route optimized using ACO algorithm")
        
        # Step 4: Add food recommendations
        itinerary_with_food = await self.food_agent.add_food_recommendations(
            itinerary=optimized_route,
            food_preference=request.food_preference,
            destination=request.destination
        )
        print(f"[{self.name}] Food recommendations added")
        
        # Step 5: Calculate budget
        final_itinerary = await self.budget_agent.estimate_costs(
            itinerary=itinerary_with_food,
            budget_type=request.budget_type,
            travelers=request.travelers
        )
        print(f"[{self.name}] Budget estimation complete")

        # Step 5.5: Add local activities
        for day in final_itinerary:
            day['activities'] = [
                "Local Handicraft Workshop",
                "Heritage Photo Walk",
                "Evening Cultural Performance"
            ]
        
        # Calculate overall metrics
        total_carbon = self._calculate_carbon_savings(final_itinerary)
        sustainability_score = self._calculate_sustainability_score(final_itinerary)
        total_cost = self._calculate_total_cost(final_itinerary)
        
        # Step 6: CrewAI Audit
        plan_data = {
            "destination": request.destination,
            "sustainability_score": sustainability_score,
            "carbon_saved": f"{total_carbon} kg",
            "days": final_itinerary
        }
        
        audit_result = await self.crew_supervisor.audit_plan(plan_data)
        print(f"[{self.name}] Audit Result: {audit_result.get('status')} - {audit_result.get('feedback')}")
        
        # Step 7: Final Synthesis with Gemini (if available)
        final_narrative = await self._synthesize_narrative(request, plan_data, audit_result)
        
        return TripPlan(
            destination=request.destination,
            summary=final_narrative,
            crowd_metric="Low (Off-Peak)" if "Feb" in request.start_date or "Sep" in request.start_date else "Medium",
            total_days=days,
            carbon_saved=f"{total_carbon} kg",
            sustainability_score=sustainability_score,
            estimated_cost=f"₹{total_cost:,}",
            days=final_itinerary
        )
    
    async def _synthesize_narrative(self, request: TripRequest, plan: Dict, audit: Dict) -> str:
        """Use Gemini to generate a warm, welcoming summary of the trip"""
        if not self.llm:
            return f"Welcome to your eco-friendly trip to {request.destination}! We've optimized your route to save {plan['carbon_saved']} of CO2."
            
        try:
            prompt = ChatPromptTemplate.from_template("""
            You are an expert sustainable travel planner. Write a short, inspiring welcome message for this trip.
            
            Trip Details:
            Destination: {destination}
            Travelers: {travelers}
            Interests: {interests}
            Sustainability Score: {score}/100
            Carbon Saved: {carbon_saved}
            Audit Status: {audit_status}
            
            Write a captivating, personalized summary (max 2 sentences).
            Mention the specific carbon savings and how their choice makes a difference. 
            Tone: Enthusiastic and Eco-conscious.
            """)
            
            chain = prompt | self.llm | StrOutputParser()
            return await chain.ainvoke({
                "destination": request.destination,
                "travelers": request.travelers,
                "interests": ", ".join(request.interests),
                "score": plan['sustainability_score'],
                "carbon_saved": plan['carbon_saved'],
                "audit_status": audit.get('status')
            })
        except Exception as e:
            print(f"[{self.name}] Synthesis failed: {e}")
            return "Enjoy your sustainable journey!"

    def _calculate_days(self, start_date: str, end_date: str) -> int:
        """Calculate number of days between dates"""
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d")
            end = datetime.strptime(end_date, "%Y-%m-%d")
            return max(1, (end - start).days + 1)
        except:
            return 5  # Default to 5 days
    
    def _calculate_carbon_savings(self, itinerary: List[Dict]) -> int:
        """Calculate total carbon savings compared to average tourist (approx 45kg/day for car+hotel)"""
        days = len(itinerary)
        avg_emission = days * 45 
        our_emission = sum(day.get('carbon_kg', 8) for day in itinerary)
        return max(0, int(avg_emission - our_emission))
    
    def _calculate_sustainability_score(self, itinerary: List[Dict]) -> int:
        """Calculate overall sustainability score (0-100)"""
        if not itinerary:
            return 0
        scores = [day.get('carbon_score', 85) for day in itinerary]
        return int(sum(scores) / len(scores))
    
    def _calculate_total_cost(self, itinerary: List[Dict]) -> int:
        """Calculate total estimated cost"""
        return sum(day.get('cost', 10000) for day in itinerary)


# Singleton instance
planner_agent = PlannerAgent()
