# backend/models/job.py
from pydantic import BaseModel
from typing import List, Optional

class JobAnalysis(BaseModel):
    jobTitle: str
    company: str
    jobDescription: str
    extractedRole: str
    extractedDomain: str
    keyRequirements: List[str]
    notes: Optional[str] = ""
    user_id: str # To associate with a user