import React, { useState, useEffect, useRef } from "react";
import { 
  Briefcase, CheckCircle, FileText, Globe, GraduationCap, 
  MessageSquare, Settings, ShieldAlert, Sparkles, UploadCloud, 
  User, ArrowRight, Copy, Download, RefreshCw, Send, Check,
  Mail, Play, ChevronRight, Lock, Award, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:5000/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMethod, setAuthMethod] = useState(""); // "google", "email", "guest"
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showGoogleOptions, setShowGoogleOptions] = useState(false);
  const [showArchitectureModal, setShowArchitectureModal] = useState(false);
  const [showRecruiterModal, setShowRecruiterModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  
  const showToast = (message) => {
    setToastMsg(message);
  };
  
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  // Dashboard Tab States
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOffline, setIsOffline] = useState(false);
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  
  // Upload States
  const [file, setFile] = useState(null);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Portfolio States
  const [portfolioMeta, setPortfolioMeta] = useState(null);
  const [activeTheme, setActiveTheme] = useState("modern_dark");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState(false);
  const [portfolioId, setPortfolioId] = useState(null);

  // Interview States
  const [interviewId, setInterviewId] = useState(null);
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [isStartingInterview, setIsStartingInterview] = useState(false);
  const [interviewChat, setInterviewChat] = useState([]);
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [mockQuestionIndex, setMockQuestionIndex] = useState(0);
  const [isWaitingForTutorQuestion, setIsWaitingForTutorQuestion] = useState(false);
  const chatEndRef = useRef(null);

  // Roadmap States
  const [roadmap, setRoadmap] = useState(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  // Resume Builder States
  const [resumeData, setResumeData] = useState({
    name: "Sankalan",
    role: "Senior Full Stack Developer",
    email: "sankalan@demo.com",
    linkedin: "linkedin.com/in/sankalan",
    github: "github.com/sankalan",
    website: "sankalan.dev",
    summary: "Sankalan is a high-caliber developer showing solid expertise in modern frontend engineering (React, Tailwind CSS) and modular backend APIs (Flask).",
    experience: [
      {
        company: "Tech Corp",
        role: "Senior Software Developer",
        date: "2024 - Present",
        bullets: [
          "Architected responsive React frontends powered by Flask RESTful APIs, reducing average page load times by 32% and enhancing user retention.",
          "Engineered secure data coordinators with local database fallback safeguarding uptime during MongoDB cluster outages."
        ]
      }
    ],
    projects: [
      {
        title: "AI Portfolio Engine",
        bullets: [
          "Engineered an AI-driven Resume + Portfolio platform using Gemini API and MongoDB; automated fallback storage layers to secure 99.9% app availability."
        ]
      }
    ],
    skills: "React.js, Next.js, JavaScript, Python, Flask, MongoDB, Tailwind CSS, Docker, GitHub Actions, Vitest",
    education: "B.S. in Computer Science - Tech University"
  });

  const [activePreviewTab, setActivePreviewTab] = useState("preview");
  const [aiRewriteInput, setAiRewriteInput] = useState("");
  const [aiRewriteTone, setAiRewriteTone] = useState("ats");
  const [aiRewriteOutput, setAiRewriteOutput] = useState("");
  const [isOptimizingBullet, setIsOptimizingBullet] = useState(false);

  const [aiResumePrompt, setAiResumePrompt] = useState("");
  const [isGeneratingAiResume, setIsGeneratingAiResume] = useState(false);
  const [aiResumeProgress, setAiResumeProgress] = useState("");

  useEffect(() => {
    if (selectedAnalysis) {
      const applicantName = selectedAnalysis.analysis.applicant_name;
      const isUrshita = applicantName.toLowerCase() === "urshita";
      const isGuest = applicantName.toLowerCase() === "guest";
      
      if (isUrshita) {
        setResumeData({
          name: "Urshita",
          role: "Lead Backend Engineer",
          email: "urshita@demo.com",
          linkedin: "linkedin.com/in/urshita",
          github: "github.com/urshita-dev",
          website: "urshita.ai",
          summary: "Urshita presents a stellar backend foundation specializing in Python, Flask APIs, and Machine Learning algorithms (PyTorch, Scikit-Learn).",
          experience: [
            {
              company: "AI Solutions",
              role: "Lead Backend Engineer",
              date: "2024 - Present",
              bullets: [
                "Designed robust Flask ETL pipelines to process 5M+ daily records, optimizing query indexing to reduce read latency by 45%.",
                "Spearheaded database migrations and established in-memory caching using Redis clusters to support high concurrency."
              ]
            }
          ],
          projects: [
            {
              title: "ML Predictive Engine",
              bullets: [
                "Trained PyTorch and Scikit-Learn classification algorithms with hyperparameter tuning, raising accuracy to 94.6% on test sets."
              ]
            }
          ],
          skills: "Python, Flask, PyTorch, Scikit-Learn, Pandas, PostgreSQL, Redis, Docker, System Design, Git",
          education: "M.S. in Intelligent Systems - Global Tech Institute"
        });
      } else if (isGuest) {
        setResumeData({
          name: "Guest",
          role: "Software Engineer",
          email: "guest@demo.com",
          linkedin: "linkedin.com/in/guest",
          github: "github.com/guest-dev",
          website: "guest.dev",
          summary: "Highly motivated Software Engineer seeking to design, build, and optimize next-generation web architectures. Experience spans modular designs, custom client interfaces, and robust server pipelines.",
          experience: [
            {
              company: "InnovateTech Inc",
              role: "Junior Software Developer",
              date: "2024 - Present",
              bullets: [
                "Developed responsive front-end single-page applications using modern JavaScript libraries, reducing layout paint times by 20%.",
                "Assisted in maintaining robust APIs and databases to secure consistent deployment runtimes."
              ]
            }
          ],
          projects: [
            {
              title: "Portfolio Platform Showcase",
              bullets: [
                "Created an open-source visual portfolio manager showcasing customized technical projects and interactive skill timelines."
              ]
            }
          ],
          skills: "React, JavaScript, HTML5, CSS3, Tailwind CSS, Python, Git",
          education: "B.S. in Computer Science - Local University"
        });
      } else {
        setResumeData({
          name: "Sankalan",
          role: "Senior Full Stack Developer",
          email: "sankalan@demo.com",
          linkedin: "linkedin.com/in/sankalan",
          github: "github.com/sankalan",
          website: "sankalan.dev",
          summary: "Sankalan is a high-caliber developer showing solid expertise in modern frontend engineering (React, Tailwind CSS) and modular backend APIs (Flask).",
          experience: [
            {
              company: "Tech Corp",
              role: "Senior Software Developer",
              date: "2024 - Present",
              bullets: [
                "Architected responsive React frontends powered by Flask RESTful APIs, reducing average page load times by 32% and enhancing user retention.",
                "Engineered secure data coordinators with local database fallback safeguarding uptime during MongoDB cluster outages."
              ]
            }
          ],
          projects: [
            {
              title: "AI Portfolio Engine",
              bullets: [
                "Engineered an AI-driven Resume + Portfolio platform using Gemini API and MongoDB; automated fallback storage layers to secure 99.9% app availability."
              ]
            }
          ],
          skills: "React.js, Next.js, JavaScript, Python, Flask, MongoDB, Tailwind CSS, Docker, GitHub Actions, Vitest",
          education: "B.S. in Computer Science - Tech University"
        });
      }
    }
  }, [selectedAnalysis]);

  const handleGenerateAiResume = (promptText) => {
    if (!promptText.trim()) return;
    
    setIsGeneratingAiResume(true);
    setAiResumeProgress("AI analyzing your prompt details...");
    
    setTimeout(() => {
      setAiResumeProgress("Extracting technical competencies & role parameters...");
      
      setTimeout(() => {
        setAiResumeProgress("Synthesizing recruiter-optimized ATS summaries...");
        
        setTimeout(() => {
          setAiResumeProgress("Structuring dynamic project descriptions...");
          
          setTimeout(() => {
            // Determine active user details
            const isUrshitaActive = resumeData.name.toLowerCase() === "urshita" || userEmail.toLowerCase() === "urshita@demo.com";
            const defaultName = isUrshitaActive ? "Urshita" : "Sankalan";
            const defaultEmail = isUrshitaActive ? "urshita@demo.com" : "sankalan@demo.com";
            const defaultLinkedin = isUrshitaActive ? "linkedin.com/in/urshita" : "linkedin.com/in/sankalan";
            const defaultGithub = isUrshitaActive ? "github.com/urshita-dev" : "github.com/sankalan";
            const defaultWebsite = isUrshitaActive ? "urshita.ai" : "sankalan.dev";

            // Parse target role from prompt
            const promptLower = promptText.toLowerCase();
            let role = "Senior Software Engineer";
            let domain = "general";

            if (promptLower.includes("frontend") || promptLower.includes("front-end")) {
              role = "Senior Frontend Engineer";
              domain = "frontend";
            } else if (promptLower.includes("backend") || promptLower.includes("back-end")) {
              role = "Lead Backend Engineer";
              domain = "backend";
            } else if (promptLower.includes("full stack") || promptLower.includes("fullstack")) {
              role = "Senior Full Stack Developer";
              domain = "fullstack";
            } else if (promptLower.includes("devops") || promptLower.includes("sre") || promptLower.includes("cloud")) {
              role = "Lead DevOps & Cloud Engineer";
              domain = "devops";
            } else if (promptLower.includes("machine learning") || promptLower.includes("ml") || promptLower.includes("ai") || promptLower.includes("deep learning") || promptLower.includes("data scientist")) {
              role = "Lead Machine Learning & AI Architect";
              domain = "ml";
            } else if (promptLower.includes("cybersecurity") || promptLower.includes("security") || promptLower.includes("pentest") || promptLower.includes("infosec")) {
              role = "Lead Cybersecurity & Threat Analyst";
              domain = "security";
            } else if (promptLower.includes("mobile") || promptLower.includes("ios") || promptLower.includes("android") || promptLower.includes("flutter")) {
              role = "Senior Mobile Applications Developer";
              domain = "mobile";
            } else if (promptLower.includes("game") || promptLower.includes("unreal") || promptLower.includes("unity") || promptLower.includes("gameplay")) {
              role = "Senior Gameplay & Physics Engineer";
              domain = "gamedev";
            } else if (promptLower.includes("qa") || promptLower.includes("test") || promptLower.includes("automation")) {
              role = "Senior QA Automation Engineer";
              domain = "qa";
            } else if (promptLower.includes("product manager") || promptLower.includes("pm")) {
              role = "Principal Product Manager";
              domain = "product";
            }

            // Extract any company name if present
            let company = "Innovation Tech Labs";
            const companyMatch = promptText.match(/(?:at|for|in)\s+([A-Z][a-zA-Z0-9]*(?:\s+[A-Z][a-zA-Z0-9]*){0,2})/);
            if (companyMatch && companyMatch[1]) {
              const matchedComp = companyMatch[1].trim();
              const stopWords = ["the", "a", "an", "this", "my", "our", "their", "present", "recent", "past"];
              if (!stopWords.includes(matchedComp.toLowerCase())) {
                company = matchedComp;
              }
            }

            // Detect Skills
            const standardSkills = [
              "React", "Next.js", "Vue", "Angular", "HTML", "CSS", "Tailwind CSS", "JavaScript", "TypeScript",
              "Node.js", "Express", "Flask", "Django", "FastAPI", "Spring Boot", "Go", "Rust", "Java", "Python",
              "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform", "CI/CD", "Jenkins", "GitHub Actions",
              "PyTorch", "TensorFlow", "Scikit-Learn", "Pandas", "NumPy", "Redis", "PostgreSQL", "MySQL", "MongoDB",
              "Unreal Engine", "Unity", "C++", "C#", "Swift", "Kotlin", "Flutter", "React Native", "Git", "REST API",
              "GraphQL", "WebSockets", "System Design", "Microservices"
            ];
            
            let matchedSkills = [];
            standardSkills.forEach(skill => {
              const regex = new RegExp("\\b" + skill.replace(".", "\\.") + "\\b", "i");
              if (regex.test(promptText)) {
                matchedSkills.push(skill);
              }
            });

            // If no skills matched, check for capital words as potential skills
            if (matchedSkills.length === 0) {
              const words = promptText.match(/\b[A-Z][a-zA-Z0-9+#]*\b/g);
              if (words) {
                const uniqueWords = [...new Set(words)];
                const exclude = ["I", "A", "The", "Sankalan", "Urshita", "Senior", "Lead", "Tech", "Corp", "Inc", "University", "College", "Bachelor", "Master", "Science", "Present", "Work", "Project", "My", "Our"];
                uniqueWords.forEach(w => {
                  if (!exclude.includes(w) && w.length > 1) {
                    matchedSkills.push(w);
                  }
                });
              }
            }

            // Fallback default skills based on domain if none found
            if (matchedSkills.length === 0) {
              if (domain === "frontend") matchedSkills = ["React", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Git"];
              else if (domain === "backend") matchedSkills = ["Python", "Flask", "PostgreSQL", "Redis", "Docker", "Git"];
              else if (domain === "fullstack") matchedSkills = ["React", "Node.js", "JavaScript", "MongoDB", "Express", "Git"];
              else if (domain === "devops") matchedSkills = ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux"];
              else if (domain === "ml") matchedSkills = ["Python", "PyTorch", "Pandas", "NumPy", "Scikit-Learn", "Git"];
              else matchedSkills = ["React.js", "Python", "Flask", "Docker", "PostgreSQL", "Git"];
            }

            const skillsString = matchedSkills.join(", ");
            const primarySkill = matchedSkills[0] || "React";
            const secondarySkill = matchedSkills[1] || "Python";

            // Generate Professional Summary Statement
            let summary = `Dynamic and accomplishments-driven ${role} specializing in ${skillsString.split(", ").slice(0, 5).join(", ")}. Proven track record of designing high-impact web components, optimizing database layers, and scaling enterprise systems to increase system reliability.`;
            if (domain === "devops") {
              summary = `High-performing ${role} with a deep specialization in infrastructure automation, cloud security, and high-frequency deployment pipelines. Adept at leveraging ${primarySkill} and ${secondarySkill} to cut build cycles and establish scalable cloud structures.`;
            } else if (domain === "ml") {
              summary = `Stellar ${role} focused on deploying advanced predictive models, pipeline optimizations, and machine learning architectures. Highly experienced in leveraging ${primarySkill} and ${secondarySkill} to drive query performance and model accuracy.`;
            }

            // Experience Bullet Templates
            let bulletsEntry1 = [];
            let bulletsEntry2 = [];

            if (domain === "devops") {
              bulletsEntry1 = [
                `Architected and deployed highly resilient Kubernetes clusters on AWS/GCP, automating complete provisioning via Terraform to reduce provisioning cycles by 55%.`,
                `Established highly optimized CI/CD deployment pipelines using GitHub Actions, decreasing containerized build times by 40% and guaranteeing 99.99% system availability.`
              ];
              bulletsEntry2 = [
                `Maintained high-frequency Dockerized cluster environments, hardening secure microservice networks and resolving critical container configuration flags.`,
                `Collaborated on cloud integration sprints using monitoring suites to preempt cluster performance bottlenecks before user impact.`
              ];
            } else if (domain === "ml") {
              bulletsEntry1 = [
                `Engineered highly accurate predictive engines and classification algorithms using ${primarySkill} and Scikit-Learn, securing a 94.8% accuracy rate on cross-validation metrics.`,
                `Spearheaded data ingestion workflows utilizing Flask and Redis cache indexing, reducing average backend processing latency by 45% on 8M+ daily records.`
              ];
              bulletsEntry2 = [
                `Optimized high-volume database query indexes in PostgreSQL and structured modular ETL scripts, trimming average query runs by 30%.`,
                `Prepared clean data pipelines and engineered targeted analytical reports to support dynamic corporate resource allocations.`
              ];
            } else if (domain === "frontend") {
              bulletsEntry1 = [
                `Developed responsive, interactive user portals and administrative boards using React.js and Next.js, elevating overall web rendering speed by 35%.`,
                `Synthesized comprehensive modular UI components styled using Tailwind CSS, boosting Lighthouse web usability scores to a standard 98%.`
              ];
              bulletsEntry2 = [
                `Refactored legacy Javascript asset structures, shaving core bundle file weights by 28% and ensuring perfect cross-browser styling.`,
                `Collaborated with UI designers to deploy smooth keyframe animations and interactive workflows that raised click conversions by 15%.`
              ];
            } else if (domain === "backend") {
              bulletsEntry1 = [
                `Architected high-throughput backend APIs using Flask and Python, designing robust microservice models that processed 2M+ daily requests.`,
                `Integrated secure token authorization layers and designed in-memory cache structures with Redis, decreasing average database overhead by 40%.`
              ];
              bulletsEntry2 = [
                `Engineered secure database schemas and handled migrations in PostgreSQL, resolving critical index bottlenecks.`,
                `Conducted unit test suites with PyTest, raising core API test coverage to a secure 92% boundary.`
              ];
            } else if (domain === "fullstack") {
              bulletsEntry1 = [
                `Coordinated full-lifecycle software delivery of a React web app integrated with modular Flask APIs, achieving 99.9% uptime via database fallback integrations.`,
                `Engineered custom database schema structures in MongoDB and optimized asset rendering to decrease server response times by 32%.`
              ];
              bulletsEntry2 = [
                `Developed and published reusable component patterns and unified endpoints, decreasing development cycle times by 20%.`,
                `Configured Docker environments for local developer sandboxes, unifying developer setups across all internal workstations.`
              ];
            } else {
              bulletsEntry1 = [
                `Designed and implemented robust, high-performance software modules using ${primarySkill} and ${secondarySkill}, reducing processing delays by 30%.`,
                `Collaborated in agile team sprints to deploy high-value features, decreasing code review iterations by 25% and ensuring high-quality releases.`
              ];
              bulletsEntry2 = [
                `Refactored complex legacy functions into clean, testable interfaces, reducing technical debt.`,
                `Participated in deployment and configuration pipelines, establishing stable local builds for active staging layers.`
              ];
            }

            // Projects Templates
            let projects = [
              {
                title: `${primarySkill} Specialized System Engine`,
                bullets: [
                  `Developed a robust open-source tool utilizing ${primarySkill} and ${secondarySkill} that automates local staging pipelines, attracting over 1,200 GitHub stars.`,
                  `Optimized overall processing workloads and local caches to achieve an immediate 32% speed improvement on operations.`
                ]
              },
              {
                title: "Scalable Data & Insights Monitor",
                bullets: [
                  `Engineered a real-time monitor and analytics dashboard, enabling instant visual rendering of essential database system metrics.`,
                  `Integrated WebSocket protocols to support seamless updates under intensive simultaneous developer sessions.`
                ]
              }
            ];

            // Build new resumeData object
            const generatedResume = {
              name: defaultName,
              role: role,
              email: defaultEmail,
              linkedin: defaultLinkedin,
              github: defaultGithub,
              website: defaultWebsite,
              summary: summary,
              experience: [
                {
                  company: company,
                  role: role,
                  date: "2023 - Present",
                  bullets: bulletsEntry1
                },
                {
                  company: "Pinnacle Software Systems",
                  role: `Associate Software Engineer`,
                  date: "2020 - 2023",
                  bullets: bulletsEntry2
                }
              ],
              projects: projects,
              skills: skillsString,
              education: "B.S. in Computer Science - Tech University"
            };

            setResumeData(generatedResume);
            setAiResumePrompt("");
            setIsGeneratingAiResume(false);
            showToast("AI Resume synthesized successfully!");
          }, 600);
        }, 500);
      }, 500);
    }, 500);
  };

  // Fetch past analyses on load
  useEffect(() => {
    if (isLoggedIn) {
      fetchAnalyses();
    }
  }, [isLoggedIn]);

  const fetchAnalyses = async (isManual = false) => {
    try {
      const res = await fetch(`${API_BASE}/analyses`);
      if (res.ok) {
        const data = await res.json();
        setAnalyses(data);
        if (data.length > 0) {
          setSelectedAnalysis(data[0]);
        }
        setIsOffline(false);
        if (isManual) {
          showToast("Connected to Live Flask Backend API!");
        }
      } else {
        throw new Error("API Offline");
      }
    } catch (err) {
      console.log("Using Mock Mode (Backend is offline or configuring).");
      setIsOffline(true);
      
      let mockList = [];
      if (userEmail.toLowerCase() === "urshita@demo.com") {
        mockList = [getMockAnalysisRecordUrshita()];
      } else if (authMethod === "guest" || userEmail.toLowerCase() === "guest@demo.com") {
        mockList = [getMockAnalysisRecordGuest()];
      } else {
        mockList = [getMockAnalysisRecord()];
      }
      
      setAnalyses(mockList);
      setSelectedAnalysis(mockList[0]);
      if (isManual) {
        showToast("Backend offline. Gracefully fell back to Sandbox Mode.");
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("github_username", github);
    formData.append("linkedin_text", linkedin);

    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setAnalyses(prev => [data, ...prev]);
        setSelectedAnalysis(data);
        setIsOffline(false);
        setActiveTab("analyzer");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.log("Upload failed, simulating parsing in offline mode...");
      setTimeout(() => {
        const newMock = getMockAnalysisRecord();
        setAnalyses(prev => [newMock, ...prev]);
        setSelectedAnalysis(newMock);
        setIsOffline(true);
        setActiveTab("analyzer");
        setIsAnalyzing(false);
      }, 2500);
      return;
    }
    setIsAnalyzing(false);
  };

  const handleGeneratePortfolio = async () => {
    if (!selectedAnalysis) return;
    setIsGeneratingPortfolio(true);

    try {
      const res = await fetch(`${API_BASE}/portfolio/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis_id: selectedAnalysis.id })
      });
      if (res.ok) {
        const data = await res.json();
        setPortfolioMeta(data.metadata);
        setPortfolioId(data.id);
        fetchThemeHtml(data.id, activeTheme);
      } else {
        throw new Error("Portfolio gen failed");
      }
    } catch (err) {
      console.log("Fallback portfolio generation offline...");
      setTimeout(() => {
        const mockMeta = getMockPortfolioMeta();
        setPortfolioMeta(mockMeta);
        setPortfolioId("mock-port-123");
        simulateThemeHtml(mockMeta, activeTheme);
        setIsGeneratingPortfolio(false);
      }, 1500);
      return;
    }
    setIsGeneratingPortfolio(false);
  };

  const fetchThemeHtml = async (id, themeName) => {
    try {
      const res = await fetch(`${API_BASE}/portfolio/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio_id: id, theme: themeName })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedHtml(data.html);
      }
    } catch (err) {
      console.log("Error loading theme HTML");
    }
  };

  const simulateThemeHtml = (meta, themeName) => {
    const name = selectedAnalysis?.analysis?.applicant_name || "Sankalan";
    const tagline = meta.tagline;
    const bio = meta.bio;
    const projects = meta.highlighted_projects || [];
    const skills_groups = meta.custom_skills_group || [];

    let html = `
      <html>
      <head>
        <style>
          body { font-family: sans-serif; padding: 40px; color: ${themeName === "cyber_terminal" ? "#00ff66" : "#333"}; background: ${themeName === "cyber_terminal" ? "#000" : "#fff"}; }
          .card { border: 1px solid rgba(0,0,0,0.1); padding: 20px; border-radius: 8px; margin-bottom: 15px; }
          h1 { color: ${themeName === "cyber_terminal" ? "#00ff66" : "#4f46e5"}; }
        </style>
      </head>
      <body>
        <h1>${name}</h1>
        <p><strong>${tagline}</strong></p>
        <p>${bio}</p>
        <h2>Highlighted Projects</h2>
        ${projects.map(p => `
          <div class="card">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <p><strong>Stack:</strong> ${p.tech_stack?.join(", ")}</p>
            <p><strong>Impact:</strong> ${p.impact_metric}</p>
          </div>
        `).join("")}
      </body>
      </html>
    `;
    setGeneratedHtml(html);
  };

  const changeTheme = (themeName) => {
    setActiveTheme(themeName);
    if (portfolioId) {
      if (isOffline) {
        simulateThemeHtml(portfolioMeta, themeName);
      } else {
        fetchThemeHtml(portfolioId, themeName);
      }
    }
  };

  const getInterviewQuestions = (role) => {
    const roleLower = (role || "Software Engineer").toLowerCase();
    
    if (roleLower.includes("data") || roleLower.includes("ml") || roleLower.includes("machine") || roleLower.includes("intelligence") || roleLower.includes("backend")) {
      return [
        {
          question: "Can you explain the difference between L1 and L2 regularization, and when you would use one over the other?",
          keywords: ["l1", "l2", "lasso", "ridge", "sparsity", "absolute", "squared", "penalty", "feature selection", "overfitting"],
          modelAnswer: "L1 regularization (Lasso) adds an absolute value penalty to the weights, forcing some coefficients to exactly zero, which acts as feature selection. L2 regularization (Ridge) adds a squared penalty, shrinking weights towards zero but not making them zero, which is ideal when you have many collinear features.",
          nextQuestion: "How would you design a data pipeline to ingest 10 million real-time sensor events per second and store them for ML training?",
          topic: "ML Regularization"
        },
        {
          question: "How would you design a data pipeline to ingest 10 million real-time sensor events per second and store them for ML training?",
          keywords: ["kafka", "spark", "flink", "s3", "parquet", "batch", "stream", "queue", "partition", "ingest", "buffer"],
          modelAnswer: "Use an ingestion broker like Apache Kafka or AWS Kinesis to buffer the incoming high-velocity data. Connect a stream processing engine like Spark Streaming or Flink to batch and partition the data, saving it in a compressed columnar format like Parquet inside cloud object storage (e.g. AWS S3) for optimal ML training speed.",
          nextQuestion: "Can you explain what gradient vanishing is in Deep Learning and how to mitigate it?",
          topic: "Data Pipeline Ingestion"
        },
        {
          question: "Can you explain what gradient vanishing is in Deep Learning and how to mitigate it?",
          keywords: ["vanishing", "gradient", "relu", "resnet", "activation", "sigmoid", "residual", "backpropagation", "batch norm", "normalization"],
          modelAnswer: "Gradient vanishing occurs when gradients shrink exponentially during backpropagation in deep neural networks, making early layers learn very slowly. It can be mitigated using ReLU activations instead of Sigmoid, implementing residual connections (like in ResNet), and applying Batch Normalization.",
          nextQuestion: "",
          topic: "Vanishing Gradients"
        }
      ];
    }
    
    // Default / Software Engineer questions
    return [
      {
        question: "Can you explain React's Virtual DOM and how reconciliation works?",
        keywords: ["copy", "diff", "reconciliation", "memory", "reconcile", "dom", "render", "fast", "component", "state", "virtual"],
        modelAnswer: "React maintains a lightweight copy of the real DOM in memory (the Virtual DOM). On state changes, it generates a new Virtual DOM tree, diffs it against the previous tree (reconciliation), and batches the required updates to the browser DOM to minimize expensive reflows.",
        nextQuestion: "How would you design a robust database fallback strategy in a Flask API when your primary MongoDB database is unreachable, ensuring absolute system availability?",
        topic: "React Virtual DOM"
      },
      {
        question: "How would you design a robust database fallback strategy in a Flask API when your primary MongoDB database is unreachable, ensuring absolute system availability?",
        keywords: ["fallback", "cache", "local", "json", "offline", "redis", "write", "backup", "try", "except", "retry"],
        modelAnswer: "Wrap MongoDB connections in try-except clauses. If unreachable, trigger a fallback mechanism that writes transactions to a local fallback file (like `mock_db.json`) or a fast local cache like Redis, then spawn a background thread to retry connection and sync data once MongoDB is online.",
        topic: "Database Fallback Strategy",
        nextQuestion: "Why is containerization (Docker) crucial for a modern full-stack web application, and how does it prevent the 'it works on my machine' bug?"
      },
      {
        question: "Why is containerization (Docker) crucial for a modern full-stack web application, and how does it prevent the 'it works on my machine' bug?",
        keywords: ["docker", "container", "image", "environment", "dependency", "same", "isolate", "portability", "works"],
        modelAnswer: "Docker packages the application code, dependencies, libraries, runtime environment, and configurations into a single standardized container image. Because the container carries its own environment, it executes identically across local development, staging, and live production environments.",
        topic: "Docker Containerization",
        nextQuestion: ""
      }
    ];
  };

  const handleStartInterview = async () => {
    if (!selectedAnalysis) return;
    setIsStartingInterview(true);
    setInterviewChat([]);
    setLastFeedback(null);
    setMockQuestionIndex(0);
    setIsWaitingForTutorQuestion(false);

    try {
      const res = await fetch(`${API_BASE}/interview/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis_id: selectedAnalysis.id, target_role: targetRole })
      });
      if (res.ok) {
        const data = await res.json();
        setInterviewId(data.interview_id);
        setInterviewChat([{ role: "interviewer", content: data.question }]);
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      console.log("Mocking interview engine...");
      const questionsList = getInterviewQuestions(targetRole);
      setTimeout(() => {
        setInterviewId("mock-int-123");
        setInterviewChat([
          { role: "interviewer", content: `Welcome ${selectedAnalysis.analysis.applicant_name} to your Sandbox AI technical interview for '${targetRole}'. Let's start with your first core topic. ${questionsList[0].question}` }
        ]);
        setIsStartingInterview(false);
      }, 1200);
      return;
    }
    setIsStartingInterview(false);
  };

  const isCasualOrConversational = (text) => {
    const clean = text.trim().toLowerCase().replace(/[!.,?]/g, "");
    if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|yo|sup)$/i.test(clean)) return true;
    if (/^(thanks|thank you|ty|appreciate it|much appreciated|thanks a lot|great help)$/i.test(clean)) return true;
    if (/^(ok|okay|cool|awesome|great|perfect|nice|sure|yes|yep|agree|ready|let's go|lets go|i'm ready|im ready|start|begin|go)$/i.test(clean)) return true;
    if (clean.length < 8 && !clean.includes("?") && !clean.includes("cant") && !clean.includes("can't") && !clean.includes("dont") && !clean.includes("don't") && !clean.includes("know") && !clean.includes("idea") && clean !== "no" && clean !== "nope") return true;
    return false;
  };

  const generateConversationalResponse = (query, role, history = []) => {
    const cleanQuery = query.trim();
    const lowerQuery = cleanQuery.toLowerCase();

    // Context Extraction: search back in history for active topics
    let lastDiscussedTopic = "Systems Design";
    const historyToScan = [...history].reverse();
    for (const msg of historyToScan) {
      if (msg.role === "interviewer") {
        // Try extracting terms from the last interviewer response
        const topics = ["sharding", "virtual dom", "indexing", "rest", "graphql", "caching", "docker", "kubernetes", "ci/cd", "solid", "oauth", "jwt", "websockets", "load balancer", "regularization", "gradient vanishing", "data pipeline"];
        for (const t of topics) {
          if (msg.content.toLowerCase().includes(t)) {
            lastDiscussedTopic = t.charAt(0).toUpperCase() + t.slice(1);
            break;
          }
        }
        if (lastDiscussedTopic !== "Systems Design") break;
      }
    }

    // 1. Intent: Follow-up questions asking "why", "explain more", "give example", "elaborate"
    const isWhyQuestion = /\b(why|reason|purpose|what is the point)\b/i.test(lowerQuery);
    const isElaborateQuestion = /\b(explain more|elaborate|go deeper|tell me more|dont understand|explain it again|clarify)\b/i.test(lowerQuery);
    const isExampleQuestion = /\b(example|show me|give me an example|code snippet|demonstrate)\b/i.test(lowerQuery);
    
    // Check for "vs" or "difference between" comparison
    const isComparisonQuestion = /\b(vs|versus|difference between|compare)\b/i.test(lowerQuery);

    if (isComparisonQuestion) {
      // Find terms
      let termA = "SQL";
      let termB = "NoSQL";
      if (lowerQuery.includes("sql") && lowerQuery.includes("nosql")) {
        termA = "SQL (Relational)"; termB = "NoSQL (Non-Relational)";
      } else if (lowerQuery.includes("rest") && lowerQuery.includes("graphql")) {
        termA = "REST APIs"; termB = "GraphQL";
      } else if (lowerQuery.includes("l1") && lowerQuery.includes("l2")) {
        termA = "L1 Regularization"; termB = "L2 Regularization";
      } else if (lowerQuery.includes("docker") && lowerQuery.includes("kubernetes")) {
        termA = "Docker Containers"; termB = "Kubernetes Clusters";
      } else {
        // Extract dynamically if possible
        const vsIndex = lowerQuery.indexOf("vs");
        if (vsIndex > -1) {
          const parts = lowerQuery.split(/\bvs\b/);
          if (parts[0] && parts[1]) {
            termA = parts[0].trim().replace(/^(explain|compare|what is the difference between)\s+/i, "");
            termB = parts[1].trim().replace(/\?+$/g, "");
            termA = termA.charAt(0).toUpperCase() + termA.slice(1);
            termB = termB.charAt(0).toUpperCase() + termB.slice(1);
          }
        }
      }

      return `📊 **Side-by-Side Comparison: ${termA} vs ${termB}**

Here is a senior engineering breakdown of how these paradigms align:

| Technical Dimension | ${termA} | ${termB} |
| :--- | :--- | :--- |
| **Core Philosophy** | Structured, normalized, contract-first layouts. | Scalable, document/key-value or event-driven structures. |
| **Execution Speeds** | Highly performant for complex indexed queries & joins. | Sub-millisecond reads/writes for horizontal, distributed scales. |
| **Data Schema** | Strict ACID transactional compliance with explicit relations. | Flexible, dynamic BSON/JSON schemas allowing rapid migrations. |
| **Operational Downside** | Vertical bottlenecks; complex sharding operations at FAANG level. | Shifts validation to backend; eventual consistency latencies. |

💡 **Architectural Summary**: Choose **${termA}** when data integrity, structural relations, and full transaction guarantees are your highest priorities. Pivot to **${termB}** when you need infinite horizontal scaling, rapid schema iterations, or high-volume serverless ingestion.

Would you like me to supply a practical code skeleton or walk through a production system design for either of these?`;
    }

    if (isWhyQuestion && lastDiscussedTopic !== "Systems Design") {
      return `❓ **Deep Dive: Why we utilize ${lastDiscussedTopic}**

In large-scale enterprise microservices, **${lastDiscussedTopic}** is deployed for three primary reasons:
1. **Preventing Latency Bottlenecks**: It bypasses structural bottlenecks (e.g. disk-seek limits, single-thread limitations, DOM layout reflow calculations) to secure stable, sub-100ms round trips.
2. **Horizontal Scalability & Portability**: It separates state dependencies so you can spin up or down nodes dynamically without introducing synchronization lag.
3. **Operational Resilience**: It establishes robust sandboxing (e.g. Docker sandboxes or local database caches) to safeguard active processes during cloud resource outages.

Without **${lastDiscussedTopic}**, systems face high concurrency lag, tight coupling, and extreme single-point-of-failure vulnerabilities.

Would you like me to write a clean code sample or outline a production deployment schematic for **${lastDiscussedTopic}**?`;
    }

    if (isElaborateQuestion && lastDiscussedTopic !== "Systems Design") {
      return `🔍 **Elaborating on the mechanics of ${lastDiscussedTopic}**

Let's peel back the layers on how **${lastDiscussedTopic}** actually executes under the hood:

- **State Syncing & Verification**: When an operation begins, the system intercepts details (like component trees, data indexes, or event buffers) to compute differences in high-speed virtual memory.
- **Resource Batching**: Instead of executing writes or changes individually (which triggers heavy operational overhead), the runtime compiles alterations into an optimized transaction queue (a single pipeline patch).
- **Asynchronous Sync Blocks**: A background dispatcher ensures that secondary connections (caches, standby nodes, replica logs) stay in lockstep without blocking client threads.

### 💡 Recruiter Tip:
When discussing this in senior interview rounds, emphasize that your selection of **${lastDiscussedTopic}** isn't arbitrary. Talk about the *trade-offs*—explain how you balanced CPU execution vs storage memory constraints to optimize performance!

Should we explore a specific code implementation, or jump back to our mock rounds?`;
    }

    if (isExampleQuestion && lastDiscussedTopic !== "Systems Design") {
      // Return a code sample for the active topic
      let topic = lastDiscussedTopic;
      let codeSnippet = "";
      if (topic.toLowerCase().includes("react") || topic.toLowerCase().includes("dom")) {
        codeSnippet = `\`\`\`javascript
// Efficient client rendering showing batch updating and React hooks
import React, { useState, useMemo } from 'react';

export function BalancedGrid({ items }) {
  const [filter, setFilter] = useState("");

  // Memoize search calculations to bypass Virtual DOM recalculation speeds
  const filteredList = useMemo(() => {
    return items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));
  }, [items, filter]);

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl">
      <input 
        type="text" 
        className="w-full p-2 mb-4 text-black rounded"
        placeholder="Filter list..."
        onChange={e => setFilter(e.target.value)}
      />
      <ul>
        {filteredList.map(item => <li key={item.id} className="py-1">{item.name}</li>)}
      </ul>
    </div>
  );
}
\`\`\``;
      } else if (topic.toLowerCase().includes("shard") || topic.toLowerCase().includes("db") || topic.toLowerCase().includes("index") || topic.toLowerCase().includes("fallback")) {
        codeSnippet = `\`\`\`python
# Advanced Database connection coordinator with local file fallback
import json
import logging

class DatabaseCoordinator:
    def __init__(self, primary_db):
        self.primary = primary_db
        self.fallback_file = "local_db_fallback.json"

    def execute_transaction(self, data):
        try:
            # Try main transaction write
            self.primary.insert(data)
            logging.info("Primary DB write successful")
        except Exception as err:
            logging.warning(f"Primary DB offline! Falling back to local logs. Error: {err}")
            self.write_to_fallback(data)

    def write_to_fallback(self, data):
        try:
            with open(self.fallback_file, "a+") as f:
                f.write(json.dumps(data) + "\\n")
            logging.info("Successfully saved local fallback data")
        except Exception as e:
            logging.error(f"Critical data loss! Fallback file failed: {e}")
\`\`\``;
      } else {
        codeSnippet = `\`\`\`javascript
// General performant system queue dispatcher pattern
class TaskQueue {
  constructor() {
    this.queue = [];
    this.active = false;
  }
  
  enqueue(task) {
    this.queue.push(task);
    if (!this.active) this.processNext();
  }
  
  async processNext() {
    if (this.queue.length === 0) {
      this.active = false;
      return;
    }
    this.active = true;
    const task = this.queue.shift();
    try {
      await task();
    } catch(e) {
      console.error("Task failed in queue:", e);
    }
    this.processNext();
  }
}
\`\`\``;
      }
      return `💻 **Practical Code Showcase for ${topic}**

Here is a clean, modular code pattern demonstrating how this is implemented:

${codeSnippet}

### ⚙️ Production Highlights:
1. **State Isolation**: Encapsulates connections and data mutations securely to avoid memory leaks.
2. **Error Catch Blocks**: Prevents runtime crashes using clear exceptions, fallback mechanisms, and queue handlers.

What other tech stack questions or code exercises would you like to solve?`;
    }

    // 2. Intent: Greetings
    if (/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening|yo)\b/i.test(lowerQuery)) {
      const activeName = resumeData?.name || "Guest";
      return `Hello ${activeName}! 👋 I am your omniscient AI Career Coach and Lead Technical Interviewer. 

I am equipped with a deep computer science encyclopedia, dynamic code generators, system design compilers, and ATS-optimized resume guidelines. I can write production-grade code, teach you advanced software architecture concepts, analyze data structures, or run realistic technical mock interviews!

What should we explore together? You can ask me *any* type of message (e.g. *"explain OAuth"*, *"show me React hooks code"*, *"how does a rocket fly?"*, *"tell me a joke"*, or ask about career advice)!`;
    }

    // 3. Intent: Thanks
    if (/\b(thanks|thank you|ty|appreciate|helpful)\b/i.test(lowerQuery)) {
      return `You are very welcome! Helping you master these complex subjects, sound like a seasoned Principal Engineer, and build your confidence is exactly what I am programmed for.

What should we conquer next? Feel free to ask me another systems architecture question, request a coding challenge, or type **"continue"** to return to our interview rounds!`;
    }

    // 4. Intent: Positive Acknowledgment
    if (/^(ok|okay|cool|awesome|great|perfect|nice|sure|yes|yep|agree)$/i.test(lowerQuery.replace(/[!.]/g, ""))) {
      return `Excellent! Keep in mind that in senior technical roles, communicating these high-level architectural patterns clearly is just as important as writing clean code.

What computer science, coding, or general topic should we break down next? Ask me anything!`;
    }

    // 4.5. Intent: Negative Acknowledgment
    if (/^(no|nope|nah|not really|sorry|apologies)$/i.test(lowerQuery.replace(/[!.]/g, ""))) {
      return `No problem at all! We can adjust the direction. If there is a specific concept you'd rather review, a coding task you want to see, or a different topic you want to learn, just say the word. 

What should we explore next?`;
    }

    // 5. Creative Intent: Jokes
    if (/\b(joke|funny|laugh|humor)\b/i.test(lowerQuery)) {
      const jokes = [
        `🤖 Here's a classic: **Why do programmers wear glasses?** \n\nBecause they don't **C#**! 🤓`,
        `🤖 Here's one for database engineers: \n\n**A SQL query walks into a bar, walks up to two tables and asks, "Can I join you?"** 📊`,
        `🤖 Here is a classic logic joke:\n\nThere are **10 types of people** in the world: those who understand binary, and those who don't! 💻`,
        `🤖 Here's a developer's real-life horror story:\n\n**"How many programmers does it take to change a light bulb?"**\nNone, that's a hardware problem! 💡`
      ];
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      return randomJoke + `\n\nHope that brought a smile to your face! What should we build or analyze next?`;
    }

    // 6. Creative Intent: Poems
    if (/\b(poem|poetry|rhyme|song)\b/i.test(lowerQuery)) {
      return `📝 **The Symphony of Code**

*A compilation of keystrokes, standard and clear,*
*A system of logic that conquers all fear.*
*From the Virtual DOM where frontends align,*
*To PostgreSQL indexes that query in time.*

*We package our structures in Docker's clean hold,*
*While Kubernetes clusters scale strong and scale bold.*
*No bugs shall survive the clean tests that we run,*
*As our CI/CD pipelines fly towards the sun.*

*So type out your variables, commit all your lines,*
*As the light of the screen in the darkness refines.*
*For inside the syntax of loops and requests,*
*We build out the future, and conquer the tests.*

What other creative prompts or coding problems would you like me to tackle?`;
    }

    // 7. Profile Specific Guidance
    if (/\b(my resume|my profile|how is my resume|review my resume|give me advice|what should i study|what skills)\b/i.test(lowerQuery)) {
      const activeName = resumeData?.name || "Guest";
      if (activeName.toLowerCase() === "sankalan") {
        return `📋 **Sankalan's Personal Profile Optimization Strategy**:

You possess an exceptional frontend and full-stack toolkit! Your experience building responsive **React** apps, integrating **Flask REST APIs**, and architecting **offline MongoDB fallback layers** shows massive senior developer caliber.

**🎯 Key Recommendations to sound like a Lead Engineer:**
1. **Deepen Cloud/DevOps**: Highlight AWS configurations, Terraform for Infrastructure as Code (IaC), and containerization patterns using Docker in your work bullets.
2. **Quantify Metrics**: Instead of *"responsible for databases"*, write *"Engineered resilient data pipelines supporting 20,000 active sessions and reducing query latencies by 35%"*.
3. **Advanced Frontend**: Study Next.js Server Actions, custom React render pipelines, and Lighthouse performance metrics.

Would you like me to generate a fully customized work experience bullet point or start a systems engineering mock interview?`;
      } else if (activeName.toLowerCase() === "urshita") {
        return `📋 **Urshita's Personal Profile Optimization Strategy**:

You present a world-class backend and machine learning profile! Your experience with **Python/Flask ETL pipelines**, **Redis cache clustering**, **SQL indexing**, and **PyTorch predictive models** shows fantastic mathematical and systems depth.

**🎯 Key Recommendations to sound like an AI/ML Architect:**
1. **Frontend Bridges**: Learn React state patterns and Tailwind styling to represent yourself as a versatile, full-stack contributor when leading features.
2. **MLOps Deployment**: Highlight how you containerized your PyTorch weight files using Docker and scaled model queries with high-velocity FastAPI web routes.
3. **Enterprise Storage**: Discuss query optimization profiling, partition limits, and asynchronous task execution (using Celery/RabbitMQ).

Would you like me to draft a high-impact NLP project bullet point, or start an AI/ML systems engineering mock interview?`;
      } else {
        return `📋 **Guest Profile Exploration & Career Guidance**:

Welcome! You are exploring TalentForge under a **Guest Account**. 

**🎯 How to maximize your career score using our Sandbox:**
1. **AI Resume Maker**: Go to the **AI Resume Maker** tab. You can fully customize your name, skills, and projects, or type an AI prompt like *"Generate a Senior Cloud Engineer resume"* to compile a high-fidelity template in real-time.
2. **ATS Scorecard**: Review your missing skills. Adding critical elements (like **Docker**, **AWS**, or **TypeScript**) will dynamically raise your match percentages for FAANG and High-Growth startups.
3. **Mock Interviews**: Continue our technical rounds. Try discussing real-world trade-offs, B-Tree indexes, and caching strategies.

What is your target role, or what computer science topic should we learn next?`;
      }
    }

    // 8. Intent: Code Requests
    if (/\b(code|function|program|write a|snippet|example of|implement|write python|write javascript|sql query)\b/i.test(lowerQuery)) {
      let codeSnippet = "";
      let topic = "Binary Search";
      
      if (lowerQuery.includes("binary search")) {
        topic = "Binary Search";
        codeSnippet = `\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        # Check if target is present at mid
        if arr[mid] == target:
            return mid
        # If target is greater, ignore left half
        elif arr[mid] < target:
            left = mid + 1
        # If target is smaller, ignore right half
        else:
            right = mid - 1
            
    return -1  # Target is not present
\`\`\``;
      } else if (lowerQuery.includes("react") || lowerQuery.includes("hook") || lowerQuery.includes("useeffect")) {
        topic = "React State Hook";
        codeSnippet = `\`\`\`javascript
import React, { useState, useEffect } from 'react';

export default function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    
    // Simulate API request
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        if (active) {
          setUser(data);
          setLoading(false);
        }
      });
      
    return () => {
      active = false; // Clean up subscriptions
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>Welcome, {user.name}!</div>;
}
\`\`\``;
      } else if (lowerQuery.includes("sql") || lowerQuery.includes("join") || lowerQuery.includes("index")) {
        topic = "Optimized SQL Join & Indexing";
        codeSnippet = `\`\`\`sql
-- Create database index on foreign key for O(log N) lookup speeds
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- Execute optimized JOIN across tables
SELECT 
    c.customer_id, 
    c.first_name, 
    COUNT(o.order_id) AS total_orders, 
    SUM(o.amount) AS total_spent
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'completed'
GROUP BY c.customer_id, c.first_name
HAVING SUM(o.amount) > 500
ORDER BY total_spent DESC;
\`\`\``;
      } else if (lowerQuery.includes("flask") || lowerQuery.includes("api") || lowerQuery.includes("route")) {
        topic = "Flask RESTful API Route";
        codeSnippet = `\`\`\`python
from flask import Flask, jsonify, request

app = Flask(__name__)

# Sample offline db
USERS = {1: {"name": "Sankalan"}, 2: {"name": "Urshita"}}

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    # Try-except safeguard block
    try:
        user = USERS.get(user_id)
        if user:
            return jsonify({"status": "success", "data": user}), 200
        return jsonify({"status": "error", "message": "User not found"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
\`\`\``;
      } else {
        topic = "Custom Utility Function";
        codeSnippet = `\`\`\`javascript
// Highly performant memoization wrapper pattern
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key); // Fast cache hit
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Example usage: Memoized recursive fibonacci (O(N) time complexity)
const fib = memoize((n) => {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
});
\`\`\``;
      }

      return `Here is a clean, recruiter-grade code implementation for **${topic}** utilizing best-practice architectures and clean code standards:

${codeSnippet}

### 💡 Engineering Breakdown:
1. **Algorithmic Efficiency**: This implementation prioritizes optimal space/time complexity bounds (e.g. constant O(1) lookups or log O(log N) splits).
2. **Error Safeguards**: Includes robust boundary conditions (such as map caches, try-except blocks, or React clean-up effects) to ensure stability in production.

What other coding example or algorithmic concept would you like to review?`;
    }

    // 9. Technical Concept Dictionary Lookup
    const richGlossary = {
      "sharding": {
        concept: "Database Sharding is a horizontal partitioning technique that splits a single large database table across multiple physical database instances (shards). Unlike vertical scaling (adding CPU or RAM), sharding distributes both the storage workload and read/write request traffic across multiple distinct nodes.",
        production: "In production, sharding is orchestrated using either hash-based algorithms (hashing a key like `user_id` to determine the target shard) or range-based boundaries. Load-balancing routers intercept queries, parse the shard key, and direct the transaction solely to the target shard. Sharding is heavily used in distributed datastores like Cassandra or MongoDB.",
        tradeoffs: "While it enables near-infinite horizontal scaling, sharding introduces immense complexity. Cross-shard JOINs are highly expensive and usually forbidden, database transactions across shards require complex two-phase commits, and re-sharding (re-balancing nodes when a shard gets full) introduces significant operational overhead."
      },
      "virtual dom": {
        concept: "React's Virtual DOM is a lightweight, in-memory representation of the real browser DOM. Instead of manipulating the heavy HTML DOM tree directly (which triggers expensive browser style recalculations and layout reflows), React performs changes in virtual memory first.",
        production: "When a component's state changes, React generates a new Virtual DOM tree. It then executes a highly optimized diffing algorithm (Reconciliation) to compare this new tree with the previous Virtual DOM tree. It identifies the exact minimum set of differences (the patch) and batches those updates, applying them to the real DOM in a single pass.",
        tradeoffs: "The Virtual DOM provides excellent developer abstraction and high UI responsiveness. However, for extremely high-frequency graphics or heavy real-time data visualizers (like canvas elements or stock charts), the Virtual DOM diffing overhead can occasionally be slower than direct, hand-tuned vanilla JS element updates."
      },
      "indexing": {
        concept: "Database Indexing is a database optimization technique that creates auxiliary data structures (typically B-Trees or Hash tables) on specific table columns. Much like a book's index, it allows the query executor to find requested records without reading every single row in the database.",
        production: "In modern relational databases like PostgreSQL or MySQL, creating an index on a column (e.g. `CREATE INDEX idx_user ON users(email)`) transforms query lookups from O(N) linear sequential scans to highly efficient O(log N) binary tree traversals. This cuts query times from seconds to fractions of a millisecond.",
        tradeoffs: "The primary trade-off is write performance and storage overhead. Every time a row is INSERTED, UPDATED, or DELETED, the database must write to both the data table and recalculate all corresponding column indexes, which can slow down write-intensive ingestion pipelines. Indexes also occupy significant disk space."
      },
      "rest": {
        concept: "REST (Representational State Transfer) is a Stateless, resource-oriented architectural style for designing networked APIs. It relies on standard HTTP methods (GET, POST, PUT, DELETE) and standard HTTP status codes (200 OK, 404 Not Found, 500 Internal Error) to represent and manipulate data resources.",
        production: "RESTful APIs map resources directly to URLs (e.g. `GET /api/users/42`). They are lightweight, stateless (each request carries all necessary context), and heavily cacheable via standard CDN or gateway caching protocols.",
        tradeoffs: "The biggest drawback is resource over-fetching and under-fetching. A client might only want a user's `first_name`, but the REST endpoint returns a massive JSON payload with 40 fields (over-fetching). Conversely, displaying a dashboard might require triggering 5 distinct API calls to different endpoints (under-fetching), raising mobile network latency."
      },
      "graphql": {
        concept: "GraphQL is a strongly typed query language and API runtime developed by Facebook. Unlike REST, which provides multiple static resource endpoints, GraphQL exposes a single unified endpoint (typically `/graphql`) where clients can request exactly the data fields they need and nothing more.",
        production: "Clients submit a structured JSON-like query detailing specific fields and nested relationships. The GraphQL server uses a schema and resolver functions to traverse databases or other microservices in parallel, aggregating the exact fields and returning a structured response matching the query shape.",
        tradeoffs: "GraphQL completely eliminates over-fetching and under-fetching, boosting performance on mobile devices. However, it shifts significant query complexity to the backend, makes traditional HTTP-level caching difficult (since all requests are HTTP POST), and introduces vulnerability vectors like recursive queries that can crash servers if not restricted."
      },
      "caching": {
        concept: "Caching is the process of storing copies of active or frequently requested data in a transient, ultra-fast memory layer (like Redis, Memcached, or local server RAM). This allows subsequent requests for the same data to be served instantly, bypassing expensive database lookups or calculations.",
        production: "In web architectures, a cache-aside pattern is standard: when an API receives a request, it first checks the Redis cache. On a 'cache hit', it returns the data instantly. On a 'cache miss', it queries PostgreSQL, writes the result to Redis for future requests, and returns the response.",
        tradeoffs: "Caching raises system speed from O(N) disk times to O(1) memory speeds. However, it introduces cache invalidation challenges (making sure the cached data stays in sync with the primary database when edits occur) and raises infrastructure costs since RAM is significantly more expensive than SSD storage."
      },
      "docker": {
        concept: "Docker is a containerization platform that packages an application's source code, runtime binaries, dependencies, libraries, and configurations into a single, standardized, lightweight container image. This image acts as an isolated, immutable sandbox.",
        production: "Because a container image carries its entire environment with it, it runs identically across local development machines, staging clusters, and live production environments. This completely solves the infamous 'it works on my machine' developer bug.",
        tradeoffs: "Containers start up in milliseconds and consume significantly fewer resources than traditional Virtual Machines (VMs) because they share the host OS kernel instead of hypervising guest kernels. However, sharing the host kernel introduces slight security isolation risks compared to strict VM hypervisors."
      },
      "kubernetes": {
        concept: "Kubernetes (often abbreviated as K8s) is an open-source container orchestration platform originally designed by Google. It automates the complete lifecycle of containerized applications, handling deployment scaling, failovers, load balancing, and health monitoring.",
        production: "In production, Kubernetes manages clusters of server nodes. It continuously monitors the state of container groups (Pods) against a declared YAML target configuration. If a container crashes, K8s restarts it automatically (self-healing); if traffic spikes, it scales the number of running containers dynamically.",
        tradeoffs: "K8s provides unparalleled infrastructure portability, automated scaling, and cluster resilience. However, it has a steep learning curve and introduces massive operational complexity, making it overkill for small applications or startups with simple deployment needs."
      },
      "ci/cd": {
        concept: "CI/CD (Continuous Integration and Continuous Deployment) is a software engineering practice that automates the integration, testing, packaging, and deployment of code changes. Continuous Integration merges developer code frequently into a shared main branch, running automated builds and tests. Continuous Deployment automatically ships those validated builds to production.",
        production: "A typical CI/CD pipeline (configured inside Git triggers like GitHub Actions, GitLab CI, or Jenkins) is activated on a Git push. It automatically boots a clean container, runs linters, compiles tests (unit, integration, end-to-end), builds a Docker image, pushes it to a registry, and updates the Kubernetes cluster.",
        tradeoffs: "CI/CD dramatically raises developer velocity, enforces high code quality, and secures stable deployment loops. The trade-off is the initial time and operational cost required to write, debug, and maintain complex CI/CD scripts and test suites."
      },
      "solid": {
        concept: "SOLID is an acronym for five foundational software design principles articulated by Robert C. Martin. They are: Single Responsibility (SRP), Open/Closed (OCP), Liskov Substitution (LSP), Interface Segregation (ISP), and Dependency Inversion (DIP).",
        production: "Applying SOLID ensures codebases are highly modular, decoupled, and easy to scale. For example, applying Dependency Inversion (DIP) ensures high-level business logic depends on clean abstractions (interfaces) rather than low-level details, enabling developers to switch secondary systems (like swapping PostgreSQL for MongoDB) without rewriting code.",
        tradeoffs: "SOLID dramatically improves software maintainability and testability. However, over-engineering simple applications to satisfy all five principles can lead to excessive interfaces and files, increasing development time and cognitive overhead for simple tasks."
      },
      "oauth": {
        concept: "OAuth 2.0 is an industry-standard authorization framework that enables third-party applications to obtain limited access to user accounts on an HTTP service (like Google, GitHub, or Facebook) without sharing the user's primary password credentials.",
        production: "In production, the application redirects the user to the Identity Provider (IdP). Upon successful authentication, the IdP sends a temporary Authorization Code back to the redirect URI. The backend exchanges this code for an Access Token (and optionally a Refresh Token) to securely fetch profile details.",
        tradeoffs: "It drastically improves user security and friction by consolidating credentials. However, it introduces complex redirection states, state CSRF tokens to manage, and relies heavily on the constant uptime of the third-party identity providers."
      },
      "jwt": {
        concept: "JWT (JSON Web Token) is an open standard that defines a compact and self-contained way for securely transmitting information between parties as a digitally signed JSON object. JWTs are stateless and widely used for user session authorization.",
        production: "A JWT is composed of three parts: Header, Payload, and Signature. The backend signs the payload containing user metadata using a secure private key and sends it to the client. The client stores it (often in HttpOnly cookies) and sends it in the Authorization header. The backend validates the signature in O(1) time without querying a session database.",
        tradeoffs: "Stateless validation avoids database lookup overhead, making it highly scalable. The primary trade-off is that once issued, JWTs are extremely difficult to revoke before expiration unless complex token-blacklisting setups (e.g. in Redis) are built."
      },
      "websockets": {
        concept: "WebSockets represent a protocol providing full-duplex, bi-directional, persistent communication channels over a single TCP connection, enabling real-time client-server communication.",
        production: "Unlike traditional HTTP polling, a WebSocket connection begins with an HTTP handshake, then upgrades the TCP socket connection. Data frames can be pushed instantly from either client or server in fractions of a millisecond, which is heavily used in chat panels and live charts.",
        tradeoffs: "Sub-millisecond real-time communication cuts header and latency overhead. However, keeping millions of TCP connections open concurrently consumes vast server resources, complicates horizontal scaling (requiring Redis Pub/Sub backplanes), and bypasses standard HTTP CDNs."
      }
    };

    // Check if we have a pre-cached rich explanation for a matched key in our dictionary
    let matchedKey = null;
    Object.keys(richGlossary).forEach(key => {
      const regex = new RegExp("\\b" + key + "\\b", "i");
      if (regex.test(lowerQuery)) {
        matchedKey = key;
      }
    });

    if (matchedKey) {
      const data = richGlossary[matchedKey];
      const capitalTopic = matchedKey.charAt(0).toUpperCase() + matchedKey.slice(1);
      return `📌 **Core Concept — ${capitalTopic}**:
${data.concept}

⚙️ **Production Architecture & Deployment**:
${data.production}

⚖️ **Engineering Trade-offs & Challenges**:
${data.tradeoffs}

What specific sub-concept or architectural flow of **${capitalTopic}** should we look into next?`;
    }

    // 10. Truly Dynamic & Adaptive Generative Simulation (handles ANY query!)
    const strippedQuery = query.replace(/[?.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const words = strippedQuery.split(" ").filter(w => w.length > 3 && !["about", "these", "would", "could", "should", "there", "their", "where", "which", "after", "before", "under", "focused", "explain", "explain me", "what is", "how does", "tell me", "what", "does", "mean", "help", "with", "about"].includes(w.toLowerCase()));

    // If no real technical subject was extracted, return a friendly coaching statement
    if (words.length === 0) {
      return `I understand! Let's keep things flexible and stress-free. Transitioning into complex systems architectures and programming concepts takes time. 

If you have any specific technical questions, coding problems, framework queries, or general topics you'd like to dive into, let know. 

Whenever you feel ready, we can always return to our active interview questions!`;
    }

    const detectedTopic = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");

    // If the detected topic is too brief or is a common conversational stop word / negative / filler
    const conversationalStopWords = ["cant", "don't", "dont", "cant do", "can't do", "nothing", "anything", "something", "please", "would", "should", "could", "about", "what", "that", "this", "help", "with", "know", "idea", "i cant", "i can't", "explain", "quantum", "systems", "systems design"];
    if (detectedTopic.length < 3 || conversationalStopWords.includes(detectedTopic.toLowerCase())) {
      return `I understand completely! Transitioning into complex systems architectures and programming concepts can be challenging, but that is exactly why we are practicing here. 

Let's take it at your own pace! If you want to review a specific concept, feel free to ask me to explain it (e.g. *"explain REST vs GraphQL"* or *"what is sharding?"*). If you want to see a clean coding demonstration, just let me know. 

Whenever you feel comfortable, we can always return to our active interview rounds!`;
    }

    // Detect if the query is a general science/life/non-technical concept or technical CS
    const isGeneralNonCS = /\b(weather|life|love|photosynthesis|gravity|airplane|planet|space|history|cook|food|music|art|health|earth|human|soul|happy|mind)\b/i.test(lowerQuery);

    if (isGeneralNonCS) {
      return `✨ **Insights on ${detectedTopic}**

**${detectedTopic}** represents one of the most fascinating domains of natural wonder and intellectual design. At its core, it connects fundamental dynamics, beautifully balanced systems, and real-world forces to create a coherent flow of energy, matter, or human experience.

🔍 **How it Operates & Core Principles**:
In the grand scale of life and science, **${detectedTopic}** executes through beautifully orchestrated steps:
1. **Interactive Elements**: It relies on a delicate balance of inputs (like atmospheric forces, photons of light, biological variables, or historical contexts) to trigger changes.
2. **Transition & Flow**: It transfers these variables dynamically, converting raw states into stable outcomes that sustain structures, ecosystems, or ideas over time.
3. **Resiliency**: Modern science shows that these systems have evolved to withstand stress, adjusting balance to maintain order in a constantly changing environment.

⚖️ **Why it Matters & Core Takeaways**:
- **Philosophical Value**: Exploring **${detectedTopic}** teaches us about interconnected dependencies—where small adjustments in initial inputs yield massive transitions downstream.
- **Modern Impact**: Understanding this allows humanity to build better tools, foster healthier habits, and adapt our lives to work in alignment with natural systems.

What other fascinating science, philosophy, or general knowledge question would you like to explore next?`;
    }

    // Default: Dynamic Technical/System Design Synthesis
    return `📌 **Core Concept — ${detectedTopic}**:
**${detectedTopic}** represents a highly crucial software engineering and systems design paradigm. At its core, it focuses on decoupling complex runtime dependencies, structuring modular data flows, and ensuring that component states remain stable, predictable, and highly performant.

⚙️ **Production Architecture & Implementation**:
In high-scale cloud environments, **${detectedTopic}** is integrated modularly to prevent single-point-of-failure (SPOF) bugs. Developers implement this by:
1. Establishing clear API interfaces (using REST, GraphQL, or gRPC endpoints) to govern inter-system communication.
2. Optimizing database interactions with column-level indexing (e.g. B-Trees) and memory-layer caching (using Redis clusters).
3. Hardening runtime safety by wrapping operations in try-except logs, robust catch blocks, and isolated container sandboxes.

⚖️ **Engineering Trade-offs**:
- **Pros**: Elevates system decoupling, raises developer shipping velocity, and makes horizontal scalability far simpler to implement.
- **Cons**: Raises operational complexity, introduces slight network or serialization latency, and requires more thorough automated end-to-end testing to maintain stability.

What specific aspect of **${detectedTopic}** would you like to design, write a code sample for, or debug next?`;
  };

  const handleSendAnswer = async (e) => {
    e.preventDefault();
    if (!candidateAnswer.trim() || isSubmittingAnswer) return;

    const answerText = candidateAnswer;
    setInterviewChat(prev => [...prev, { role: "candidate", content: answerText }]);
    setCandidateAnswer("");
    setIsSubmittingAnswer(true);

    try {
      const res = await fetch(`${API_BASE}/interview/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interview_id: interviewId, answer: answerText })
      });
      if (res.ok) {
        const data = await res.json();
        setLastFeedback({
          feedback: data.feedback_last_answer,
          score: data.score_last_answer,
          modelAnswer: data.model_answer_last
        });
        setInterviewChat(prev => [...prev, { role: "interviewer", content: data.question }]);
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      console.log("Mock interview response...");
      const questionsList = getInterviewQuestions(targetRole);
      setTimeout(() => {
        const lowerAnswer = answerText.toLowerCase();

        // Standard Active Question (if within bounds)
        const currentQ = mockQuestionIndex < questionsList.length ? questionsList[mockQuestionIndex] : null;

        // 1. Navigation check while inside Tutor Lock state (MUST run first to intercept 'skip', 'next', 'continue', 'resume')
        if (isWaitingForTutorQuestion) {
          if (lowerAnswer.includes("continue") || lowerAnswer.includes("return") || lowerAnswer.includes("back") || lowerAnswer.includes("resume")) {
            setIsWaitingForTutorQuestion(false);
            const activeQ = currentQ || questionsList[0];
            setLastFeedback({
              feedback: "Returned to the mock technical interview.",
              score: "MOCK",
              modelAnswer: activeQ.modelAnswer
            });
            const nextQuestionText = `[AI Lead Interviewer]: Welcome back to the interview! Let's resume your evaluation. My active question is still: "${activeQ.question}"`;
            setInterviewChat(prev => [...prev, { role: "interviewer", content: nextQuestionText }]);
            setIsSubmittingAnswer(false);
            return;
          }
          
          if (lowerAnswer.includes("next") || lowerAnswer.includes("skip")) {
            setIsWaitingForTutorQuestion(false);
            const nextIndex = mockQuestionIndex + 1;
            setMockQuestionIndex(nextIndex);
            
            if (nextIndex < questionsList.length) {
              const nextQ = questionsList[nextIndex];
              setLastFeedback({
                feedback: "Moved to the next interview round.",
                score: "MOCK",
                modelAnswer: nextQ.question
              });
              const nextQuestionText = `[AI Lead Interviewer]: Understood. Let's move on. Here is the next question: "${nextQ.question}"`;
              setInterviewChat(prev => [...prev, { role: "interviewer", content: nextQuestionText }]);
            } else {
              setLastFeedback({
                feedback: "Successfully completed mock interview rounds!",
                score: "COMPLETED",
                modelAnswer: "You have unlocked the Infinite Career Tutor! Ask any software engineering or computer science questions."
              });
              const nextQuestionText = `Fantastic! You have successfully completed your Sandbox mock interview rounds. You did an excellent job discussing advanced frontend, resilient backend fallbacks, and infrastructure portability!
              
🎓 [AI Career Tutor Activated]: I can now act as your infinite tutoring assistant!

In which question, coding problem, or framework concept (e.g. explain React hooks, SQL vs NoSQL, Git rebasing, or database indexing) should I help you or explain it to you?

Just type whatever you want to learn next, or ask me: "ask me another question"!`;
              setInterviewChat(prev => [...prev, { role: "interviewer", content: nextQuestionText }]);
            }
            setIsSubmittingAnswer(false);
            return;
          }
        }

        // 2. Smart Conversational Guard: Check if the user is typing casual greetings, agreements, or fillers
        if (currentQ && isCasualOrConversational(answerText)) {
          let tutorExplanation = generateConversationalResponse(answerText, targetRole, interviewChat);
          setLastFeedback({
            feedback: `Conversational interaction: "${answerText}"`,
            score: "MOCK",
            modelAnswer: currentQ.modelAnswer
          });
          const nextQuestionText = `[AI Lead Interviewer]: Of course! Keep in mind we are currently in a technical round. 

${tutorExplanation}

Whenever you're ready, let's return to our active interview question:
"${currentQ.question}"`;
          
          setInterviewChat(prev => [...prev, { role: "interviewer", content: nextQuestionText }]);
          setIsSubmittingAnswer(false);
          return;
        }

        // Custom Question detection check (asking a question, query, or topic lookup)
        const isCustomQuestion = 
          lowerAnswer.includes("?") ||
          lowerAnswer.includes("what is") ||
          lowerAnswer.includes("how to") ||
          lowerAnswer.includes("why is") ||
          lowerAnswer.includes("can you") ||
          lowerAnswer.includes("explain ") ||
          lowerAnswer.includes("what are") ||
          lowerAnswer.includes("tell me") ||
          lowerAnswer.includes("teach me") ||
          lowerAnswer.includes("career") ||
          lowerAnswer.includes("question") ||
          lowerAnswer.includes("ask") ||
          lowerAnswer.includes("how does") ||
          lowerAnswer.includes("what does") ||
          lowerAnswer.includes("who is") ||
          lowerAnswer.includes("who are") ||
          lowerAnswer.includes("joke") ||
          lowerAnswer.includes("poem") ||
          lowerAnswer.includes("vs") ||
          lowerAnswer.includes("difference");

        // Explanation request check (skipping or explicit "dont know" review requests)
        const isExplanationRequested = 
          lowerAnswer === "dont know" ||
          lowerAnswer === "don't know" ||
          lowerAnswer.includes("i don't know") ||
          lowerAnswer.includes("i dont know") ||
          lowerAnswer.includes("i can't") ||
          lowerAnswer.includes("i cant") ||
          lowerAnswer.includes("cant do") ||
          lowerAnswer.includes("can't do") ||
          lowerAnswer === "cant" ||
          lowerAnswer === "can't" ||
          lowerAnswer === "no" ||
          lowerAnswer === "nope" ||
          lowerAnswer === "no idea" ||
          lowerAnswer.includes("dont know you explain") ||
          lowerAnswer.includes("don't know you explain") ||
          lowerAnswer.includes("dont know, you explain") ||
          lowerAnswer.includes("don't know, you explain") ||
          lowerAnswer.includes("explain it to me") ||
          lowerAnswer.includes("explain to me") ||
          lowerAnswer.includes("explain in short") ||
          lowerAnswer.includes("explain me in short") ||
          lowerAnswer.includes("no idea") || 
          lowerAnswer.includes("have no idea") || 
          lowerAnswer === "explain" || 
          lowerAnswer === "help" ||
          (lowerAnswer.length < 5 && !lowerAnswer.includes("?") && !lowerAnswer.includes("go"));

        // Case A: User explicitly asks a custom question (instant answer resolution)
        if (isCustomQuestion && !isExplanationRequested) {
          setIsWaitingForTutorQuestion(true); // Lock state
          
          let tutorExplanation = generateConversationalResponse(answerText, targetRole, interviewChat);
          
          setLastFeedback({
            feedback: `You asked a question: "${answerText}"`,
            score: "TUTOR",
            modelAnswer: tutorExplanation
          });

          let nextQuestionText = "";
          if (currentQ) {
            nextQuestionText = `[AI Lead Interviewer]: Of course! I am here to help you learn.
            
[AI Career Tutor]: ${tutorExplanation}

Feel free to ask another question or coding problem, or type **"continue"** to return to your active interview question: "${currentQ.question}"`;
          } else {
            nextQuestionText = `[AI Career Tutor]: ${tutorExplanation}

What other question or coding problem would you like me to help you with? You can ask me other questions, or type "continue" to return to the active interview!`;
          }

          setInterviewChat(prev => [...prev, { role: "interviewer", content: nextQuestionText }]);
          setIsSubmittingAnswer(false);
          return;
        }

        // Case B: User says "dont know" / requests explanation for current question (Review lock mode)
        if (isExplanationRequested && currentQ) {
          setIsWaitingForTutorQuestion(true); // Lock state

          setLastFeedback({
            feedback: `You requested an explanation for our active topic: "${currentQ.topic}"`,
            score: "TUTOR",
            modelAnswer: currentQ.modelAnswer
          });

          const explanationResponse = `[AI Lead Interviewer]: No worries, let's learn this concept! Here is the detailed explanation for our active question:

📌 **${currentQ.topic}**:\n${currentQ.modelAnswer}

Feel free to ask any follow-up questions about this topic, or type **"next"** or **"skip"** to proceed to the next interview round!`;

          setInterviewChat(prev => [...prev, { role: "interviewer", content: explanationResponse }]);
          setIsSubmittingAnswer(false);
          return;
        }

        // Case C: Standard interview console answer submission evaluation
        if (currentQ) {
          const matchedKeywords = currentQ.keywords.filter(kw => lowerAnswer.includes(kw));
          const matchRatio = matchedKeywords.length / currentQ.keywords.length;
          
          let calculatedScore = 0;
          let evaluatedFeedback = "";
          let prefixTransition = "";
          
          if (matchRatio >= 0.5) {
            calculatedScore = 9;
            evaluatedFeedback = `Superb! Your explanation of "${currentQ.topic}" shows deep engineering maturity. You accurately discussed crucial mechanisms like ${matchedKeywords.join(", ")}. It is clear you understand how to build and scale this in production.`;
            prefixTransition = `Excellent response! You hit all key technical dimensions of ${currentQ.topic}.`;
          } else if (matchRatio >= 0.2) {
            calculatedScore = 6;
            const missingKeywords = currentQ.keywords.filter(kw => !lowerAnswer.includes(kw));
            evaluatedFeedback = `Solid start! You correctly mentioned key elements like "${matchedKeywords.join(", ")}". However, to make this response truly recruiter-grade, you should expand on the architectural details regarding: ${missingKeywords.slice(0, 3).join(", ")}. Review the model answer below for the complete structure!`;
            prefixTransition = "Got it, that is a reasonable summary with good core highlights.";
          } else {
            calculatedScore = 3;
            evaluatedFeedback = `Your response is a bit brief for a senior-level technical round. While assessing "${currentQ.topic}", it is essential to discuss system trade-offs, B-Tree indices, or runtime properties. Try to incorporate keywords like: ${currentQ.keywords.slice(0, 4).join(", ")}. Let's review the standard production model answer key below!`;
            prefixTransition = "Understood. That's a brief outline of the topic.";
          }
          
          setLastFeedback({
            feedback: evaluatedFeedback,
            score: calculatedScore,
            modelAnswer: currentQ.modelAnswer
          });

          let nextQuestionText = "";
          const nextIndex = mockQuestionIndex + 1;
          
          if (nextIndex < questionsList.length) {
            const nextQ = questionsList[nextIndex];
            nextQuestionText = `${prefixTransition} Let's move on. Here is the next question: "${nextQ.question}"`;
          } else {
            nextQuestionText = `${prefixTransition}\n\nFantastic! You have successfully completed your Sandbox mock interview rounds. You did an excellent job discussing advanced frontend, resilient backend fallbacks, and infrastructure portability!\n\n🎓 [AI Career Tutor Activated]: I can now act as your infinite tutoring assistant!\n\nIn which question, coding problem, or framework concept (e.g. explain React hooks, SQL vs NoSQL, Git rebasing, or database indexing) should I help you or explain it to you?\n\nJust type whatever you want to learn next, or ask me: "ask me another question"!`;
          }
          
          setInterviewChat(prev => [...prev, { role: "interviewer", content: nextQuestionText }]);
          setMockQuestionIndex(nextIndex);
          setIsSubmittingAnswer(false);
          return;
        }

        // Infinite consultation tutor fallback (when all rounds are complete and no other condition was met)
        let tutorExplanation = generateConversationalResponse(answerText, targetRole, interviewChat);
        
        setLastFeedback({
          feedback: `AI Tutor mode evaluated query: "${answerText}"`,
          score: "TUTOR",
          modelAnswer: tutorExplanation
        });
        
        const nextQuestionText = `[AI Career Tutor]: ${tutorExplanation}`;
        
        setInterviewChat(prev => [...prev, { role: "interviewer", content: nextQuestionText }]);
        setIsSubmittingAnswer(false);
      }, 1500);
      return;
    }

    setIsSubmittingAnswer(false);
  };

  const handleGenerateRoadmap = async () => {
    if (!selectedAnalysis) return;
    setIsGeneratingRoadmap(true);

    try {
      const res = await fetch(`${API_BASE}/roadmap/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis_id: selectedAnalysis.id, target_role: targetRole })
      });
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data);
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      console.log("Mocking Learning Roadmap...");
      setTimeout(() => {
        setRoadmap(getMockRoadmapData(targetRole));
        setIsGeneratingRoadmap(false);
      }, 1200);
      return;
    }
    setIsGeneratingRoadmap(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [interviewChat]);

  // Auth simulators
  const handleGoogleLogin = () => {
    setShowGoogleOptions(true);
  };

  const handleGoogleLoginAs = (email) => {
    setUserEmail(email);
    setAuthMethod("google");
    // Simulate short load
    setTimeout(() => {
      setIsLoggedIn(true);
      setShowGoogleOptions(false);
    }, 800);
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (!userEmail.trim()) return;

    if (userEmail.toLowerCase() === "sankalan@demo.com" || userEmail.toLowerCase() === "urshita@demo.com") {
      if (userPassword !== "123") {
        alert("Incorrect password for demo account! Use '123' to login.");
        return;
      }
    }

    setAuthMethod("email");
    setTimeout(() => {
      setIsLoggedIn(true);
    }, 800);
  };

  // Mock Generators
  const getMockAnalysisRecordGuest = () => {
    return {
      id: "mock-guest-9999",
      created_at: new Date().toISOString(),
      github_username: "GUEST",
      linkedin_text: "Software Engineering Enthusiast",
      analysis: {
        applicant_name: "Guest",
        ats_score: 75,
        summary: "You are exploring TalentForge under a Guest profile. Try importing your own custom resume using GitHub/LinkedIn, or write custom prompts in the AI Resume Maker tab to dynamically compile any custom profile!",
        sub_scores: {
          formatting: 80,
          highlight: 70, // Map placeholder
          impact: 70,
          skills: 75,
          achievements: 65
        },
        strengths: [
          "Interactive client-side evaluation active.",
          "Perfect exploration profile ready for ATS cross-examinations.",
          "Clean sandbox environment ready for live mock interviews."
        ],
        weaknesses: [
          "Profile is currently populated with standard sandbox demo logs.",
          "No direct external integrations active."
        ],
        suggestions: [
          {
            area: "Summary Statement",
            before: "Enthusiastic Guest developer looking for opportunities.",
            after: "Dynamic and results-focused Software Engineer specializing in modern frontend architectures...",
            why: "ATS engines screen for specific action patterns and key framework nouns."
          }
        ],
        missing_skills: {
          critical: ["Docker / Containerization", "AWS / Cloud Deployments", "CI/CD Pipelines (GitHub Actions)"],
          recommended: ["TypeScript", "Redis Caching", "Unit Testing (Jest/PyTest)"],
          optional: ["Next.js", "GraphQL", "Tailwind CSS v4 CSS-Variables"]
        },
        company_matching: [
          {
            type: "FAANG / Tier-1 Tech",
            match_percentage: 65,
            reasons: ["Excellent sandbox readiness, but needs more deep system engineering portfolios.", "Needs to demonstrate handling high-concurrency systems."]
          },
          {
            type: "High-Growth Startups",
            match_percentage: 88,
            reasons: ["High potential and agile exploration. Fits well with visual prototyping and fast shipping pipelines."]
          },
          {
            type: "Enterprise/Corporates",
            match_percentage: 72,
            reasons: ["Good basic understanding of database queries, but needs to expand into enterprise-wide microservices."]
          }
        ]
      }
    };
  };

  const getMockAnalysisRecord = () => {
    return {
      id: "mock-1234-5678",
      created_at: new Date().toISOString(),
      github_username: "SANKALAN",
      linkedin_text: "Senior Full Stack Dev at Tech Corp",
      analysis: {
        applicant_name: "Sankalan",
        ats_score: 82,
        summary: "Sankalan is a high-caliber developer showing solid expertise in modern frontend engineering (React, Tailwind CSS) and modular backend APIs (Flask). The application has high formatting quality but lacks core business-level impact metrics and containerization scopes.",
        sub_scores: {
          formatting: 90,
          impact: 72,
          skills: 85,
          achievements: 68
        },
        strengths: [
          "Superb integration of React with Tailwind CSS, showing custom design systems and clean styling workflows.",
          "Excellent RESTful API architecture, properly handling CORS, routes, and JSON schema requests.",
          "Clean visual layout, clear visual hierarchy, and standard recruiters-preferred formatting."
        ],
        weaknesses: [
          "Resume lacks quantifiable accomplishments (e.g. percentages, dollars, time saved).",
          "No references to cloud deployments (Render, Vercel) or containerized architectures (Docker).",
          "Work bullets rely on passive verbs ('responsible for', 'assisted in') rather than strong action verbs ('engineered', 'spearheaded')."
        ],
        suggestions: [
          {
            area: "Work Experience - Software Developer",
            before: "Responsible for managing and maintaining the frontend website and connecting it to Flask APIs.",
            after: "Architected responsive React frontends powered by Flask RESTful APIs, reducing average page load times by 32% and enhancing user retention.",
            why: "This replaces passive 'responsible for' with the active verb 'architected' and establishes a solid quantifiable business metric."
          },
          {
            area: "Projects - Portfolio Platform",
            before: "Made a website that analyzes resumes using AI and saves details in MongoDB.",
            after: "Engineered an AI-driven Resume + Portfolio platform using Gemini API and MongoDB; automated fallback storage layers to secure 99.9% app availability.",
            why: "Highlighting architectural decisions (like fallback layers) and direct integration metrics proves engineering maturity."
          }
        ],
        missing_skills: {
          critical: ["Docker / Containerization", "AWS / Cloud Deployments", "CI/CD Pipelines (GitHub Actions)"],
          recommended: ["TypeScript", "Redis Caching", "Unit Testing (Jest/PyTest)"],
          optional: ["Next.js", "GraphQL", "Tailwind CSS v4 CSS-Variables"]
        },
        company_matching: [
          {
            type: "FAANG / Tier-1 Tech",
            match_percentage: 68,
            reasons: ["Strong framework knowledge, but needs more deep algorithmic foundations and system design scope.", "Needs to demonstrate handling high-concurrency systems."]
          },
          {
            type: "High-Growth Startups",
            match_percentage: 92,
            reasons: ["High agility and product creation focus. Rapidly prototypes using Flask, React, and Tailwind.", "Fits the fast-paced full-stack shipping requirements perfectly."]
          },
          {
            type: "Enterprise/Corporates",
            match_percentage: 78,
            reasons: ["Understands structured APIs and databases.", "Would benefit from adding enterprise architectural patterns (e.g. microservices)."]
          }
        ]
      }
    };
  };

  const getMockAnalysisRecordUrshita = () => {
    return {
      id: "mock-urshita-5678",
      created_at: new Date().toISOString(),
      github_username: "urshita-dev",
      linkedin_text: "Backend Developer & AI Specialist",
      analysis: {
        applicant_name: "Urshita",
        ats_score: 86,
        summary: "Urshita presents a stellar backend foundation specializing in Python, Flask APIs, and Machine Learning algorithms (PyTorch, Scikit-Learn). The profile is highly optimized for server-side architectures, but could benefit from adding visual frontend frames and system containerization integrations.",
        sub_scores: {
          formatting: 92,
          impact: 78,
          skills: 88,
          achievements: 72
        },
        strengths: [
          "Superb expertise in backend RESTful architectures, Python databases, and SQL query optimizations.",
          "Solid knowledge of Machine Learning models, mathematical evaluations, and data mining pipelines.",
          "Exceptional code readability and highly logical modular structures."
        ],
        weaknesses: [
          "Lacks experience with modern frontend frameworks (React, Next.js).",
          "No references to Tailwind CSS or responsive CSS design systems.",
          "Underrepresented continuous integration (CI/CD) and automated deployment tools."
        ],
        suggestions: [
          {
            area: "Work Experience - Backend Engineer",
            before: "Worked on python scripts to process data and saved outputs in databases.",
            after: "Designed robust Flask ETL pipelines to process 5M+ daily records, optimizing query indexing to reduce read latency by 45%.",
            why: "Establishes quantifiable metrics (5M+ records, 45% latency reduction) and replaces passive verbs with high-impact engineering terms."
          },
          {
            area: "Projects - AI Model Hub",
            before: "Created a machine learning script to classify text inputs.",
            after: "Engineered a NLP text classification microservice using PyTorch and Flask, achieving a 94.2% F1-accuracy score.",
            why: "Specifying the frame (PyTorch, Flask) and the exact performance metric (94.2% F1-score) proves quantitative engineering depth."
          }
        ],
        missing_skills: {
          critical: ["React / Frontend Frameworks", "Tailwind CSS / Responsive Design", "Docker / Containerization"],
          recommended: ["TypeScript", "GitHub Actions (CI/CD)", "Next.js"],
          optional: ["GraphQL", "Redis Caching", "NoSQL Databases (MongoDB)"]
        },
        company_matching: [
          {
            type: "FAANG / Tier-1 Tech",
            match_percentage: 72,
            reasons: ["Excellent algorithmic and backend foundations, but needs broader system-design experience.", "Would benefit from containerized microservice architectures."]
          },
          {
            type: "High-Growth Startups",
            match_percentage: 85,
            reasons: ["Strong Python scripting agility, but needs frontend capabilities to act as a versatile full-stack engineer.", "Great fit for backend-first role demands."]
          },
          {
            type: "Enterprise/Corporates",
            match_percentage: 90,
            reasons: ["Superb data-processing structures and database query alignment.", "Fits enterprisal backend and AI pipelines perfectly."]
          }
        ]
      }
    };
  };

  const getMockPortfolioMeta = () => {
    return {
      tagline: "Crafting Scalable Full-Stack Solutions & AI Intelligence Platforms",
      bio: "I am a passionate Full-Stack Engineer who specializes in building highly performant React interfaces, robust Flask backends, and integrating cutting-edge AI services. I write clean, modular code and focus deeply on visual micro-interactions and resilient system designs.",
      terminal_welcome: "Welcome to TalentForge Shell v1.0.0\nType 'help' to see a list of commands, or explore my resume dashboard.",
      terminal_commands: [
        {
          command: "skills",
          output: "Core Languages: JavaScript, Python, HTML/CSS\nFrameworks: React, Flask, Express, Tailwind CSS\nDatabases: MongoDB, PostgreSQL"
        },
        {
          command: "projects",
          output: "1. TalentForge: AI Resume & Portfolio Builder (React, Flask, MongoDB, Gemini API)\n2. Aurora: Glassmorphic E-Commerce Hub (Vite, Tailwind, Firebase)"
        },
        {
          command: "about",
          output: "Full Stack Engineer dedicated to bridging beautiful user interfaces with high-performance, fault-tolerant backend microservices."
        }
      ],
      highlighted_projects: [
        {
          title: "TalentForge AI Platform",
          description: "Designed and deployed an end-to-end intelligence workspace that parses PDFs, performs Gemini prompt evaluations, and crafts dynamic web assets.",
          tech_stack: ["React", "TailwindCSS", "Flask", "Gemini API", "MongoDB"],
          impact_metric: "Automated asset creation in under 4 seconds"
        },
        {
          title: "Aurora Design System",
          description: "Authored an HSL-tailored dark-mode glassmorphic component framework, offering reusable modular components.",
          tech_stack: ["React", "Vite", "Tailwind CSS"],
          impact_metric: "100% responsive, sub-100ms load times"
        }
      ],
      custom_skills_group: [
        {
          category: "Frontend Craft",
          skills: ["React", "Tailwind CSS v4", "Framer Motion", "Recharts"]
        },
        {
          category: "Backend & Cloud",
          skills: ["Flask (Python)", "RESTful APIs", "MongoDB", "Node.js", "Docker"]
        }
      ]
    };
  };

  const getMockRoadmapData = (role) => {
    const roleLower = (role || "Software Engineer").toLowerCase();
    
    // 1. Frontend Developer Pathway
    if (roleLower.includes("frontend") || roleLower.includes("ui") || roleLower.includes("ux") || roleLower.includes("client") || roleLower.includes("designer")) {
      return {
        target_role: role,
        milestones: [
          {
            week_range: "Weeks 1-4",
            title: "Advanced Modern UI & State Architecture",
            description: "Master component lifecycles, advanced React Hooks (useState, useEffect, useMemo, useCallback), and robust central state management using Redux Toolkit or Zustand.",
            skills_gained: ["React.js", "Custom Hooks", "Zustand State Management", "Tailwind CSS v4"],
            suggested_actions: ["Build a dynamic, responsive client dashboard with custom context providers", "Refactor standard inline styles to highly modular HSL tailwind configuration classes"],
            curated_resources: [
              {
                name: "React Hooks Deep Dive - freeCodeCamp",
                type: "Free Course",
                link: "https://www.freecodecamp.org/news/react-hooks-handbook/"
              },
              {
                name: "Zustand State Management Guide",
                type: "Official Docs",
                link: "https://zustand.docs.pmnd.rs/getting-started/introduction"
              }
            ]
          },
          {
            week_range: "Weeks 5-8",
            title: "Server-Side Frameworks & Rendering Orchestrations",
            description: "Deep dive into Next.js frameworks, understanding Server vs Client Components, implementing Static Site Generation (SSG), Server-Side Rendering (SSR), and Incremental Static Regeneration (ISR) to secure optimal load speeds and SEO indexing.",
            skills_gained: ["Next.js App Router", "Server-Side Rendering", "SEO & Metadata", "Lighthouse Optimization"],
            suggested_actions: ["Migrate a client-side React App to a Next.js App Router project", "Improve site speed index, core web vitals, and accessibility under Lighthouse auditing"],
            curated_resources: [
              {
                name: "Next.js Interactive Roadmap - roadmap.sh",
                type: "Interactive Pathway",
                link: "https://roadmap.sh/nextjs"
              },
              {
                name: "Web Vitals & Performance Checklist",
                type: "Best Practices Guide",
                link: "https://web.dev/vitals/"
              }
            ]
          },
          {
            week_range: "Weeks 9-12",
            title: "End-to-End Auditing, Automated Testing & CD",
            description: "Configure automated frontend continuous deployments to Vercel or Netlify. Master unit and component testing utilizing Vitest and advanced E2E automated user flow testing utilizing Playwright.",
            skills_gained: ["Playwright E2E Testing", "Vitest Unit Testing", "Vercel CD Pipelines", "GitHub Actions"],
            suggested_actions: ["Write comprehensive user flow and element visibility integration tests in Playwright", "Configure GitHub Actions workflow to run automated linting and tests on pull requests"],
            curated_resources: [
              {
                name: "Playwright E2E Automation Crash Course",
                type: "Free Video Tutorial",
                link: "https://www.youtube.com/watch?v=5yH_Roc67S4"
              },
              {
                name: "Vercel Git Integration Deployment Guide",
                type: "Documentation",
                link: "https://vercel.com/docs/deployments/git"
              }
            ]
          }
        ]
      };
    }
    
    // 2. Backend Developer Pathway
    if (roleLower.includes("backend") || roleLower.includes("server") || roleLower.includes("api") || roleLower.includes("database")) {
      return {
        target_role: role,
        milestones: [
          {
            week_range: "Weeks 1-4",
            title: "Robust Server Architectures & RESTful API Specs",
            description: "Design and implement high-performance, modular API servers using Flask, Node/Express, or Django. Incorporate request parsing, validation, security headers, and centralized custom exception loggers.",
            skills_gained: ["Flask/Express API Design", "Schema Validation", "CORS & Security Headers", "Middleware Pipelines"],
            suggested_actions: ["Write a scalable RESTful API with route validation schemas", "Deploy a custom error response utility that logs server exceptions automatically"],
            curated_resources: [
              {
                name: "RESTful API Best Practices Guide",
                type: "Technical Article",
                link: "https://roadmap.sh/api"
              },
              {
                name: "Flask API Development - freeCodeCamp",
                type: "Free Course",
                link: "https://www.freecodecamp.org/news/flask-api-development-course/"
              }
            ]
          },
          {
            week_range: "Weeks 5-8",
            title: "Advanced Database Architectures & Query Tuning",
            description: "Integrate relational (PostgreSQL) or non-relational (MongoDB) databases. Master ACID compliance, horizontal partitioning, schema models, query profiling, and O(log N) search indexes.",
            skills_gained: ["PostgreSQL/MongoDB", "ACID Compliance", "Query Profiling", "Database Indexing"],
            suggested_actions: ["Audit and profile slow queries, adding indexes to drop database scans from O(N) to O(log N) using indexing constraints", "Configure connection pooling to support concurrent client requests safely"],
            curated_resources: [
              {
                name: "Databases & Storage Paths - roadmap.sh",
                type: "Interactive Learning",
                link: "https://roadmap.sh/postgresql"
              },
              {
                name: "MongoDB Indexes Official Manual",
                type: "Documentation",
                link: "https://www.mongodb.com/docs/manual/indexes/"
              }
            ]
          },
          {
            week_range: "Weeks 9-12",
            title: "High-Speed In-Memory Caching & Task Queues",
            description: "Optimize database load by engineering cache-aside architectures with Redis. Deploy asynchronous background task managers (Celery or BullMQ) to execute heavy tasks outside the request cycle.",
            skills_gained: ["Redis Caching", "Celery/BullMQ Task Queues", "Asynchronous Processing", "Message Brokers"],
            suggested_actions: ["Integrate a Redis cache layer on high-frequency server GET routes", "Configure BullMQ/Celery to handle bulk data analysis and email generation in the background"],
            curated_resources: [
              {
                name: "Redis Caching Patterns Guide",
                type: "Official Tutorial",
                link: "https://redis.io/docs/latest/develop/use/patterns/"
              },
              {
                name: "Asynchronous Workflows with Celery",
                type: "Best Practice Manual",
                link: "https://docs.celeryq.dev/en/stable/getting-started/first-steps-with-celery.html"
              }
            ]
          }
        ]
      };
    }
    
    // 3. Data Science / ML / AI Engineer Pathway
    if (roleLower.includes("ml") || roleLower.includes("machine") || roleLower.includes("data") || roleLower.includes("ai") || roleLower.includes("intelligence") || roleLower.includes("deep") || roleLower.includes("nlp") || roleLower.includes("analyst")) {
      return {
        target_role: role,
        milestones: [
          {
            week_range: "Weeks 1-4",
            title: "Applied Scientific Computing & High-Volume Data Ingestion",
            description: "Master computational libraries (NumPy, Pandas, Polars) to parse, clean, filter, and analyze massive structured/unstructured datasets, and visualize insights utilizing Seaborn/Matplotlib.",
            skills_gained: ["Pandas/Polars", "Data Wrangling", "Exploratory Data Analysis (EDA)", "Data Pipelines"],
            suggested_actions: ["Build an automated data pipeline that ingests messy CSV/JSON logs and outputs standardized datasets", "Conduct a complete statistical profiling analysis on housing or applicant datasets"],
            curated_resources: [
              {
                name: "Data Science with Pandas - freeCodeCamp",
                type: "Free Course",
                link: "https://www.freecodecamp.org/news/pandas-data-science-tutorial/"
              },
              {
                name: "Exploratory Data Analysis Guide",
                type: "Technical Overview",
                link: "https://roadmap.sh/ai"
              }
            ]
          },
          {
            week_range: "Weeks 5-8",
            title: "Supervised Modeling, Feature Engineering & Hyperparameter Tuning",
            description: "Develop classification, regression, and clustering models using Scikit-Learn. Design custom feature scaling pipelines, evaluate performance metrics, and perform cross-validation tuning.",
            skills_gained: ["Scikit-Learn Modeling", "Feature Engineering", "Cross-Validation", "GridSearchCV"],
            suggested_actions: ["Train a Random Forest classifier and tune hyperparameters utilizing GridSearchCV for optimal AUC score", "Construct a pipeline to encode categorical data, scale numerical data, and impute missing values"],
            curated_resources: [
              {
                name: "Scikit-Learn Modeling Official Guide",
                type: "Documentation",
                link: "https://scikit-learn.org/stable/user_guide.html"
              },
              {
                name: "Machine Learning Course - Kaggle",
                type: "Free Course",
                link: "https://www.kaggle.com/learn/intro-to-machine-learning"
              }
            ]
          },
          {
            week_range: "Weeks 9-12",
            title: "Deep Neural Networks & Production MLOps Deployment",
            description: "Train neural networks (ANNs, CNNs) utilizing PyTorch. Transition models from notebook environments to production using Docker containerization, FastAPI web wrappers, and MLflow model registries.",
            skills_gained: ["PyTorch Deep Learning", "Model APIs", "MLOps", "Model Packaging"],
            suggested_actions: ["Build and evaluate an image classifier or text classification model using PyTorch neural layers", "Containerize your trained ML weight models inside a Docker instance and deploy as a REST API on Render"],
            curated_resources: [
              {
                name: "PyTorch for Deep Learning Course",
                type: "Free Video Tutorial",
                link: "https://www.youtube.com/watch?v=V_xro1bcAuA"
              },
              {
                name: "MLOps Production Ingestion Guides",
                type: "DevOps Reference",
                link: "https://mlflow.org/docs/latest/index.html"
              }
            ]
          }
        ]
      };
    }
    
    // 4. DevOps Engineer / SRE Pathway
    if (roleLower.includes("devops") || roleLower.includes("sre") || roleLower.includes("infra") || roleLower.includes("cloud") || roleLower.includes("admin") || roleLower.includes("platform")) {
      return {
        target_role: role,
        milestones: [
          {
            week_range: "Weeks 1-4",
            title: "Docker Packaging & Multi-Stage Production Containerization",
            description: "Package full-stack applications with high efficiency. Master Dockerfiles, multi-stage builds to drop image sizes, docker volume mounts, network bridges, and multi-service orchestrations with Docker Compose.",
            skills_gained: ["Docker Image Building", "Multi-stage Builds", "Docker Compose", "Persistent Storage"],
            suggested_actions: ["Write a secure multi-stage Dockerfile that drops client build weights by 85%", "Configure a multi-service Docker Compose ecosystem including Flask, React, and MongoDB"],
            curated_resources: [
              {
                name: "Docker Containerization Fundamentals",
                type: "Free Course",
                link: "https://www.freecodecamp.org/news/what-is-docker-used-for-a-docker-container-tutorial-for-beginners/"
              },
              {
                name: "Docker Compose Best Practices",
                type: "Official Guide",
                link: "https://docs.docker.com/compose/"
              }
            ]
          },
          {
            week_range: "Weeks 5-8",
            title: "Infrastructure as Code (IaC) & Cloud Networks provisioning",
            description: "Provision robust cloud networks programmatically utilizing HashiCorp Terraform. Set up virtual networks, compute instances, load balancers, database instances, and secure groups on AWS or GCP.",
            skills_gained: ["Terraform IaC", "AWS Infrastructure", "Virtual Networks (VPC)", "Load Balancer Configs"],
            suggested_actions: ["Write reusable Terraform modules to provision an EC2 server and link it to an S3 storage bucket", "Configure AWS security groups to allow strict HTTP/HTTPS access on designated ports"],
            curated_resources: [
              {
                name: "Terraform Cloud Provisioning Path",
                type: "Official Docs",
                link: "https://developer.hashicorp.com/terraform/tutorials"
              },
              {
                name: "AWS Architecture & Deployment Guides",
                type: "Interactive Map",
                link: "https://roadmap.sh/devops"
              }
            ]
          },
          {
            week_range: "Weeks 9-12",
            title: "Container Orchestrations & Advanced Automated CI/CD pipelines",
            description: "Scale applications globally using Kubernetes clusters. Configure automated continuous integration/continuous deployment pipelines utilizing GitHub Actions to auto-run unit tests, lint, and deploy.",
            skills_gained: ["Kubernetes", "Helm Orchestrations", "CI/CD (GitHub Actions)", "System Monitoring"],
            suggested_actions: ["Deploy an application cluster with replication using Kubernetes service and deployment YAMLs", "Set up a GitHub Actions workflow to build, test, and automatically push your latest build to AWS on git push"],
            curated_resources: [
              {
                name: "Kubernetes Orchestration Crash Course",
                type: "Free Course",
                link: "https://www.youtube.com/watch?v=X48VuDVv0do"
              },
              {
                name: "GitHub Actions DevOps Automation",
                type: "Documentation",
                link: "https://docs.github.com/en/actions"
              }
            ]
          }
        ]
      };
    }
    
    // 5. Cybersecurity Analyst Pathway
    if (roleLower.includes("cyber") || roleLower.includes("security") || roleLower.includes("pentest") || roleLower.includes("hacking") || roleLower.includes("threat") || roleLower.includes("infosec")) {
      return {
        target_role: role,
        milestones: [
          {
            week_range: "Weeks 1-4",
            title: "Network Security Audits & Packet Analysis",
            description: "Master core computer network protocols (TCP/IP, DNS, TLS/SSL). Analyze packet captures in Wireshark and audit system ports and service versions utilizing Nmap.",
            skills_gained: ["Network Security", "Wireshark Packet Analysis", "Nmap Port Audits", "Cryptography Fundamentals"],
            suggested_actions: ["Capture and inspect HTTP vs HTTPS handshakes in Wireshark to understand encryption differences", "Run a network security scan using Nmap on a target sandbox environment to detect exposed ports"],
            curated_resources: [
              {
                name: "CompTIA Security+ Blueprint Course",
                type: "Free Prep Course",
                link: "https://www.freecodecamp.org/news/comptia-security-plus-course/"
              },
              {
                name: "Wireshark Network Troubleshooting Guide",
                type: "Documentation",
                link: "https://www.wireshark.org/docs/"
              }
            ]
          },
          {
            week_range: "Weeks 5-8",
            title: "Web Penetration Testing & OWASP Top 10 Audits",
            description: "Understand critical web vulnerabilities (SQL Injections, Cross-Site Scripting (XSS), CSRF, Broken Authentications) outlined in the OWASP Top 10, and learn how to patch them securely.",
            skills_gained: ["Penetration Testing", "OWASP Top 10 Auditing", "Vulnerability Remediation", "Web Sec Protocols"],
            suggested_actions: ["Audit a web form to detect SQL Injection vulnerability, and remediate using parameterized SQL queries", "Configure secure, HTTP-only, SameSite cookie authentication sessions to protect against session hijacking"],
            curated_resources: [
              {
                name: "PortSwigger Web Security Academy",
                type: "Interactive Lab Course",
                link: "https://portswigger.net/web-security"
              },
              {
                name: "OWASP Top 10 Critical Risks Guide",
                type: "Security Standard",
                link: "https://owasp.org/www-project-top-ten/"
              }
            ]
          },
          {
            week_range: "Weeks 9-12",
            title: "SecOps Pipeline Integration & Incident Detection",
            description: "Deploy Security Information and Event Management (SIEM) log aggregators. Integrate automated SAST (Static Application Security Testing) checkers directly inside the development workflow.",
            skills_gained: ["SIEM Systems", "SecOps & Logging", "DevSecOps (SAST)", "Firewall Policies"],
            suggested_actions: ["Configure local firewalls using UFW or firewalld, logging audit triggers to SIEM dashboards", "Integrate automated security scanners (e.g. bandit, npm audit) into GitHub Actions pull request checks"],
            curated_resources: [
              {
                name: "DevSecOps Engineering Path - roadmap.sh",
                type: "Interactive Map",
                link: "https://roadmap.sh/devops"
              },
              {
                name: "Introduction to Security Operations (SecOps)",
                type: "Free Course",
                link: "https://www.youtube.com/watch?v=uC93Xv7qW3k"
              }
            ]
          }
        ]
      };
    }
    
    // 6. Mobile App Developer Pathway (iOS / Android / Cross-Platform)
    if (roleLower.includes("mobile") || roleLower.includes("app") || roleLower.includes("ios") || roleLower.includes("android") || roleLower.includes("flutter") || roleLower.includes("native") || roleLower.includes("phone")) {
      return {
        target_role: role,
        milestones: [
          {
            week_range: "Weeks 1-4",
            title: "Mobile Framework Architectures & Responsive Screen Layouts",
            description: "Learn core components of cross-platform (Flutter, React Native) or native (SwiftUI/Kotlin Jetpack Compose) frameworks. Master adaptive layouts and central state engines.",
            skills_gained: ["React Native/Flutter", "Adaptive Mobile UI", "Mobile State Management", "Mobile Routing"],
            suggested_actions: ["Design a cross-platform scrollable profile dashboard with responsive layouts for mobile and tablet", "Set up dynamic, hardware-accelerated screen transitions and multi-tier navigations"],
            curated_resources: [
              {
                name: "React Native Mobile Dev Guide - freeCodeCamp",
                type: "Free Course",
                link: "https://www.freecodecamp.org/news/react-native-full-course/"
              },
              {
                name: "Flutter Official Layout Documentation",
                type: "Official Manual",
                link: "https://docs.flutter.dev/ui/layout"
              }
            ]
          },
          {
            week_range: "Weeks 5-8",
            title: "Local Database storage & Hardware API Integrations",
            description: "Integrate persistent local databases (SQLite, Realm, or Hive) to cache records. Bind hardware services including GPS Location, Camera permissions, and offline state syncing.",
            skills_gained: ["Local persistence (SQLite/Realm)", "Offline Data Cache", "Hardware API Integrations", "Secure Data Storage"],
            suggested_actions: ["Build an offline-first journal or scanner app that writes to a local SQLite database and syncs once online", "Configure secure keystore credentials to save sensitive API tokens on the device"],
            curated_resources: [
              {
                name: "Mobile App Offline Caching Strategies",
                type: "Technical Overview",
                link: "https://roadmap.sh/android"
              },
              {
                name: "SQLite Mobile Integration Tutorial",
                type: "Guide",
                link: "https://www.youtube.com/watch?v=312H_M3yFmQ"
              }
            ]
          },
          {
            week_range: "Weeks 9-12",
            title: "Automated Device Testing & App Store Publishing CI/CD",
            description: "Implement mobile unit and UI widget tests. Configure Fastlane script automation to build, sign, and automatically publish beta and production bundles to Apple App Store and Google Play Console.",
            skills_gained: ["Mobile Testing", "Fastlane Automation", "App Store Guidelines", "Mobile CI/CD Pipelines"],
            suggested_actions: ["Set up automated widget integration tests to verify touch inputs and UI state reactions", "Write a Fastlane configuration file to sign binaries and upload mock release bundles to Google Play Internal Test tracks"],
            curated_resources: [
              {
                name: "Fastlane Mobile Automation Official Guide",
                type: "Documentation",
                link: "https://docs.fastlane.tools/"
              },
              {
                name: "App Publishing Checklist - iOS & Android",
                type: "Best Practice Checklist",
                link: "https://roadmap.sh/flutter"
              }
            ]
          }
        ]
      };
    }
    
    // 7. Dynamic Synthesized Roadmap Pathway for ANY Other Career Role
    const roleClean = (role || "Software Engineer").trim();
    const roleTitle = roleClean.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    
    // Extract base keyword name to generate beautiful custom skills
    let baseRole = roleTitle
      .replace(/\b(developer|engineer|analyst|specialist|architect|manager|lead|consultant)\b/gi, "")
      .trim();
    if (!baseRole) baseRole = roleTitle;

    return {
      target_role: roleTitle,
      milestones: [
        {
          week_range: "Weeks 1-4",
          title: `Advanced Foundations & Core Tooling in ${roleTitle}`,
          description: `Master the foundational architectural patterns, compiler settings, and development environments specifically utilized in professional ${roleTitle} systems to ensure strict clean-code principles.`,
          skills_gained: [`${baseRole} Core Principles`, "Environment Configuration", "Clean Architecture Spec", "Toolchain Coordination"],
          suggested_actions: [
            `Configure and document a highly optimized sandbox workspace for modern ${roleTitle} setups`,
            `Draft a technical architectural blueprint mapping modular structures and data-flow constraints`
          ],
          curated_resources: [
            {
              name: `${roleTitle} Foundations Course - freeCodeCamp`,
              type: "Free Course",
              link: "https://www.freecodecamp.org/news/"
            },
            {
              name: "Interactive Role Pathways - roadmap.sh",
              type: "Interactive Learning",
              link: "https://roadmap.sh"
            }
          ]
        },
        {
          week_range: "Weeks 5-8",
          title: `Production Performance & High-Velocity Optimization`,
          description: `Analyze resource bottlenecks, optimize execution structures, and configure in-memory caching or asset preloading layers specifically for active ${roleTitle} systems.`,
          skills_gained: ["System Profiling", `${baseRole} Optimizations`, "Resource Management", "Caching Architectures"],
          suggested_actions: [
            `Audit latency and profile resource allocations under simulated high load conditions`,
            `Implement persistent caching layers or asset loading schedulers to drop system latencies by 50%`
          ],
          curated_resources: [
            {
              name: `${roleTitle} Performance Tuning Guide`,
              type: "Technical Overview",
              link: "https://roadmap.sh"
            },
            {
              name: "Software Architecture Optimizations Manual",
              type: "Documentation",
              link: "https://github.com/donnemartin/system-design-primer"
            }
          ]
        },
        {
          week_range: "Weeks 9-12",
          title: "Automated Integration, Robust Security & Cloud Delivery",
          description: `Package containerized configurations of your ${roleTitle} modules. Implement automated linting, test suites, and continuous deployment pipelines for robust cloud delivery.`,
          skills_gained: ["Containerization", "Automated Testing", "CI/CD Deployment", "System SecOps & Monitoring"],
          suggested_actions: [
            `Set up automated unit and integration tests inside GitHub Actions to run on push events`,
            `Containerize the application configurations inside Docker environments and deploy directly to cloud instances`
          ],
          curated_resources: [
            {
              name: "GitHub Actions Automation Official Guide",
              type: "Documentation",
              link: "https://docs.github.com/en/actions"
            },
            {
              name: "Docker Containerization Fundamentals",
              type: "Free Video Tutorial",
              link: "https://www.freecodecamp.org/news/what-is-docker-used-for-a-docker-container-tutorial-for-beginners/"
            }
          ]
        }
      ]
    };
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-100 selection:bg-violet-500 selection:text-white">
      
      {/* Background Neon Gradients */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none opacity-45">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* ======================================================== */}
        {/* =================== LANDING SCREEN ===================== */}
        {/* ======================================================== */}
        {!isLoggedIn ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full flex-grow flex flex-col items-center px-4 relative overflow-hidden"
          >
            
            {/* Visual Header */}
            <div className="w-full max-w-7xl flex items-center justify-between py-6 px-4">
              <div className="flex items-center gap-3">
                {/* Visual SVG Hammer & Shield forged Logo */}
                <svg className="w-10 h-10 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 5L90 25V65L50 95L10 65V25L50 5Z" fill="url(#logo-grad)" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                  <path d="M50 15L80 30V60L50 82L20 60V30L50 15Z" fill="#030014" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1" />
                  {/* Forge Anvil Mark */}
                  <path d="M35 45H65L60 62H40L35 45Z" fill="url(#glow-grad)" />
                  <rect x="47" y="32" width="6" height="15" rx="2" fill="url(#glow-grad)" />
                  <defs>
                    <linearGradient id="logo-grad" x1="0" y1="0" x2="100" y2="100">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                    <linearGradient id="glow-grad" x1="0" y1="0" x2="100" y2="100">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                </svg>
                <div>
                  <span className="text-xl font-black tracking-tight text-white">TalentForge</span>
                  <span className="text-[10px] text-cyan-400 block font-bold uppercase tracking-widest leading-none">AI Intelligence</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowArchitectureModal(true)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer hidden sm:block bg-transparent border-none outline-none"
                >
                  Architecture
                </button>
                <button 
                  onClick={() => setShowRecruiterModal(true)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer hidden sm:block bg-transparent border-none outline-none"
                >
                  Recruiter Panel
                </button>
                <button 
                  onClick={() => {
                    setAuthMethod("guest");
                    setUserEmail("guest@demo.com");
                    setIsLoggedIn(true);
                  }} 
                  className="glass-button px-4 py-1.5 rounded-lg text-xs font-bold border border-violet-500/20"
                >
                  Quick Guest Access
                </button>
              </div>
            </div>

            {/* Visual Hero Block (inspired by freechurchwebsites.com layout) */}
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 md:py-20 px-4 flex-grow">
              
              {/* Left Column: Title & Feature Grids */}
              <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/10 text-violet-300 border border-violet-500/20 text-xs font-bold w-fit">
                  <Sparkles className="w-3.5 h-3.5" />
                  Next-Gen Career Copilot
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] text-white">
                  Forge a Resume That <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">Demands Selection.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
                  Analyze your profile metrics, cross-examine with GitHub & LinkedIn, design instantly deployable web portfolios, and prep inside stateful AI mock interview terminals.
                </p>

                {/* Grid features (High-contrast, visual-centric) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {[
                    { title: "ATS Scorecard", desc: "Detailed breakdown on formatting, verb strength & achievements.", icon: Award, color: "border-violet-500/20 text-violet-400" },
                    { title: "Live Portfolio Designer", desc: "Generates fully responsive templates, customizable & downloadable.", icon: Globe, color: "border-cyan-500/20 text-cyan-400" },
                    { title: "AI Mock Interviews", desc: "Stateful chat interviews with granular feedback and grading.", icon: MessageSquare, color: "border-fuchsia-500/20 text-fuchsia-400" },
                    { title: "12-Week Gantt Roadmaps", desc: "Action steps and free curated links to bridge skill gaps.", icon: Target, color: "border-emerald-500/20 text-emerald-400" }
                  ].map((feat, i) => (
                    <div key={i} className="p-4 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-2xl flex items-start gap-3 transition-all">
                      <div className={`p-2 rounded-xl bg-white/[0.02] border ${feat.color} shrink-0`}>
                        <feat.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-none">{feat.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Creative Register / Portal Widget */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col gap-6 w-full max-w-md mx-auto">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Newly Designed Logo Banner */}
                  <div className="flex flex-col items-center text-center gap-2 mb-2">
                    <svg className="w-16 h-16 drop-shadow-[0_0_12px_rgba(139,92,246,0.65)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 3L92 24V64L50 97L8 64V24L50 3Z" fill="url(#logo-hero)" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
                      <path d="M50 13L82 29V59L50 84L18 29V29L50 13Z" fill="#02000c" stroke="rgba(14, 165, 233, 0.4)" strokeWidth="1.5" />
                      {/* Forge Hammer Vector */}
                      <path d="M35 48H65L62 66H38L35 48Z" fill="url(#glow-hero)" />
                      <rect x="46" y="32" width="8" height="18" rx="2.5" fill="url(#glow-hero)" />
                      {/* Spark dots */}
                      <circle cx="28" cy="40" r="2.5" fill="#38bdf8" />
                      <circle cx="72" cy="45" r="2" fill="#c084fc" />
                      <circle cx="50" cy="88" r="3" fill="#0ea5e9" className="animate-ping" />
                      <defs>
                        <linearGradient id="logo-hero" x1="0" y1="0" x2="100" y2="100">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#0ea5e9" />
                        </linearGradient>
                        <linearGradient id="glow-hero" x1="0" y1="0" x2="100" y2="100">
                          <stop offset="0%" stopColor="#c084fc" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div>
                      <h3 className="text-xl font-extrabold tracking-tight text-white">Create Account</h3>
                      <p className="text-xs text-slate-400">Unlock your AI Portfolio & ATS Scorecard</p>
                    </div>
                  </div>

                  {/* Register Pipelines */}
                  <div className="flex flex-col gap-3">
                    
                    {showGoogleOptions ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-3 text-center border border-violet-500/25 bg-violet-950/20 p-4.5 rounded-2xl relative overflow-hidden"
                      >
                        {/* Google Logo highlight */}
                        <div className="flex flex-col items-center gap-1.5 mb-1.5">
                          <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                          </svg>
                          <span className="text-[11px] font-bold text-slate-300">Choose Google account:</span>
                        </div>

                        <div className="flex flex-col gap-2.5">
                          {/* Option 1: Sankalan */}
                          <button
                            onClick={() => handleGoogleLoginAs("sankalan@demo.com")}
                            className="w-full py-3 px-4 rounded-xl border border-violet-500/25 hover:border-violet-500/50 bg-violet-600/10 hover:bg-violet-600/20 text-xs font-bold text-white transition-all flex flex-col items-center justify-center cursor-pointer shadow-md group"
                          >
                            <span className="text-[11px] text-violet-400 group-hover:text-violet-300 font-extrabold uppercase tracking-wider">Continue as Sankalan</span>
                            <span className="text-[9px] text-slate-400 mt-0.5">sankalan@demo.com</span>
                          </button>

                          {/* Option 2: Urshita */}
                          <button
                            onClick={() => handleGoogleLoginAs("urshita@demo.com")}
                            className="w-full py-3 px-4 rounded-xl border border-cyan-500/25 hover:border-cyan-500/50 bg-cyan-600/10 hover:bg-cyan-600/20 text-xs font-bold text-white transition-all flex flex-col items-center justify-center cursor-pointer shadow-md group"
                          >
                            <span className="text-[11px] text-cyan-400 group-hover:text-cyan-300 font-extrabold uppercase tracking-wider">Continue as Urshita</span>
                            <span className="text-[9px] text-slate-400 mt-0.5">urshita@demo.com</span>
                          </button>
                        </div>

                        <button
                          onClick={() => setShowGoogleOptions(false)}
                          className="mt-2 text-[10px] font-bold text-slate-400 hover:text-white cursor-pointer bg-transparent border-none outline-none"
                        >
                          ✕ Cancel
                        </button>
                      </motion.div>
                    ) : (
                      <>
                        {/* Google register */}
                        <button
                          onClick={handleGoogleLogin}
                          className="w-full py-3 px-4 rounded-xl border border-white/10 hover:border-violet-500/40 bg-white/[0.02] hover:bg-white/[0.04] text-xs font-bold text-white transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
                        >
                          {/* Google Colorful Vector Logo */}
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                          </svg>
                          Continue with Google
                        </button>

                        {/* Email register (Toggle email display) */}
                        {!showEmailInput ? (
                          <button
                            onClick={() => setShowEmailInput(true)}
                            className="w-full py-3 px-4 rounded-xl border border-white/10 hover:border-cyan-500/40 bg-white/[0.02] hover:bg-white/[0.04] text-xs font-bold text-white transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
                          >
                            <Mail className="w-4 h-4 text-cyan-400" />
                            Continue with Email
                          </button>
                        ) : (
                          <form onSubmit={handleEmailLogin} className="flex flex-col gap-2 mt-1">
                            <input
                              type="email"
                              required
                              value={userEmail}
                              onChange={(e) => setUserEmail(e.target.value)}
                              placeholder="Email (e.g. sankalan@demo.com)"
                              className="glass-input px-3.5 py-2 text-xs w-full"
                            />
                            <input
                              type="password"
                              required
                              value={userPassword}
                              onChange={(e) => setUserPassword(e.target.value)}
                              placeholder="Password (use 123 for demo)"
                              className="glass-input px-3.5 py-2 text-xs w-full"
                            />
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="glass-button flex-1 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-violet-600 to-cyan-500"
                              >
                                Log In / Register
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowEmailInput(false);
                                  setUserPassword("");
                                }}
                                className="px-3 py-2 rounded-lg border border-white/5 text-slate-400 hover:text-white text-xs font-semibold"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}

                        <div className="relative my-2 text-center">
                          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
                          <span className="relative bg-[#0b0b14] px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Or</span>
                        </div>

                        {/* Guest access */}
                        <button
                          onClick={() => {
                            setAuthMethod("guest");
                            setUserEmail("guest@demo.com");
                            setIsLoggedIn(true);
                          }}
                          className="w-full py-2.5 rounded-xl border border-dashed border-white/10 hover:border-slate-500/40 text-xs font-bold text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          Try instantly as Guest
                        </button>
                      </>
                    )}

                  </div>

                  <div className="text-[10px] text-slate-500 text-center leading-relaxed mt-2 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3 shrink-0" />
                    Strictly secure. We never sell your career data.
                  </div>

                  {/* Horizontal Demo Accounts Row */}
                  <div className="mt-2 border-t border-white/5 pt-3.5 flex flex-col gap-2">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Demo Accounts (Click to Auto-fill)</div>
                    <div className="flex flex-row items-center justify-center gap-3">
                      <button 
                        onClick={() => {
                          setUserEmail("sankalan@demo.com");
                          setUserPassword("123");
                          setShowEmailInput(true);
                        }}
                        className="glass-panel hover:border-violet-500/30 px-3 py-1.5 rounded-xl text-[10px] text-slate-300 flex flex-col items-center bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer"
                      >
                        <span className="font-bold text-violet-400 text-[11px] leading-none">Sankalan</span>
                        <span className="text-[9px] text-slate-500 mt-1">sankalan@demo.com • pass: 123</span>
                      </button>
                      
                      <button 
                        onClick={() => {
                          setUserEmail("urshita@demo.com");
                          setUserPassword("123");
                          setShowEmailInput(true);
                        }}
                        className="glass-panel hover:border-cyan-500/30 px-3 py-1.5 rounded-xl text-[10px] text-slate-300 flex flex-col items-center bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer"
                      >
                        <span className="font-bold text-cyan-400 text-[11px] leading-none">Urshita</span>
                        <span className="text-[9px] text-slate-500 mt-1">urshita@demo.com • pass: 123</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* System Architecture Full-Screen Overlay */}
            <AnimatePresence>
              {showArchitectureModal && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-50 bg-[#02000c]/98 backdrop-blur-2xl overflow-y-auto flex flex-col p-6 sm:p-12"
                >
                  {/* Radial Neon Highlights */}
                  <div className="absolute top-[-10%] left-[30%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
                  <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

                  {/* Schematic Header */}
                  <div className="w-full max-w-7xl mx-auto flex items-center justify-between border-b border-white/10 pb-6 mb-8 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/30 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">System Ingestion & Engineering Schematic</h2>
                        <p className="text-xs text-slate-400 font-medium">Bespoke TalentForge Monorepo Architecture Map</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowArchitectureModal(false)}
                      className="glass-button px-5 py-2.5 rounded-xl text-xs font-bold border border-violet-500/40 text-violet-400 hover:text-white shrink-0 shadow-lg"
                    >
                      Close
                    </button>
                  </div>

                  {/* Dashboard Explorer Grid */}
                  <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
                    
                    {/* Left: Interactive Directory Explorer Tree (4 Columns) */}
                    <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-400" />
                        📁 Monorepo File Explorer
                      </h3>

                      <div className="flex flex-col gap-3 font-mono text-[11px] text-slate-400 leading-normal overflow-y-auto max-h-[440px] pr-1">
                        
                        {/* root */}
                        <div className="flex items-center gap-1.5 font-bold text-white"><span className="text-violet-400">📂</span> TalentForge-Workspace/</div>
                        
                        {/* backend */}
                        <div className="pl-4 flex flex-col gap-2 border-l border-white/5 ml-2.5">
                          <div className="flex items-center gap-1.5 font-bold text-slate-300"><span>📂</span> backend/</div>
                          <div className="pl-4 flex flex-col gap-2 border-l border-white/5 ml-2.5">
                            <div className="flex items-center gap-1.5"><span>📂</span> routes/</div>
                            <div className="pl-4 flex flex-col gap-1.5 border-l border-white/5 ml-2.5">
                              <div className="flex items-center gap-1 text-[10px]"><span>📄</span> analyze.py <span className="text-violet-500">(Scorecard Route)</span></div>
                              <div className="flex items-center gap-1 text-[10px]"><span>📄</span> portfolio.py <span className="text-cyan-500">(Theme Exports)</span></div>
                              <div className="flex items-center gap-1 text-[10px]"><span>📄</span> interview.py <span className="text-emerald-500">(Mock Chat API)</span></div>
                            </div>
                            <div className="flex items-center gap-1.5"><span>📂</span> services/</div>
                            <div className="pl-4 flex flex-col gap-1.5 border-l border-white/5 ml-2.5">
                              <div className="flex items-center gap-1 text-[10px]"><span>📄</span> resume_parser.py <span className="text-slate-500">(pypdf Extractor)</span></div>
                              <div className="flex items-center gap-1 text-[10px]"><span>📄</span> gemini_service.py <span className="text-violet-400">(AI Orchestration)</span></div>
                              <div className="flex items-center gap-1 text-[10px]"><span>📄</span> db_service.py <span className="text-emerald-400">(Mongo & Fallback)</span></div>
                            </div>
                            <div className="flex items-center gap-1"><span>📄</span> app.py <span className="text-white/80">(Flask Entrypoint)</span></div>
                            <div className="flex items-center gap-1 text-slate-500"><span>📄</span> requirements.txt</div>
                          </div>
                        </div>

                        {/* frontend */}
                        <div className="pl-4 flex flex-col gap-2 border-l border-white/5 ml-2.5 mt-1">
                          <div className="flex items-center gap-1.5 font-bold text-slate-300"><span>📂</span> src/</div>
                          <div className="pl-4 flex flex-col gap-1.5 border-l border-white/5 ml-2.5">
                            <div className="flex items-center gap-1"><span>📄</span> App.jsx <span className="text-violet-400">(Landing & Dashboard SPA)</span></div>
                            <div className="flex items-center gap-1"><span>📄</span> index.css <span className="text-cyan-400">(Tailwind v4 Styling)</span></div>
                            <div className="flex items-center gap-1 text-slate-500"><span>📄</span> main.jsx</div>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500"><span>📄</span> vite.config.js <span className="text-xs text-white/50">(Port 3000 config)</span></div>
                        </div>

                      </div>
                    </div>

                    {/* Right: Immersive Architecture Detail Cards (8 Columns) */}
                    <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-1 max-h-[500px]">
                      
                      {/* Flow Step 1 */}
                      <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-violet-500/20 transition-all flex items-start gap-4">
                        <div className="w-8 h-8 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0 font-bold text-xs">
                          01
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                            PDF Resume Ingestion Pipeline
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            When you select a resume, the frontend packages it under a `multipart/form-data` request. The backend receives it at `/api/analyze`, passes the raw buffer to `pypdf`, and parses the characters. The text pipeline handles multi-page PDF documents and sanitizes unicode character sets seamlessly.
                          </p>
                        </div>
                      </div>

                      {/* Flow Step 2 */}
                      <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-cyan-500/20 transition-all flex items-start gap-4">
                        <div className="w-8 h-8 rounded-xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0 font-bold text-xs">
                          02
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                            Gemini AI Structured Schema Injections
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            The raw text is cross-referenced with your GitHub username or LinkedIn bio. TalentForge communicates with Gemini 1.5 Flash using highly detailed prompt instructions and locks down responses to strict, robust JSON schemas. This guarantees that all circular progress graphs, suggestions, missing skills, and interview flows parse correctly into standard objects.
                          </p>
                        </div>
                      </div>

                      {/* Flow Step 3 */}
                      <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-emerald-500/20 transition-all flex items-start gap-4">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 font-bold text-xs">
                          03
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                            PyMongo Cluster Integration with Local storage Fallback
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            TalentForge integrates a modern, highly fault-tolerant database connection layer. If you specify a `MONGO_URI`, it registers records in MongoDB clusters. If no database is detected or connections fail, the backend triggers an automated fallback write system that handles all records in a local backup file (`backend/data/mock_db.json`), guaranteeing zero setup issues.
                          </p>
                        </div>
                      </div>

                      {/* Flow Step 4 */}
                      <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-fuchsia-500/20 transition-all flex items-start gap-4">
                        <div className="w-8 h-8 rounded-xl bg-fuchsia-600/10 text-fuchsia-400 border border-fuchsia-500/20 flex items-center justify-center shrink-0 font-bold text-xs">
                          04
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                            Monorepo Vercel & Render Hosting Configurations
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            To ensure high-performance hosting, we set up the frontend directly in the monorepo root folder, allowing instant single-click Vercel integration. The backend sits inside a isolated `/backend` folder and is ready for containerized web service deployment on platforms like Render.
                          </p>
                        </div>
                      </div>

                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recruiter Panel Full-Screen Overlay */}
            <AnimatePresence>
              {showRecruiterModal && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-50 bg-[#02000c]/98 backdrop-blur-2xl overflow-y-auto flex flex-col p-6 sm:p-12"
                >
                  {/* Radial Neon Highlights */}
                  <div className="absolute top-[-10%] left-[30%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
                  <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none" />

                  {/* Header */}
                  <div className="w-full max-w-7xl mx-auto flex items-center justify-between border-b border-white/10 pb-6 mb-8 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Recruiter Audit & Hiring Suite</h2>
                        <p className="text-xs text-slate-400 font-medium">Bespoke integrations built to capture hiring manager attention</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowRecruiterModal(false)}
                      className="glass-button px-5 py-2.5 rounded-xl text-xs font-bold border border-cyan-500/40 text-cyan-400 hover:text-white shrink-0 shadow-lg"
                    >
                      Close
                    </button>
                  </div>

                  {/* Recruiter Suite Grid */}
                  <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 flex-grow">
                    
                    {/* Block 1 */}
                    <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col gap-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full blur-2xl" />
                      <div className="text-[10px] font-bold text-violet-400 tracking-widest uppercase">Integration Module #1</div>
                      <h3 className="text-base font-bold text-white">🔗 Shareable Candidate Talent Card</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Instead of sending heavy static documents, candidates can toggle their dashboards to "Public Recruiter View" and copy a single shareable link. 
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed border-t border-white/5 pt-4">
                        Recruiters click the link and instantly load your calculated scores, strengths, comparative before/after suggestions, target roadmap, and customizable portfolio—making evaluation extremely fast and interactive.
                      </p>
                    </div>

                    {/* Block 2 */}
                    <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col gap-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-600/5 rounded-full blur-2xl" />
                      <div className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">Integration Module #2</div>
                      <h3 className="text-base font-bold text-white">📊 Comparative ATS Scorecard</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        To prove engineering maturity, we parsed exact power verbs, formatting layout rules, skill density, and accomplishments using custom scoring equations.
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed border-t border-white/5 pt-4">
                        Hiring managers can see a direct comparison showing weak resume sentences vs their AI-refactored, metric-rich versions—highlighting exactly how a candidate impacts business products.
                      </p>
                    </div>

                    {/* Block 3 */}
                    <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col gap-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/5 rounded-full blur-2xl" />
                      <div className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">Integration Module #3</div>
                      <h3 className="text-base font-bold text-white">🛠️ Robust Offline Testing Safeguards</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Hiring teams often reject applications if local code builds fail or demand complex set-up configurations.
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed border-t border-white/5 pt-4">
                        To ensure zero setup issues, we integrated automatic local mock file connectors. Anyone can run and test every tab, theme exporter, interview chat, and scorecard instantly with zero API dependencies, establishing massive reliability.
                      </p>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer badges */}
            <div className="w-full border-t border-white/5 py-8 mt-auto flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl px-4">
              <span className="text-xs text-slate-500">&copy; {new Date().getFullYear()} TalentForge Ecosystem. Inspired by visual excellence.</span>
              <div className="flex items-center gap-5 text-xs text-slate-400">
                <span className="hover:text-white transition-colors cursor-pointer">Security Suite</span>
                <span className="hover:text-white transition-colors cursor-pointer">API Integration</span>
                <span className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</span>
              </div>
            </div>

          </motion.div>
        ) : (
          
          // ========================================================
          // =================== MAIN DASHBOARD =====================
          // ========================================================
          <motion.div
            key="dashboard-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full flex-grow flex flex-col"
          >
            
            {/* Header navbar */}
            <header className="sticky top-0 z-45 w-full glass-panel border-b border-white/5 backdrop-blur-md px-6 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                
                {/* Visual Header Logo */}
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 drop-shadow-[0_0_6px_rgba(139,92,246,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 5L90 25V65L50 95L10 65V25L50 5Z" fill="url(#logo-grad-nav)" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <path d="M50 15L80 30V60L50 82L20 60V30L50 15Z" fill="#030014" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1" />
                    <path d="M35 45H65L60 62H40L35 45Z" fill="url(#glow-grad-nav)" />
                    <rect x="47" y="32" width="6" height="15" rx="2" fill="url(#glow-grad-nav)" />
                    <defs>
                      <linearGradient id="logo-grad-nav" x1="0" y1="0" x2="100" y2="100">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                      </linearGradient>
                      <linearGradient id="glow-grad-nav" x1="0" y1="0" x2="100" y2="100">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div>
                    <h1 className="text-base font-bold tracking-tight text-white leading-none">
                      TalentForge
                    </h1>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">AI Career workspace</span>
                  </div>
                </div>

                {/* Tabs */}
                <nav className="hidden md:flex items-center gap-1">
                  {[
                    { id: "dashboard", label: "Dashboard", icon: FileText },
                    { id: "analyzer", label: "ATS Scorecard", icon: Sparkles },
                    { id: "resumebuilder", label: "AI Resume Maker", icon: Briefcase },
                    { id: "portfolio", label: "Portfolio Designer", icon: Globe },
                    { id: "interview", label: "Interview Prep", icon: MessageSquare },
                    { id: "roadmap", label: "Learning Path", icon: GraduationCap },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                        activeTab === tab.id 
                          ? "bg-violet-600/20 text-violet-400 border border-violet-500/30" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </nav>

                {/* Status Indicator & Log out */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block">
                    <button 
                      onClick={() => setShowStatusModal(true)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold transition-all duration-300 hover:scale-105 hover:bg-white/5 active:scale-95 cursor-pointer shadow-md ${
                        isOffline 
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/25" 
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? "bg-amber-400 animate-pulse" : "bg-emerald-400 animate-pulse"}`} />
                      {isOffline ? "Sandbox Mode" : "API Active"}
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      setIsLoggedIn(false);
                      setAuthMethod("");
                      setShowGoogleOptions(false);
                    }} 
                    className="px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-[10px] font-bold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </header>

            {/* Dashboard Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
              <AnimatePresence mode="wait">
                
                {/* ================== TAB: DASHBOARD ================== */}
                {activeTab === "dashboard" && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                  >
                    {/* Left Column: Upload Panel */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                      <div className="glass-panel rounded-2xl p-6 flex flex-col gap-5 border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl" />
                        
                        <div className="flex items-center gap-2.5">
                          <UploadCloud className="w-5 h-5 text-violet-400" />
                          <h2 className="text-lg font-bold text-white">Upload Resume</h2>
                        </div>
                        
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Upload your PDF resume to parse it, score it, generate customizable portfolios, and begin customized mock coding interviews.
                        </p>

                        <form onSubmit={handleUpload} className="flex flex-col gap-4">
                          <label className="border-2 border-dashed border-white/10 hover:border-violet-500/40 transition-all rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-white/[0.01] hover:bg-white/[0.03]">
                            <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                            <span className="text-xs font-semibold text-slate-300">
                              {file ? file.name : "Select PDF Resume"}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-1">PDF format only (Max 5MB)</span>
                            <input 
                              type="file" 
                              accept=".pdf" 
                              className="hidden" 
                              onChange={(e) => setFile(e.target.files[0])} 
                            />
                          </label>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">GitHub Profile (Optional)</label>
                            <input 
                              type="text" 
                              placeholder={userEmail.toLowerCase() === "urshita@demo.com" ? "e.g. URSHITA" : "e.g. SANKALAN"} 
                              value={github}
                              onChange={(e) => setGithub(e.target.value)}
                              className="glass-input px-3 py-2 text-xs w-full font-semibold"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">LinkedIn Summary (Optional)</label>
                            <textarea 
                              rows="2"
                              placeholder="Paste LinkedIn bio or summary here..." 
                              value={linkedin}
                              onChange={(e) => setLinkedin(e.target.value)}
                              className="glass-input px-3 py-2 text-xs w-full resize-none font-semibold"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={!file || isAnalyzing}
                            className="glass-button w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-40"
                          >
                            {isAnalyzing ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                AI Engine Processing...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 text-violet-400" />
                                Analyze Profile
                              </>
                            )}
                          </button>
                        </form>
                      </div>

                      {/* Candidate Selection List */}
                      <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-2xl">
                        <h3 className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-cyan-400" />
                          Past Analyses History
                        </h3>
                        
                        <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                          {analyses.map((item, idx) => (
                            <button
                              key={item.id || idx}
                              onClick={() => setSelectedAnalysis(item)}
                              className={`text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                                selectedAnalysis?.id === item.id 
                                  ? "bg-white/5 border-violet-500/40 shadow-inner" 
                                  : "border-white/5 hover:bg-white/[0.02]"
                              }`}
                            >
                              <div>
                                <div className="text-xs font-bold text-white">{item.analysis.applicant_name}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">ATS Score: {item.analysis.ats_score}</div>
                              </div>
                              <div className="w-8 h-8 rounded-lg bg-violet-600/10 text-violet-400 flex items-center justify-center font-bold text-xs border border-violet-500/20">
                                {item.analysis.ats_score}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Columns: Main Dashboard View */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                      {selectedAnalysis ? (
                        <>
                          {/* Welcome Banner */}
                          <div className="glass-panel rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-gradient-to-br from-violet-600/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-violet-400" />
                                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Profile Overview</span>
                              </div>
                              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
                                Hi, {selectedAnalysis.analysis.applicant_name}
                              </h2>
                              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                                {selectedAnalysis.analysis.summary}
                              </p>
                            </div>

                            {/* Radial Score Gauge */}
                            <div className="flex flex-col items-center shrink-0">
                              <div className="relative w-28 h-28 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                  <circle cx="56" cy="56" r="48" className="stroke-slate-800" strokeWidth="6" fill="transparent" />
                                  <circle 
                                    cx="56" 
                                    cy="56" 
                                    r="48" 
                                    className="stroke-violet-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" 
                                    strokeWidth="8" 
                                    fill="transparent" 
                                    strokeDasharray={2 * Math.PI * 48}
                                    strokeDashoffset={2 * Math.PI * 48 * (1 - selectedAnalysis.analysis.ats_score / 100)}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                  <span className="text-2xl font-black text-white">{selectedAnalysis.analysis.ats_score}</span>
                                  <span className="text-[10px] font-bold text-violet-400 tracking-widest uppercase">ATS Rating</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Breakdown Scores Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                              { label: "Layout & Formatting", val: selectedAnalysis.analysis.sub_scores.formatting, color: "stroke-emerald-400" },
                              { label: "Power & Action Verbs", val: selectedAnalysis.analysis.sub_scores.impact, color: "stroke-indigo-400" },
                              { label: "Skill-Density Map", val: selectedAnalysis.analysis.sub_scores.skills, color: "stroke-cyan-400" },
                              { label: "Quantifiable Impact", val: selectedAnalysis.analysis.sub_scores.achievements, color: "stroke-amber-400" },
                            ].map((item, idx) => (
                              <div key={idx} className="glass-panel rounded-2xl p-4 border border-white/5 flex items-center gap-3.5">
                                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                                  <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="24" cy="24" r="20" className="stroke-slate-800" strokeWidth="3" fill="transparent" />
                                    <circle 
                                      cx="24" 
                                      cy="24" 
                                      r="20" 
                                      className={item.color} 
                                      strokeWidth="4" 
                                      fill="transparent" 
                                      strokeDasharray={2 * Math.PI * 20}
                                      strokeDashoffset={2 * Math.PI * 20 * (1 - item.val / 100)}
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  <span className="absolute text-xs font-bold text-white">{item.val}</span>
                                </div>
                                <div>
                                  <div className="text-[9px] font-bold text-slate-400 tracking-wider uppercase leading-none">{item.label}</div>
                                  <div className="text-base font-black text-white mt-1">{item.val}%</div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Recruiter View Share Widget */}
                          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-cyan-600/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shrink-0">
                                <Globe className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white">Recruiter View Link Active</h4>
                                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Recruiters can review this candidate card live with your customized portfolio.</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`https://talentforge.dev/candidate/${selectedAnalysis.id}`);
                                alert("Recruiter Shareable Link copied to clipboard!");
                              }}
                              className="glass-button px-3.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shrink-0"
                            >
                              <Copy className="w-3 h-3" />
                              Copy Share Link
                            </button>
                          </div>

                          {/* Strengths & Weaknesses Quick Glance */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-panel rounded-2xl p-6 border border-white/5">
                              <h3 className="text-xs font-bold text-emerald-400 mb-4 flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4" />
                                Core Profile Strengths
                              </h3>
                              <ul className="flex flex-col gap-3">
                                {selectedAnalysis.analysis.strengths.map((str, i) => (
                                  <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                    {str}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="glass-panel rounded-2xl p-6 border border-white/5">
                              <h3 className="text-xs font-bold text-rose-400 mb-4 flex items-center gap-1.5">
                                <ShieldAlert className="w-4 h-4" />
                                Application Weaknesses
                              </h3>
                              <ul className="flex flex-col gap-3">
                                {selectedAnalysis.analysis.weaknesses.map((wk, i) => (
                                  <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                                    {wk}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="glass-panel rounded-3xl p-12 border border-white/5 text-center flex flex-col items-center justify-center">
                          <UploadCloud className="w-16 h-16 text-violet-400 mb-4 animate-bounce" />
                          <h3 className="text-xl font-bold text-white mb-2">No Profiles Analyzed Yet</h3>
                          <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
                            Select or drag-and-drop your resume in the panel on the left to begin generating actionable AI insights!
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ================== TAB: ANALYZER ================== */}
                {activeTab === "analyzer" && (
                  <motion.div
                    key="analyzer"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex flex-col gap-8"
                  >
                    {selectedAnalysis ? (
                      <>
                        <div>
                          <h2 className="text-2xl font-black text-white tracking-tight">Recruiter-Grade Scorecard</h2>
                          <p className="text-sm text-slate-400 mt-1 font-medium">Detailed resume improvements to pass both ATS systems and human screening.</p>
                        </div>

                        {/* Company Match Score */}
                        <div className="glass-panel rounded-2xl p-6 border border-white/5">
                          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-violet-400" />
                            Cross-Industry Match Scorecard
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {selectedAnalysis.analysis.company_matching.map((comp, idx) => (
                              <div key={idx} className="bg-white/[0.01] border border-white/5 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-bold text-slate-200">{comp.type}</span>
                                  <span className="text-sm font-black text-violet-400">{comp.match_percentage}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-4">
                                  <div className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full" style={{ width: `${comp.match_percentage}%` }} />
                                </div>
                                <ul className="flex flex-col gap-2">
                                  {comp.reasons.map((r, i) => (
                                    <li key={i} className="text-[11px] text-slate-400 leading-relaxed flex items-start gap-1.5">
                                      <span className="w-1 h-1 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                                      {r}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Suggestions */}
                        <div className="flex flex-col gap-4">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-cyan-400" />
                            Interactive Resume Refactoring Suggestions
                          </h3>
                          
                          <div className="flex flex-col gap-4">
                            {selectedAnalysis.analysis.suggestions.map((sug, idx) => (
                              <div key={idx} className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20">
                                    {sug.area}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-400">Improvement #{idx + 1}</span>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                                  <div className="border border-rose-500/20 bg-rose-500/[0.02] rounded-xl p-4 flex flex-col gap-2 relative">
                                    <span className="absolute top-3 right-3 text-[9px] font-bold text-rose-400 tracking-wider uppercase">Original</span>
                                    <div className="text-[10px] font-bold text-rose-300">Weak Phrase</div>
                                    <p className="text-xs text-slate-300 leading-relaxed italic mt-1">"{sug.before}"</p>
                                  </div>

                                  <div className="border border-emerald-500/20 bg-emerald-500/[0.02] rounded-xl p-4 flex flex-col gap-2 relative">
                                    <span className="absolute top-3 right-3 text-[9px] font-bold text-emerald-400 tracking-wider uppercase">AI Optimized</span>
                                    <div className="text-[10px] font-bold text-emerald-300">Recommended</div>
                                    <p className="text-xs text-slate-100 leading-relaxed font-semibold mt-1">"{sug.after}"</p>
                                  </div>
                                </div>

                                <div className="text-xs text-slate-400 border-t border-white/5 pt-3 leading-relaxed flex items-center gap-2">
                                  <span className="font-bold text-cyan-400">Why it works:</span>
                                  {sug.why}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Skill Gaps */}
                        <div className="glass-panel rounded-2xl p-6 border border-white/5">
                          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-violet-400" />
                            Critical Skill Gap Analysis
                          </h3>
                          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                            We cross-referenced your profile with popular tech stacks to identify target skill sets you should append.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                              { category: "Critical Skill Gaps", list: selectedAnalysis.analysis.missing_skills.critical, color: "text-rose-400 border-rose-500/20 bg-rose-500/5", dotColor: "bg-rose-400" },
                              { category: "Highly Recommended", list: selectedAnalysis.analysis.missing_skills.recommended, color: "text-amber-400 border-amber-500/20 bg-amber-500/5", dotColor: "bg-amber-400" },
                              { category: "Optional Skills", list: selectedAnalysis.analysis.missing_skills.optional, color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5", dotColor: "bg-cyan-400" },
                            ].map((grp, idx) => (
                              <div key={idx} className="flex flex-col gap-3">
                                <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold tracking-wide uppercase ${grp.color}`}>
                                  {grp.category}
                                </div>
                                <div className="flex flex-col gap-2">
                                  {grp.list.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/[0.01] border border-white/5 rounded-lg text-xs text-slate-300">
                                      <span className={`w-1.5 h-1.5 rounded-full ${grp.dotColor}`} />
                                      {s}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="glass-panel rounded-3xl p-12 border border-white/5 text-center flex flex-col items-center justify-center">
                        <UploadCloud className="w-16 h-16 text-violet-400 mb-4 animate-bounce" />
                        <h3 className="text-xl font-bold text-white mb-2">No Profile Uploaded</h3>
                        <p className="text-slate-400 max-w-sm text-sm">Return to the dashboard to scan your resume!</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ================== TAB: AI RESUME MAKER ================== */}
                {activeTab === "resumebuilder" && (
                  <motion.div
                    key="resumebuilder"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                  >
                    <style>{`
                      @media print {
                        body * {
                          visibility: hidden !important;
                        }
                        #printable-resume-area, #printable-resume-area * {
                          visibility: visible !important;
                        }
                        #printable-resume-area {
                          position: absolute !important;
                          left: 0 !important;
                          top: 0 !important;
                          width: 100% !important;
                          max-width: 100% !important;
                          background: white !important;
                          color: #1e293b !important;
                          padding: 40px !important;
                          margin: 0 !important;
                          box-shadow: none !important;
                          border: none !important;
                          z-index: 99999 !important;
                        }
                      }
                    `}</style>

                    {/* Left Column: Form Editor */}
                    <div className="lg:col-span-6 flex flex-col gap-6">
                      <div className="flex items-center justify-between flex-wrap gap-2 text-left">
                        <div>
                          <h2 className="text-2xl font-black text-white tracking-tight">AI Resume Maker</h2>
                          <p className="text-sm text-slate-400 mt-1 font-medium">Draft, refine, and optimize your recruiter-ready application.</p>
                        </div>
                      </div>

                      {/* AI Resume Generator Command Center */}
                      <div className="relative overflow-hidden glass-panel rounded-2xl p-6 border border-violet-500/30 bg-gradient-to-br from-violet-950/20 via-slate-900/40 to-cyan-950/20 text-left flex flex-col gap-4">
                        {/* Decorative neon gradient highlight */}
                        <div className="absolute top-0 right-0 w-36 h-36 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-36 h-36 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                            Omniscient AI Resume Assistant
                          </h3>
                          <span className="text-[9px] font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                            Offline Sandbox Mode
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                          Type any target role, specific skills, companies, or custom accomplishments you want. The AI will instantly compile a recruiter-ready resume tailored to your profile!
                        </p>

                        <div className="flex flex-col gap-2 relative">
                          <textarea
                            value={aiResumePrompt}
                            onChange={(e) => setAiResumePrompt(e.target.value)}
                            placeholder="e.g. Build a senior DevOps Engineer resume focused on AWS, Kubernetes, Terraform, and CI/CD, with 4 years experience at Oracle."
                            rows={3}
                            disabled={isGeneratingAiResume}
                            className="w-full glass-input px-3.5 py-3 text-xs font-semibold placeholder-slate-500 border border-white/5 focus:border-violet-500/50 bg-slate-950/40 resize-none rounded-xl"
                          />
                          
                          {isGeneratingAiResume && (
                            <div className="absolute inset-0 bg-slate-950/80 rounded-xl flex flex-col items-center justify-center gap-3 backdrop-blur-sm border border-violet-500/20">
                              {/* Spinner micro-animation */}
                              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                              <span className="text-[11px] font-bold text-violet-400 animate-pulse">{aiResumeProgress}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center gap-4">
                          <span className="text-[10px] text-slate-400 leading-normal flex items-center gap-1">
                            <span className="w-1 h-1 bg-violet-400 rounded-full animate-ping" />
                            Current session: <span className="font-bold text-violet-400 uppercase">{resumeData.name}</span>
                          </span>

                          <button
                            onClick={() => handleGenerateAiResume(aiResumePrompt)}
                            disabled={isGeneratingAiResume || !aiResumePrompt.trim()}
                            className="px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 rounded-xl cursor-pointer shadow-lg shadow-violet-500/20 flex items-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 animate-pulse"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Generate Resume
                          </button>
                        </div>
                      </div>

                      {/* Section A: Personal & Contact info */}
                      <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-4 text-left">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                          <User className="w-4 h-4 text-violet-400" />
                          Personal & Contact Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                            <input
                              type="text"
                              value={resumeData.name}
                              onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                              className="glass-input px-3.5 py-2 text-xs font-semibold"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Target Professional Role</label>
                            <input
                              type="text"
                              value={resumeData.role}
                              onChange={(e) => setResumeData({ ...resumeData, role: e.target.value })}
                              className="glass-input px-3.5 py-2 text-xs font-semibold"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                            <input
                              type="email"
                              value={resumeData.email}
                              onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                              className="glass-input px-3.5 py-2 text-xs font-semibold"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">LinkedIn Profile Link</label>
                            <input
                              type="text"
                              value={resumeData.linkedin}
                              onChange={(e) => setResumeData({ ...resumeData, linkedin: e.target.value })}
                              className="glass-input px-3.5 py-2 text-xs font-semibold"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">GitHub Profile URL</label>
                            <input
                              type="text"
                              value={resumeData.github}
                              onChange={(e) => setResumeData({ ...resumeData, github: e.target.value })}
                              className="glass-input px-3.5 py-2 text-xs font-semibold"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Personal Portfolio Website</label>
                            <input
                              type="text"
                              value={resumeData.website}
                              onChange={(e) => setResumeData({ ...resumeData, website: e.target.value })}
                              className="glass-input px-3.5 py-2 text-xs font-semibold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section B: Summary Statement */}
                      <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-4 text-left">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                          <Sparkles className="w-4 h-4 text-violet-400" />
                          Professional Summary Statement
                        </h3>
                        <div className="flex flex-col gap-1.5">
                          <textarea
                            value={resumeData.summary}
                            rows={3}
                            onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                            className="glass-input px-3.5 py-2 text-xs font-semibold resize-y"
                          />
                        </div>
                      </div>

                      {/* Section C: Work Experience */}
                      <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-4 text-left">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-violet-400" />
                            Work History & Roles
                          </h3>
                          <button
                            onClick={() => {
                              const newExp = { company: "New Corp", role: "Software Developer", date: "2025 - Present", bullets: ["Implemented dynamic frontends."] };
                              setResumeData({ ...resumeData, experience: [...resumeData.experience, newExp] });
                            }}
                            className="text-[10px] font-bold text-violet-400 hover:text-white flex items-center gap-1 bg-transparent border-none cursor-pointer"
                          >
                            + Add Role
                          </button>
                        </div>

                        {resumeData.experience.map((exp, idx) => (
                          <div key={idx} className="flex flex-col gap-3 p-4 bg-white/[0.01] border border-white/5 rounded-xl relative">
                            <button
                              onClick={() => {
                                const newExps = resumeData.experience.filter((_, i) => i !== idx);
                                setResumeData({ ...resumeData, experience: newExps });
                              }}
                              className="absolute top-3 right-3 text-[10px] font-bold text-rose-400 hover:text-white bg-transparent border-none cursor-pointer"
                            >
                              Delete
                            </button>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="flex flex-col gap-1 text-left">
                                <label className="text-[9px] font-bold text-slate-500 uppercase">Company Name</label>
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) => {
                                    const newExps = [...resumeData.experience];
                                    newExps[idx].company = e.target.value;
                                    setResumeData({ ...resumeData, experience: newExps });
                                  }}
                                  className="glass-input px-2.5 py-1.5 text-xs font-semibold"
                                />
                              </div>
                              <div className="flex flex-col gap-1 text-left">
                                <label className="text-[9px] font-bold text-slate-500 uppercase">Your Role Title</label>
                                <input
                                  type="text"
                                  value={exp.role}
                                  onChange={(e) => {
                                    const newExps = [...resumeData.experience];
                                    newExps[idx].role = e.target.value;
                                    setResumeData({ ...resumeData, experience: newExps });
                                  }}
                                  className="glass-input px-2.5 py-1.5 text-xs font-semibold"
                                />
                              </div>
                              <div className="flex flex-col gap-1 text-left">
                                <label className="text-[9px] font-bold text-slate-500 uppercase">Employment Dates</label>
                                <input
                                  type="text"
                                  value={exp.date}
                                  onChange={(e) => {
                                    const newExps = [...resumeData.experience];
                                    newExps[idx].date = e.target.value;
                                    setResumeData({ ...resumeData, experience: newExps });
                                  }}
                                  className="glass-input px-2.5 py-1.5 text-xs font-semibold"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Key accomplishments</span>
                                <button
                                  onClick={() => {
                                    const newExps = [...resumeData.experience];
                                    newExps[idx].bullets.push("New accomplishment point.");
                                    setResumeData({ ...resumeData, experience: newExps });
                                  }}
                                  className="text-[9px] font-bold text-violet-400 bg-transparent border-none cursor-pointer"
                                >
                                  + Add Bullet
                                </button>
                              </div>
                              {exp.bullets.map((b, bIdx) => (
                                <div key={bIdx} className="flex gap-2 items-center">
                                  <textarea
                                    value={b}
                                    rows={2}
                                    onChange={(e) => {
                                      const newExps = [...resumeData.experience];
                                      newExps[idx].bullets[bIdx] = e.target.value;
                                      setResumeData({ ...resumeData, experience: newExps });
                                    }}
                                    className="glass-input px-3 py-1.5 text-xs font-medium resize-none flex-grow"
                                  />
                                  <button
                                    onClick={() => {
                                      const newExps = [...resumeData.experience];
                                      newExps[idx].bullets = newExps[idx].bullets.filter((_, i) => i !== bIdx);
                                      setResumeData({ ...resumeData, experience: newExps });
                                    }}
                                    className="text-slate-500 hover:text-rose-400 text-xs bg-transparent border-none cursor-pointer font-bold px-1"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Section D: Key Projects */}
                      <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-4 text-left">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Award className="w-4 h-4 text-violet-400" />
                            Core Projects
                          </h3>
                          <button
                            onClick={() => {
                              const newProj = { title: "New Project Platform", bullets: ["Built scalable systems."] };
                              setResumeData({ ...resumeData, projects: [...resumeData.projects, newProj] });
                            }}
                            className="text-[10px] font-bold text-violet-400 hover:text-white flex items-center gap-1 bg-transparent border-none cursor-pointer"
                          >
                            + Add Project
                          </button>
                        </div>

                        {resumeData.projects.map((proj, idx) => (
                          <div key={idx} className="flex flex-col gap-3 p-4 bg-white/[0.01] border border-white/5 rounded-xl relative">
                            <button
                              onClick={() => {
                                const newProjs = resumeData.projects.filter((_, i) => i !== idx);
                                setResumeData({ ...resumeData, projects: newProjs });
                              }}
                              className="absolute top-3 right-3 text-[10px] font-bold text-rose-400 hover:text-white bg-transparent border-none cursor-pointer"
                            >
                              Delete
                            </button>
                            <div className="flex flex-col gap-1 text-left">
                              <label className="text-[9px] font-bold text-slate-500 uppercase">Project Title</label>
                              <input
                                type="text"
                                value={proj.title}
                                onChange={(e) => {
                                  const newProjs = [...resumeData.projects];
                                  newProjs[idx].title = e.target.value;
                                  setResumeData({ ...resumeData, projects: newProjs });
                                }}
                                className="glass-input px-2.5 py-1.5 text-xs font-semibold"
                              />
                            </div>

                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Key specifications</span>
                                <button
                                  onClick={() => {
                                    const newProjs = [...resumeData.projects];
                                    newProjs[idx].bullets.push("Developed responsive layout workflows.");
                                    setResumeData({ ...resumeData, projects: newProjs });
                                  }}
                                  className="text-[9px] font-bold text-violet-400 bg-transparent border-none cursor-pointer"
                                >
                                  + Add Bullet
                                </button>
                              </div>
                              {proj.bullets.map((b, bIdx) => (
                                <div key={bIdx} className="flex gap-2 items-center">
                                  <textarea
                                    value={b}
                                    rows={2}
                                    onChange={(e) => {
                                      const newProjs = [...resumeData.projects];
                                      newProjs[idx].bullets[bIdx] = e.target.value;
                                      setResumeData({ ...resumeData, projects: newProjs });
                                    }}
                                    className="glass-input px-3 py-1.5 text-xs font-medium resize-none flex-grow"
                                  />
                                  <button
                                    onClick={() => {
                                      const newProjs = [...resumeData.projects];
                                      newProjs[idx].bullets = newProjs[idx].bullets.filter((_, i) => i !== bIdx);
                                      setResumeData({ ...resumeData, projects: newProjs });
                                    }}
                                    className="text-slate-500 hover:text-rose-400 text-xs bg-transparent border-none cursor-pointer font-bold px-1"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Section E: Skills & Education */}
                      <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-4 text-left">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                          <GraduationCap className="w-4 h-4 text-violet-400" />
                          Skills & Education
                        </h3>
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-1.5 text-left">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Core Skills Tags (Comma-separated)</label>
                            <input
                              type="text"
                              value={resumeData.skills}
                              onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                              className="glass-input px-3.5 py-2 text-xs font-semibold"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 text-left">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Education Summary</label>
                            <input
                              type="text"
                              value={resumeData.education}
                              onChange={(e) => setResumeData({ ...resumeData, education: e.target.value })}
                              className="glass-input px-3.5 py-2 text-xs font-semibold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Preview pane / AI Rewrite lab */}
                    <div className="lg:col-span-6 flex flex-col gap-6 lg:sticky lg:top-8">
                      {/* View Switcher Tabs */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setActivePreviewTab("preview")}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                              activePreviewTab === "preview"
                                ? "bg-violet-600/20 text-violet-400 border border-violet-500/30"
                                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                            }`}
                          >
                            Live Recruiter Preview
                          </button>
                          <button
                            onClick={() => setActivePreviewTab("lab")}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                              activePreviewTab === "lab"
                                ? "bg-violet-600/20 text-violet-400 border border-violet-500/30"
                                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Rewrite Lab
                          </button>
                        </div>

                        {/* Export Menu */}
                        {activePreviewTab === "preview" && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => {
                                const docHtml = `
                                  <html>
                                  <head>
                                    <title>Resume - ${resumeData.name}</title>
                                    <style>
                                      body { font-family: sans-serif; max-width: 800px; margin: 40px auto; color: #1e293b; line-height: 1.6; }
                                      h1 { font-size: 28px; margin-bottom: 2px; }
                                      .role { font-size: 18px; color: #64748b; font-weight: bold; margin-bottom: 10px; }
                                      .contact { font-size: 13px; color: #475569; border-bottom: 2px solid #5b21b6; padding-bottom: 8px; margin-bottom: 20px; }
                                      h2 { font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; color: #1e3a8a; margin-top: 25px; }
                                      .job { margin-top: 15px; }
                                      .title { font-weight: bold; }
                                      .meta { color: #64748b; font-size: 12px; margin-top: 2px; }
                                      ul { padding-left: 20px; }
                                      li { margin-bottom: 4px; }
                                    </style>
                                  </head>
                                  <body>
                                    <div style="text-align: center;">
                                      <h1>${resumeData.name}</h1>
                                      <div className="role">${resumeData.role}</div>
                                      <div className="contact">${resumeData.email} | ${resumeData.linkedin} | ${resumeData.github} | ${resumeData.website}</div>
                                    </div>
                                    <h2>PROFESSIONAL SUMMARY</h2>
                                    <p>${resumeData.summary}</p>
                                    <h2>WORK EXPERIENCE</h2>
                                    ${resumeData.experience.map(exp => `
                                      <div className="job">
                                        <span className="title">${exp.role}</span> at <i>${exp.company}</i>
                                        <div className="meta">${exp.date}</div>
                                        <ul>${exp.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
                                      </div>
                                    `).join("")}
                                    <h2>PROJECTS</h2>
                                    ${resumeData.projects.map(p => `
                                      <div className="job">
                                        <span className="title">${p.title}</span>
                                        <ul>${p.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
                                      </div>
                                    `).join("")}
                                    <h2>SKILLS</h2>
                                    <p>${resumeData.skills}</p>
                                    <h2>EDUCATION</h2>
                                    <p>${resumeData.education}</p>
                                  </body>
                                  </html>
                                `;
                                const blob = new Blob([docHtml], { type: "text/html" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `${resumeData.name.replace(/\s+/g, "_")}_Resume.html`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold text-cyan-400 hover:text-white border border-cyan-500/20 rounded-md cursor-pointer hover:bg-cyan-500/10 flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              HTML
                            </button>

                            <button
                              onClick={() => {
                                const md = `
# ${resumeData.name}
**${resumeData.role}**

${resumeData.email} | ${resumeData.linkedin} | ${resumeData.github} | ${resumeData.website}

---

## PROFESSIONAL SUMMARY
${resumeData.summary}

## WORK EXPERIENCE
${resumeData.experience.map(exp => `
### ${exp.role} - ${exp.company}
*${exp.date}*
${exp.bullets.map(b => `* ${b}`).join("\n")}
`).join("\n")}

## PROJECTS
${resumeData.projects.map(p => `
### ${p.title}
${p.bullets.map(b => `* ${b}`).join("\n")}
`).join("\n")}

## TECHNICAL SKILLS
${resumeData.skills}

## EDUCATION
${resumeData.education}
                                `;
                                const blob = new Blob([md], { type: "text/plain" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `${resumeData.name.replace(/\s+/g, "_")}_Resume.md`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold text-violet-400 hover:text-white border border-violet-500/20 rounded-md cursor-pointer hover:bg-violet-500/10 flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              Markdown
                            </button>

                            {/* EXPORT WORD DOC (.doc) */}
                            <button
                              onClick={() => {
                                const resumeHtml = `
                                  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                                  <head>
                                    <title>Resume - ${resumeData.name}</title>
                                    <style>
                                      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.15; margin: 1in; }
                                      h1 { font-size: 18pt; font-weight: bold; border-bottom: 1.5pt solid #5b21b6; color: #5b21b6; margin-bottom: 5px; }
                                      h2 { font-size: 13pt; font-weight: bold; color: #1e3a8a; border-bottom: 1pt solid #cbd5e1; margin-top: 15px; margin-bottom: 5px; }
                                      .contact { font-size: 9.5pt; color: #475569; margin-bottom: 15px; text-align: center; }
                                      .job-title { font-weight: bold; }
                                      .job-meta { color: #64748b; font-size: 10pt; }
                                      ul { margin-top: 5px; margin-bottom: 5px; padding-left: 20px; }
                                      li { margin-bottom: 3px; }
                                    </style>
                                  </head>
                                  <body>
                                    <div style="text-align: center;">
                                      <h1 style="margin: 0; padding: 0; border: none; font-size: 22pt;">${resumeData.name}</h1>
                                      <div style="font-size: 13pt; font-weight: bold; color: #64748b; margin-top: 3px;">${resumeData.role}</div>
                                      <div class="contact">
                                        ${resumeData.email} | ${resumeData.linkedin} | ${resumeData.github} | ${resumeData.website}
                                      </div>
                                    </div>
                                    
                                    <h2>PROFESSIONAL SUMMARY</h2>
                                    <p>${resumeData.summary}</p>
                                    
                                    <h2>WORK EXPERIENCE</h2>
                                    ${resumeData.experience.map(exp => `
                                      <div style="margin-top: 10px;">
                                        <span class="job-title">${exp.role}</span> - <span style="font-style: italic;">${exp.company}</span>
                                        <div class="job-meta">${exp.date}</div>
                                        <ul>
                                          ${exp.bullets.map(b => `<li>${b}</li>`).join("")}
                                        </ul>
                                      </div>
                                    `).join("")}
                                    
                                    <h2>PROJECTS</h2>
                                    ${resumeData.projects.map(proj => `
                                      <div style="margin-top: 10px;">
                                        <span class="job-title">${proj.title}</span>
                                        <ul>
                                          ${proj.bullets.map(b => `<li>${b}</li>`).join("")}
                                        </ul>
                                      </div>
                                    `).join("")}
                                    
                                    <h2>TECHNICAL SKILLS</h2>
                                    <p>${resumeData.skills}</p>
                                    
                                    <h2>EDUCATION</h2>
                                    <p>${resumeData.education}</p>
                                  </body>
                                  </html>
                                `;
                                const blob = new Blob(['\ufeff' + resumeHtml], { type: 'application/msword' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `${resumeData.name.replace(/\s+/g, "_")}_Resume.doc`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold text-amber-400 hover:text-white border border-amber-500/20 rounded-md cursor-pointer hover:bg-amber-500/10 flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              Document (.doc)
                            </button>

                            {/* EXPORT PDF (TRIGGERS PRINT) */}
                            <button
                              onClick={() => {
                                window.print();
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold text-emerald-400 hover:text-white border border-emerald-500/20 rounded-md cursor-pointer hover:bg-emerald-500/10 flex items-center gap-1 animate-pulse"
                            >
                              <FileText className="w-3 h-3" />
                              Print PDF
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Display View Content */}
                      {activePreviewTab === "preview" ? (
                        <div 
                          id="printable-resume-area"
                          className="w-full bg-white text-slate-800 p-8 shadow-2xl rounded-2xl flex flex-col gap-6 text-left border border-slate-200"
                        >
                          <div className="text-center border-b-2 border-violet-800 pb-4">
                            <h2 className="text-2xl font-black text-slate-900 leading-none">{resumeData.name}</h2>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mt-1.5">{resumeData.role}</p>
                            <p className="text-[10px] text-slate-400 mt-2 flex flex-wrap justify-center gap-2">
                              <span>{resumeData.email}</span>
                              <span>•</span>
                              <span>{resumeData.linkedin}</span>
                              <span>•</span>
                              <span>{resumeData.github}</span>
                              <span>•</span>
                              <span>{resumeData.website}</span>
                            </p>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <h3 className="text-xs font-black text-violet-800 uppercase tracking-widest border-b border-slate-200 pb-0.5">Professional Summary</h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">{resumeData.summary}</p>
                          </div>

                          <div className="flex flex-col gap-3">
                            <h3 className="text-xs font-black text-violet-800 uppercase tracking-widest border-b border-slate-200 pb-0.5">Work History</h3>
                            {resumeData.experience.map((exp, i) => (
                              <div key={i} className="flex flex-col gap-1">
                                <div className="flex justify-between items-baseline flex-wrap">
                                  <span className="text-xs font-bold text-slate-800">{exp.role} — <span className="font-semibold italic">{exp.company}</span></span>
                                  <span className="text-[10px] font-semibold text-slate-400">{exp.date}</span>
                                </div>
                                <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
                                  {exp.bullets.map((b, idx) => (
                                    <li key={idx} className="text-xs text-slate-600 leading-relaxed font-medium">{b}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-col gap-3">
                            <h3 className="text-xs font-black text-violet-800 uppercase tracking-widest border-b border-slate-200 pb-0.5">Key Projects</h3>
                            {resumeData.projects.map((proj, i) => (
                              <div key={i} className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-slate-800">{proj.title}</span>
                                <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
                                  {proj.bullets.map((b, idx) => (
                                    <li key={idx} className="text-xs text-slate-600 leading-relaxed font-medium">{b}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <h3 className="text-xs font-black text-violet-800 uppercase tracking-widest border-b border-slate-200 pb-0.5">Core Technical Skills</h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">{resumeData.skills}</p>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <h3 className="text-xs font-black text-violet-800 uppercase tracking-widest border-b border-slate-200 pb-0.5">Education</h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">{resumeData.education}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-4 text-left">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-violet-400" />
                            AI Bullet Optimizer & Refactoring Lab
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Paste any weak bullet point below (e.g. from original resume summaries), choose a targeted recruitment tone, and let the AI rewrite it with strong metrics and action verbs!
                          </p>

                          <div className="flex flex-col gap-1.5 mt-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Weak Bullet Point</label>
                            <textarea
                              placeholder="e.g. helped with making databases and writing queries"
                              value={aiRewriteInput}
                              onChange={(e) => setAiRewriteInput(e.target.value)}
                              rows={3}
                              className="glass-input px-3.5 py-2 text-xs font-semibold resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5 text-left">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Optimization Tone</label>
                              <select
                                value={aiRewriteTone}
                                onChange={(e) => setAiRewriteTone(e.target.value)}
                                className="glass-input px-3.5 py-2 text-xs font-bold text-slate-200"
                              >
                                <option value="ats">Quantitative & ATS-Ready</option>
                                <option value="impact">Action-Verb Impact</option>
                                <option value="concise">Concise Executive</option>
                              </select>
                            </div>
                            <div className="flex items-end">
                              <button
                                onClick={() => {
                                  if (!aiRewriteInput.trim()) return;
                                  setIsOptimizingBullet(true);
                                  setTimeout(() => {
                                    const inputLower = aiRewriteInput.toLowerCase();
                                    
                                    // Extract words
                                    const cleanInput = aiRewriteInput.replace(/[?.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                                    const words = cleanInput.split(" ").filter(w => w.length > 4 && !["helped", "assisted", "worked", "managed"].includes(w));
                                    const topicName = words.length > 0 ? words[0] : "development";
                                    
                                    let output = "";
                                    if (aiRewriteTone === "ats") {
                                      output = `Engineered dynamic, highly scaled systems powered by optimized ${topicName} workflows, increasing processing throughput by 35% and dropping average data latency by 42%.`;
                                    } else if (aiRewriteTone === "impact") {
                                      output = `Spearheaded full-stack implementation and secure architectural design of key ${topicName} microservices, streamlining data flows across multiple development teams.`;
                                    } else {
                                      output = `Developed responsive ${topicName} client models; refactored codebase structure to optimize memory consumption and drops API resource overhead.`;
                                    }
                                    
                                    setAiRewriteOutput(output);
                                    setIsOptimizingBullet(false);
                                  }, 800);
                                }}
                                disabled={isOptimizingBullet || !aiRewriteInput.trim()}
                                className="glass-button px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 text-xs w-full"
                              >
                                {isOptimizingBullet ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Optimizing...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 text-violet-400" />
                                    AI Refactor Bullet
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {aiRewriteOutput && (
                            <div className="flex flex-col gap-3 mt-4 border-t border-white/5 pt-4">
                              <div className="border border-emerald-500/20 bg-emerald-500/[0.02] rounded-xl p-4 flex flex-col gap-2 relative">
                                <span className="absolute top-3 right-3 text-[9px] font-bold text-emerald-400 tracking-wider uppercase">AI Recommended</span>
                                <div className="text-[10px] font-bold text-emerald-300">Optimized Accomplishment</div>
                                <p className="text-xs text-slate-100 leading-relaxed font-semibold mt-1">"{aiRewriteOutput}"</p>
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(aiRewriteOutput);
                                  alert("Copied to clipboard! Go ahead and paste it into your resume fields on the left.");
                                }}
                                className="glass-button px-4 py-2 rounded-xl text-xs font-bold border border-violet-500/20 hover:text-white"
                              >
                                Copy Optimized Bullet
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ================== TAB: PORTFOLIO ================== */}
                {activeTab === "portfolio" && (
                  <motion.div
                    key="portfolio"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex flex-col gap-8"
                  >
                    {selectedAnalysis ? (
                      <>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">AI Portfolio Builder</h2>
                            <p className="text-sm text-slate-400 mt-1">Generates customizable single-page resumes in high-end vector HTML codes.</p>
                          </div>
                          {!portfolioMeta && (
                            <button
                              onClick={handleGeneratePortfolio}
                              disabled={isGeneratingPortfolio}
                              className="glass-button px-5 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 text-xs"
                            >
                              {isGeneratingPortfolio ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Forging Portfolio...
                                </>
                              ) : (
                                <>
                                  <Globe className="w-4 h-4 text-cyan-400" />
                                  Generate Portfolio
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {portfolioMeta ? (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            
                            {/* Control Pane */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                              <div className="glass-panel rounded-2xl p-5 border border-white/5">
                                <h3 className="text-xs font-bold text-white mb-3">Select Visual Theme</h3>
                                <div className="flex flex-col gap-2">
                                  {[
                                    { id: "modern_dark", label: "Aurora Glass (Dark)", desc: "Deep purple glassmorphic layout." },
                                    { id: "cyber_terminal", label: "Developer Shell (Terminal)", desc: "Green retro monospaced CLI." },
                                    { id: "aurora_light", label: "Minimalist Elegant (Light)", desc: "Indigo radial high-contrast clean." },
                                  ].map(theme => (
                                    <button
                                      key={theme.id}
                                      onClick={() => changeTheme(theme.id)}
                                      className={`text-left p-3 rounded-xl border transition-all ${
                                        activeTheme === theme.id 
                                          ? "bg-violet-600/10 border-violet-500/50 shadow-inner" 
                                          : "border-white/5 hover:bg-white/[0.02]"
                                      }`}
                                    >
                                      <div className="text-xs font-bold text-white">{theme.label}</div>
                                      <div className="text-[10px] text-slate-400 mt-0.5">{theme.desc}</div>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col gap-3">
                                <h3 className="text-xs font-bold text-white">Export Assets</h3>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(generatedHtml);
                                    alert("Source copied!");
                                  }}
                                  className="glass-button w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-violet-500/20"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Full HTML
                                </button>
                                <button
                                  onClick={() => {
                                    const blob = new Blob([generatedHtml], { type: "text/html" });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = "portfolio.html";
                                    a.click();
                                  }}
                                  className="glass-button w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-500"
                                >
                                  <Download className="w-4 h-4" />
                                  Download index.html
                                </button>
                              </div>
                            </div>

                            {/* Iframe View */}
                            <div className="lg:col-span-8 flex flex-col gap-3">
                              <div className="border border-white/10 rounded-2xl overflow-hidden bg-white shadow-2xl h-[560px]">
                                {generatedHtml ? (
                                  <iframe
                                    title="Portfolio Preview"
                                    srcDoc={generatedHtml}
                                    className="w-full h-full border-none"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-400">
                                    <RefreshCw className="w-8 h-8 animate-spin text-violet-400" />
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        ) : (
                          <div className="glass-panel rounded-3xl p-16 border border-white/5 text-center flex flex-col items-center justify-center">
                            <Globe className="w-16 h-16 text-cyan-400 mb-4 animate-pulse" />
                            <h3 className="text-xl font-bold text-white mb-2">Portfolio Generator Unlocked</h3>
                            <p className="text-slate-400 max-w-sm text-sm leading-relaxed mb-6">
                              Let's compile custom visual HTML templates representing your work. Fully customizable & downloadable.
                            </p>
                            <button
                              onClick={handleGeneratePortfolio}
                              disabled={isGeneratingPortfolio}
                              className="glass-button px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 text-xs"
                            >
                              {isGeneratingPortfolio ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Forging Portfolio...
                                </>
                              ) : (
                                <>
                                  <Globe className="w-4 h-4 text-cyan-400" />
                                  Generate Web Portfolio
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="glass-panel rounded-3xl p-12 border border-white/5 text-center flex flex-col items-center justify-center">
                        <UploadCloud className="w-16 h-16 text-violet-400 mb-4 animate-bounce" />
                        <h3 className="text-xl font-bold text-white mb-2">No Profile Uploaded</h3>
                        <p className="text-slate-400 max-w-sm text-sm">Return to the dashboard to begin portfolios!</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ================== TAB: INTERVIEW ================== */}
                {activeTab === "interview" && (
                  <motion.div
                    key="interview"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex flex-col gap-8"
                  >
                    {selectedAnalysis ? (
                      <>
                        <div>
                          <h2 className="text-2xl font-black text-white tracking-tight">AI Mock Coding Interview</h2>
                          <p className="text-sm text-slate-400 mt-1 font-medium">Practice stateful developer interviews with Gemini. Get scoring, feedback, and recruiter grades on every single answer.</p>
                        </div>

                        {!interviewId ? (
                          <div className="glass-panel rounded-3xl p-12 border border-white/5 flex flex-col items-center justify-center text-center">
                            <MessageSquare className="w-16 h-16 text-violet-400 mb-4 animate-pulse" />
                            <h3 className="text-xl font-bold text-white mb-2">AI Interview Simulator</h3>
                            <p className="text-slate-400 max-w-md text-sm leading-relaxed mb-6">
                              Gemini acts as an elite technical interviewer. It reviews your resume and targets questions specifically to your experience level and target role.
                            </p>

                            <div className="flex items-center gap-3 mb-6 max-w-xs w-full">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">Role:</label>
                              <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                className="glass-input px-3.5 py-1.5 text-xs w-full font-semibold"
                              />
                            </div>

                            <button
                              onClick={handleStartInterview}
                              disabled={isStartingInterview}
                              className="glass-button px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg text-xs"
                            >
                              {isStartingInterview ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Prepping Interviewer Room...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4 text-violet-400" />
                                  Start Stateful Mock Session
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            
                            {/* Left: Chat Terminal console */}
                            <div className="lg:col-span-7 flex flex-col gap-4">
                              <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-black/60">
                                
                                <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs font-semibold text-slate-300">
                                  <span className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <span className="ml-1 tracking-mono">AI Interview Console ~ bash</span>
                                  </span>
                                  <span className="text-[10px] text-violet-400 tracking-wider">MOCK SESSION</span>
                                </div>

                                <div className="p-5 h-[340px] overflow-y-auto flex flex-col gap-4">
                                  {interviewChat.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === "candidate" ? "justify-end" : "justify-start"}`}>
                                      <div className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                                        msg.role === "candidate"
                                          ? "bg-violet-600/20 text-violet-200 border border-violet-500/30 rounded-br-none"
                                          : "bg-white/5 text-slate-200 border border-white/5 rounded-bl-none font-mono"
                                      }`}>
                                        <div className="text-[9px] font-bold text-slate-400 mb-1">
                                          {msg.role === "candidate" ? "YOU" : "AI LEAD INTERVIEWER"}
                                        </div>
                                        {msg.content}
                                      </div>
                                    </div>
                                  ))}
                                  {isSubmittingAnswer && (
                                    <div className="flex justify-start">
                                      <div className="bg-white/5 border border-white/5 rounded-xl rounded-bl-none p-3.5 text-xs text-slate-400 flex items-center gap-2">
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-violet-400" />
                                        AI Recruiter is evaluating your response...
                                      </div>
                                    </div>
                                  )}
                                  <div ref={chatEndRef} />
                                </div>

                                <form onSubmit={handleSendAnswer} className="border-t border-white/10 p-3 bg-white/[0.01] flex items-center gap-3">
                                  <input
                                    type="text"
                                    value={candidateAnswer}
                                    onChange={(e) => setCandidateAnswer(e.target.value)}
                                    placeholder="Type your technical answer here..."
                                    disabled={isSubmittingAnswer}
                                    className="bg-transparent text-xs text-white placeholder-slate-500 flex-1 outline-none px-2.5 font-semibold py-1.5"
                                  />
                                  <button
                                    type="submit"
                                    disabled={!candidateAnswer.trim() || isSubmittingAnswer}
                                    className="glass-button p-2 rounded-xl border border-violet-500/20 text-violet-400 disabled:opacity-40"
                                  >
                                    <Send className="w-4 h-4" />
                                  </button>
                                </form>
                              </div>
                            </div>

                            {/* Right Evaluation */}
                            <div className="lg:col-span-5 flex flex-col gap-6">
                              <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-2xl relative overflow-hidden">
                                <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-violet-400" />
                                  Assessment (Previous Answer)
                                </h3>
                                
                                {lastFeedback ? (
                                  <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                      <div className="w-14 h-14 rounded-full bg-violet-600/10 text-violet-400 border border-violet-500/30 flex items-center justify-center font-black text-xs uppercase tracking-wider shadow-lg shrink-0 text-center leading-none px-1">
                                        {typeof lastFeedback.score === "number" ? `${lastFeedback.score}/10` : lastFeedback.score}
                                      </div>
                                      <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Recruiter Score</div>
                                        <div className="text-xs text-slate-200 mt-0.5 leading-relaxed font-semibold">
                                          {typeof lastFeedback.score === "number"
                                            ? lastFeedback.score >= 8
                                              ? "Excellent technical breakdown!"
                                              : "Good, but needs more deep details."
                                            : "AI Career Tutor Consultation"}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                                      <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide mb-1">Feedback</div>
                                      <p className="text-xs text-slate-300 leading-relaxed italic">
                                        "{lastFeedback.feedback}"
                                      </p>
                                    </div>

                                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                                      <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide mb-1">Model Answer</div>
                                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                        {lastFeedback.modelAnswer}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-10 text-slate-400 text-xs leading-relaxed">
                                    Type your answer and send to reveal evaluation metrics!
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => setInterviewId(null)}
                                className="glass-button w-full py-2.5 rounded-xl text-xs font-bold text-slate-400 flex items-center justify-center gap-1.5"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Reset Interview Console
                              </button>
                            </div>

                          </div>
                        )}
                      </>
                    ) : (
                      <div className="glass-panel rounded-3xl p-12 border border-white/5 text-center flex flex-col items-center justify-center">
                        <UploadCloud className="w-16 h-16 text-violet-400 mb-4 animate-bounce" />
                        <h3 className="text-xl font-bold text-white mb-2">No Profile Uploaded</h3>
                        <p className="text-slate-400 max-w-sm text-sm">Return to the dashboard to begin interview prep!</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ================== TAB: ROADMAP ================== */}
                {activeTab === "roadmap" && (
                  <motion.div
                    key="roadmap"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex flex-col gap-8"
                  >
                    {selectedAnalysis ? (
                      <>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">AI Skill Transition roadmap</h2>
                            <p className="text-sm text-slate-400 mt-1 font-medium">bespoke developmental modules to scale your targeted engineering competencies.</p>
                          </div>
                          {!roadmap && (
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                className="glass-input px-3.5 py-1.5 text-xs font-semibold max-w-[160px]"
                              />
                              <button
                                onClick={handleGenerateRoadmap}
                                disabled={isGeneratingRoadmap}
                                className="glass-button px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 text-xs"
                              >
                                {isGeneratingRoadmap ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Compiling Curriculum...
                                  </>
                                ) : (
                                  <>
                                    <GraduationCap className="w-4 h-4 text-violet-400" />
                                    Generate Roadmap
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {roadmap ? (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            
                            {/* Timeline Milestones list */}
                            <div className="lg:col-span-8 flex flex-col gap-6">
                              <div className="relative border-l border-white/10 pl-6 ml-4 flex flex-col gap-8">
                                {roadmap.milestones.map((mile, i) => (
                                  <div key={i} className="relative">
                                    <div className="absolute top-1.5 left-[-32px] w-4 h-4 rounded-full bg-violet-500 border-4 border-slate-950 shadow-lg" />
                                    
                                    <div className="glass-panel rounded-2xl p-5 border border-white/5">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-[9px] font-bold text-violet-400 uppercase tracking-widest">{mile.week_range}</span>
                                        <span className="text-xs font-semibold text-slate-400">Milestone #{i + 1}</span>
                                      </div>
                                      
                                      <h3 className="text-base font-bold text-white mb-2">{mile.title}</h3>
                                      <p className="text-xs text-slate-300 leading-relaxed mb-4">{mile.description}</p>
                                      
                                      <div className="flex flex-col gap-3">
                                        <div>
                                          <div className="text-[9px] font-bold text-cyan-400 uppercase mb-1">Acquired skills</div>
                                          <div className="flex flex-wrap gap-1.5">
                                            {mile.skills_gained.map((sk, k) => (
                                              <span key={k} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-300 font-semibold">
                                                {sk}
                                              </span>
                                            ))}
                                          </div>
                                        </div>

                                        <div>
                                          <div className="text-[9px] font-bold text-emerald-400 uppercase mb-1">Suggested Tasks</div>
                                          <ul className="flex flex-col gap-1.5">
                                            {mile.suggested_actions.map((act, k) => (
                                              <li key={k} className="text-xs text-slate-300 flex items-start gap-2">
                                                <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                                                {act}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Resources */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                              <div className="glass-panel rounded-2xl p-5 border border-white/5">
                                <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-1.5">
                                  <Sparkles className="w-4 h-4 text-violet-400" />
                                  Curated Resources
                                </h3>
                                
                                <div className="flex flex-col gap-3">
                                  {roadmap.milestones.flatMap(m => m.curated_resources).map((res, idx) => (
                                    <a
                                      key={idx}
                                      href={res.link}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl transition-all flex flex-col gap-1.5"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-white leading-tight">{res.name}</span>
                                        <span className="px-2 py-0.5 rounded bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 text-[8px] font-semibold tracking-wider uppercase shrink-0">
                                          {res.type}
                                        </span>
                                      </div>
                                      <div className="text-[9px] text-slate-500 tracking-mono truncate">{res.link}</div>
                                    </a>
                                  ))}
                                </div>
                              </div>

                              <button
                                onClick={() => setRoadmap(null)}
                                className="glass-button w-full py-2.5 rounded-xl text-xs font-bold text-slate-400 flex items-center justify-center gap-1.5"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Reconfigure Roadmap
                              </button>
                            </div>

                          </div>
                        ) : (
                          <div className="glass-panel rounded-3xl p-16 border border-white/5 text-center flex flex-col items-center justify-center">
                            <GraduationCap className="w-16 h-16 text-violet-400 mb-4 animate-pulse" />
                            <h3 className="text-xl font-bold text-white mb-2">Learning Path Generator</h3>
                            <p className="text-slate-400 max-w-sm text-sm leading-relaxed mb-6">
                              Construct a bespoke 12-week educational curriculum to prepare you for this exact role.
                            </p>

                            <div className="flex items-center gap-3 mb-6 max-w-xs w-full">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">Role:</label>
                              <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                className="glass-input px-3.5 py-1.5 text-xs w-full font-semibold"
                              />
                            </div>

                            <button
                              onClick={handleGenerateRoadmap}
                              disabled={isGeneratingRoadmap}
                              className="glass-button px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 text-xs"
                            >
                              {isGeneratingRoadmap ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Designing Career Path...
                                </>
                              ) : (
                                <>
                                  <GraduationCap className="w-4 h-4 text-violet-400" />
                                  Generate Roadmap
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="glass-panel rounded-3xl p-12 border border-white/5 text-center flex flex-col items-center justify-center">
                        <UploadCloud className="w-16 h-16 text-violet-400 mb-4 animate-bounce" />
                        <h3 className="text-xl font-bold text-white mb-2">No Profile Uploaded</h3>
                        <p className="text-slate-400 max-w-sm text-sm">Return to the dashboard to scan your resume!</p>
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="w-full glass-panel border-t border-white/5 py-6 px-6 mt-16 text-center text-xs text-slate-500">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <p>&copy; {new Date().getFullYear()} TalentForge Intelligence. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <span className="hover:text-slate-300 cursor-pointer">Security Protocol</span>
                  <span className="hover:text-slate-300 cursor-pointer">Recruiter Services</span>
                  <span className="hover:text-slate-300 cursor-pointer">API Integration</span>
                </div>
              </div>
            </footer>

          </motion.div>
        )}

      </AnimatePresence>

      {/* System Status & Safeguards Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#02000c]/98 backdrop-blur-2xl overflow-y-auto flex flex-col p-6 sm:p-12"
          >
            {/* Radial Neon Highlights */}
            <div className="absolute top-[-10%] left-[30%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="w-full max-w-4xl mx-auto flex items-center justify-between border-b border-white/10 pb-6 mb-8 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">System Connection & Status Dashboard</h2>
                  <p className="text-xs text-slate-400 font-medium">Bespoke TalentForge Engine Auditing Suite</p>
                </div>
              </div>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="glass-button px-5 py-2.5 rounded-xl text-xs font-bold border border-amber-500/40 text-amber-400 hover:text-white shrink-0 shadow-lg cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Body Grid */}
            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
              
              {/* Left Panel: Active Status & Simulated Controls */}
              <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
                
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    📊 Connection Status Indicators
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-slate-400">Current Mode</div>
                      <div className="text-sm font-black text-white mt-1">
                        {isOffline ? "Simulated Sandbox Mode" : "Live API Active Mode"}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${isOffline ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                      {isOffline ? "Sandbox Mode Active" : "Online"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-slate-400">Backend Server URL</div>
                      <div className="text-xs font-mono text-white/80 mt-1 select-all">{API_BASE}</div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Port 5000</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-slate-400">Active Session Workspace</div>
                      <div className="text-xs font-semibold text-white/80 mt-1">
                        {userEmail ? `${userEmail} (Demo Account)` : "Guest Account / Quick Access"}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Session ID</span>
                  </div>
                </div>

                {/* Simulated Engine Toggle Control */}
                <div className="border-t border-white/5 pt-5 mt-auto">
                  <h4 className="text-xs font-bold text-white mb-2">Simulate Connection Modes</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                    Manually switch between standard online API modes and local mock offline databases to preview backend failure safeguards instantly:
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIsOffline(true);
                        let mockList = [];
                        if (userEmail.toLowerCase() === "urshita@demo.com") {
                          mockList = [getMockAnalysisRecordUrshita()];
                        } else {
                          mockList = [getMockAnalysisRecord()];
                        }
                        setAnalyses(mockList);
                        setSelectedAnalysis(mockList[0]);
                        showToast("Forced Simulated Sandbox Mode!");
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                        isOffline 
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/40" 
                          : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full bg-amber-400 ${isOffline ? "animate-pulse" : ""}`} />
                      Force Offline Mode
                    </button>
                    <button
                      onClick={() => {
                        setIsOffline(false);
                        fetchAnalyses(true);
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                        !isOffline 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40" 
                          : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${!isOffline ? "animate-pulse" : ""}`} />
                      Live API Test
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Panel: Informative details */}
              <div className="flex flex-col gap-6 justify-between">
                <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    📁 Dual Offline Safeguards Explanation
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                      <h4 className="text-xs font-bold text-violet-400 flex items-center gap-1.5 mb-1.5">
                        1. Local Database Safeguard
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        If MongoDB clusters are unreachable or offline, the database coordinator automatically redirects all read/write workloads to a local persistent database schema at `backend/data/mock_db.json`. This guarantees all dynamic profiles compile without database config errors.
                      </p>
                    </div>

                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                      <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 mb-1.5">
                        2. Simulated AI Safeguard
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        When `GEMINI_API_KEY` is not detected in `.env`, the backend seamlessly loads high-fidelity simulated response schemas. You can run all rating charts, full-screen recruiter audits, theme exports, roadmaps, and chat interview simulators without paying for API calls.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl text-center">
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Designed with visual resilience: TalentForge automatically recovers active database integrations without restarting servers once connection streams are re-established.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Connection Status Toasts */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] max-w-sm glass-panel p-4 border border-violet-500/30 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0 animate-pulse">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">System Notification</div>
              <div className="text-xs font-semibold text-white mt-1.5 leading-relaxed">{toastMsg}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
