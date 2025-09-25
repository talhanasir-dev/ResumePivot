# backend/schemas/job.py
def job_analysis_serializer(job) -> dict:
    return {
        "id": str(job["_id"]),
        "jobTitle": job["jobTitle"],
        "company": job["company"],
        "jobDescription": job["jobDescription"],
        "extractedRole": job["extractedRole"],
        "extractedDomain": job["extractedDomain"],
        "keyRequirements": job["keyRequirements"],
        "notes": job.get("notes", ""),
        "createdDate": str(job["_id"].generation_time),
        "user_id": job["user_id"]
    }

def job_analyses_serializer(jobs) -> list:
    return [job_analysis_serializer(job) for job in jobs]