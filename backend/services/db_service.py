import os
import json
import uuid
from datetime import datetime
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError
from backend.config import Config

class DBService:
    def __init__(self):
        self.use_fallback = True
        self.db = None
        self.client = None
        self.mock_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "mock_db.json")
        
        # Ensure directories exist
        os.makedirs(os.path.dirname(self.mock_file_path), exist_ok=True)
        if not os.path.exists(self.mock_file_path):
            with open(self.mock_file_path, "w") as f:
                json.dump({"analyses": {}, "portfolios": {}, "interviews": {}}, f, indent=4)
        
        # Try connecting to MongoDB if URI is provided
        if Config.MONGO_URI:
            try:
                # Set a short timeout (3 seconds) so we don't hang if database is offline
                self.client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=3000)
                # Force a connection check
                self.client.admin.command('ping')
                self.db = self.client.get_database()
                self.use_fallback = False
                print("Successfully connected to MongoDB database.")
            except (ConnectionFailure, ConfigurationError, Exception) as e:
                print(f"MongoDB connection failed: {str(e)}. Falling back to local JSON database storage.")
                self.use_fallback = True
        else:
            print("No MONGO_URI supplied. Falling back to local JSON database storage.")
            self.use_fallback = True

    def _read_mock_db(self):
        try:
            with open(self.mock_file_path, "r") as f:
                return json.load(f)
        except Exception:
            return {"analyses": {}, "portfolios": {}, "interviews": {}}

    def _write_mock_db(self, data):
        try:
            with open(self.mock_file_path, "w") as f:
                json.dump(data, f, indent=4)
        except Exception as e:
            print(f"Error writing to mock DB: {str(e)}")

    # Core Operations
    def save_analysis(self, analysis_data):
        analysis_id = str(uuid.uuid4())
        record = {
            "id": analysis_id,
            "created_at": datetime.utcnow().isoformat(),
            **analysis_data
        }
        
        if not self.use_fallback:
            try:
                self.db.analyses.insert_one(record.copy())
                # Convert MongoDB ObjectId to string for JSON serialization
                record.pop("_id", None)
                return record
            except Exception as e:
                print(f"MongoDB write failed: {str(e)}. Attempting fallback.")
        
        # Fallback local write
        db_data = self._read_mock_db()
        db_data["analyses"][analysis_id] = record
        self._write_mock_db(db_data)
        return record

    def get_analysis(self, analysis_id):
        if not self.use_fallback:
            try:
                record = self.db.analyses.find_one({"id": analysis_id})
                if record:
                    record.pop("_id", None)
                    return record
            except Exception as e:
                print(f"MongoDB read failed: {str(e)}. Attempting fallback.")
        
        db_data = self._read_mock_db()
        return db_data["analyses"].get(analysis_id)

    def get_all_analyses(self):
        if not self.use_fallback:
            try:
                cursor = self.db.analyses.find().sort("created_at", -1)
                records = list(cursor)
                for r in records:
                    r.pop("_id", None)
                return records
            except Exception as e:
                print(f"MongoDB read failed: {str(e)}. Attempting fallback.")
        
        db_data = self._read_mock_db()
        # Return sorted by created_at descending
        sorted_records = sorted(
            db_data["analyses"].values(), 
            key=lambda x: x.get("created_at", ""), 
            reverse=True
        )
        return sorted_records

    def save_portfolio(self, portfolio_data):
        portfolio_id = str(uuid.uuid4())
        record = {
            "id": portfolio_id,
            "created_at": datetime.utcnow().isoformat(),
            **portfolio_data
        }
        
        if not self.use_fallback:
            try:
                self.db.portfolios.insert_one(record.copy())
                record.pop("_id", None)
                return record
            except Exception as e:
                print(f"MongoDB write failed: {str(e)}. Attempting fallback.")
        
        db_data = self._read_mock_db()
        db_data["portfolios"][portfolio_id] = record
        self._write_mock_db(db_data)
        return record

    def get_portfolio(self, portfolio_id):
        if not self.use_fallback:
            try:
                record = self.db.portfolios.find_one({"id": portfolio_id})
                if record:
                    record.pop("_id", None)
                    return record
            except Exception as e:
                print(f"MongoDB read failed: {str(e)}. Attempting fallback.")
        
        db_data = self._read_mock_db()
        return db_data["portfolios"].get(portfolio_id)

    def save_interview(self, interview_data):
        interview_id = interview_data.get("id") or str(uuid.uuid4())
        record = {
            "id": interview_id,
            "created_at": datetime.utcnow().isoformat(),
            **interview_data
        }
        
        if not self.use_fallback:
            try:
                self.db.interviews.update_one(
                    {"id": interview_id}, 
                    {"$set": record}, 
                    upsert=True
                )
                return record
            except Exception as e:
                print(f"MongoDB write failed: {str(e)}. Attempting fallback.")
        
        db_data = self._read_mock_db()
        db_data["interviews"][interview_id] = record
        self._write_mock_db(db_data)
        return record

    def get_interview(self, interview_id):
        if not self.use_fallback:
            try:
                record = self.db.interviews.find_one({"id": interview_id})
                if record:
                    record.pop("_id", None)
                    return record
            except Exception as e:
                print(f"MongoDB read failed: {str(e)}. Attempting fallback.")
        
        db_data = self._read_mock_db()
        return db_data["interviews"].get(interview_id)

# Global Instance
db_service = DBService()
