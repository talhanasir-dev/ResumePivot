from pydantic import BaseModel
from typing import List, Optional

class WorkExperience(BaseModel):
    id: str
    company: str
    position: str
    startDate: str
    endDate: str
    description: str
    tags: List[str]

class Education(BaseModel):
    id: str
    institution: str
    degree: str
    field: str
    graduationDate: str

class MasterResume(BaseModel):
    personalInfo: dict
    workExperiences: List[WorkExperience]
    education: List[Education]
    skills: List[str]
    certifications: List[str]
    user_id: str # To associate with a user