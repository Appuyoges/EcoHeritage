from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.agents.planner_agent import planner_agent
from app.models.api_models import TripRequest
from dotenv import load_dotenv
import os

# Import Routers
from app.api.routes import trips, heritage_sites, carbon, users, chat, community
from app.db.mongodb import connect_to_mongo, close_mongo_connection

# Load environment variables
load_dotenv()

app = FastAPI(title="EcoHeritage API", version="1.0.0")

# Database Events
app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("shutdown", close_mongo_connection)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for Docker/Dev flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(trips.router, prefix="/api/trips", tags=["Trips"])
app.include_router(heritage_sites.router, prefix="/api/sites", tags=["Heritage Sites"])
app.include_router(carbon.router, prefix="/api/carbon", tags=["Carbon Tracking"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(community.router, prefix="/api/community", tags=["Community"])

@app.get("/")
async def root():
    return {"message": "EcoHeritage API is running"}

# Legacy endpoint for backward compatibility (optional, or can be removed if frontend is fully updated)
@app.post("/api/plan-trip")
async def plan_trip(request: TripRequest):
    """
    Generate a sustainable trip plan using the multi-agent system.
    (Legacy Route)
    """
    try:
        plan = await planner_agent.plan_trip(request)
        return plan
    except Exception as e:
        print(f"Error generating plan: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
