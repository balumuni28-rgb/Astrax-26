# ASTRA X'26 - Aditya Degree College Backend (Python & Flask)

This is the Python Flask backend service for the **ASTRA X'26** AI and Robotics event registration platform at **Aditya Degree College**.

## Architecture & Features
- **Language**: Python 3.10+
- **Framework**: Flask with CORS
- **Database**: SQLite3 (`astra_events.db`)
- **Strict Rule Engine**: Ensures that each student (identified by unique **SUC code**) can register for **strictly one competition**. Subsequent registration attempts in any competition are rejected with HTTP 409 Conflict.
- **Admin Authentication**: Whitelisted authorization for approved event admins (**Varshu**, **Rampa**, and **Jai**) with password protection.

## Quick Start Guide

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Run the Flask Server
```bash
python3 backend/app.py
```
The server will run on `http://127.0.0.1:5000` with the SQLite database automatically initialized at `backend/astra_events.db`.

## REST API Specification

### Public Endpoints
- `GET /api/health`: Health status and backend configuration
- `GET /api/competitions`: Returns the 6 ASTRA X'26 event competitions
- `POST /api/register`: Register a student
  - Request body:
    ```json
    {
      "studentName": "Rahul Sharma",
      "course": "B.Sc Artificial Intelligence & Robotics",
      "year": "2nd Year",
      "sucNumber": "23091045",
      "competitionId": "bot-arena"
    }
    ```
  - Responses:
    - `201 Created`: Registration successful
    - `409 Conflict`: SUC already registered for another competition

### Admin Endpoints (Varshu, Rampa, Jai)
- `POST /api/admin/login`: Verify admin credentials
  - Request body: `{"username": "varshu", "password": "astra@aditya2026"}`
- `GET /api/registrations`: Fetch full attendee roster
- `DELETE /api/registrations/<id>`: Deregister or cancel an entry
