# backend/routers/job.py
from fastapi import APIRouter, HTTPException, Depends
from backend.models.job import JobAnalysis
from backend.schemas.job import job_analyses_serializer, job_analysis_serializer
from backend.database.db import db
from bson import ObjectId

# Placeholder for getting the current user ID
def get_current_user_id():
    return "60c72b9f9b1d8c001f8e4c8a" # Replace with a valid user_id from your db

job_router = APIRouter()

@job_router.get("/analyses")
async def get_job_analyses(user_id: str = Depends(get_current_user_id)):
    analyses = db.job_analyses.find({"user_id": user_id})
    return job_analyses_serializer(list(analyses))

@job_router.post("/analyses")
async def create_job_analysis(analysis: JobAnalysis, user_id: str = Depends(get_current_user_id)):
    analysis_dict = analysis.dict()
    analysis_dict["user_id"] = user_id
    
    result = db.job_analyses.insert_one(analysis_dict)
    new_analysis = db.job_analyses.find_one({"_id": result.inserted_id})
    return job_analysis_serializer(new_analysis)

@job_router.delete("/analyses/{analysis_id}")
async def delete_job_analysis(analysis_id: str, user_id: str = Depends(get_current_user_id)):
    result = db.job_analyses.delete_one({"_id": ObjectId(analysis_id), "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job analysis not found")
    return {"message": "Job analysis deleted successfully"}