from flask import Blueprint, request, jsonify
from backend.services.gemini_service import gemini_service
from backend.services.db_service import db_service

interview_bp = Blueprint("interview", __name__)

@interview_bp.route("/interview/start", methods=["POST"])
def start_interview():
    """
    POST /api/interview/start
    Expects JSON:
        - 'analysis_id': string
        - 'target_role': string
    """
    data = request.get_json() or {}
    analysis_id = data.get("analysis_id")
    target_role = data.get("target_role", "Software Engineer")

    if not analysis_id:
        return jsonify({"error": "No analysis_id provided"}), 400

    try:
        # Fetch original analysis
        analysis_record = db_service.get_analysis(analysis_id)
        if not analysis_record:
            return jsonify({"error": "Analysis record not found"}), 404

        resume_text = analysis_record.get("resume_text", "")
        
        # Initiate stateful interview question
        ai_response = gemini_service.generate_interview_question(
            resume_text=resume_text,
            target_role=target_role,
            chat_history=[]
        )

        # Create session in database
        session_record = db_service.save_interview({
            "analysis_id": analysis_id,
            "target_role": target_role,
            "resume_text": resume_text,
            "chat_history": [
                {"role": "interviewer", "content": ai_response.get("question")}
            ]
        })

        return jsonify({
            "interview_id": session_record.get("id"),
            "welcome_message": ai_response.get("welcome_message") or f"Welcome! Let's start the mock interview for '{target_role}'.",
            "question": ai_response.get("question")
        }), 200

    except Exception as e:
        print(f"Start interview error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@interview_bp.route("/interview/respond", methods=["POST"])
def respond_interview():
    """
    POST /api/interview/respond
    Expects JSON:
        - 'interview_id': string
        - 'answer': string
    """
    data = request.get_json() or {}
    interview_id = data.get("interview_id")
    answer = data.get("answer")

    if not interview_id or not answer:
        return jsonify({"error": "Missing interview_id or candidate answer"}), 400

    try:
        # Fetch current session
        session = db_service.get_interview(interview_id)
        if not session:
            return jsonify({"error": "Interview session not found"}), 404

        history = session.get("chat_history", [])
        resume_text = session.get("resume_text", "")
        target_role = session.get("target_role", "")

        # Append candidate's answer to history
        history.append({"role": "candidate", "content": answer})

        # Ask Gemini to evaluate and get next question
        ai_response = gemini_service.generate_interview_question(
            resume_text=resume_text,
            target_role=target_role,
            chat_history=history
        )

        # Append next question to history
        history.append({"role": "interviewer", "content": ai_response.get("question")})

        # Save session
        session["chat_history"] = history
        db_service.save_interview(session)

        return jsonify({
            "feedback_last_answer": ai_response.get("feedback_last_answer"),
            "score_last_answer": ai_response.get("score_last_answer"),
            "model_answer_last": ai_response.get("model_answer_last"),
            "question": ai_response.get("question")
        }), 200

    except Exception as e:
        print(f"Respond interview error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@interview_bp.route("/roadmap/generate", methods=["POST"])
def generate_roadmap():
    """
    POST /api/roadmap/generate
    Expects JSON:
        - 'analysis_id': string
        - 'target_role': string
    """
    data = request.get_json() or {}
    analysis_id = data.get("analysis_id")
    target_role = data.get("target_role", "Software Engineer")

    if not analysis_id:
        return jsonify({"error": "No analysis_id provided"}), 400

    try:
        # Fetch analysis
        analysis_record = db_service.get_analysis(analysis_id)
        if not analysis_record:
            return jsonify({"error": "Analysis record not found"}), 404

        resume_text = analysis_record.get("resume_text", "")
        analysis_data = analysis_record.get("analysis", {})

        # Generate roadmap
        roadmap = gemini_service.generate_learning_roadmap(resume_text, target_role, analysis_data)
        return jsonify(roadmap), 200

    except Exception as e:
        print(f"Roadmap gen error: {str(e)}")
        return jsonify({"error": str(e)}), 500
