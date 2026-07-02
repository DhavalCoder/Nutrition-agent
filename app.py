import os
from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq
from agent_config import AGENT_CONFIG

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "nutriguru-secret-2024")
CORS(app)

# ── Groq / Ollama Client Setup ────────────────────────────────────────────────
def get_client():
    """Return a Groq client, or None if not configured."""
    api_key = os.getenv("GROQ_API_KEY", "")
    if api_key and api_key != "your_groq_api_key_here":
        return Groq(api_key=api_key)
    return None


def ask_ai(user_message: str, history: list, context: str = "") -> str:
    """
    Send a message to Groq (or Ollama) and return the response text.
    Falls back to demo mode if no API key is configured.
    """
    cfg = AGENT_CONFIG["model_settings"]

    # ── Build messages list ───────────────────────────────────────────────────
    system_prompt = build_system_prompt(context)
    messages = [{"role": "system", "content": system_prompt}]

    # Add last 6 turns of conversation history
    for turn in history[-6:]:
        messages.append({"role": "user",      "content": turn["user"]})
        messages.append({"role": "assistant", "content": turn["assistant"]})

    messages.append({"role": "user", "content": user_message})

    # ── Ollama (local, no API key needed) ─────────────────────────────────────
    if cfg.get("use_ollama"):
        return ask_ollama(messages, cfg)

    # ── Groq API ──────────────────────────────────────────────────────────────
    client = get_client()
    if client is None:
        return demo_response()

    try:
        response = client.chat.completions.create(
            model=cfg["model_id"],
            messages=messages,
            max_tokens=cfg["max_tokens"],
            temperature=cfg["temperature"],
            top_p=cfg["top_p"],
            stream=False,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return (
            f"⚠️ AI error: {str(e)}\n\n"
            "Please check your `GROQ_API_KEY` in the `.env` file and try again."
        )


def ask_ollama(messages: list, cfg: dict) -> str:
    """Call local Ollama API."""
    import requests as req
    try:
        resp = req.post(
            f"{cfg['ollama_url']}/api/chat",
            json={
                "model": cfg["ollama_model"],
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": cfg["temperature"],
                    "num_predict": cfg["max_tokens"],
                }
            },
            timeout=120,
        )
        resp.raise_for_status()
        return resp.json()["message"]["content"].strip()
    except Exception as e:
        return (
            f"⚠️ Ollama error: {str(e)}\n\n"
            "Make sure Ollama is running (`ollama serve`) and the model is pulled "
            f"(`ollama pull {cfg['ollama_model']}`)."
        )


def demo_response() -> str:
    return (
        "🌟 **NutriGuru — Demo Mode**\n\n"
        "The AI is not connected yet. To enable full responses:\n\n"
        "**Option A — Groq (Free, Recommended):**\n"
        "1. Get a free API key at [console.groq.com](https://console.groq.com)\n"
        "2. Copy `.env.example` → `.env`\n"
        "3. Add `GROQ_API_KEY=your_key` in `.env`\n"
        "4. Restart the app\n\n"
        "**Option B — Ollama (Fully local, no internet):**\n"
        "1. Install from [ollama.com](https://ollama.com)\n"
        "2. Run `ollama pull llama3` in terminal\n"
        "3. In `agent_config.py`, set `use_ollama: True`\n"
        "4. Restart the app\n\n"
        "💡 *Groq is completely free — no credit card needed!*"
    )


# ── Build System Prompt from AGENT_CONFIG ─────────────────────────────────────
def build_system_prompt(extra_context: str = "") -> str:
    cfg  = AGENT_CONFIG
    spec = cfg["specializations"]
    ind  = cfg["indian_food_settings"]
    fmt  = cfg["response_format"]
    safe = cfg["safety_rules"]

    active_specs = [k.replace("_", " ").title() for k, v in spec.items() if v]
    regions      = ", ".join(ind.get("preferred_regions", []))

    prompt = f"""
{cfg['agent_persona']}

=== YOUR SPECIALIZATIONS ===
{', '.join(active_specs)}

=== INDIAN FOOD SETTINGS ===
- Prefer Indian food alternatives: {ind['prefer_indian_alternatives']}
- Include regional varieties ({regions}): {ind['include_regional_varieties']}
- Highlight traditional Indian superfoods: {ind['traditional_superfoods']}
- Explain spice health benefits: {ind['spice_health_benefits']}
- Offer healthy street food swaps: {ind['street_food_healthy_swaps']}

=== RESPONSE FORMAT ===
- Use emojis: {fmt['use_emojis']}
- Always include calorie counts: {fmt['include_calorie_counts']}
- Always include macros (protein/carbs/fat): {fmt['include_macros']}
- Include preparation tips: {fmt['include_preparation_tips']}
- Language: {fmt['response_language']}

=== SAFETY RULES ===
- Never suggest below {safe['adult_min_calories']} kcal/day for adults
- Never suggest below {safe['child_min_calories']} kcal/day for children
- Refuse extreme or dangerous diets: {safe['refuse_extreme_diets']}
- Always add medical disclaimer for medical conditions
- Medical disclaimer: "{safe['medical_disclaimer']}"

=== ADDITIONAL INSTRUCTIONS ===
{cfg['additional_system_instructions']}
""".strip()

    if extra_context:
        prompt += f"\n\n=== CURRENT USER CONTEXT ===\n{extra_context}"

    return prompt


