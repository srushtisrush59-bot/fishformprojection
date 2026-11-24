# AquaShield AI – Smart Fish Farm Security Platform

**Tagline:** Smart Monitoring. Safer Fish Farms.

AquaShield AI is a complete demo web application for AI-powered fish farm security and animal intrusion detection. It includes a premium React frontend and a FastAPI backend scaffold/integration for OpenCV + YOLO-based detection workflows.

> **Design reference note:** The requested Pinterest reference (`https://pin.it/5GqWkDT6y`) could not be accessed from this environment, so the UI was not copied from that exact pin. Instead, this build uses an original premium aquaculture/security visual direction (oceanic dark theme, teal/cyan accents, glass cards, responsive layouts, and polished navigation). **If you want the UI refined to match the Pinterest reference precisely, please share a screenshot of the pin and I can adapt the design system, layout, and styling to it.**

## Project structure

```text
C:\fishform
├─ frontend/   # React + Vite + Tailwind CSS + Lucide + Recharts + Framer Motion
├─ backend/    # FastAPI + OpenCV + YOLO integration + PostgreSQL config/models
└─ README.md
```

## Features implemented

### Frontend pages (all navigable)
- **Landing Page**: hero with fish-farm imagery, AquaShield branding, CTA buttons, feature cards, modern footer.
- **Login / Logout**: functional demo authentication (client-side simulated login, clearly labeled).
- **Dashboard**: total/active cameras, detected people, animal intrusions, today's alerts, recent incidents, weekly/monthly analytics charts, camera connection status.
- **Live CCTV Monitoring**: multiple camera cards (Pond 1, Pond 2, Storage Area, Main Entrance), online/offline status, live video area previews, AI detection bounding box overlays, labels/confidence/timestamps.
- **AI Detection System**: video/image upload for testing, run detection workflow, detection labels/confidence/timestamps, RTSP stream configuration/start action. **Clearly distinguishes simulated demo output from actual model output.**
- **Protected Zone Management**: camera frame zone-selection interface (click-to-draw polygon), multiple zones, save/enable/disable/remove, simulate zone-entry event generation.
- **Alerts & Notifications**: alert cards with type/camera/date-time/confidence/snapshot/acknowledge/resolve and filtering.
- **Incident History**: searchable/filterable table (date/camera/event type), incident detail modal with snapshots, CSV export.
- **Camera Management**: add/remove/configure cameras, RTSP URLs, connection status, test connection (simulated in demo mode unless backend/network integrated).

### Main demonstration workflow (supported in UI)
1. Upload/select a CCTV video (or image) in **AI Detection**.
2. Run AI object detection.
3. Detect a person or dog (and supported animals).
4. Check protected pond zone entry (zone configuration + event generation flow).
5. Generate a security alert.
6. Save incident with timestamp/snapshot context.
7. View incidents in **Dashboard** and **Incident History**.

## Simulated vs actual (important)
- **Simulated/demo data by default:** camera feeds/previews, some connection tests/status toggles, detection overlay previews, and fallback detection results when backend/model is unavailable. These are labeled in the UI.
- **Actual model output (when connected):** Backend `/api/detect/upload` runs **OpenCV + Ultralytics YOLO** on uploaded media if dependencies/models are available and returns detections with `source: "model"`. The frontend displays this as "Actual model output".
- **No fake live AI detection:** Live RTSP detection requires a configured FastAPI backend, OpenCV/YOLO runtime, and reachable RTSP streams. If unavailable, the UI/API reports that clearly instead of faking live inference.
- **Database:** Backend is configured for **PostgreSQL** (SQLAlchemy) and falls back to in-memory demo storage if the database is unavailable.

## Tech stack
- **Frontend:** React.js, Tailwind CSS, Lucide React, Recharts, Framer Motion, Vite
- **Backend:** Python, FastAPI, OpenCV, YOLO (Ultralytics)
- **Database:** PostgreSQL

## Running the frontend
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL (typically `http://localhost:5173`).

Build for production:
```bash
npm run build
npm run preview
```

## Running the backend
> Python must be installed on the machine where you run the backend.

```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Optional `.env` (backend):
```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/aquashield
YOLO_MODEL=yolov8n.pt
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

API docs: `http://localhost:8000/docs`

## Frontend ↔ backend integration
- Vite dev server proxies `/api` to `http://localhost:8000` (see `frontend/vite.config.js`).
- The frontend attempts backend calls where applicable and gracefully falls back to demo behavior with clear labeling when unavailable.

## Notes
- Logo combines aquatic (fish) and security/AI (shield) elements in the UI and favicon.
- Sample fish-farm/camera imagery uses royalty-free Unsplash photos for realistic demonstration visuals.
- This environment did not have a runnable Python interpreter available, so backend runtime could not be executed here; backend source is fully implemented and ready to run in a Python environment.
