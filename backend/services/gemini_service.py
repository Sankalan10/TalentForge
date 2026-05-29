import os
import json
import google.generativeai as genai
from backend.config import Config

class GeminiService:
    def __init__(self):
        self.api_key = Config.GEMINI_API_KEY
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-1.5-flash")
            print("Gemini API initialized successfully.")
        else:
            self.model = None
            print("WARNING: GEMINI_API_KEY not found in configurations. AI features will run in mock mode.")

    def _is_configured(self):
        return self.model is not None

    def analyze_resume(self, resume_text, github_data=None, linkedin_data=None):
        """
        Sends resume text and social details to Gemini and parses the structured JSON analysis.
        Returns a beautifully formatted dictionary.
        """
        if not self._is_configured():
            return self._get_mock_analysis()

        prompt = f"""
        You are an elite Tech Recruiter and ATS Expert. Analyze the following resume text, and cross-reference with optional social profile descriptions.
        
        Resume Content:
        \"\"\"{resume_text}\"\"\"
        
        GitHub Profile Data:
        \"\"\"{github_data or "Not Provided"}\"\"\"
        
        LinkedIn Profile Data:
        \"\"\"{linkedin_data or "Not Provided"}\"\"\"
        
        Evaluate this candidate thoroughly. Provide the analysis in STRICT JSON format matching the following schema exactly:
        {{
          "applicant_name": "String (Extract candidate's name or use 'Talent' if missing)",
          "ats_score": "Integer (1-100 overall score)",
          "summary": "String (A 2-3 sentence expert recruiter summary of the candidate's fit)",
          "sub_scores": {{
            "formatting": "Integer (1-100 rating formatting, structure, headers)",
            "impact": "Integer (1-100 rating power words, action verbs, active voice)",
            "skills": "Integer (1-100 rating skill density vs industry standards)",
            "achievements": "Integer (1-100 rating quantifiable metrics & impact)"
          }},
          "strengths": ["List of 3 key strengths in their profile"],
          "weaknesses": ["List of 3 areas that dilute their application"],
          "suggestions": [
            {{
              "area": "String (e.g., 'Work Experience - Software Engineer')",
              "before": "String (A weak or generic sentence from their current resume)",
              "after": "String (An optimized, high-impact version with metrics/action verbs)",
              "why": "String (Brief explanation of why the change stands out to a recruiter)"
            }}
          ],
          "missing_skills": {{
            "critical": ["List of 2-3 key missing tech skills for their level/role"],
            "recommended": ["List of 2-3 recommended skills/tools"],
            "optional": ["List of 2-3 good-to-have tools/frameworks"]
          }},
          "company_matching": [
            {{
              "type": "FAANG / Tier-1 Tech",
              "match_percentage": "Integer (1-100)",
              "reasons": ["List of reasons for this score"]
            }},
            {{
              "type": "High-Growth Startups",
              "match_percentage": "Integer (1-100)",
              "reasons": ["List of reasons for this score"]
            }},
            {{
              "type": "Enterprise/Corporates",
              "match_percentage": "Integer (1-100)",
              "reasons": ["List of reasons for this score"]
            }}
          ]
        }}

        Ensure the JSON is perfectly valid and matches the format exactly.
        """

        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Gemini analysis call failed: {str(e)}. Falling back to mock data.")
            return self._get_mock_analysis()

    def generate_portfolio_metadata(self, resume_text, analysis_data):
        """
        Generates engaging recruiter-optimized portfolio website content based on the resume.
        """
        if not self._is_configured():
            return self._get_mock_portfolio_metadata()

        prompt = f"""
        You are a highly creative UX Copywriter and Web Developer.
        Based on the resume content and our previous analysis, generate a highly engaging, visual, recruiter-ready Portfolio Content profile.
        
        Resume Content:
        \"\"\"{resume_text}\"\"\"

        Candidate Profile:
        \"\"\"{json.dumps(analysis_data)}\"\"\"
        
        Generate the website content in STRICT JSON format matching the following schema exactly:
        {{
          "tagline": "String (A memorable, high-impact elevator pitch, e.g., 'Building scalable distributed architectures')",
          "bio": "String (An engaging, personality-rich 3-sentence introduction)",
          "terminal_welcome": "String (A geeky terminal-style ASCII or welcome message)",
          "terminal_commands": [
            {{
              "command": "String (e.g. 'skills' or 'projects' or 'about')",
              "output": "String (Mock terminal response for that command)"
            }}
          ],
          "highlighted_projects": [
            {{
              "title": "String (Catchy project name)",
              "description": "String (High-impact description using the STAR method)",
              "tech_stack": ["List of tools used"],
              "impact_metric": "String (e.g. 'Reduced load times by 40%')"
            }}
          ],
          "custom_skills_group": [
            {{
              "category": "String (e.g. 'Backend & Clouds')",
              "skills": ["List of skills in this category"]
            }}
          ]
        }}
        """

        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Gemini portfolio gen failed: {str(e)}. Falling back to mock data.")
            return self._get_mock_portfolio_metadata()

    def generate_learning_roadmap(self, resume_text, target_role, analysis_data):
        """
        Generates a milestone-based Gantt-style learning path to cover missing skills.
        """
        if not self._is_configured():
            return self._get_mock_roadmap(target_role)

        prompt = f"""
        You are an expert technical mentor. The candidate wants to transition into the target role: '{target_role}'.
        Their current resume text:
        \"\"\"{resume_text}\"\"\"
        
        Their analyzed profile:
        \"\"\"{json.dumps(analysis_data)}\"\"\"

        Create a highly detailed, actionable 12-week learning roadmap to bridge their missing skills and elevate them.
        Provide the roadmap in STRICT JSON format matching the following schema exactly:
        {{
          "target_role": "String",
          "milestones": [
            {{
              "week_range": "String (e.g., 'Weeks 1-3')",
              "title": "String (Milestone name, e.g., 'Mastering Containerization')",
              "description": "String (Brief overview of the focus area)",
              "skills_gained": ["List of specific skills acquired"],
              "suggested_actions": ["List of concrete tasks, e.g. 'Build a multi-stage Dockerfile'"],
              "curated_resources": [
                {{
                  "name": "String (Name of tutorial/resource)",
                  "type": "String (e.g. 'Free Course', 'Documentation', 'Interactive Tutorial')",
                  "link": "String (URL to resource, use highly standard reference domains like freecodecamp.org, roadmap.sh, MDN)"
                }}
              ]
            }}
          ]
        }}
        """

        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Gemini roadmap failed: {str(e)}. Falling back to mock data.")
            return self._get_mock_roadmap(target_role)

    def generate_interview_question(self, resume_text, target_role, chat_history):
        """
        Generates a stateful mock interview question based on the candidate's resume, the target role, and past answers.
        
        chat_history: list of dicts {"role": "interviewer"/"candidate", "content": "..."}
        Returns: {"question": "...", "feedback_last_answer": "...", "score_last_answer": "...", "model_answer_last": "..."}
        """
        if not self._is_configured():
            return self._get_mock_interview_response(chat_history)

        prompt = f"""
        You are an elite Lead Engineer acting as an Interviewer. You are interviewing a candidate for the role: '{target_role}'.
        
        Candidate's Resume:
        \"\"\"{resume_text}\"\"\"
        
        Interview Conversation History:
        {json.dumps(chat_history)}

        Tasks:
        1. If this is the START (history is empty or has 0 answers), welcome the candidate and ask a targeted technical question based on their resume.
        2. If the candidate answered a previous question, read the history. Evaluate their last answer:
           - Provide constructive feedback (1-2 sentences).
           - Rate their last answer (Integer 1-10, or null if no answer).
           - Provide a concise model answer for the previous question (2 sentences).
           - Ask the NEXT logical technical or behavioral question based on their stack/level.

        Format your reply in STRICT JSON matching this schema exactly:
        {{
          "welcome_message": "String (Only for the first question, otherwise empty)",
          "feedback_last_answer": "String (Recruiter's feedback, or null if first turn)",
          "score_last_answer": "Integer (1-10 score, or null if first turn)",
          "model_answer_last": "String (Concise perfect answer, or null if first turn)",
          "question": "String (The next interview question)"
        }}
        """

        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Gemini interview failed: {str(e)}. Falling back to mock interview turn.")
            return self._get_mock_interview_response(chat_history)

    # Mock Data Fallbacks for Out-of-the-Box Operation
    def _get_mock_analysis(self):
        return {
            "applicant_name": "Sankalan",
            "ats_score": 78,
            "summary": "Sankalan presents a strong foundation in frontend technologies like React and Tailwind CSS. The backend has good structure but lacks quantifiable impact. Introducing more achievements, metrics, and backend scalability markers will significantly elevate this resume.",
            "sub_scores": {
                "formatting": 85,
                "impact": 68,
                "skills": 82,
                "achievements": 60
            },
            "strengths": [
                "Strong modern frontend expertise (React, Vite, CSS design systems)",
                "Solid understanding of REST API integration and database architectures",
                "Clean code formatting and well-structured professional layout"
            ],
            "weaknesses": [
                "Lack of quantifiable metrics (e.g. percentages, dollars, hours saved)",
                "Underrepresented backend cloud scaling and containerization skills",
                "Weak work experience bullet points starting with passive verbs"
            ],
            "suggestions": [
                {
                    "area": "Experience - Software Engineer",
                    "before": "Responsible for managing and maintaining the React frontend and connecting it to Flask APIs.",
                    "after": "Architected responsive React frontends powered by Flask RESTful APIs, reducing average page load times by 32% and enhancing user retention.",
                    "why": "This replaces passive 'responsible for' with the action-verb 'architected' and establishes a solid quantifiable business metric."
                },
                {
                    "area": "Projects - Portfolio Intelligence",
                    "before": "Made a website that analyzes resumes using AI and saves details in MongoDB.",
                    "after": "Engineered an AI-driven Resume + Portfolio platform using Gemini API and MongoDB; automated fallback storage layers to secure 99.9% app availability.",
                    "why": "Highlighting architectural decisions (like fallback layers) and direct integration metrics proves engineering maturity."
                }
            ],
            "missing_skills": {
                "critical": ["Docker / Containerization", "AWS / Cloud Deployments", "CI/CD Pipelines (GitHub Actions)"],
                "recommended": ["TypeScript", "Redis Caching", "Unit Testing (Jest/PyTest)"],
                "optional": ["Next.js", "GraphQL", "Tailwind CSS v4 CSS-Variables"]
            },
            "company_matching": [
                {
                    "type": "FAANG / Tier-1 Tech",
                    "match_percentage": 65,
                    "reasons": ["Solid framework knowledge, but needs more deep algorithmic foundations and system design scope.", "Needs to demonstrate handling high-concurrency systems."]
                },
                {
                    "type": "High-Growth Startups",
                    "match_percentage": 88,
                    "reasons": ["High agility and product creation focus. Rapidly prototypes using Flask, React, and Tailwind.", "Fits the fast-paced full-stack shipping requirements perfectly."]
                },
                {
                    "type": "Enterprise/Corporates",
                    "match_percentage": 75,
                    "reasons": ["Understands structured APIs and databases.", "Would benefit from adding enterprise architectural patterns (e.g. microservices)."]
                }
            ]
        }

    def _get_mock_portfolio_metadata(self):
        return {
            "tagline": "Crafting Scalable Full-Stack Solutions & AI Intelligence Platforms",
            "bio": "I am a passionate Full-Stack Engineer who specializes in building highly performant React interfaces, robust Flask backends, and integrating cutting-edge AI services. I write clean, modular code and focus deeply on visual micro-interactions and resilient system designs.",
            "terminal_welcome": "Welcome to TalentForge Shell v1.0.0\nType 'help' to see a list of commands, or explore my resume dashboard.",
            "terminal_commands": [
                {
                    "command": "skills",
                    "output": "Core Languages: JavaScript, Python, HTML/CSS\nFrameworks: React, Flask, Express, Tailwind CSS\nDatabases: MongoDB, PostgreSQL"
                },
                {
                    "command": "projects",
                    "output": "1. TalentForge: AI Resume & Portfolio Builder (React, Flask, MongoDB, Gemini API)\n2. Aurora: Glassmorphic E-Commerce Hub (Vite, Tailwind, Firebase)"
                },
                {
                    "command": "about",
                    "output": "Full Stack Engineer dedicated to bridging beautiful user interfaces with high-performance, fault-tolerant backend microservices."
                }
            ],
            "highlighted_projects": [
                {
                    "title": "TalentForge AI Platform",
                    "description": "Designed and deployed an end-to-end intelligence workspace that parses PDFs, performs Gemini prompt evaluations, and crafts dynamic web assets.",
                    "tech_stack": ["React", "TailwindCSS", "Flask", "Gemini API", "MongoDB"],
                    "impact_metric": "Automated asset creation in under 4 seconds"
                },
                {
                    "title": "Aurora Design System",
                    "description": "Authored an HSL-tailored dark-mode glassmorphic component framework, offering reusable modular components.",
                    "tech_stack": ["React", "Vite", "Tailwind CSS"],
                    "impact_metric": "100% responsive, sub-100ms load times"
                }
            ],
            "custom_skills_group": [
                {
                    "category": "Frontend Craft",
                    "skills": ["React", "Tailwind CSS v4", "Framer Motion", "Recharts"]
                },
                {
                    "category": "Backend & Cloud",
                    "skills": ["Flask (Python)", "RESTful APIs", "MongoDB", "Node.js", "Docker"]
                }
            ]
        }

    def _get_mock_roadmap(self, target_role):
        return {
            "target_role": target_role,
            "milestones": [
                {
                    "week_range": "Weeks 1-4",
                    "title": "Docker & Container Architecture",
                    "description": "Learn to containerize Python Flask and React configurations for scalable and identical dev/prod environments.",
                    "skills_gained": ["Docker", "Docker Compose", "Multi-stage Builds"],
                    "suggested_actions": ["Write a Dockerfile for Flask", "Configure Docker Compose for full-stack environment locally"],
                    "curated_resources": [
                        {
                            "name": "Docker for Beginners - freeCodeCamp",
                            "type": "Free Course",
                            "link": "https://www.freecodecamp.org/news/what-is-docker-used-for-a-docker-container-tutorial-for-beginners/"
                        }
                    ]
                },
                {
                    "week_range": "Weeks 5-8",
                    "title": "Cloud Deployments & Serverless",
                    "description": "Learn cloud hosting basics, deploying microservices to Render, and static frontend deployments to Vercel.",
                    "skills_gained": ["Render Hosting", "Vercel Deployments", "Environment Configs"],
                    "suggested_actions": ["Configure Render Web Service linked to GitHub", "Configure Vercel project with CLI"],
                    "curated_resources": [
                        {
                            "name": "Full Stack Cloud Deployment Guide - roadmap.sh",
                            "type": "Interactive Tutorial",
                            "link": "https://roadmap.sh/devops"
                        }
                    ]
                },
                {
                    "week_range": "Weeks 9-12",
                    "title": "Continuous Integration (CI/CD)",
                    "description": "Master GitHub Actions to automate unit tests, lint checks, and automated continuous deployment workflows.",
                    "skills_gained": ["GitHub Actions", "CI Workflows", "Automated Linting"],
                    "suggested_actions": ["Set up .github/workflows/test.yml", "Configure webhook auto-deployments"],
                    "curated_resources": [
                        {
                            "name": "GitHub Actions Official Guide",
                            "type": "Documentation",
                            "link": "https://docs.github.com/en/actions"
                        }
                    ]
                }
            ]
        }

    def _get_mock_interview_response(self, chat_history):
        if not chat_history:
            return {
                "welcome_message": "Welcome SANKALAN to your TalentForge AI Mock Technical Interview. I will act as your Lead Engineering Interviewer. Let's start with your React experience.",
                "feedback_last_answer": None,
                "score_last_answer": None,
                "model_answer_last": None,
                "question": "Can you explain how React's virtual DOM works, and how it differs from the real DOM in terms of performance and reconciliation?"
            }
        
        # Simple static mock sequence based on turn count
        turn_count = len(chat_history)
        if turn_count == 2: # 1 question + 1 answer
            return {
                "welcome_message": "",
                "feedback_last_answer": "Excellent explanation. You clearly understand the diffing algorithm and why updating the virtual DOM batch-processes layout calculations.",
                "score_last_answer": 9,
                "model_answer_last": "React maintains an in-memory representation of the UI (Virtual DOM). During reconciliation, React diffs this virtual representation against the previous snapshot, generating a minimal patch to update the real DOM via batched operations, bypassing heavy browser reflows.",
                "question": "Great! Let's pivot to the backend. In your Flask services, how do you handle security configurations like CORS, and what measures would you take to protect endpoints from heavy API abuse?"
            }
        else:
            return {
                "welcome_message": "",
                "feedback_last_answer": "Good overview of the Flask-CORS library and rate-limiting modules like Flask-Limiter.",
                "score_last_answer": 8,
                "model_answer_last": "In Flask, CORS is enabled via the Flask-CORS extension to specify origins, headers, and methods. To protect against abuse, we use Flask-Limiter to set rate limits on routes, validate all payloads using schemas (like Marshmallow), and manage API secrets strictly using environment variables.",
                "question": "Finally, let's talk databases. What are the key advantages of using MongoDB for resume storage over standard Relational databases, and how do you handle indexing for text-search in MongoDB?"
            }

# Global Instance
gemini_service = GeminiService()
