import os
import json
import re
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for frontend dev server
CORS(app, resources={r"/api/*": {"origins": "*"}})

OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
DEFAULT_MODEL = "qwen2.5:3b"
FALLBACK_MODEL = "qwen2.5:0.5b"

def get_installed_models():
    """Query local Ollama for list of installed models."""
    try:
        resp = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=3)
        if resp.status_code == 200:
            data = resp.json()
            models = [m.get("name", "") for m in data.get("models", [])]
            return True, models, None
        return False, [], f"Ollama returned status code {resp.status_code}"
    except requests.exceptions.ConnectionError:
        return False, [], "Ollama server is not running at http://localhost:11434. Please start Ollama desktop or run 'ollama serve'."
    except requests.exceptions.Timeout:
        return False, [], "Connection to Ollama server timed out (3s)."
    except Exception as e:
        return False, [], f"Error connecting to Ollama: {str(e)}"

def resolve_model(requested_model=None, allow_fallback=True):
    """
    Determine which model to run.
    Checks if Ollama is online and if the desired model is installed.
    """
    online, models, err = get_installed_models()
    if not online:
        return None, err, []

    target = requested_model or DEFAULT_MODEL

    # Direct match or version match (e.g., 'qwen2.5:3b' matching 'qwen2.5:3b' or 'qwen2.5:3b-instruct')
    found_target = None
    for m in models:
        if m == target or m.startswith(f"{target}:") or target in m:
            found_target = m
            break

    if found_target:
        return found_target, None, models

    # Target not found; check fallback if allowed
    if allow_fallback:
        for m in models:
            if FALLBACK_MODEL in m:
                return m, f"Notice: Desired model '{target}' not installed yet, falling back to '{m}'. Run 'ollama pull {target}' for best results.", models
        if models:
            return models[0], f"Notice: Model '{target}' not found. Using available model '{models[0]}'. Run 'ollama pull {target}'.", models

    return None, f"Model '{target}' is not installed in local Ollama. Run: ollama pull {target}", models

def clean_json_response(raw_text):
    """Extract valid JSON from Ollama output that might have markdown or conversational preamble."""
    if not raw_text:
        return None
    
    # Try direct parse
    try:
        return json.loads(raw_text.strip())
    except Exception:
        pass

    # Look for ```json ... ``` or ``` ... ```
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", raw_text)
    if fence_match:
        try:
            return json.loads(fence_match.group(1).strip())
        except Exception:
            pass

    # Look for outermost { ... }
    bracket_match = re.search(r"(\{[\s\S]*\})", raw_text)
    if bracket_match:
        try:
            return json.loads(bracket_match.group(1).strip())
        except Exception:
            pass

    return None

@app.route("/api/health", methods=["GET"])
def health_check():
    """
    Checks Ollama availability and installed models.
    Provides diagnostic help if Ollama is offline or qwen2.5:3b is missing.
    """
    online, models, err = get_installed_models()
    
    has_3b = any(DEFAULT_MODEL in m for m in models)
    has_fallback = any(FALLBACK_MODEL in m for m in models)
    
    active_model = None
    if has_3b:
        active_model = DEFAULT_MODEL
    elif has_fallback:
        active_model = FALLBACK_MODEL
    elif models:
        active_model = models[0]

    return jsonify({
        "status": "online" if online else "offline",
        "ollama_available": online,
        "ollama_url": OLLAMA_BASE_URL,
        "preferred_model": DEFAULT_MODEL,
        "is_preferred_installed": has_3b,
        "active_model": active_model,
        "installed_models": models,
        "error_message": err,
        "setup_instructions": {
            "if_not_installed": "Download and install Ollama from https://ollama.com",
            "if_not_running": "Open Ollama app or run 'ollama serve' in terminal",
            "pull_model_command": f"ollama pull {DEFAULT_MODEL}"
        }
    })

