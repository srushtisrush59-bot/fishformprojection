# AquaShield AI Backend (FastAPI)

## Stack
- Python + FastAPI
- OpenCV + Ultralytics YOLO (object detection)
- PostgreSQL via SQLAlchemy (with in-memory demo fallback when DB unavailable)

## Setup
1. Create and activate a virtual environment.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment (optional):
   - `DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/aquashield`
   - `YOLO_MODEL=yolov8n.pt` (auto-download by Ultralytics if available)

## Run
```bash
uvicorn app.main:app --reload --port 8000
```

## Notes
- If PostgreSQL is not reachable, the API runs in demo mode using in-memory sample data.
- `/api/detect/upload` performs actual YOLO/OpenCV detection when `ultralytics` and model weights are available; otherwise it returns a clear `model_unavailable` response (not faked detections).
- Live RTSP stream detection endpoint is provided as a backend integration point; actual stream processing requires reachable RTSP sources and runtime resources.