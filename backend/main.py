from fastapi import FastAPI
from backend.routers.auth import auth_router
from backend.routers.resume import resume_router
from backend.routers.job import job_router

app = FastAPI()

app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(resume_router, prefix="/api/v1/resumes", tags=["resumes"])
app.include_router(job_router, prefix="/api/v1/jobs", tags=["jobs"])

@app.get("/healthz")
def health_check():
    return {"status": "ok"}