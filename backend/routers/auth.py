# backend/routers/auth.py
from fastapi import APIRouter, Response, Depends, HTTPException
from backend.models.user import User
from backend.schemas.user import user_serializer
from backend.database.db import db
from bson import ObjectId
from passlib.context import CryptContext

auth_router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@auth_router.post("/signup")
async def signup(user: User):
    user_dict = user.dict()
    user_dict["password"] = pwd_context.hash(user_dict["password"])
    
    # Check if user already exists
    if db.users.find_one({"email": user_dict["email"]}):
        raise HTTPException(status_code=400, detail="Email already registered")

    db.users.insert_one(user_dict)
    return {"message": "User created successfully"}

@auth_router.post("/login")
async def login(user: User):
    db_user = db.users.find_one({"email": user.email})
    if not db_user or not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # In a real app, you would return a JWT token here.
    # For now, we'll just return a success message.
    return {"message": "Login successful", "user_id": str(db_user["_id"])}

# This is a placeholder for a protected route
@auth_router.get("/me/{user_id}")
async def get_me(user_id: str):
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user_serializer(user)