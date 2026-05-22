"""
Heritage Sites API Routes
"""

from fastapi import APIRouter, HTTPException, Query, Request, Depends
from typing import List, Optional
import re
from app.db.mongodb import get_database

router = APIRouter()



@router.get("/")
async def get_all_sites(
    search: Optional[str] = Query(None, description="Search by name, location, or description"),
    region: Optional[str] = Query(None, description="Filter by region (north, south, east, west, central, northeast)"),
    crowd_level: Optional[str] = Query(None, description="Filter by crowd level"),
    min_sustainability: Optional[int] = Query(None, description="Minimum sustainability score"),
    sort_by: Optional[str] = Query("sustainability", description="Sort by field (sustainability, rating, reviews)"),
    db = Depends(get_database)
):
    """Get all heritage sites with advanced filtering from MongoDB"""
    # db is already the database object
    query = {}
    
    # Text Search
    if search:
        query["$text"] = {"$search": search}
    
    # Precise Filters
    if region:
        query["region"] = region.lower()
    
    if crowd_level:
        query["crowd_level"] = crowd_level.lower()
    
    if min_sustainability:
        query["sustainability"] = {"$gte": min_sustainability}
    
    # Pagination & Sorting
    sort_field = "sustainability" if sort_by == "sustainability" else ("rating" if sort_by == "rating" else "reviews")
    
    cursor = db.heritage_sites.find(query).sort(sort_field, -1)
    sites = await cursor.to_list(length=100)
    
    # Clean up _id for frontend compatibility
    for site in sites:
        if "_id" in site:
            site["_id"] = str(site["_id"])
            
    return {"sites": sites, "total": len(sites)}


@router.get("/{site_id}")
async def get_site_by_id(site_id: str, db = Depends(get_database)):
    """Get a single heritage site by ID/Slug"""
    site = await db.heritage_sites.find_one({"id": site_id})
    
    if not site:
        # Try search by mongo _id if it looks like one, but normally we use our custom "id"
        raise HTTPException(status_code=404, detail="Site not found")
    
    if "_id" in site:
        site["_id"] = str(site["_id"])
    return site


@router.get("/recommendations/eco")
async def get_eco_recommendations(limit: int = 5, db = Depends(get_database)):
    """Get most sustainable heritage sites from DB"""
    cursor = db.heritage_sites.find({}).sort("sustainability", -1).limit(limit)
    recommendations = await cursor.to_list(length=limit)
    
    for r in recommendations: r["_id"] = str(r["_id"])
    return {"recommendations": recommendations}


@router.get("/recommendations/offbeat")
async def get_offbeat_recommendations(limit: int = 5, db = Depends(get_database)):
    """Get less crowded, hidden gem sites from DB"""
    cursor = db.heritage_sites.find({"crowd_level": "low"}).sort("rating", -1).limit(limit)
    offbeat = await cursor.to_list(length=limit)
    
    for o in offbeat: o["_id"] = str(o["_id"])
    return {"recommendations": offbeat}
