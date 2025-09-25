from fastapi import APIRouter, HTTPException, Depends
from backend.models.resume import MasterResume
from backend.schemas.resume import resume_serializer
from backend.database.db import db
from bson import ObjectId

# This is a placeholder for a dependency that would get the current user
# In a real app, this would come from a JWT token
def get_current_user_id():
    # For now, we'll hardcode a user_id for testing purposes.
    # This will be replaced with actual user auth later.
    return "60c72b9f9b1d8c001f8e4c8a" # Replace with a valid user_id from your db

resume_router = APIRouter()

@resume_router.get("/master")
async def get_master_resume(user_id: str = Depends(get_current_user_id)):
    resume = db.master_resumes.find_one({"user_id": user_id})
    if not resume:
        raise HTTPException(status_code=404, detail="Master resume not found")
    return resume_serializer(resume)

@resume_router.post("/master")
async def create_or_update_master_resume(resume: MasterResume, user_id: str = Depends(get_current_user_id)):
    resume_dict = resume.dict()
    
    # Associate the resume with the current user
    resume_dict["user_id"] = user_id

    # Use update_one with upsert=True to either update or create the document
    db.master_resumes.update_one(
        {"user_id": user_id},
        {"$set": resume_dict},
        upsert=True
    )
    return {"message": "Master resume saved successfully"}