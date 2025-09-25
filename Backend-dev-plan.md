# 1) Executive Summary
- This document outlines the backend development plan for ResumePivot, a platform for creating tailored resumes.
- The backend will be built with **FastAPI** and **MongoDB Atlas**, adhering to the constraints of no Docker, frontend-driven manual testing, and a `main`-only Git workflow.
- The sprint plan is dynamic and will expand to cover all features identified in the frontend.

# 2) In-scope & Success Criteria
- **In-scope Features:**
  - User authentication (signup, login, logout).
  - Master resume management (create, view, edit).
  - Content tagging for work experience.
  - Job description analysis.
  - Resume version and cover letter generation.
- **Success Criteria:**
  - All frontend features are fully supported by the backend.
  - Each sprint's functionality passes manual UI-based testing.
  - Successful sprints are committed and pushed to the `main` branch.

# 3) API Design
- **Conventions:**
  - Base path: `/api/v1`
  - Errors will return a simple JSON object: `{"detail": "Error message"}`.
- **Endpoints:**
  - **Authentication:**
    - `POST /api/v1/auth/signup`: Register a new user.
    - `POST /api/v1/auth/login`: Authenticate a user and return a JWT.
    - `GET /api/v1/auth/me`: Get the current authenticated user's data.
  - **Master Resume:**
    - `GET /api/v1/resumes/master`: Retrieve the user's master resume.
    - `POST /api/v1/resumes/master`: Create or update the master resume.
  - **Job Analysis:**
    - `GET /api/v1/jobs/analyses`: Get all saved job analyses.
    - `POST /api/v1/jobs/analyses`: Create a new job analysis.
    - `DELETE /api/v1/jobs/analyses/{analysis_id}`: Delete a job analysis.
  - **Dashboard:**
    - `GET /api/v1/dashboard/stats`: Get statistics for the dashboard.

# 4) Data Model (MongoDB Atlas)
- **Collections:**
  - **users:**
    - `_id`: ObjectId
    - `email`: String (required, unique)
    - `hashed_password`: String (required)
  - **master_resumes:**
    - `_id`: ObjectId
    - `user_id`: ObjectId (required, ref: 'users')
    - `personal_info`: Object
    - `work_experiences`: Array of Objects
    - `education`: Array of Objects
    - `skills`: Array of Strings
    - `certifications`: Array of Strings
    - **Example:**
      ```json
      {
        "_id": "60c72b9f9b1d8c001f8e4c8b",
        "user_id": "60c72b9f9b1d8c001f8e4c8a",
        "personal_info": { "fullName": "Sarah Chen", "email": "sarah.chen@example.com" },
        "work_experiences": [{ "company": "TechCorp", "position": "Product Manager", "tags": ["Product Manager", "SaaS"] }]
      }
      ```
  - **job_analyses:**
    - `_id`: ObjectId
    - `user_id`: ObjectId (required, ref: 'users')
    - `job_title`: String (required)
    - `company`: String (required)
    - `job_description`: String
    - `extracted_role`: String
    - `extracted_domain`: String
    - `created_date`: ISODate
    - **Example:**
      ```json
      {
        "_id": "60c72b9f9b1d8c001f8e4c8c",
        "user_id": "60c72b9f9b1d8c001f8e4c8a",
        "job_title": "Senior Product Manager",
        "company": "Innovate Inc.",
        "extracted_role": "Product Manager"
      }
      ```

# 5) Frontend Audit & Feature Map
- **Routes & Components:**
  - `Index.tsx` (Dashboard):
    - Purpose: Displays stats and quick actions.
    - Backend: `GET /api/v1/dashboard/stats`
  - `MasterResume.tsx`:
    - Purpose: Create and manage the master resume.
    - Backend: `GET /POST /api/v1/resumes/master`
  - `JobAnalysis.tsx`:
    - Purpose: Analyze and save job descriptions.
    - Backend: `GET /POST /DELETE /api/v1/jobs/analyses`

# 6) Configuration & ENV Vars
- `APP_ENV`: "development"
- `PORT`: 8000
- `MONGODB_URI`: (user provided)
- `JWT_SECRET`: (randomly generated)
- `JWT_EXPIRES_IN`: 3600
- `CORS_ORIGINS`: "http://localhost:5173"

# 9) Testing Strategy (Manual via Frontend)
- **Policy:** All backend features will be tested manually through the frontend UI.
- **Per-sprint Checklist:** Each sprint will include a detailed checklist of UI actions to perform.
- **User Test Prompt:** Simple, clear instructions for a non-technical user to test the features.
- **Post-sprint:** On successful testing, changes will be committed and pushed to `main`.

# 10) Dynamic Sprint Plan & Backlog (S0…Sn)
- **S0 - Environment Setup & Frontend Connection**
  - **Objectives:**
    - Create FastAPI skeleton with `/api/v1` and `/healthz`.
    - Ask user for `MONGODB_URI`.
    - Implement `/healthz` with a DB connectivity check.
    - Enable CORS for the frontend.
    - Initialize Git and push to a new GitHub repository.
  - **Definition of Done:**
    - Backend runs, `/healthz` is successful.
    - Frontend connects to the backend.
    - Code is on GitHub on the `main` branch.
  - **Manual Test Checklist (Frontend):**
    - Start backend, open the app, confirm no CORS errors and successful `/healthz` call in DevTools.
  - **User Test Prompt:**
    - "Please run the app and confirm the dashboard loads without errors."
  - **Post-sprint:** Commit and push to `main`.

- **S1 - Basic Auth (signup, login, logout)**
  - **Objectives:**
    - Implement signup, login, and me endpoints.
    - Protect master resume and job analysis pages.
  - **Endpoints:**
    - `POST /api/v1/auth/signup`
    - `POST /api/v1/auth/login`
    - `GET /api/v1/auth/me`
  - **Definition of Done:**
    - Users can sign up, log in, and access protected pages.
  - **Manual Test Checklist (Frontend):**
    - Create a user, log in, visit the master resume page, log out, and verify access is blocked.
  - **User Test Prompt:**
    - "Can you create an account, log in, and see the master resume page?"
  - **Post-sprint:** Commit and push to `main`.

- **S2 - Master Resume**
  - **Objectives:**
    - Implement create, read, and update for the master resume.
  - **Endpoints:**
    - `GET /api/v1/resumes/master`
    - `POST /api/v1/resumes/master`
  - **Definition of Done:**
    - A logged-in user can create, view, and edit their master resume.
  - **Manual Test Checklist (Frontend):**
    - Log in, go to the master resume page, fill out and save the form, reload, and verify data persistence.
  - **User Test Prompt:**
    - "Please create and save your master resume."
  - **Post-sprint:** Commit and push to `main`.

- **S3 - Job Analysis**
  - **Objectives:**
    - Implement create, read, and delete for job analyses.
  - **Endpoints:**
    - `GET /api/v1/jobs/analyses`
    - `POST /api/v1/jobs/analyses`
    - `DELETE /api/v1/jobs/analyses/{analysis_id}`
  - **Definition of Done:**
    - A logged-in user can create, view, and delete job analyses.
  - **Manual Test Checklist (Frontend):**
    - Log in, go to the job analysis page, create a new analysis, save it, and then delete it.
  - **User Test Prompt:**
    - "Can you analyze a job description, save it, and then delete it?"
  - **Post-sprint:** Commit and push to `main`.