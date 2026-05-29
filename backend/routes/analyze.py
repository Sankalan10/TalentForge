import os
from flask import Blueprint, request, jsonify
from backend.services.resume_parser import extract_text_from_pdf
from backend.services.gemini_service import gemini_service
from backend.services.db_service import db_service

analyze_bp = Blueprint("analyze", __name__)

@analyze_bp.route("/analyze", methods=["POST"])
def analyze_resume():
    """
    POST /api/analyze
    Expects:
        - file: 'resume' (PDF format)
        - text fields: 'github_username' (optional), 'linkedin_text' (optional)
    """
    if "resume" not in request.files:
        return jsonify({"error": "No resume file provided"}), 400
        
    file = request.files["resume"]
    if file.filename == "":
        return jsonify({"error": "No resume file selected"}), 400

    if not file.filename.endswith(".pdf"):
        return jsonify({"error": "Only PDF resumes are supported"}), 400

    github_username = request.form.get("github_username", "")
    linkedin_text = request.form.get("linkedin_text", "")

    try:
        # Extract text from PDF
        pdf_bytes = file.read()
        resume_text = extract_text_from_pdf(pdf_bytes)
        
        if not resume_text:
            return jsonify({"error": "Could not extract readable text from PDF. Ensure it is not a scanned image."}), 400
            
        # Get AI analysis from Gemini
        analysis = gemini_service.analyze_resume(
            resume_text=resume_text,
            github_data=f"Username: {github_username}" if github_username else "",
            linkedin_data=linkedin_text
        )
        
        # Save to database (MongoDB or Fallback Local Storage)
        saved_record = db_service.save_analysis({
            "resume_text": resume_text,
            "github_username": github_username,
            "linkedin_text": linkedin_text,
            "analysis": analysis
        })
        
        return jsonify(saved_record), 200

    except Exception as e:
        print(f"Analysis route exception: {str(e)}")
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@analyze_bp.route("/analyses", methods=["GET"])
def get_all_analyses():
    """
    GET /api/analyses
    Returns a list of all past resume analysis scorecards.
    """
    try:
        records = db_service.get_all_analyses()
        return jsonify(records), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analyze_bp.route("/analysis/<analysis_id>", methods=["GET"])
def get_analysis(analysis_id):
    """
    GET /api/analysis/<id>
    Returns details of a specific past resume analysis scorecard.
    """
    try:
        record = db_service.get_analysis(analysis_id)
        if not record:
            return jsonify({"error": "Analysis not found"}), 404
        return jsonify(record), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
