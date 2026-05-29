# TalentForge — Advanced AI-Driven Career Suite & Interview Preparation Simulator

TalentForge is an ultra-premium, client-side offline intelligence suite designed to accelerate developer career growth. The platform empowers candidates to analyze their resumes against rigorous ATS specifications, dynamically compile recruiter-grade visual portfolios, navigate real-time technical interviews with an advanced conversational AI interviewer, and build optimized resumes using multi-format compilation pipelines.

---

## 🚀 Key Architecture & Features

### 1. ATS Scorecard & Suggestion Lab
- **ATS Match Scanner**: Grades resumes across Formatting, Impact, Skill Alignment, and Accomplishments.
- **Dynamic Suggestions Engine**: Flags passive verbs and weak descriptions, suggesting immediate quantifiable replacements (before vs after).
- **Company Alignment Panel**: Calculates match rates for **FAANG/Tier-1 Tech**, **High-Growth Startups**, and **Enterprise Corporates** based on core technical alignments.
- **Skill Gaps Aggregator**: Lists Critical, Recommended, and Optional missing technologies.

### 2. AI Resume Maker & Rewrite Lab
- **Interactive Form Coordinator**: Dynamically structures and edits Personal Details, Summary Statements, Education, Skills, and adjustable Work/Project blocks.
- **AI Bullet Rewrite Lab**: Pasta weak description (e.g. *"helped connect server databases"*), select a recruitment tone (**Quantitative & ATS-Ready**, **Action-Verb Impact**, or **Concise Executive**), and instantly generate an optimized, recruiter-ready bullet containing mock metric ratios.
- **Session Profile Synchronization**: Automatically preloads tailored demo profiles:
  - **Sankalan's Profile**: Pre-populated with Frontend & Full-Stack specialties (React, Flask, offline MongoDB fallback systems, Vitest).
  - **Urshita's Profile**: Pre-populated with Lead Backend & Machine Learning specialties (Flask ETL, Redis cache clusters, PyTorch predictions, SQL indexing).
  - **Guest Profile**: Populates a clean developer template.
- **Multi-Format Export Pipelines**:
  1. **Print PDF**: Self-contained `@media print` style overrides hide dashboard chrome to print a perfectly structured recruitment sheet.
  2. **Microsoft Word Document (.doc)**: Dynamically compiles fields into an XML-compliant MS Word document block with a Word MIME type (`application/msword`) for native formatting inside Microsoft Word.
  3. **Markdown (.md) & HTML**: High-fidelity structured markdown or standalone HTML documents.

### 3. Smart Mock Interview Console
- **Tutor Lock & Review States**: Typing ignorance statements (like *"i can't"*, *"i don't know"*, or *"no"*) halts automated skipped turns. The AI will output a detailed model answer card and lock into a **Review state** (typing *"next"* or *"skip"* proceeds, while *"continue"* returns to the question).
- **Conversational Guard**: Casual fillers (*"hi"*, *"thanks"*, *"ok"*, *"ready"*) submitted during active rounds are intercepted conversationally. The active interview question remains active without scoring penalties.
- **Keyword Grading Sheets**: Calculates exact match ratios against critical technical terms.

### 4. Omniscient AI Career Tutor (Gemini/ChatGPT Simulator)
- **Context-Aware Memory**: Accepts conversation history to evaluate follow-ups (like *"why?"*, *"explain more"*, or *"give me code"*) contextually based on the active topic.
- **Comparative Paradigms**: Side-by-side Markdown comparison grids for technical paradigms (e.g. *"SQL vs NoSQL"*, *"REST vs GraphQL"*, or *"L1 vs L2 regularization"*).
- **Dynamic Science & General Topic Synthesizer**: Non-technical queries (e.g. *"photosynthesis"*, *"airplane wings"*, or *"quantum computing"*) are dynamically parsed to output descriptive scientific breakdowns and trivia instead of generic fallbacks.
- **Creative Prompts**: Generates randomized developer jokes and coding sonnets.

### 5. Multi-Role Skill Roadmap Compiler
- Generates a bespoke **12-week development curriculum** complete with gained skills, action items, and direct hyperlinks to high-quality interactive guides on freeCodeCamp, roadmap.sh, MDN, and official manuals.
- Tailored pathways for **Frontend**, **Backend**, **ML/Data/AI**, **DevOps/SRE**, **Cybersecurity**, **Mobile App Dev**, or *any other custom role typed in by the user*.

---

## 🛠️ Technology Stack
- **Core Library**: React (JavaScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context & local hook coordinators
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Analytics & Graphs**: Recharts

---

## ⚙️ Local Development & Running

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/Sankalan10/TalentForge.git
cd TalentForge
npm install
```

### Run Dev Server
Start the Vite local development server:
```bash
npm run dev
```
Open **http://localhost:3000/** in your browser to explore the platform.

### Build Production Bundle
Build and minify the application for production deployment:
```bash
npm run build
```
The compiled bundle will be saved inside the `dist/` directory.
