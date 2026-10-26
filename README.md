# Resource Rescue AI ♻️🌱

> **A Professional Circular Economy & Waste Reduction Platform** connecting operational surplus resources with verified community needs. Powered by **React + Vite**, **Python Flask**, and the local **Ollama `qwen2.5:3b`** AI model.

---

## 🏛️ Design & Architectural Philosophy

Resource Rescue AI has been completely redesigned with an **editorial, climate-tech startup aesthetic**:
- **Palette**: Warm off-white surfaces (`#f8faf7`, `#ffffff`), deep forest green (`#173829`), sage tints (`#eaf3ec`), and restrained amber/teal accents.
- **Typography**: High-contrast, readable typography using **Outfit** (editorial headlines) and **Plus Jakarta Sans** (accessible, legible body text).
- **Structure**: Hairline borders, calm whitespace, and subtle shadows replacing neon glows or heavy glassmorphism.
- **Truthful & Transparent**:
  - Seeded initial listings are explicitly badged as `[DEMO]` to prevent misrepresenting real partnerships.
  - Metrics are clearly marked as **"Estimated Potential Diversion"** derived from active listings.
  - Ollama connectivity status is truthfully reported in real-time.

---

## 🌟 The 4 Core Platform Sections

1. **Impact Dashboard** (`/dashboard`):
   - Executive overview of active resource offers, community needs, compatible direct match pairs, and estimated landfill/water diversion.
   - Primary action buttons: **“Offer a Resource”** and **“Find a Resource”**.
   - Sector breakdown across the 3 core pillars: **Reusable Electronics**, **Surplus Packaged Food**, and **Water Conservation**.
   - Demo disclaimer banner with a one-click **Reset Demo Data** utility.

2. **Discover Resources (Resource Marketplace)** (`/marketplace`):
   - Compact, editorial cards showcasing listing title, specifications, quantity, condition, location, and organization.
   - **Safety & Intake Compliance** alerts for each resource (e.g. NIST 800-88 / DBAN data wiping, hermetic can integrity, pressure regulators).
   - Live search bar and dynamic filters by intent (*All Items*, *Offers*, *Needs*) and category.
   - Direct match discovery shortcut on every card.

3. **AI Solution Lab** (`/analyzer`):
   - Real inference using local **Ollama `qwen2.5:3b`** (with automatic fallback to `qwen2.5:0.5b` if installed).
   - Quick one-click inspiration scenarios (15 office laptops, 35kg packaged bakery surplus, 800L AC condensation, community farm drought).
   - Structured AI response breakdown:
     - **Category & Urgency Classification**
     - **Recommended Repurposing Pathways** with target beneficiaries
     - **Immediate Implementation Checklist**
     - **Safety, Sanitation & Regulatory Guidelines**
   - **1-Click Conversion**: Publish any AI-generated plan directly into a live marketplace listing.

4. **Matches (Smart Matchmaker)** (`/matcher`):
   - **Strict Category Constraints**: Enforces category compatibility as a hard constraint. Laptops are **only** compared against functional electronics requests; surplus packaged food is **only** compared against food pantry requests.
   - Laptops are **never** matched with food or water as a direct rescue match.
   - Compatibility score breakdown (Category Match, Complementary Role, Location Proximity, Shared Specifications).
   - **Cross-Sector Collaborations**: Unrelated cross-category items are segregated into a distinct informational section and never represented as direct matches.
   - **Match Reservation Workflow**: Click *Initiate Match & Reserve* to update statuses and lock in the circular exchange.

---

## 🚀 Windows Setup & Quick Start

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Local Ollama running with `qwen2.5:3b`

### 2. Launching the Platform
You can start both backend and frontend with the 1-click launcher:

```powershell
.\start_app.bat
```

Or run them in separate terminals:
```powershell
# Terminal 1 - Backend:
python backend\app.py
# Runs on http://127.0.0.1:5000

# Terminal 2 - Frontend:
cd frontend
npm run dev
# Opens on http://localhost:5173
```

Open **`http://localhost:5173`** in your browser.

---

## 🧠 What to Do if Ollama is NOT Installed

If Ollama is not installed on your Windows machine:

1. **Download Ollama for Windows**:
   - Visit: [https://ollama.com/download/windows](https://ollama.com/download/windows)
   - Download and run `OllamaSetup.exe`.
2. **Start the Ollama Server**:
   - Open PowerShell and run:
     ```powershell
     ollama serve
     ```
3. **Pull the Model (`qwen2.5:3b`)**:
   - Run:
     ```powershell
     ollama pull qwen2.5:3b
     ```
   *(Note: For laptops with low RAM under 8GB, you can pull `ollama pull qwen2.5:0.5b`; the platform automatically detects and supports it).*

---

## 🧪 Automated Testing

Verify the backend, strict category matching, and Ollama integration anytime:

```powershell
python backend\test_backend.py
```

Expected output:
```text
[1] Testing /api/health...
Status: 200 (Ollama available, model qwen2.5:3b active)
[OK] Health check PASSED

[2] Testing /api/analyze with real local Ollama (qwen2.5:3b)...
Status: 200 in 15.12s
Category: Reusable Electronics
[OK] AI Analysis PASSED with real Ollama qwen2.5:3b!

[3] Testing /api/match...
Direct matches count: 1
Cross-category count: 1
Top direct match: 95% for 'High School STEM Club Needs Laptops'
Cross-category segregated item: 'Community Garden Needs Water Tanks' (Score: 10%)
[OK] Strict category constraint verified! Water tank correctly excluded from direct matches.

ALL TESTS PASSED SUCCESSFULLY!
```

---

## 📁 Repository Structure

```text
ResourceRescueAI/
├── backend/
│   ├── app.py                 # Flask REST API, Ollama qwen2.5:3b caller, strict matcher
│   ├── requirements.txt       # flask, flask-cors, requests
│   └── test_backend.py        # Automated test suite for health, AI, and strict matching
├── frontend/
│   ├── index.html             # HTML5 shell with Google Fonts (Outfit & Plus Jakarta Sans)
│   ├── package.json           # React 19, Vite, Lucide Icons
│   ├── vite.config.js         # Vite configuration with backend proxy
│   └── src/
│       ├── main.jsx           # Entrypoint
│       ├── index.css          # Editorial climate-tech design system (Light Theme)
│       ├── App.jsx            # Tab orchestrator, filters, and state management
│       ├── components/
│       │   ├── Navbar.jsx              # Editorial navigation with truthful status pill
│       │   ├── DashboardStats.jsx      # Impact Dashboard with estimated metrics & CTAs
│       │   ├── ListingCard.jsx         # Compact card with demo badges & compliance notes
│       │   ├── ProblemAnalyzer.jsx     # AI Solution Lab with structured output & skeletons
│       │   ├── MatchExplorer.jsx       # Category-constrained Smart Matchmaker & workflow
│       │   ├── ListingFormModal.jsx    # Accessible resource posting modal
│       │   └── OllamaGuideModal.jsx    # Windows setup & connection test modal
│       └── services/
│           ├── api.js         # API client with matching fallback
│           └── storage.js     # LocalStorage demo data tagged with isDemoData: true
├── start_app.bat              # Combined 1-click Windows launcher
├── run_backend.bat            # Backend-only Windows launcher
├── run_frontend.bat           # Frontend-only Windows launcher
└── README.md                  # Comprehensive documentation
```
