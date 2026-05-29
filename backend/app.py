import os
from flask import Flask, jsonify
from flask_cors import CORS
from backend.config import Config
from backend.routes.analyze import analyze_bp
from backend.routes.portfolio import portfolio_bp
from backend.routes.interview import interview_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for all routes (to allow our React dev server on localhost:5173 to connect easily)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register Blueprints with /api prefix
    app.register_blueprint(analyze_bp, url_prefix="/api")
    app.register_blueprint(portfolio_bp, url_prefix="/api")
    app.register_blueprint(interview_bp, url_prefix="/api")

    @app.route("/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "TalentForge Flask API Engine",
            "environment": Config.FLASK_ENV
        }), 200

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error occurred"}), 500

    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("PORT", 5000))
    # We set debug=True for local dev hot-reloading
    app.run(host="0.0.0.0", port=port, debug=True)
