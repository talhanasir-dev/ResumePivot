from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers.auth import auth_router
from backend.routers.resume import resume_router
from backend.routers.job import job_router
from backend.database.db import client

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(resume_router, prefix="/api/v1/resumes", tags=["resumes"])
app.include_router(job_router, prefix="/api/v1/jobs", tags=["jobs"])

@app.get("/healthz")
def health_check():
    try:
        client.admin.command('ismaster')
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "ok", "database": "disconnected", "error": str(e)}