from flask import Blueprint, request, jsonify
from backend.services.gemini_service import gemini_service
from backend.services.db_service import db_service

portfolio_bp = Blueprint("portfolio", __name__)

@portfolio_bp.route("/portfolio/generate", methods=["POST"])
def generate_portfolio():
    """
    POST /api/portfolio/generate
    Expects JSON:
        - 'analysis_id': string
    """
    data = request.get_json() or {}
    analysis_id = data.get("analysis_id")

    if not analysis_id:
        return jsonify({"error": "No analysis_id provided"}), 400

    try:
        # Fetch the analysis record
        analysis_record = db_service.get_analysis(analysis_id)
        if not analysis_record:
            return jsonify({"error": "Analysis record not found"}), 404

        resume_text = analysis_record.get("resume_text", "")
        analysis_data = analysis_record.get("analysis", {})

        # Generate portfolio metadata from Gemini
        metadata = gemini_service.generate_portfolio_metadata(resume_text, analysis_data)

        # Save to database
        saved_record = db_service.save_portfolio({
            "analysis_id": analysis_id,
            "applicant_name": analysis_data.get("applicant_name", "Developer"),
            "metadata": metadata
        })

        return jsonify(saved_record), 200

    except Exception as e:
        print(f"Portfolio gen error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@portfolio_bp.route("/portfolio/<portfolio_id>", methods=["GET"])
def get_portfolio(portfolio_id):
    """
    GET /api/portfolio/<portfolio_id>
    """
    try:
        record = db_service.get_portfolio(portfolio_id)
        if not record:
            return jsonify({"error": "Portfolio not found"}), 404
        return jsonify(record), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@portfolio_bp.route("/portfolio/export", methods=["POST"])
def export_portfolio_html():
    """
    POST /api/portfolio/export
    Expects JSON:
        - 'portfolio_id': string
        - 'theme': 'modern_dark' | 'cyber_terminal' | 'aurora_light'
    Generates and returns a self-contained, responsive, beautifully styled index.html.
    """
    data = request.get_json() or {}
    portfolio_id = data.get("portfolio_id")
    theme = data.get("theme", "modern_dark")

    if not portfolio_id:
        return jsonify({"error": "No portfolio_id provided"}), 400

    try:
        portfolio = db_service.get_portfolio(portfolio_id)
        if not portfolio:
            return jsonify({"error": "Portfolio not found"}), 404

        metadata = portfolio.get("metadata", {})
        name = portfolio.get("applicant_name", "Developer")
        tagline = metadata.get("tagline", "Full Stack Developer & AI Engineer")
        bio = metadata.get("bio", "Passionate about creating modern scalable web applications.")
        projects = metadata.get("highlighted_projects", [])
        skills_groups = metadata.get("custom_skills_group", [])
        terminal_welcome = metadata.get("terminal_welcome", "Welcome SANKALAN to the Portfolio shell.")
        terminal_commands = metadata.get("terminal_commands", [])

        # Generate standard HTML template based on theme selection
        html_code = ""

        if theme == "cyber_terminal":
            html_code = get_cyber_terminal_theme(name, tagline, bio, terminal_welcome, terminal_commands)
        elif theme == "aurora_light":
            html_code = get_aurora_light_theme(name, tagline, bio, projects, skills_groups)
        else: # modern_dark
            html_code = get_modern_dark_theme(name, tagline, bio, projects, skills_groups)

        return jsonify({"html": html_code}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# HTML Theme Generators
def get_modern_dark_theme(name, tagline, bio, projects, skills_groups):
    projects_html = ""
    for p in projects:
        stack_chips = "".join([f'<span class="chip">{tech}</span>' for tech in p.get("tech_stack", [])])
        projects_html += f"""
        <div class="card">
            <h3 class="card-title">{p.get("title")}</h3>
            <p class="card-desc">{p.get("description")}</p>
            <div class="card-chips">{stack_chips}</div>
            <div class="card-impact">🚀 {p.get("impact_metric")}</div>
        </div>
        """

    skills_html = ""
    for sg in skills_groups:
        skills_list = "".join([f'<span class="skill-pill">{s}</span>' for s in sg.get("skills", [])])
        skills_html += f"""
        <div class="skill-category">
            <h4 class="category-title">{sg.get("category")}</h4>
            <div class="skills-list">{skills_list}</div>
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} | Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        body {{
            background: #030014;
            color: #f3f4f6;
            font-family: 'Outfit', sans-serif;
            margin: 0;
            padding: 0;
            background-image: 
                radial-gradient(ellipse at 50% -20%, rgba(120, 119, 198, 0.35), rgba(255, 255, 255, 0)),
                radial-gradient(ellipse at 80% 50%, rgba(14, 165, 233, 0.08), rgba(255, 255, 255, 0));
            background-attachment: fixed;
        }}
        .container {{
            max-width: 900px;
            margin: 0 auto;
            padding: 80px 24px;
        }}
        header {{
            text-align: center;
            margin-bottom: 80px;
        }}
        h1 {{
            font-size: 56px;
            font-weight: 800;
            margin: 0 0 16px 0;
            background: linear-gradient(135deg, #c084fc 0%, #38bdf8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -2px;
        }}
        .tagline {{
            font-size: 20px;
            color: #9ca3af;
            font-weight: 300;
            margin-bottom: 24px;
        }}
        .bio {{
            font-size: 18px;
            line-height: 1.6;
            color: #d1d5db;
            max-width: 600px;
            margin: 0 auto;
        }}
        section {{
            margin-bottom: 80px;
        }}
        h2 {{
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 32px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 12px;
            color: #fff;
        }}
        .grid {{
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
        }}
        @media(min-width: 768px) {{
            .grid {{ grid-template-columns: 1fr 1fr; }}
        }}
        .card {{
            background: rgba(17, 17, 27, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 24px;
            transition: all 0.3s ease;
        }}
        .card:hover {{
            border-color: rgba(192, 132, 252, 0.4);
            transform: translateY(-4px);
        }}
        .card-title {{
            font-size: 22px;
            font-weight: 600;
            margin: 0 0 12px;
            color: #fff;
        }}
        .card-desc {{
            color: #9ca3af;
            font-size: 15px;
            line-height: 1.5;
            margin: 0 0 20px;
        }}
        .card-chips {{
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
        }}
        .chip {{
            background: rgba(255, 255, 255, 0.05);
            color: #a78bfa;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
        }}
        .card-impact {{
            color: #38bdf8;
            font-weight: 600;
            font-size: 14px;
        }}
        .skills-container {{
            display: grid;
            grid-template-columns: 1fr;
            gap: 32px;
        }}
        @media(min-width: 768px) {{
            .skills-container {{ grid-template-columns: 1fr 1fr; }}
        }}
        .skill-category {{
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 24px;
        }}
        .category-title {{
            margin: 0 0 16px;
            font-size: 18px;
            font-weight: 600;
            color: #f3f4f6;
        }}
        .skills-list {{
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }}
        .skill-pill {{
            background: rgba(139, 92, 246, 0.1);
            color: #c084fc;
            border: 1px solid rgba(139, 92, 246, 0.2);
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 14px;
        }}
        footer {{
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            margin-top: 100px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>{name}</h1>
            <div class="tagline">{tagline}</div>
            <p class="bio">{bio}</p>
        </header>

        <section id="projects">
            <h2>Highlighted Projects</h2>
            <div class="grid">
                {projects_html}
            </div>
        </section>

        <section id="skills">
            <h2>Technical Superpowers</h2>
            <div class="skills-container">
                {skills_html}
            </div>
        </section>

        <footer>
            <p>&copy; {name}. Crafted with TalentForge Intelligence.</p>
        </footer>
    </div>
</body>
</html>"""

def get_cyber_terminal_theme(name, tagline, bio, welcome_msg, commands):
    commands_html = ""
    for c in commands:
        commands_html += f"""
        <div class="terminal-block">
            <div class="input-line"><span class="prompt">talentforge-guest@cmd ~ </span> <span class="cmd-text">{c.get("command")}</span></div>
            <div class="output-line">{c.get("output").replace('\n', '<br>')}</div>
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} | Console</title>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body {{
            background: #000;
            color: #00ff66;
            font-family: 'Fira Code', monospace;
            padding: 24px;
            margin: 0;
        }}
        .console {{
            max-width: 800px;
            margin: 40px auto;
            border: 2px solid #00ff66;
            border-radius: 8px;
            box-shadow: 0 0 30px rgba(0, 255, 102, 0.15);
            background: #020202;
            overflow: hidden;
        }}
        .title-bar {{
            background: #00ff66;
            color: #000;
            padding: 8px 16px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
        }}
        .dots {{
            display: flex;
            gap: 6px;
        }}
        .dot {{
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #000;
        }}
        .content {{
            padding: 24px;
            min-height: 450px;
        }}
        .header {{
            margin-bottom: 32px;
            border-bottom: 1px dashed #00ff66;
            padding-bottom: 24px;
        }}
        h1 {{
            font-size: 28px;
            margin: 0 0 8px 0;
        }}
        .tagline {{
            color: #0099ff;
            margin-bottom: 12px;
        }}
        .bio {{
            color: #88c0d0;
            line-height: 1.6;
        }}
        .terminal-block {{
            margin-bottom: 24px;
        }}
        .prompt {{
            color: #0099ff;
            font-weight: 600;
        }}
        .cmd-text {{
            color: #fff;
        }}
        .output-line {{
            color: #88c0d0;
            padding-left: 16px;
            margin-top: 8px;
            line-height: 1.5;
        }}
        .cursor {{
            display: inline-block;
            width: 10px;
            height: 20px;
            background: #00ff66;
            animation: blink 1s step-start infinite;
            vertical-align: middle;
            margin-left: 6px;
        }}
        @keyframes blink {{
            50% {{ opacity: 0; }}
        }}
    </style>
</head>
<body>
    <div class="console">
        <div class="title-bar">
            <span>bash - shell - {name}</span>
            <div class="dots">
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
        <div class="content">
            <div class="header">
                <h1>> {name}</h1>
                <div class="tagline">// {tagline}</div>
                <div class="bio">{bio}</div>
            </div>

            <div class="terminal-block">
                <div class="input-line"><span class="prompt">talentforge-guest@cmd ~ </span> <span class="cmd-text">welcome.sh</span></div>
                <div class="output-line">{welcome_msg.replace('\n', '<br>')}</div>
            </div>

            {commands_html}

            <div class="input-line"><span class="prompt">talentforge-guest@cmd ~ </span> <span class="cursor"></span></div>
        </div>
    </div>
</body>
</html>"""

def get_aurora_light_theme(name, tagline, bio, projects, skills_groups):
    projects_html = ""
    for p in projects:
        stack_chips = "".join([f'<span class="chip">{tech}</span>' for tech in p.get("tech_stack", [])])
        projects_html += f"""
        <div class="card">
            <h3 class="card-title">{p.get("title")}</h3>
            <p class="card-desc">{p.get("description")}</p>
            <div class="card-chips">{stack_chips}</div>
            <div class="card-impact">🚀 {p.get("impact_metric")}</div>
        </div>
        """

    skills_html = ""
    for sg in skills_groups:
        skills_list = "".join([f'<span class="skill-pill">{s}</span>' for s in sg.get("skills", [])])
        skills_html += f"""
        <div class="skill-category">
            <h4 class="category-title">{sg.get("category")}</h4>
            <div class="skills-list">{skills_list}</div>
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} | Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        body {{
            background: #f8fafc;
            color: #334155;
            font-family: 'Plus Jakarta Sans', sans-serif;
            margin: 0;
            padding: 0;
            background-image: 
                radial-gradient(ellipse at 50% -20%, rgba(99, 102, 241, 0.15), rgba(255, 255, 255, 0)),
                radial-gradient(ellipse at 80% 50%, rgba(13, 148, 136, 0.08), rgba(255, 255, 255, 0));
            background-attachment: fixed;
        }}
        .container {{
            max-width: 900px;
            margin: 0 auto;
            padding: 80px 24px;
        }}
        header {{
            text-align: center;
            margin-bottom: 80px;
        }}
        h1 {{
            font-size: 56px;
            font-weight: 800;
            margin: 0 0 16px 0;
            background: linear-gradient(135deg, #4f46e5 0%, #0d9488 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -2px;
        }}
        .tagline {{
            font-size: 20px;
            color: #64748b;
            font-weight: 300;
            margin-bottom: 24px;
        }}
        .bio {{
            font-size: 18px;
            line-height: 1.6;
            color: #475569;
            max-width: 600px;
            margin: 0 auto;
        }}
        section {{
            margin-bottom: 80px;
        }}
        h2 {{
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 32px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 12px;
            color: #1e293b;
        }}
        .grid {{
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
        }}
        @media(min-width: 768px) {{
            .grid {{ grid-template-columns: 1fr 1fr; }}
        }}
        .card {{
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }}
        .card:hover {{
            border-color: #6366f1;
            box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.1);
            transform: translateY(-4px);
        }}
        .card-title {{
            font-size: 22px;
            font-weight: 600;
            margin: 0 0 12px;
            color: #1e293b;
        }}
        .card-desc {{
            color: #64748b;
            font-size: 15px;
            line-height: 1.5;
            margin: 0 0 20px;
        }}
        .card-chips {{
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
        }}
        .chip {{
            background: #f1f5f9;
            color: #4f46e5;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
        }}
        .card-impact {{
            color: #0d9488;
            font-weight: 600;
            font-size: 14px;
        }}
        .skills-container {{
            display: grid;
            grid-template-columns: 1fr;
            gap: 32px;
        }}
        @media(min-width: 768px) {{
            .skills-container {{ grid-template-columns: 1fr 1fr; }}
        }}
        .skill-category {{
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }}
        .category-title {{
            margin: 0 0 16px;
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
        }}
        .skills-list {{
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }}
        .skill-pill {{
            background: rgba(99, 102, 241, 0.05);
            color: #4f46e5;
            border: 1px solid rgba(99, 102, 241, 0.15);
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 14px;
        }}
        footer {{
            text-align: center;
            color: #94a3b8;
            font-size: 14px;
            margin-top: 100px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>{name}</h1>
            <div class="tagline">{tagline}</div>
            <p class="bio">{bio}</p>
        </header>

        <section id="projects">
            <h2>Highlighted Projects</h2>
            <div class="grid">
                {projects_html}
            </div>
        </section>

        <section id="skills">
            <h2>Technical Superpowers</h2>
            <div class="skills-container">
                {skills_html}
            </div>
        </section>

        <footer>
            <p>&copy; {name}. Crafted with TalentForge Intelligence.</p>
        </footer>
    </div>
</body>
</html>"""