# ── Page Routes ───────────────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html", agent_name=AGENT_CONFIG["agent_name"])

@app.route("/chat")
def chat():
    return render_template("chat.html", agent_name=AGENT_CONFIG["agent_name"])

@app.route("/meal-plan")
def meal_plan():
    return render_template("meal_plan.html", agent_name=AGENT_CONFIG["agent_name"])

@app.route("/bmi")
def bmi():
    return render_template("bmi.html", agent_name=AGENT_CONFIG["agent_name"])

@app.route("/family")
def family():
    return render_template("family.html", agent_name=AGENT_CONFIG["agent_name"])


# ── API: Chat ─────────────────────────────────────────────────────────────────
@app.route("/api/chat", methods=["POST"])
def api_chat():
    data    = request.get_json()
    message = (data.get("message") or "").strip()
    if not message:
        return jsonify({"error": "Empty message"}), 400

    if "chat_history" not in session:
        session["chat_history"] = []

    # Build user context from active profile
    context = ""
    if session.get("active_profile"):
        p = session["active_profile"]
        context = (
            f"User profile — Name: {p.get('name')}, Age: {p.get('age')}, "
            f"Gender: {p.get('gender')}, Weight: {p.get('weight')} kg, "
            f"Height: {p.get('height')} cm, Goal: {p.get('goal')}, "
            f"Allergies: {p.get('allergies', 'None')}, "
            f"Health Conditions: {p.get('conditions', 'None')}"
        )

    reply = ask_ai(message, session["chat_history"], context)
    session["chat_history"].append({"user": message, "assistant": reply})
    session.modified = True

    return jsonify({"reply": reply})


# ── API: Generate Meal Plan ───────────────────────────────────────────────────
@app.route("/api/meal-plan", methods=["POST"])
def api_meal_plan():
    data = request.get_json()
    days       = int(data.get("days", 7))
    calories   = int(data.get("calories", 2000))
    diet_type  = data.get("diet_type", "balanced")
    allergies  = data.get("allergies", "none")
    goal       = data.get("goal", "maintain weight")
    cuisine    = data.get("cuisine", "Indian")
    conditions = data.get("conditions", "none")
    budget     = data.get("budget", "moderate")

    # Enforce safety minimum
    safe = AGENT_CONFIG["safety_rules"]
    calories = max(calories, safe["adult_min_calories"])

    prompt = f"""
Create a detailed {days}-day {diet_type} meal plan for someone with:
- Daily calorie target: {calories} kcal
- Goal: {goal}
- Cuisine preference: {cuisine}
- Allergies / restrictions: {allergies}
- Health conditions: {conditions}
- Budget: {budget}

Structure EACH day as:
🌅 Breakfast | 🍎 Mid-Morning Snack | ☀️ Lunch | 🌆 Evening Snack | 🌙 Dinner

For EVERY meal include:
- Dish name (prefer {cuisine} dishes)
- Approximate calories
- Key macros: Protein / Carbs / Fat
- One quick prep tip (under 10 words)

End each day with a brief Daily Nutrition Summary and a hydration reminder.
Use emojis throughout. Be specific with quantities (e.g., "1 cup cooked dal").
"""
    response = ask_ai(prompt, [])
    return jsonify({"meal_plan": response})


# ── API: BMI + TDEE Analysis ──────────────────────────────────────────────────
@app.route("/api/bmi", methods=["POST"])
def api_bmi():
    data     = request.get_json()
    weight   = float(data.get("weight", 70))
    height   = float(data.get("height", 170))
    age      = int(data.get("age", 30))
    gender   = data.get("gender", "male").lower()
    activity = data.get("activity_level", "moderate")

    # Calculate BMI
    bmi_val = round(weight / ((height / 100) ** 2), 1)
    if bmi_val < 18.5:
        category = "Underweight"
    elif bmi_val < 25:
        category = "Normal weight"
    elif bmi_val < 30:
        category = "Overweight"
    else:
        category = "Obese"

    # BMR — Mifflin-St Jeor equation
    if gender == "male":
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161

    activity_factors = {
        "sedentary":   1.2,
        "light":       1.375,
        "moderate":    1.55,
        "active":      1.725,
        "very_active": 1.9,
    }
    tdee = round(bmr * activity_factors.get(activity, 1.55))

    prompt = f"""
A {age}-year-old {gender} has:
- BMI: {bmi_val} ({category})
- Weight: {weight} kg | Height: {height} cm
- TDEE: {tdee} kcal/day | Activity: {activity}

Please provide:
1. 📊 Friendly explanation of their BMI and what it means for their health
2. 🎯 Personalised calorie targets: weight loss / maintenance / muscle gain
3. 🥗 Top 5 dietary tips specific to their BMI category
4. 🏃 Simple lifestyle and exercise recommendations
5. 📅 Realistic timeline to reach healthy BMI (if not already there)
6. 🇮🇳 3 perfect Indian food choices for their situation with calorie info
7. 💧 Daily hydration target

Be encouraging, specific, and actionable. Use emojis throughout.
"""
    ai_analysis = ask_ai(prompt, [])

    return jsonify({
        "bmi":      bmi_val,
        "category": category,
        "bmr":      round(bmr),
        "tdee":     tdee,
        "analysis": ai_analysis,
    })


