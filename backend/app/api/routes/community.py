from fastapi import APIRouter, Depends, HTTPException, Header, Request
from typing import List, Optional
from app.db.mongodb import get_database
from app.models.community_models import Post, PostCreate, CommentCreate, UserShort, Comment
from datetime import datetime
import uuid

router = APIRouter()

# Dependency to get current user from header (Simulation for Demo)
async def get_current_user(x_user_id: Optional[str] = Header(None), db=Depends(get_database)):
    if not x_user_id:
        # Default fallback if no header
        x_user_id = "user_123" 
    
    user_data = await db.users.find_one({"id": x_user_id})
    if not user_data:
         # Fallback mock if DB lookup fails (shouldn't happen with seed)
        return UserShort(
            id="user_123",
            name="Guest User",
            avatar="https://i.pravatar.cc/150",
            level="Eco Explorer"
        )
    
    return UserShort(
        id=user_data["id"],
        name=user_data["name"],
        avatar=user_data.get("avatar", "https://i.pravatar.cc/150"),
        level=user_data.get("level", "Eco Explorer")
    )

@router.get("/posts", response_model=dict)
async def get_posts(sort_by: str = "latest", db=Depends(get_database)):
    """
    Get community posts feed.
    sort_by: 'latest' (default) or 'trending'
    """
    import traceback
    try:
        sort_field = "created_at"
        if sort_by == "trending":
            sort_field = "likes"
            
        cursor = db.posts.find({}).sort(sort_field, -1).limit(50)
        posts = await cursor.to_list(length=50)
        
        # Transform for frontend
        cleaned_posts = []
        for p in posts:
            p["id"] = str(p.get("_id"))
             # Fix serialization error by removing ObjectId
            if "_id" in p: del p["_id"]
            
            if "comments" not in p or not isinstance(p["comments"], list): p["comments"] = []
            p["comments_count"] = len(p["comments"])
            cleaned_posts.append(p)
            
        return {"posts": cleaned_posts}
    except Exception as e:
        print(f"ERROR in get_posts: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/posts")
async def create_post(
    post: PostCreate, 
    current_user: UserShort = Depends(get_current_user),
    db=Depends(get_database)
):
    """Create a new community post"""
    new_post_dict = post.model_dump()
    new_post_dict.update({
        "user": current_user.model_dump(),
        "likes": 0,
        "comments": [],
        "created_at": datetime.now()
    })
    
    result = await db.posts.insert_one(new_post_dict)
    
    # GAMIFICATION: Award points for posting
    await db.users.update_one(
        {"id": current_user.id},
        {"$inc": {"green_points": 50}}
    )
    
    # Return created post
    created_post = await db.posts.find_one({"_id": result.inserted_id})
    created_post["id"] = str(created_post.pop("_id"))
    created_post["comments_count"] = 0
    
    return {"message": "Post created (+50 Points)", "post": created_post}

@router.post("/posts/{post_id}/like")
async def like_post(
    post_id: str, 
    current_user: UserShort = Depends(get_current_user), 
    db=Depends(get_database)
):
    """Like a post and reward author"""
    from bson import ObjectId
    try:
        pid = ObjectId(post_id)
        
        # 1. Update Post Likes
        result = await db.posts.find_one_and_update(
            {"_id": pid},
            {"$inc": {"likes": 1}},
            return_document=True
        )
        
        # 2. Reward Author (if exists)
        if result and "user" in result and "id" in result["user"]:
            author_id = result["user"]["id"]
            # Prevent self-liking abuse
            if author_id != current_user.id:
                await db.users.update_one(
                    {"id": author_id},
                    {"$inc": {"green_points": 10}}
                )
                
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid ID")

@router.post("/posts/{post_id}/comment")
async def add_comment(
    post_id: str, 
    comment: CommentCreate, 
    current_user: UserShort = Depends(get_current_user),
    db=Depends(get_database)
):
    """Add a comment to a post"""
    from bson import ObjectId
    try:
        pid = ObjectId(post_id)
        
        new_comment = Comment(
            user=current_user,
            content=comment.content
        )
        
        await db.posts.update_one(
            {"_id": pid},
            {"$push": {"comments": new_comment.model_dump()}}
        )
        return {"success": True, "comment": new_comment}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid ID")

@router.delete("/posts/{post_id}")
async def delete_post(
    post_id: str,
    current_user: UserShort = Depends(get_current_user),
    db=Depends(get_database)
):
    """Delete a post if the current user is the author"""
    from bson import ObjectId
    try:
        pid = ObjectId(post_id)
        post = await db.posts.find_one({"_id": pid})
        
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
            
        # Verify ownership
        if post["user"]["id"] != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this post")
            
        await db.posts.delete_one({"_id": pid})
        return {"success": True, "message": "Post deleted"}
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid Request")
