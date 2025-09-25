def resume_serializer(resume) -> dict:
    return {
        "id": str(resume["_id"]),
        "personalInfo": resume["personalInfo"],
        "workExperiences": resume["workExperiences"],
        "education": resume["education"],
        "skills": resume["skills"],
        "certifications": resume["certifications"],
        "user_id": resume["user_id"]
    }