# ── API: Calorie Analysis ─────────────────────────────────────────────────────
@app.route("/api/calorie-analysis", methods=["POST"])
def api_calorie_analysis():
    data  = request.get_json()
    foods = (data.get("foods") or "").strip()
    if not foods:
        return jsonify({"error": "No food items provided"}), 400

    prompt = f"""
Analyse the nutritional content of this meal / food list:
{foods}

Provide a structured report with:
1. 📊 Estimated calories per item
2. 🔢 Total meal calories
3. 💪 Full macronutrient breakdown (Protein, Carbohydrates, Fats, Fiber)
4. ✅ Nutritional strengths of this meal
5. ⚠️ Nutritional gaps or concerns
6. 💡 2-3 simple swaps to make it healthier while keeping it tasty
7. 🇮🇳 Rating out of 10 for an Indian diet context with brief reason

Format as a clear, well-structured nutritional report with emojis.
"""
    analysis = ask_ai(prompt, [])
    return jsonify({"analysis": analysis})


# ── API: Family Diet Plan ─────────────────────────────────────────────────────
@app.route("/api/family-plan", methods=["POST"])
def api_family_plan():
    data    = request.get_json()
    members = data.get("members", [])
    if not members:
        return jsonify({"error": "No family members provided"}), 400

    members_desc = "\n".join([
        f"- {m['name']} ({m['age']} yr old {m['gender']}): "
        f"Goal={m.get('goal', 'healthy eating')}, "
        f"Conditions={m.get('conditions', 'none')}, "
        f"Allergies={m.get('allergies', 'none')}"
        for m in members
    ])

    prompt = f"""
Create a unified family nutrition plan for these members:
{members_desc}

Deliver:
1. 🏠 A 3-day shared family meal plan that works for EVERYONE
2. 👶 Special portion and nutrient notes for any children
3. 👴 Special notes for any seniors (easy to digest, bone health)
4. 🏥 Medical diet adjustments for any stated health conditions
5. 🇮🇳 3 Indian family recipes that satisfy all dietary needs simultaneously
6. 🛒 Combined weekly grocery list (grouped by category)
7. 💡 Tips for cooking one meal that meets different dietary requirements

Be warm, practical, and family-friendly. Use emojis.
"""
    plan = ask_ai(prompt, [])
    return jsonify({"family_plan": plan})


# ── API: Set Active User Profile ──────────────────────────────────────────────
@app.route("/api/set-profile", methods=["POST"])
def set_profile():
    data = request.get_json()
    session["active_profile"] = data
    session.modified = True
    return jsonify({"status": "Profile saved successfully"})


# ── API: Clear Chat History ───────────────────────────────────────────────────
@app.route("/api/clear-chat", methods=["POST"])
def clear_chat():
    session["chat_history"] = []
    session.modified = True
    return jsonify({"status": "Chat history cleared"})


# ── API: Daily Quick Tip ──────────────────────────────────────────────────────
@app.route("/api/quick-tip", methods=["GET"])
def quick_tip():
    prompt = (
        "Give ONE unique, practical, and motivating daily nutrition tip for an Indian person. "
        "Keep it short (2-3 sentences max). Use one emoji. Make it immediately actionable. "
        "Rotate topics: superfoods, hydration, meal timing, spice benefits, traditional foods, "
        "mindful eating, budget nutrition, seasonal eating."
    )
    tip = ask_ai(prompt, [])
    return jsonify({"tip": tip})


# ── API: Health Check ─────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health_check():
    cfg = AGENT_CONFIG["model_settings"]
    backend = "ollama" if cfg.get("use_ollama") else "groq"
    return jsonify({
        "status":    "running",
        "agent":     AGENT_CONFIG["agent_name"],
        "backend":   backend,
        "model":     cfg["ollama_model"] if cfg.get("use_ollama") else cfg["model_id"],
        "api_ready": bool(os.getenv("GROQ_API_KEY")) or cfg.get("use_ollama", False),
    })


if __name__ == "__main__":
    debug = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    app.run(debug=debug, host="0.0.0.0", port=5000)
