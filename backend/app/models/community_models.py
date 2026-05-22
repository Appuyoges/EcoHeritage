from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class UserShort(BaseModel):
    """Minimal user info for embedding in posts"""
    id: str  # Added ID for linking
    name: str
    avatar: str
    level: str = "Eco Explorer"

class Comment(BaseModel):
    """Comment model"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user: UserShort
    content: str
    created_at: datetime = Field(default_factory=datetime.now)

class PostBase(BaseModel):
    """Base fields for a post"""
    content: str
    location: Optional[str] = None
    tags: List[str] = []
    image: Optional[str] = None

class PostCreate(PostBase):
    """Model for creating a post"""
    pass

class Post(PostBase):
    """Full post model stored in DB"""
    id: str
    user: UserShort
    likes: int = 0
    comments: List[Comment] = []
    created_at: datetime

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class CommentCreate(BaseModel):
    """Model for adding a comment"""
    content: str
