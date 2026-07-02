# 🥗 NutriGuru — AI-Powered Nutrition Agent

> A full-stack web application built with **Python Flask** and **Groq AI (Llama 3)** that delivers personalised nutrition coaching, meal planning, BMI analysis, and family diet management — with deep Indian cuisine expertise.

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![Flask](https://img.shields.io/badge/Flask-3.0.3-green)
![Groq](https://img.shields.io/badge/Groq-Llama_3-orange)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-blueviolet)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Chat** | Real-time nutrition Q&A powered by IBM Granite 13B |
| 🗓️ **Meal Planner** | 1–7 day personalised Indian meal plans with macros |
| ⚖️ **BMI Calculator** | BMI + TDEE + BMR with AI health analysis |
| 👨‍👩‍👧 **Family Profiles** | Unified diet plans for every family member |
| 🔢 **Calorie Analyser** | Instant nutrition breakdown for any meal |
| 💡 **Daily Tips** | AI-generated daily nutrition tips |
| 🌙 **Dark Mode** | Beautiful dark/light theme toggle |
| 📱 **Responsive** | Fully mobile-optimised UI |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10 or higher
- **Groq API key** (100% free, no credit card) — get at [console.groq.com](https://console.groq.com)
  - OR use **Ollama** (100% local, no internet) — [ollama.com](https://ollama.com)

### 1. Clone & Setup
```bash
git clone https://github.com/YOUR_USERNAME/nutrition-agent.git
cd nutrition-agent

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Choose Your AI Backend

#### **Option A: Groq (Recommended — Free, Fast)**

1. Go to [console.groq.com](https://console.groq.com) and sign up (free, no credit card)
2. Create an API key
3. Copy `.env.example` to `.env`:
```bash
copy .env.example .env       # Windows
cp .env.example .env         # Mac/Linux
```
4. Edit `.env` and add your Groq API key:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
FLASK_SECRET_KEY=change-this-to-a-random-secret
FLASK_DEBUG=False
```

#### **Option B: Ollama (100% Local, No Internet)**

1. Install Ollama from [ollama.com](https://ollama.com)
2. Open terminal and run:
```bash
ollama pull llama3
ollama serve
```
3. In `agent_config.py`, change line 124:
```python
"use_ollama": True,  # Change from False to True
```
4. Restart the app — no API key needed!

### 3. Run the App
```bash
python app.py
```
Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## 🎛️ Customising the Agent

All agent behaviour is controlled from **`agent_config.py`** — no need to touch `app.py`.

```python
# agent_config.py

AGENT_CONFIG = {
    "agent_name": "NutriGuru",          # ← Change the agent's name
    "agent_persona": "...",             # ← Change tone and personality

    "specializations": {
        "indian_cuisine": True,         # ← Enable/disable specializations
        "diabetic_friendly": True,
        "keto": False,                  # ← Set False to disable
    },

    "indian_food_settings": {
        "prefer_indian_alternatives": True,   # ← Suggest dal over lentil soup
        "preferred_regions": ["North Indian", "South Indian"],
    },

    "safety_rules": {
        "adult_min_calories": 1200,     # ← Minimum calorie floor
        "refuse_extreme_diets": True,   # ← Block crash diet requests
    },

    "model_settings": {
        "model_id": "ibm/granite-13b-chat-v2",  # ← Change Granite model
        "temperature": 0.7,             # ← Higher = more creative
    },

    "additional_system_instructions": """
    Add any custom rules here...        # ← Free-form extra instructions
    """,
}
```

### Available Groq Models (all free)
| Model ID | Description |
|---|---|
| `llama-3.3-70b-versatile` | Best quality (recommended) |
| `llama-3.1-8b-instant` | Fastest responses |
| `mixtral-8x7b-32768` | Great for long outputs |
| `gemma2-9b-it` | Google Gemma 2 |

---

## 📁 Project Structure

```
nutrition_agent/
├── app.py                  # Flask backend — all routes & AI logic
├── agent_config.py         # ⭐ Agent customisation — edit this!
├── requirements.txt        # Python dependencies
├── .env.example            # Environment template (copy to .env)
├── .gitignore
├── templates/
│   ├── base.html           # Layout with navbar, dark mode
│   ├── index.html          # Dashboard + calorie analyser
│   ├── chat.html           # AI chat interface
│   ├── meal_plan.html      # Meal planning page
│   ├── bmi.html            # BMI calculator
│   └── family.html         # Family profiles
└── static/
    ├── css/style.css       # Custom styles
    └── js/main.js          # Theme, toasts, animations
```

---

## 🌐 Deployment

### Option 1: Render (Free, Recommended)

1. Push your code to GitHub (make sure `.env` is in `.gitignore`)
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `gunicorn app:app`
6. Add environment variables in the Render dashboard (same as your `.env`)
7. Deploy!

### Option 2: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```
Add environment variables in the Railway dashboard.

### Option 3: Heroku

```bash
# Create Procfile
echo "web: gunicorn app:app" > Procfile

heroku create your-nutriguru-app
heroku config:set IBM_API_KEY=your_key
heroku config:set IBM_PROJECT_ID=your_id
heroku config:set FLASK_SECRET_KEY=your_secret
git push heroku main
```

### Option 4: Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

```bash
docker build -t nutriguru .
docker run -p 5000:5000 --env-file .env nutriguru
```

---

## 🔌 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/chat` | POST | Send chat message, get AI response |
| `/api/meal-plan` | POST | Generate personalised meal plan |
| `/api/bmi` | POST | Calculate BMI + TDEE + AI analysis |
| `/api/calorie-analysis` | POST | Analyse calories for food items |
| `/api/family-plan` | POST | Generate family nutrition plan |
| `/api/set-profile` | POST | Save user profile for context |
| `/api/clear-chat` | POST | Clear chat session history |
| `/api/quick-tip` | GET | Get daily nutrition tip |
| `/api/health` | GET | Health check / status |

### Example: Chat API
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What should I eat for a diabetic-friendly Indian breakfast?"}'
```

### Example: Meal Plan API
```bash
curl -X POST http://localhost:5000/api/meal-plan \
  -H "Content-Type: application/json" \
  -d '{
    "days": 7,
    "calories": 1800,
    "diet_type": "diabetic-friendly",
    "cuisine": "South Indian",
    "goal": "manage blood sugar"
  }'
```

---

## 🔒 Security Notes

- Never commit `.env` to version control (it's in `.gitignore`)
- Change `FLASK_SECRET_KEY` to a long random string in production
- Set `FLASK_DEBUG=False` in production
- Consider adding rate limiting for production use: `pip install flask-limiter`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 Disclaimer

NutriGuru is an AI-powered assistant for informational purposes only. It is **not a substitute for professional medical or nutritional advice**. Always consult a registered dietitian or healthcare professional before making significant dietary changes, especially if you have a medical condition.

---

*Built with ❤️ and 🇮🇳 Indian food love | Powered by Groq + Llama 3 (Free AI)*