@app.route("/api/analyze", methods=["POST"])
def analyze_resource():
    """
    Real Ollama AI analysis endpoint.
    Takes a resource or problem description and prompts Ollama to generate
    practical solutions, category, action steps, and safety warnings.
    NEVER fakes AI output.
    """
    data = request.get_json(silent=True) or {}
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    entry_type = data.get("type", "problem") # 'problem', 'offer', 'request'
    requested_model = data.get("model", None)
    allow_fallback = data.get("allow_fallback", True)

    if not title and not description:
        return jsonify({
            "error": "Missing input: please provide at least a title or description."
        }), 400

    # Validate Ollama and model
    selected_model, model_msg, available_models = resolve_model(requested_model, allow_fallback=allow_fallback)
    if not selected_model:
        return jsonify({
            "error": "Ollama / Model Unavailable",
            "message": model_msg,
            "troubleshooting": {
                "step_1": "Ensure Ollama is running: run 'ollama serve' or start the Ollama desktop application.",
                "step_2": f"Ensure the model is downloaded: run 'ollama pull {DEFAULT_MODEL}'.",
                "available_models": available_models
            }
        }), 503

    # Craft structured prompt
    prompt = f"""You are Resource Rescue AI, an expert in circular economy, waste reduction, material upcycling, food rescue, and community resource sharing.
Analyze the following user submission:

Submission Type: {entry_type.upper()}
Title: {title or 'Unspecified'}
Description: {description or 'Unspecified'}

Generate a thorough, practical, and safe rescue & reuse plan.
You MUST output ONLY a valid JSON object matching this exact schema:
{{
  "category": "Reusable Electronics" | "Surplus Packaged Food" | "Water Conservation" | "Upcycling & Materials" | "Tools & Equipment" | "Other",
  "summary": "1 concise sentence summarizing the rescue opportunity",
  "urgency_level": "High" | "Medium" | "Low",
  "potential_impact": "1-2 sentences on ecological, economic or social benefit",
  "practical_solutions": [
    {{
      "title": "Clear solution name",
      "description": "How to repurpose, reuse, donate or deploy this resource",
      "target_recipient": "Who benefits (e.g. local school lab, community pantry, urban garden)"
    }}
  ],
  "action_steps": [
    "Step 1: Immediate sorting, verification, or cleaning action",
    "Step 2: Practical preparation or safe storage",
    "Step 3: Distribution, pairing, or installation step"
  ],
  "safety_warnings": [
    "Crucial safety, hygiene, regulatory, electrical, data privacy or expiration warning"
  ],
  "suggested_tags": ["tag1", "tag2", "tag3"]
}}

Provide 2 to 3 practical solutions, 3 to 4 concrete action steps, and at least 2 critical safety warnings (e.g., sanitization, battery hazards, secure data wipe, food expiry rules, pressure/seal checks).
Do NOT include any conversational filler outside the JSON. Return only the JSON object.
"""

    try:
        # Call Ollama generate endpoint
        payload = {
            "model": selected_model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.2, # Low temperature for structured output consistency
                "top_p": 0.9
            }
        }

        resp = requests.post(f"{OLLAMA_BASE_URL}/api/generate", json=payload, timeout=60)
        
        if resp.status_code != 200:
            return jsonify({
                "error": "Ollama Error",
                "message": f"Ollama returned status code {resp.status_code}: {resp.text}",
                "model_used": selected_model
            }), 502

        result = resp.json()
        raw_output = result.get("response", "")

        parsed_json = clean_json_response(raw_output)
        if not parsed_json:
            # If Ollama didn't return perfect JSON, return clean structured error with raw text
            return jsonify({
                "error": "Invalid Model Output",
                "message": "Model generated output but could not be parsed into required JSON schema.",
                "raw_output": raw_output,
                "model_used": selected_model
            }), 422

        return jsonify({
            "success": True,
            "model_used": selected_model,
            "model_note": model_msg,
            "analysis": parsed_json,
            "eval_duration_ms": round(result.get("eval_duration", 0) / 1_000_000, 2)
        })

    except requests.exceptions.Timeout:
        return jsonify({
            "error": "Model Timeout",
            "message": "Ollama model evaluation timed out after 60 seconds. Model may be running under heavy load."
        }), 504
    except requests.exceptions.ConnectionError:
        return jsonify({
            "error": "Connection Lost",
            "message": "Lost connection to Ollama server during inference."
        }), 503
    except Exception as e:
        return jsonify({
            "error": "Unexpected Error",
            "message": str(e)
        }), 500

def normalize_category(cat_str):
    """Normalize category strings for strict compatibility checks."""
    if not cat_str:
        return ""
    c = cat_str.lower().strip()
    if "electronic" in c or "tech" in c or "computer" in c or "laptop" in c:
        return "electronics"
    if "food" in c or "bakery" in c or "grocery" in c or "produce" in c or "meal" in c:
        return "food"
    if "water" in c or "rain" in c or "irrigation" in c or "tank" in c:
        return "water"
    if "upcycling" in c or "material" in c:
        return "materials"
    if "tool" in c or "equipment" in c:
        return "tools"
    return c

