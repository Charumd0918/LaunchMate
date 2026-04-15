# LaunchMate 🚀

LaunchMate is a professional-grade startup intelligence platform. It transforms raw startup ideas into investor-ready blueprints using advanced AI simulation, high-fidelity data visualization, and an immersive "Mission Control" UI.

## 🌟 Premium Features
- **Mission Control Dashboard**: A unique, bento-grid interface with floating glass navigation for a bespoke strategist experience.
- **Success Radar (Radar Analysis)**: 5-pillar visualization of Market, Tech, Revenue, Risk, and Timing using Recharts.
- **AI Expert Verdicts**: Layered feedback from three personas: Silicon Valley VC, Technical Architect, and Growth Hacker.
- **High-Fidelity PDF Export**: Professional dark-themed 12-section blueprint with page-break precision and zero-margin layout.
- **Cash Runway Projections**: Interactive 12-month burn curve and sustainability analysis.
- **Interactive Roadmap**: Kanban-style execution board and daily strategy tracer with AI re-alignment.

## 🛠️ Tech Stack
-   **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Recharts, Lucide Icons, html2pdf.js
-   **Backend:** FastAPI (Python), Google Gemini AI, Motor (MongoDB Driver), Bcrypt, PyJWT
-   **Database:** MongoDB

---

## 🚀 How to Run Locally

### 1. Backend Setup
1. `cd backend`
2. `python -m venv venv`
3. Activate venv (`venv\Scripts\activate` on Windows, `source venv/bin/activate` on Mac)
4. `pip install -r requirements.txt`
5. Create `.env`:
   ```ini
   MONGO_URI=your_mongodb_uri
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your_secret_key
   GEMINI_API_KEY=your_gemini_key
   ```
6. `uvicorn main:app --reload`

### 2. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env`:
   ```ini
   VITE_API_URL=http://localhost:8000/api
   ```
4. `npm run dev`

---

## 🏆 Exhibition Ready
This platform is optimized for live demonstrations, featuring smooth transitions, real-time AI processing, and a high-end "War Room" aesthetic.
