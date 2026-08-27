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
        role_lower = (target_role or "Software Engineer").lower()
        
        # 1. Frontend Developer Pathway
        if any(kw in role_lower for kw in ["frontend", "ui", "ux", "client", "designer"]):
            return {
                "target_role": target_role,
                "milestones": [
                    {
                        "week_range": "Weeks 1-4",
                        "title": "Advanced Modern UI & State Architecture",
                        "description": "Master component lifecycles, advanced React Hooks (useState, useEffect, useMemo, useCallback), and robust central state management using Redux Toolkit or Zustand.",
                        "skills_gained": ["React.js", "Custom Hooks", "Zustand State Management", "Tailwind CSS v4"],
                        "suggested_actions": ["Build a dynamic, responsive client dashboard with custom context providers", "Refactor standard inline styles to highly modular HSL tailwind configuration classes"],
                        "curated_resources": [
                            {
                                "name": "React Hooks Deep Dive - freeCodeCamp",
                                "type": "Free Course",
                                "link": "https://www.freecodecamp.org/news/react-hooks-handbook/"
                            },
                            {
                                "name": "Zustand State Management Guide",
                                "type": "Official Docs",
                                "link": "https://zustand.docs.pmnd.rs/getting-started/introduction"
                            }
                        ]
                    },
                    {
                        "week_range": "Weeks 5-8",
                        "title": "Server-Side Frameworks & Rendering Orchestrations",
                        "description": "Deep dive into Next.js frameworks, understanding Server vs Client Components, implementing Static Site Generation (SSG), Server-Side Rendering (SSR), and Incremental Static Regeneration (ISR) to secure optimal load speeds and SEO indexing.",
                        "skills_gained": ["Next.js App Router", "Server-Side Rendering", "SEO & Metadata", "Lighthouse Optimization"],
                        "suggested_actions": ["Migrate a client-side React App to a Next.js App Router project", "Improve site speed index, core web vitals, and accessibility under Lighthouse auditing"],
                        "curated_resources": [
                            {
                                "name": "Next.js Interactive Roadmap - roadmap.sh",
                                "type": "Interactive Pathway",
                                "link": "https://roadmap.sh/nextjs"
                            },
                            {
                                "name": "Web Vitals & Performance Checklist",
                                "type": "Best Practices Guide",
                                "link": "https://web.dev/vitals/"
                            }
                        ]
                    },
                    {
                        "week_range": "Weeks 9-12",
                        "title": "End-to-End Auditing, Automated Testing & CD",
                        "description": "Configure automated frontend continuous deployments to Vercel or Netlify. Master unit and component testing utilizing Vitest and advanced E2E automated user flow testing utilizing Playwright.",
                        "skills_gained": ["Playwright E2E Testing", "Vitest Unit Testing", "Vercel CD Pipelines", "GitHub Actions"],
                        "suggested_actions": ["Write comprehensive user flow and element visibility integration tests in Playwright", "Configure GitHub Actions workflow to run automated linting and tests on pull requests"],
                        "curated_resources": [
                            {
                                "name": "Playwright E2E Automation Crash Course",
                                "type": "Free Video Tutorial",
                                "link": "https://www.youtube.com/watch?v=5yH_Roc67S4"
                            },
                            {
                                "name": "Vercel Git Integration Deployment Guide",
                                "type": "Documentation",
                                "link": "https://vercel.com/docs/deployments/git"
                            }
                        ]
                    }
                ]
            }

        # 2. Backend Developer Pathway
        if any(kw in role_lower for kw in ["backend", "server", "api", "database"]):
            return {
                "target_role": target_role,
                "milestones": [
                    {
                        "week_range": "Weeks 1-4",
                        "title": "Robust Server Architectures & RESTful API Specs",
                        "description": "Design and implement high-performance, modular API servers using Flask, Node/Express, or Django. Incorporate request parsing, validation, security headers, and centralized custom exception loggers.",
                        "skills_gained": ["Flask/Express API Design", "Schema Validation", "CORS & Security Headers", "Middleware Pipelines"],
                        "suggested_actions": ["Write a scalable RESTful API with route validation schemas", "Deploy a custom error response utility that logs server exceptions automatically"],
                        "curated_resources": [
                            {
                                "name": "RESTful API Best Practices Guide",
                                "type": "Technical Article",
                                "link": "https://roadmap.sh/api"
                            },
                            {
                                "name": "Flask API Development - freeCodeCamp",
                                "type": "Free Course",
                                "link": "https://www.freecodecamp.org/news/flask-api-development-course/"
                            }
                        ]
                    },
                    {
                        "week_range": "Weeks 5-8",
                        "title": "Advanced Database Architectures & Query Tuning",
                        "description": "Integrate relational (PostgreSQL) or non-relational (MongoDB) databases. Master ACID compliance, horizontal partitioning, schema models, query profiling, and O(log N) search indexes.",
                        "skills_gained": ["PostgreSQL/MongoDB", "ACID Compliance", "Query Profiling", "Database Indexing"],
                        "suggested_actions": ["Audit and profile slow queries, adding indexes to drop database scans from O(N) to O(log N) using indexing constraints", "Configure connection pooling to support concurrent client requests safely"],
                        "curated_resources": [
                            {
                                "name": "Databases & Storage Paths - roadmap.sh",
                                "type": "Interactive Learning",
                                "link": "https://roadmap.sh/postgresql"
                            },
                            {
                                "name": "MongoDB Indexes Official Manual",
                                "type": "Documentation",
                                "link": "https://www.mongodb.com/docs/manual/indexes/"
                            }
                        ]
                    },
                    {
                        "week_range": "Weeks 9-12",
                        "title": "High-Speed In-Memory Caching & Task Queues",
                        "description": "Optimize database load by engineering cache-aside architectures with Redis. Deploy asynchronous background task managers (Celery or BullMQ) to execute heavy tasks outside the request cycle.",
                        "skills_gained": ["Redis Caching", "Celery/BullMQ Task Queues", "Asynchronous Processing", "Message Brokers"],
                        "suggested_actions": ["Integrate a Redis cache layer on high-frequency server GET routes", "Configure BullMQ/Celery to handle bulk data analysis and email generation in the background"],
                        "curated_resources": [
                            {
                                "name": "Redis Caching Patterns Guide",
                                "type": "Official Tutorial",
                                "link": "https://redis.io/docs/latest/develop/use/patterns/"
                            },
                            {
                                "name": "Asynchronous Workflows with Celery",
                                "type": "Best Practice Manual",
                                "link": "https://docs.celeryq.dev/en/stable/getting-started/first-steps-with-celery.html"
                            }
                        ]
                    }
                ]
            }

        # 3. Data Science / ML / AI Engineer Pathway
        if any(kw in role_lower for kw in ["ml", "machine", "data", "ai", "intelligence", "deep", "nlp", "analyst"]):
            return {
                "target_role": target_role,
                "milestones": [
                    {
                        "week_range": "Weeks 1-4",
                        "title": "Applied Scientific Computing & High-Volume Data Ingestion",
                        "description": "Master computational libraries (NumPy, Pandas, Polars) to parse, clean, filter, and analyze massive structured/unstructured datasets, and visualize insights utilizing Seaborn/Matplotlib.",
                        "skills_gained": ["Pandas/Polars", "Data Wrangling", "Exploratory Data Analysis (EDA)", "Data Pipelines"],
                        "suggested_actions": ["Build an automated data pipeline that ingests messy CSV/JSON logs and outputs standardized datasets", "Conduct a complete statistical profiling analysis on housing or applicant datasets"],
                        "curated_resources": [
                            {
                                "name": "Data Science with Pandas - freeCodeCamp",
                                "type": "Free Course",
                                "link": "https://www.freecodecamp.org/news/pandas-data-science-tutorial/"
                            },
                            {
                                "name": "Exploratory Data Analysis Guide",
                                "type": "Technical Overview",
                                "link": "https://roadmap.sh/ai"
                            }
                        ]
                    },
                    {
                        "week_range": "Weeks 5-8",
                        "title": "Supervised Modeling, Feature Engineering & Hyperparameter Tuning",
                        "description": "Develop classification, regression, and clustering models using Scikit-Learn. Design custom feature scaling pipelines, evaluate performance metrics, and perform cross-validation tuning.",
                        "skills_gained": ["Scikit-Learn Modeling", "Feature Engineering", "Cross-Validation", "GridSearchCV"],
                        "suggested_actions": ["Train a Random Forest classifier and tune hyperparameters utilizing GridSearchCV for optimal AUC score", "Construct a pipeline to encode categorical data, scale numerical data, and impute missing values"],
                        "curated_resources": [
                            {
                                "name": "Scikit-Learn Modeling Official Guide",
                                "type": "Documentation",
                                "link": "https://scikit-learn.org/stable/user_guide.html"
                            },
                            {
                                "name": "Machine Learning Course - Kaggle",
                                "type": "Free Course",
                                "link": "https://www.kaggle.com/learn/intro-to-machine-learning"
                            }
                        ]
                    },
                    {
                        "week_range": "Weeks 9-12",
                        "title": "Deep Neural Networks & Production MLOps Deployment",
                        "description": "Train neural networks (ANNs, CNNs) utilizing PyTorch. Transition models from notebook environments to production using Docker containerization, FastAPI web wrappers, and MLflow model registries.",
                        "skills_gained": ["PyTorch Deep Learning", "Model APIs", "MLOps", "Model Packaging"],
                        "suggested_actions": ["Build and evaluate an image classifier or text classification model using PyTorch neural layers", "Containerize your trained ML weight models inside a Docker instance and deploy as a REST API on Render"],
                        "curated_resources": [
                            {
                                "name": "PyTorch for Deep Learning Course",
                                "type": "Free Video Tutorial",
                                "link": "https://www.youtube.com/watch?v=V_xro1bcAuA"
                            },
                            {
                                "name": "MLOps Production Ingestion Guides",
                                "type": "DevOps Reference",
                                "link": "https://mlflow.org/docs/latest/index.html"
                            }
                        ]
                    }
                ]
            }

        # 4. DevOps Engineer / SRE Pathway
        if any(kw in role_lower for kw in ["devops", "sre", "infra", "cloud", "admin", "platform"]):
            return {
                "target_role": target_role,
                "milestones": [
                    {
                        "week_range": "Weeks 1-4",
                        "title": "Docker Packaging & Multi-Stage Production Containerization",
                        "description": "Package full-stack applications with high efficiency. Master Dockerfiles, multi-stage builds to drop image sizes, docker volume mounts, network bridges, and multi-service orchestrations with Docker Compose.",
                        "skills_gained": ["Docker Image Building", "Multi-stage Builds", "Docker Compose", "Persistent Storage"],
                        "suggested_actions": ["Write a secure multi-stage Dockerfile that drops client build weights by 85%", "Configure a multi-service Docker Compose ecosystem including Flask, React, and MongoDB"],
                        "curated_resources": [
                            {
                                "name": "Docker Containerization Fundamentals",
                                "type": "Free Course",
                                "link": "https://www.freecodecamp.org/news/what-is-docker-used-for-a-docker-container-tutorial-for-beginners/"
                            },
                            {
                                "name": "Docker Compose Best Practices",
                                "type": "Official Guide",
                                "link": "https://docs.docker.com/compose/"
                            }
                        ]
                    },
                    {
                        "week_range": "Weeks 5-8",
                        "title": "Infrastructure as Code (IaC) & Cloud Networks provisioning",
                        "description": "Provision robust cloud networks programmatically utilizing HashiCorp Terraform. Set up virtual networks, compute instances, load balancers, database instances, and secure groups on AWS or GCP.",
                        "skills_gained": ["Terraform IaC", "AWS Infrastructure", "Virtual Networks (VPC)", "Load Balancer Configs"],
                        "suggested_actions": ["Write reusable Terraform modules to provision an EC2 server and link it to an S3 storage bucket", "Configure AWS security groups to allow strict HTTP/HTTPS access on designated ports"],
                        "curated_resources": [
                            {
                                "name": "Terraform Cloud Provisioning Path",
                                "type": "Official Docs",
                                "link": "https://developer.hashicorp.com/terraform/tutorials"
                            },
                            {
                                "name": "AWS Architecture & Deployment Guides",
                                "type": "Interactive Map",
                                "link": "https://roadmap.sh/devops"
                            }
                        ]
                    },
                    {
                        "week_range": "Weeks 9-12",
                        "title": "Container Orchestrations & Advanced Automated CI/CD pipelines",
                        "description": "Scale applications globally using Kubernetes clusters. Configure automated continuous integration/continuous deployment pipelines utilizing GitHub Actions to auto-run unit tests, lint, and deploy.",
                        "skills_gained": ["Kubernetes", "Helm Orchestrations", "CI/CD (GitHub Actions)", "System Monitoring"],
                        "suggested_actions": ["Deploy an application cluster with replication using Kubernetes service and deployment YAMLs", "Set up a GitHub Actions workflow to build, test, and automatically push your latest build to AWS on git push"],
                        "curated_resources": [
                            {
                                "name": "Kubernetes Orchestration Crash Course",
                                "type": "Free Course",
                                "link": "https://www.youtube.com/watch?v=X48VuDVv0do"
                            },
                            {
                                "name": "GitHub Actions DevOps Automation",
                                "type": "Documentation",
                                "link": "https://docs.github.com/en/actions"
                            }
                        ]
                    }
                ]
            }

        # 5. Cybersecurity Analyst Pathway
        if any(kw in role_lower for kw in ["cyber", "security", "pentest", "hacking", "threat", "infosec"]):
            return {
                "target_role": target_role,
                "milestones": [
                    {
                        "week_range": "Weeks 1-4",
                        "title": "Network Security Audits & Packet Analysis",
                        "description": "Master core computer network protocols (TCP/IP, DNS, TLS/SSL). Analyze packet captures in Wireshark and audit system ports and service versions utilizing Nmap.",
                        "skills_gained": ["Network Security", "Wireshark Packet Analysis", "Nmap Port Audits", "Cryptography Fundamentals"],
                        "suggested_actions": ["Capture and inspect HTTP vs HTTPS handshakes in Wireshark to understand encryption differences", "Run a network security scan using Nmap on a target sandbox environment to detect exposed ports"],
                        "curated_resources": [
                            {
                                "name": "CompTIA Security+ Blueprint Course",
                                "type": "Free Prep Course",
                                "link": "https://www.freecodecamp.org/news/comptia-security-plus-course/"
                            },
                            {
                                "name": "Wireshark Network Troubleshooting Guide",
                                "type": "Documentation",
                                "link": "https://www.wireshark.org/docs/"
                            }
                        ]
                    },
                    {
                        "week_range": "Weeks 5-8",
                        "title": "Web Penetration Testing & OWASP Top 10 Audits",
                        "description": "Understand critical web vulnerabilities (SQL Injections, Cross-Site Scripting (XSS), CSRF, Broken Authentications) outlined in the OWASP Top 10, and learn how to patch them securely.",
                        "skills_gained": ["Penetration Testing", "OWASP Top 10 Auditing", "Vulnerability Remediation", "Web Sec Protocols"],
                        "suggested_actions": ["Audit a web form to detect SQL Injection vulnerability, and remediate using parameterized SQL queries", "Configure secure, HTTP-only, SameSite cookie authentication sessions to protect against session hijacking"],
                        "curated_resources": [
                            {
                                "name": "PortSwigger Web Security Academy",
                                "type": "Interactive Lab Course",
                                "link": "https://portswigger.net/web-security"
                            },
                            {
                                "name": "OWASP Top 10 Critical Risks Guide",
                                "type": "Security Standard",
                                "link": "https://owasp.org/www-project-top-ten/"
                            }
                        ]
                    },
                    {
                        "week_range": "Weeks 9-12",
                        "title": "SecOps Pipeline Integration & Incident Detection",
                        "description": "Deploy Security Information and Event Management (SIEM) log aggregators. Integrate automated SAST (Static Application Security Testing) checkers directly inside the development workflow.",
                        "skills_gained": ["SIEM Systems", "SecOps & Logging", "DevSecOps (SAST)", "Firewall Policies"],
                        "suggested_actions": ["Configure local firewalls using UFW or firewalld, logging audit triggers to SIEM dashboards", "Integrate automated security scanners (e.g. bandit, npm audit) into GitHub Actions pull request checks"],
                        "curated_resources": [
                            {
                                "name": "DevSecOps Engineering Path - roadmap.sh",
                                "type": "Interactive Map",
                                "link": "https://roadmap.sh/devops"
                            },
                            {
                                "name": "Introduction to Security Operations (SecOps)",
                                "type": "Free Course",
                                "link": "https://www.youtube.com/watch?v=uC93Xv7qW3k"
                            }
                        ]
                    }
                ]
            }

        # 6. Mobile App Developer Pathway
        if any(kw in role_lower for kw in ["mobile", "app", "ios", "android", "flutter", "native", "phone"]):
            return {
                "target_role": target_role,
                "milestones": [
                    {
                        "week_range": "Weeks 1-4",
                        "title": "Mobile Framework Architectures & Responsive Screen Layouts",
                        "description": "Learn core components of cross-platform (Flutter, React Native) or native (SwiftUI/Kotlin Jetpack Compose) frameworks. Master adaptive layouts and central state engines.",
                        "skills_gained": ["React Native/Flutter", "Adaptive Mobile UI", "Mobile State Management", "Mobile Routing"],
                        "suggested_actions": ["Design a cross-platform scrollable profile dashboard with responsive layouts for mobile and tablet", "Set up dynamic, hardware-accelerated screen transitions and multi-tier navigations"],
                        "curated_resources": [
                            {
                                "name": "React Native Mobile Dev Guide - freeCodeCamp",
                                "type": "Free Course",
                                "link": "https://www.freecodecamp.org/news/react-native-full-course/"
                            },
                            {
                                "name": "Flutter Official Layout Documentation",
                                "type": "Official Manual",
                                "link": "https://docs.flutter.dev/ui/layout"
                            }
                        ]
                    },
                    {
                        "week_range": "Weeks 5-8",
                        "title": "Local Database storage & Hardware API Integrations",
                        "description": "Integrate persistent local databases (SQLite, Realm, or Hive) to cache records. Bind hardware services including GPS Location, Camera permissions, and offline state syncing.",
                        "skills_gained": ["Local persistence (SQLite/Realm)", "Offline Data Cache", "Hardware API Integrations", "Secure Data Storage"],
                        "suggested_actions": ["Build an offline-first journal or scanner app that writes to a local SQLite database and syncs once online", "Configure secure keystore credentials to save sensitive API tokens on the device"],
                        "curated_resources": [
                            {
                                "name": "Mobile App Offline Caching Strategies",
                                "type": "Technical Overview",
                                "link": "https://roadmap.sh/android"
                            },
                            {
                                "name": "SQLite Mobile Integration Tutorial",
                                "type": "Guide",
                                "link": "https://www.youtube.com/watch?v=312H_M3yFmQ"
                            }
                        ]
                    },
                    {
                        "week_range": "Weeks 9-12",
                        "title": "Automated Device Testing & App Store Publishing CI/CD",
                        "description": "Implement mobile unit and UI widget tests. Configure Fastlane script automation to build, sign, and automatically publish beta and production bundles to Apple App Store and Google Play Console.",
                        "skills_gained": ["Mobile Testing", "Fastlane Automation", "App Store Guidelines", "Mobile CI/CD Pipelines"],
                        "suggested_actions": ["Set up automated widget integration tests to verify touch inputs and UI state reactions", "Write a Fastlane configuration file to sign binaries and upload mock release bundles to Google Play Internal Test tracks"],
                        "curated_resources": [
                            {
                                "name": "Fastlane Mobile Automation Official Guide",
                                "type": "Documentation",
                                "link": "https://docs.fastlane.tools/"
                            },
                            {
                                "name": "App Publishing Checklist - iOS & Android",
                                "type": "Best Practice Checklist",
                                "link": "https://roadmap.sh/flutter"
                            }
                        ]
                    }
                ]
            }

        # 7. Fallback Dynamic Synthesized
        role_words = [w.capitalize() for w in role_lower.split(" ") if w.strip()]
        role_title = " ".join(role_words)
        base_role = role_title.replace("Developer", "").replace("Engineer", "").replace("Analyst", "").strip()
        if not base_role:
            base_role = role_title
            
        return {
            "target_role": role_title,
            "milestones": [
                {
                    "week_range": "Weeks 1-4",
                    "title": f"Advanced Foundations & Core Tooling in {role_title}",
                    "description": f"Master the foundational architectural patterns, compiler settings, and development environments specifically utilized in professional {role_title} systems to ensure clean-code principles.",
                    "skills_gained": [f"{base_role} Core Principles", "Environment Configuration", "Clean Architecture Spec"],
                    "suggested_actions": [f"Write a standardized tool configuration for a new {base_role} project module"],
                    "curated_resources": [
                        {
                            "name": f"{role_title} Learning Map",
                            "type": "Interactive Guide",
                            "link": "https://roadmap.sh"
                        }
                    ]
                },
                {
                    "week_range": "Weeks 5-8",
                    "title": f"Production Workflows & Integration Patterns",
                    "description": f"Design and implement end-to-end processing pipelines, data storage connectors, and error-resilient middleware layers tailored to {role_title} execution contexts.",
                    "skills_gained": ["Data Processing Pipelines", "Integration Safeguards", "Error Fallback Strategies"],
                    "suggested_actions": ["Configure connection limits and asynchronous callbacks to secure 99.9% uptime"],
                    "curated_resources": [
                        {
                            "name": "Software Engineering Best Practices",
                            "type": "Technical Guide",
                            "link": "https://roadmap.sh"
                        }
                    ]
                },
                {
                    "week_range": "Weeks 9-12",
                    "title": f"Performance Auditing, Automated Tests & Release CD",
                    "description": f"Build automated verification test suites and continuous deployment release workflows to deliver secure, optimized build outputs to staging/production.",
                    "skills_gained": ["Unit & Integration Testing", "Automated Workflows (CI/CD)", "Performance Optimization"],
                    "suggested_actions": ["Configure a CI/CD script that automates code formatting checks, builds the binaries, and alerts on failures"],
                    "curated_resources": [
                        {
                            "name": "DevOps Automation and Deployment",
                            "type": "Best Practice Guide",
                            "link": "https://roadmap.sh"
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