@app.route("/api/match", methods=["POST"])
def match_resources():
    """
    Intelligent resource matching endpoint.
    Strictly enforces category compatibility as a hard constraint for Direct Rescue matches.
    Laptops and electronics will NEVER be matched with food or water as a direct rescue match.
    Cross-category items are segregated and labeled separately with low synergy scores.
    """
    data = request.get_json(silent=True) or {}
    source = data.get("source_item")
    candidates = data.get("candidates", [])

    if not source:
        return jsonify({"error": "Missing 'source_item' parameter"}), 400

    if not candidates:
        return jsonify({"matches": [], "cross_category_collaborations": []})

    source_type = source.get("type", "offer").lower()
    source_cat = source.get("category", "")
    source_norm_cat = normalize_category(source_cat)
    source_title = source.get("title", "").lower()
    source_desc = source.get("description", "").lower()
    source_tags = [t.lower() for t in source.get("tags", [])]
    
    # Extract keywords
    source_words = set(re.findall(r"\b[a-zA-Z]{3,}\b", f"{source_title} {source_desc} {' '.join(source_tags)}"))

    direct_matches = []
    cross_category_matches = []

    stopwords = {"with", "this", "that", "from", "have", "need", "offer", "looking", "available", "good", "some", "seeking"}

    for item in candidates:
        # Don't match with self
        if str(item.get("id")) == str(source.get("id")):
            continue

        item_type = item.get("type", "").lower()
        item_cat = item.get("category", "")
        item_norm_cat = normalize_category(item_cat)
        item_title = item.get("title", "").lower()
        item_desc = item.get("description", "").lower()
        item_tags = [t.lower() for t in item.get("tags", [])]
        item_words = set(re.findall(r"\b[a-zA-Z]{3,}\b", f"{item_title} {item_desc} {' '.join(item_tags)}"))

        # Check Category Compatibility
        is_same_category = bool(source_norm_cat and item_norm_cat and (source_norm_cat == item_norm_cat))
        
        # Check Role Complementarity (Offer <-> Request is primary)
        is_complementary = (source_type == "offer" and item_type == "request") or \
                           (source_type == "request" and item_type == "offer") or \
                           (source_type == "problem" and item_type == "offer")

        # Keyword & location overlap
        common_words = [w for w in source_words.intersection(item_words) if w not in stopwords]
        keyword_score = min(15, len(common_words) * 5)
        
        src_loc = source.get("location", "").lower().strip()
        item_loc = item.get("location", "").lower().strip()
        is_nearby = bool(src_loc and item_loc and (src_loc in item_loc or item_loc in src_loc))

        # HARD CONSTRAINT: Direct Rescue Matches require same category AND complementary roles
        if is_same_category and is_complementary:
            score = 75 + keyword_score + (5 if is_nearby else 0)
            score = min(98, score)

            reasons = [
                f"Verified Category Match: {source_cat}",
                f"Complementary Roles: {source_type.title()} directly meets {item_type.title()}"
            ]
            if common_words:
                reasons.append(f"Matching specifications: {', '.join(common_words[:3])}")
            if is_nearby:
                reasons.append(f"Local proximity: {item.get('location')}")

            direct_matches.append({
                "target_item": item,
                "match_score": score,
                "reasons": reasons,
                "exchange_type": "Direct Rescue Match",
                "is_direct_match": True,
                "category_verified": True
            })

        elif is_same_category and not is_complementary:
            # Same category, but both offers or both requests (resource pooling opportunity)
            score = 40 + keyword_score
            reasons = [
                f"Same Category ({source_cat}), but both are {source_type.title()}s",
                "Potential for collective logistics, batching or coalition donation"
            ]
            cross_category_matches.append({
                "target_item": item,
                "match_score": score,
                "reasons": reasons,
                "exchange_type": "Same-Category Coalition (Not a Direct Match)",
                "is_direct_match": False,
                "category_verified": True
            })

        else:
            # Cross-Category: Never a direct match!
            reasons = [
                f"Incompatible Categories ({source_cat} vs {item_cat})",
                "Different resource streams; requires separate operational handling"
            ]
            cross_category_matches.append({
                "target_item": item,
                "match_score": 10,
                "reasons": reasons,
                "exchange_type": "Cross-Sector Collaborative Opportunity",
                "is_direct_match": False,
                "category_verified": False
            })

    # Sort descending by match score
    direct_matches.sort(key=lambda x: x["match_score"], reverse=True)
    cross_category_matches.sort(key=lambda x: x["match_score"], reverse=True)

    return jsonify({
        "source_id": source.get("id"),
        "matches": direct_matches,
        "direct_matches": direct_matches,
        "cross_category_collaborations": cross_category_matches
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"[*] Starting Resource Rescue AI Backend on http://{host}:{port}")
    app.run(host=host, port=port, debug=False)
