# 🥗 NutriGuru — AI-Powered Nutrition Agent

<div align="center">

![NutriGuru Banner](https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=400&fit=crop&q=85)

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0.3-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PC9zdmc+)](https://groq.com)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![Railway](https://img.shields.io/badge/Deployed_on-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)

**A full-stack AI-powered nutrition web application with real-time LLM integration, personalized meal planning, BMI analysis, family diet management, and deep Indian cuisine expertise.**

[🌐 Live Demo](https://github.com/DhavalCoder/Nutrition-agent) · [💬 Chat Feature](#-ai-chat) · [🗓️ Meal Planner](#-meal-planner) · [⚖️ BMI Calculator](#-bmi--tdee-calculator)

</div>

---

## 📌 Project Overview

NutriGuru is a production-ready AI nutrition agent built with **Python Flask** and **Groq's Llama 3.3 70B** model. It provides real-time personalized nutrition advice, generates structured 7-day meal plans, performs BMI/TDEE calculations, and manages multi-member family diet profiles — all through a modern Apple-inspired web interface.

This project demonstrates full-stack AI application development including **LLM API integration**, **session-based context management**, **RESTful API design**, **responsive frontend engineering**, and **cloud deployment**.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Nutrition Chat** | Real-time conversational AI using Groq + Llama 3.3 70B with session-based memory |
| 🗓️ **Meal Planner** | Generates structured 1–7 day personalised Indian meal plans with macros & calories |
| ⚖️ **BMI & TDEE Calculator** | Mifflin-St Jeor BMR formula + TDEE + AI-powered health analysis |
| 👨‍👩‍👧 **Family Diet Profiles** | Multi-member family nutrition management with age/condition-aware planning |
| 🔢 **Calorie Analyser** | Instant nutritional breakdown for any meal with improvement suggestions |
| 💡 **Daily Tips** | AI-generated daily nutrition tips tailored to Indian dietary habits |
| 🇮🇳 **Indian Cuisine Expert** | Deep knowledge of North/South Indian, Bengali, Gujarati, and Maharashtrian cuisine |
| 🌙 **Dark / Light Mode** | Persistent theme toggle with smooth transitions |
| 📱 **Fully Responsive** | Mobile-first design, works on all screen sizes |

---

## 🏗️ Tech Stack

### Backend
- **Python 3.11** — Core language
- **Flask 3.0.3** — Web framework & REST API
- **Groq SDK** — LLM inference client (Llama 3.3 70B)
- **Flask-CORS** — Cross-origin resource sharing
- **Python-dotenv** — Environment variable management
- **Gunicorn** — Production WSGI server

### Frontend
- **Bootstrap 5.3** — Responsive grid & components
- **DM Serif Display / Plus Jakarta Sans / DM Sans** — Premium font system
- **Animate.css** — Scroll-triggered animations
- **Marked.js** — Markdown parsing for AI responses
- **Vanilla JS (ES6+)** — Intersection Observer, Parallax, Theme system
- **Unsplash API** — Dynamic food imagery

### AI / LLM
- **Groq Cloud API** — Ultra-fast LLM inference
- **Meta Llama 3.3 70B Versatile** — Foundation model
- **Custom System Prompt Engine** — Fully configurable via `agent_config.py`

### Deployment
- **Railway** — Cloud hosting with auto-deploy from GitHub
- **GitHub** — Version control & CI/CD trigger

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10 or higher
- Free Groq API key → [console.groq.com](https://console.groq.com) *(no credit card needed)*

### 1. Clone the Repository
```bash
git clone https://github.com/DhavalCoder/Nutrition-agent.git
cd Nutrition-agent
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
```bash
# Copy the template
cp .env.example .env       # macOS/Linux
copy .env.example .env     # Windows
```

Edit `.env` and add your Groq API key:
```env
GROQ_API_KEY=gsk_your_key_here
FLASK_SECRET_KEY=your-random-secret-string
FLASK_DEBUG=False
```

> 🔑 Get your **free** Groq API key at [console.groq.com](https://console.groq.com) — takes 30 seconds, no credit card.

### 5. Run the Application
```bash
python app.py
```

Open **[http://localhost:5000](http://localhost:5000)** in your browser.

---

## 📁 Project Structure

```
nutrition_agent/
│
├── app.py                  # Flask app — all routes, API endpoints, AI logic
├── agent_config.py         # ⭐ Agent control panel — customize everything here
├── requirements.txt        # Python dependencies
├── Procfile                # Railway/Heroku start command
├── railway.json            # Railway deployment config
├── runtime.txt             # Python version specification
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules (keeps .env safe)
│
├── templates/
│   ├── base.html           # Base layout — navbar, footer, theme, FAB
│   ├── index.html          # Dashboard — hero, bento grid, calorie analyser
│   ├── chat.html           # AI chat interface with sidebar
│   ├── meal_plan.html      # Meal planner with custom controls
│   ├── bmi.html            # BMI & TDEE calculator with visual gauge
│   └── family.html         # Family profile manager
│
└── static/
    ├── css/style.css       # Full custom stylesheet (1100+ lines)
    └── js/main.js          # Theme, animations, scroll effects, parallax
```

---

## 🔌 REST API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send a message, receive AI nutrition response |
| `POST` | `/api/meal-plan` | Generate N-day personalised meal plan |
| `POST` | `/api/bmi` | Calculate BMI, BMR, TDEE + AI analysis |
| `POST` | `/api/calorie-analysis` | Analyse calories & macros for any foods |
| `POST` | `/api/family-plan` | Generate unified family nutrition plan |
| `POST` | `/api/set-profile` | Save user profile for personalised context |
| `POST` | `/api/clear-chat` | Clear conversation history |
| `GET`  | `/api/quick-tip` | Get AI-generated daily nutrition tip |
| `GET`  | `/api/health` | Health check & API status |

### Example Request
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Give me a high protein vegetarian Indian breakfast idea"}'
```

### Example Response
```json
{
  "reply": "🌅 Great choice! Here's a high-protein vegetarian Indian breakfast:\n\n**Moong Dal Chilla** 💪\n- Calories: ~280 kcal\n- Protein: 18g | Carbs: 32g | Fat: 6g\n..."
}
```

---

## 🎛️ Agent Customization

All AI behavior is controlled from `agent_config.py` — **no need to touch `app.py`**.

```python
AGENT_CONFIG = {
    "agent_name": "NutriGuru",          # Change agent name

    "agent_persona": "...",             # Change tone & personality

    "specializations": {
        "indian_cuisine": True,         # Enable/disable expertise areas
        "diabetic_friendly": True,
        "keto": False,                  # Disabled
    },

    "indian_food_settings": {
        "prefer_indian_alternatives": True,
        "preferred_regions": ["North Indian", "South Indian"],
    },

    "safety_rules": {
        "adult_min_calories": 1200,     # Safety floor
        "refuse_extreme_diets": True,
    },

    "model_settings": {
        "model_id": "llama-3.3-70b-versatile",
        "temperature": 0.7,             # Creativity level
    },

    "additional_system_instructions": """
    Add any custom rules here...
    """,
}
```

---

## 🌐 Deployment

### Railway (Recommended)
1. Fork this repo on GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your fork
4. Add environment variables:
   ```
   GROQ_API_KEY=your_key
   FLASK_SECRET_KEY=any_random_string
   FLASK_DEBUG=False
   ```
5. Railway auto-detects Python and runs `gunicorn app:app`
6. Go to Settings → Networking → Generate Domain for your public URL

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:$PORT", "app:app"]
```

```bash
docker build -t nutriguru .
docker run -p 5000:5000 --env-file .env nutriguru
```

---

## 📸 Screenshots

| Dashboard | AI Chat | Meal Planner |
|-----------|---------|--------------|
| Hero with video BG | Real-time AI responses | Custom calorie controls |

| BMI Calculator | Family Profiles | Dark / Light Mode |
|----------------|-----------------|-------------------|
| Visual BMI gauge | Multi-member plans | Smooth theme toggle |

---

## 🔑 Key Technical Decisions

**Why Groq?**
Groq's inference hardware delivers ~500 tokens/second — making responses feel instant compared to typical LLM APIs. The free tier supports full production usage.

**Why Flask over FastAPI?**
Flask's simplicity and Jinja2 templating made server-side rendering easier for a multi-page app. The lightweight nature keeps deployment costs near zero.

**Agent Config Pattern**
All AI behavior (persona, safety rules, specializations) is centralized in `agent_config.py`. This means the agent can be repurposed (e.g., for fitness or mental wellness) by editing one file.

**Session-based Context**
Chat history and user profiles are stored in Flask sessions, enabling personalized responses without a database — keeping the stack simple and stateless-friendly for deployment.

---

## 🛡️ Security Notes

- `.env` is in `.gitignore` — API keys are never committed
- Flask sessions use a secret key for signing
- Minimum calorie safety floors enforced server-side
- Medical disclaimer added to all health-related AI responses
- Input sanitization on all API endpoints

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) for ultra-fast LLM inference
- [Meta Llama](https://llama.meta.com) for the Llama 3.3 70B model
- [Unsplash](https://unsplash.com) for food photography
- [Bootstrap](https://getbootstrap.com) for the UI framework

---

<div align="center">

**Built with ❤️ and 🇮🇳 Indian food love**

*Not a substitute for professional medical or nutritional advice.*

</div>
