"""
ASTRA X'26 - Aditya Degree College AI Event Backend
Framework: Python Flask with SQLite Database
Admins allowed: varshu, Rampa, Jai
Rule: One student can register for only one competition (Strict SUC Number validation)
"""

import os
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'astra_events.db')

# Approved Admins and Credentials
ALLOWED_ADMINS = {'varshu', 'rampa', 'jai'}
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'astra@aditya2026')

# 6 Official Competitions for ASTRA X'26
COMPETITIONS = [
    {
        "id": "bot-arena",
        "title": "BOT - ARENA",
        "tagline": "AI Chatbot & Intelligent Agent Showdown",
        "description": "Build and present an AI chatbot solution for a real-world problem."
    },
    {
        "id": "ai-cineverse",
        "title": "AI CINEVERSE",
        "tagline": "Generative Cinema & Visual Storytelling",
        "description": "AI-supported short film using creativity, story and video production."
    },
    {
        "id": "neura-quest",
        "title": "NEURA QUEST",
        "tagline": "High-Stakes AI & Tech Master Quiz",
        "description": "AI/general knowledge quiz with multiple competitive rounds."
    },
    {
        "id": "vision-x",
        "title": "VISION-X",
        "tagline": "AI & Robotics Tech Presentation",
        "description": "Generate a ppt on given topic which is based on AI and robotics."
    },
    {
        "id": "ai-crossfire",
        "title": "AI CROSSFIRE",
        "tagline": "Structured AI Debate & Ethics Arena",
        "description": "Structured debate on AI-related topics."
    },
    {
        "id": "prompt-wars",
        "title": "PROMPT WARS",
        "tagline": "Elite Prompt Engineering Combat",
        "description": "Create the most effective prompt for a given task."
    }
]

# Official Eligible Courses / Classes for Aditya Degree College
COURSES = [
    "Artificial intelligence and robotics",
    "Bsc and bca data science",
    "BBA",
    "BSC-A",
    "BSC-B",
    "BSC-C",
    "BCA"
]

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS registrations (
            id TEXT PRIMARY KEY,
            student_name TEXT NOT NULL,
            course TEXT NOT NULL,
            year TEXT NOT NULL,
            suc_number TEXT UNIQUE NOT NULL,
            competition_id TEXT NOT NULL,
            competition_title TEXT NOT NULL,
            registered_at TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Initialize Database tables
init_db()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "service": "ASTRA X'26 Python Flask Backend",
        "college": "Aditya Degree College",
        "database": "SQLite (astra_events.db)"
    })

@app.route('/api/competitions', methods=['GET'])
def list_competitions():
    return jsonify(COMPETITIONS)

@app.route('/api/courses', methods=['GET'])
def list_courses():
    return jsonify(COURSES)

@app.route('/api/register', methods=['POST'])
def register_student():
    """
    Register a student.
    RULE ENFORCEMENT:
    One student should participate in one competition only.
    If SUC number already exists, reject immediately.
    """
    data = request.get_json() or {}
    student_name = data.get('studentName', '').strip()
    course = data.get('course', '').strip()
    year = data.get('year', '').strip()
    suc_number = data.get('sucNumber', '').strip().upper()
    competition_id = data.get('competitionId', '').strip()

    if not all([student_name, course, year, suc_number, competition_id]):
        return jsonify({
            "success": False,
            "error": "All fields are required: studentName, course, year, sucNumber, competitionId."
        }), 400

    comp_match = next((c for c in COMPETITIONS if c['id'] == competition_id), None)
    if not comp_match:
        return jsonify({"success": False, "error": "Invalid competition selected."}), 400

    conn = get_db()
    cursor = conn.cursor()

    # Rule Check: SUC must not already be registered in ANY competition
    cursor.execute('SELECT student_name, competition_title, suc_number FROM registrations WHERE UPPER(suc_number) = ?', (suc_number,))
    existing = cursor.fetchone()

    if existing:
        conn.close()
        return jsonify({
            "success": False,
            "error": f"Registration Blocked: Student with SUC [{existing['suc_number']}] ({existing['student_name']}) is already registered for '{existing['competition_title']}'. As per ASTRA X'26 rules, one student can only participate in one competition.",
            "alreadyRegistered": True,
            "existingCompetition": existing['competition_title']
        }), 409

    # Generate unique ID and save
    reg_id = f"ASTRA-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{suc_number[-4:]}"
    registered_at = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')

    try:
        cursor.execute('''
            INSERT INTO registrations (id, student_name, course, year, suc_number, competition_id, competition_title, registered_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (reg_id, student_name, course, year, suc_number, competition_id, comp_match['title'], registered_at))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({
            "success": False,
            "error": f"Duplicate entry: SUC {suc_number} is already registered."
        }), 409
    finally:
        conn.close()

    return jsonify({
        "success": True,
        "message": f"Congratulations {student_name}! You have been registered successfully for {comp_match['title']}.",
        "registration": {
            "id": reg_id,
            "studentName": student_name,
            "course": course,
            "year": year,
            "sucNumber": suc_number,
            "competitionId": competition_id,
            "competitionTitle": comp_match['title'],
            "registeredAt": registered_at
        }
    }), 201

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """
    Authenticate Admin access.
    Allowed admin names: varshu, Rampa, Jai (case-insensitive)
    Password protected.
    """
    data = request.get_json() or {}
    username = data.get('username', '').strip().lower()
    password = data.get('password', '').strip()

    if username not in ALLOWED_ADMINS:
        return jsonify({
            "success": False,
            "error": "Access Denied: You are not authorized. Only designated admins (Varshu, Rampa, Jai) can access the portal."
        }), 403

    if password != ADMIN_PASSWORD:
        return jsonify({
            "success": False,
            "error": "Invalid Admin Password. Please enter the correct password for ASTRA X'26 admins."
        }), 401

    display_names = {
        'varshu': 'Varshu',
        'rampa': 'Rampa',
        'jai': 'Jai'
    }

    return jsonify({
        "success": True,
        "message": f"Welcome Admin {display_names.get(username, username)}!",
        "admin": {
            "username": display_names.get(username, username),
            "role": "Organizing Admin",
            "event": "ASTRA X'26",
            "college": "Aditya Degree College"
        }
    })

@app.route('/api/registrations', methods=['GET'])
def get_registrations():
    """
    Retrieve all registered students for second frontend.
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, student_name, course, year, suc_number, competition_id, competition_title, registered_at
        FROM registrations
        ORDER BY registered_at DESC
    ''')
    rows = cursor.fetchall()
    conn.close()

    registrations = [
        {
            "id": row["id"],
            "studentName": row["student_name"],
            "course": row["course"],
            "year": row["year"],
            "sucNumber": row["suc_number"],
            "competitionId": row["competition_id"],
            "competitionTitle": row["competition_title"],
            "registeredAt": row["registered_at"]
        }
        for row in rows
    ]

    return jsonify({
        "success": True,
        "count": len(registrations),
        "registrations": registrations
    })

@app.route('/api/registrations/<string:reg_id>', methods=['DELETE'])
def delete_registration(reg_id):
    """
    Delete a registration record (Admin action).
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM registrations WHERE id = ?', (reg_id,))
    deleted = cursor.rowcount
    conn.commit()
    conn.close()

    if deleted == 0:
        return jsonify({"success": False, "error": "Registration not found"}), 404

    return jsonify({"success": True, "message": "Student registration cancelled successfully."})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting ASTRA X'26 Python Flask Backend on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
