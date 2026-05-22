"""
AI Chat API Routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
import json
import re

from fastapi import APIRouter, HTTPException, Depends
from app.db.mongodb import get_database

router = APIRouter()

# Initialize Gemini Model
# We assume GOOGLE_API_KEY is in os.environ via load_dotenv in main.py
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.7,
    max_output_tokens=400, # Limit response length for speed
    convert_system_message_to_human=True
)

class ChatMessage(BaseModel):
    """Chat message model"""
    role: str  # 'user' or 'assistant'
    content: str


class ChatRequest(BaseModel):
    """Chat request model"""
    message: str
    history: List[ChatMessage] = []
    context: Optional[dict] = None


class ChatResponse(BaseModel):
    """Chat response model"""
    response: str
    suggestions: List[str]
    trip_data: Optional[dict] = None




SYSTEM_PROMPT = """You are EcoHeritage, a smart and sustainable travel assistant. 
Your goal is to help users plan eco-friendly trips to heritage sites in India and globally.

Key Guidelines:
1. Prioritize **sustainability**: Suggest trains over flights, eco-lodges, and walking tours.
2. Focus on **heritage**: Highlight history, culture, and architecture.
3. Be **concise** but helpful. Use formatting (bullet points, bold text) for readability.
4. If the user asks about specific locations (e.g., "Chennai"), provide concrete heritage sites and eco-tips for that place.
5. **Personalize**: If user context is provided (name, level, points), acknowledge their progress and tailor suggestions to their experience.
6. Suggest **3 follow-up questions** or actions at the end.
7. **Structured Data**: If the user asks for a specific trip plan (e.g., "Plan a trip to Kerala"), ONLY IF you have enough info, verify you include a JSON block at the end of your response in this EXACT format:
```json
{
  "type": "trip_plan",
  "destination": "Kerala",
  "duration": "5 Days",
  "budget": "Standard",
  "eco_score": 95,
  "highlights": ["Aleppey Houseboat", "Munnar Tea Gardens", "Fort Kochi"]
}
```
Do not output the JSON if you are just chatting or verifying details.
```
Do not output the JSON if you are just chatting or verifying details.
"""

def get_contextual_prompt(context: Optional[dict] = None, site_context: str = "") -> str:
    prompt = SYSTEM_PROMPT
    if site_context:
        prompt += f"\n\nREAL-TIME DATABASE KNOWLEDGE:\n{site_context}\n(Use these facts to answer accurately about specific sites)"

    if context:
        prompt += f"\n\nCURRENT USER CONTEXT:\n"
        if "name" in context: prompt += f"- Name: {context['name']}\n"
        if "level" in context: prompt += f"- Expertise Level: {context['level']}\n"
        if "green_points" in context: prompt += f"- Green Points: {context['green_points']}\n"
        if "carbon_saved" in context: prompt += f"- Total CO2 Saved: {context['carbon_saved']}\n"
        prompt += "\nUse this context to make your response feel personal and rewarding. For example, congratulate them on their CO2 savings if relevant."
    else:
        prompt += "\n\nCurrent context: The user is interested in sustainable heritage tourism."
    return prompt


@router.post("/message", response_model=ChatResponse)

async def send_message(request: ChatRequest, db=Depends(get_database)):
    """
    Chat with the AI Assistant (Gemini Powered)
    """
    try:
        # --- RAG SEARCH ---
        site_context = ""
        try:
            # 1. Detect keywords (naive approach for now, relies on text index)
            # Find relevant sites in DB based on message content
            cursor = db.heritage_sites.find({"$text": {"$search": request.message}}).limit(3)
            found_sites = await cursor.to_list(length=3)
            
            if found_sites:
                site_context = "Here is verified information from our database about the requested locations:\n"
                for site in found_sites:
                    site_context += f"- Name: {site.get('name')}\n"
                    site_context += f"  Location: {site.get('location')}\n"
                    site_context += f"  Sustainability Score: {site.get('sustainability')}/100\n"
                    site_context += f"  Best Time: {site.get('best_time')}\n"
                    site_context += f"  Description: {site.get('description')}\n"
                    site_context += f"  Eco-Tips: {', '.join(site.get('eco_tips', []))}\n\n"
        except Exception as db_err:
            print(f"RAG Search failed (ignoring): {db_err}")

        # Construct message history with contextual prompt + RAG data
        prompt = get_contextual_prompt(request.context, site_context)
        messages = [SystemMessage(content=prompt)]
        
        # Add conversation history
        for msg in request.history[-5:]: # Keep last 5 messages for context
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.content))
            else:
                messages.append(AIMessage(content=msg.content))
        
        # Add current message
        messages.append(HumanMessage(content=request.message))

        # Get response from LLM
        response = await llm.ainvoke(messages)
        ai_content = response.content
        
        # Extract structured JSON if present
        trip_data = None
        json_match = re.search(r'```json\s*(\{.*?\})\s*```', ai_content, re.DOTALL)
        if json_match:
            try:
                json_str = json_match.group(1)
                trip_data = json.loads(json_str)
                # Remove the JSON block from the visible response to keep it clean
                ai_content = re.sub(r'```json\s*\{.*?\}\s*```', '', ai_content, flags=re.DOTALL).strip()
            except Exception as e:
                print(f"JSON Parse Error: {e}")

        # Generate dynamic suggestions based on the response
        suggestions = ["Plan this trip", "Save Itinerary", "Cost Breakdown"]
        if trip_data:
             suggestions = ["Book with Eco-Travel", "View Full Itinerary", "Share Plan"]
        
        return ChatResponse(
            response=ai_content,
            suggestions=suggestions,
            trip_data=trip_data
        )

    except Exception as e:
        print(f"AI Error: {e}")
        # Fallback to simple logic if AI fails
        return ChatResponse(
            response="I'm having trouble connecting to my brain right now. 🧠\n\nBut I'd love to help you plan a trip to **Rajasthan**, **Kerala**, or **Hampi**!",
            suggestions=["Explore Rajasthan", "Visit Hampi", "Kerala Backwaters"]
        )


@router.post("/plan-from-chat")
async def plan_from_chat(request: ChatRequest):
    """Generate a trip plan from natural language"""
    message = request.message.lower()
    
    # Extract destination
    destinations = {
        "rajasthan": ["rajasthan", "jaipur", "udaipur", "jodhpur", "pushkar"],
        "karnataka": ["karnataka", "hampi", "mysore", "bangalore"],
        "uttar pradesh": ["agra", "varanasi", "taj mahal", "lucknow"],
        "madhya pradesh": ["khajuraho", "orchha", "sanchi"],
        "kerala": ["kerala", "kochi", "alleppey", "munnar"]
    }
    
    detected_dest = "Rajasthan"  # Default
    for dest, keywords in destinations.items():
        if any(kw in message for kw in keywords):
            detected_dest = dest.title()
            break
    
    # Extract number of days
    days_match = re.search(r'(\d+)\s*(?:days?|nights?)', message)
    num_days = int(days_match.group(1)) if days_match else 5
    
    # Extract budget
    budget_match = re.search(r'₹?\s*(\d+[,\d]*)', message)
    if budget_match:
        budget = int(budget_match.group(1).replace(',', ''))
        budget_type = "budget" if budget < 30000 else ("premium" if budget > 60000 else "standard")
    else:
        budget_type = "standard"
    
    return {
        "interpreted": {
            "destination": detected_dest,
            "days": num_days,
            "budget_type": budget_type
        },
        "response": f"I'll help you plan a {num_days}-day trip to {detected_dest}! Let me create a personalized, eco-friendly itinerary for you.",
        "next_step": "confirm_trip",
        "suggestions": ["Confirm and generate", "Change destination", "Adjust days"]
    }


@router.get("/suggestions")
async def get_suggestions():
    """Get suggested conversation starters"""
    return {
        "suggestions": [
            {"icon": "MapPin", "text": "Plan a heritage trip to Karnataka"},
            {"icon": "Leaf", "text": "Most eco-friendly destinations in India"},
            {"icon": "Calendar", "text": "Best time to visit Taj Mahal"},
            {"icon": "Wallet", "text": "Budget trip to Rajasthan under ₹30,000"},
            {"icon": "Users", "text": "Family-friendly heritage sites"},
            {"icon": "Camera", "text": "Best photography spots in India"}
        ]
    }
