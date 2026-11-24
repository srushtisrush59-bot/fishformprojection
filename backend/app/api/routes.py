import os
import tempfile
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.schemas.common import StreamRequest
from app.services import store
from app.services.detection import run_yolo_detection
from app.core.config import settings

router = APIRouter()


@router.get('/health')
def health():
    from app.db.session import db_available
    model_ready = False
    model_error = None
    try:
        import ultralytics  # noqa: F401
        import cv2  # noqa: F401
        model_ready = True
    except Exception as e:
        model_error = str(e)
    return {
        "status": "ok",
        "app": settings.app_name,
        "database": {"connected": db_available, "mode": "postgresql" if db_available else "in-memory demo fallback"},
        "detection": {"yolo_opencv_available": model_ready, "model": settings.yolo_model, "note": model_error or "Dependencies importable"},
    }


@router.get('/cameras')
def list_cameras():
    return store.cameras


@router.post('/cameras')
def add_camera(payload: dict):
    cam = {"id": store.new_id('cam'), "status": payload.get('status', 'Offline'), **payload}
    store.cameras.insert(0, cam)
    return cam


@router.delete('/cameras/{camera_id}')
def delete_camera(camera_id: str):
    before = len(store.cameras)
    store.cameras[:] = [c for c in store.cameras if c.get('id') != camera_id]
    if len(store.cameras) == before:
        raise HTTPException(status_code=404, detail='Camera not found')
    return {"ok": True}


@router.get('/alerts')
def list_alerts():
    return store.alerts


@router.post('/alerts/{alert_id}/acknowledge')
def acknowledge_alert(alert_id: str):
    for a in store.alerts:
        if a.get('id') == alert_id:
            a['status'] = 'Acknowledged'
            return a
    raise HTTPException(status_code=404, detail='Alert not found')


@router.post('/alerts/{alert_id}/resolve')
def resolve_alert(alert_id: str):
    for a in store.alerts:
        if a.get('id') == alert_id:
            a['status'] = 'Resolved'
            return a
    raise HTTPException(status_code=404, detail='Alert not found')


@router.get('/incidents')
def list_incidents():
    return store.incidents


@router.get('/zones')
def list_zones():
    return store.zones


@router.post('/zones')
def add_zone(payload: dict):
    zone = {"id": store.new_id('zone'), **payload}
    store.zones.insert(0, zone)
    return zone


@router.post('/detect/upload')
async def detect_upload(file: UploadFile = File(...), camera: str | None = None):
    suffix = os.path.splitext(file.filename or '')[1] or '.bin'
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        try:
            result = run_yolo_detection(tmp_path, zones=store.zones, model_name=settings.yolo_model)
            result['fileName'] = file.filename
            # Generate alert/incident records for detections in zones (actual model-driven events)
            for det in result.get('detections', []):
                if det.get('inZone') and det.get('label') in ('Person', 'Dog', 'Cat', 'Bird', 'Cow', 'Sheep', 'Horse', 'Bear'):
                    conf = round(float(det.get('confidence', 0)) * 100, 2)
                    cam_name = camera or 'Uploaded media'
                    alert = {
                        'id': store.new_id('al'), 'type': 'Unauthorized zone entry', 'camera': cam_name,
                        'dateTime': det.get('timestamp'), 'confidence': conf, 'status': 'Open',
                        'snapshot': 'person-pond1' if det.get('label') == 'Person' else 'dog-pond2',
                        'description': f"{det.get('label')} detected in {det.get('zone','protected zone')} by actual YOLO/OpenCV model.",
                        'source': 'model'
                    }
                    incident = {
                        'id': store.new_id('in'), 'eventType': 'Person intrusion' if det.get('label') == 'Person' else 'Animal intrusion',
                        'object': det.get('label'), 'camera': cam_name, 'dateTime': det.get('timestamp'), 'confidence': conf,
                        'zone': det.get('zone', 'Protected zone'), 'snapshot': alert['snapshot'],
                        'details': f"Actual model output: {det.get('label')} entered protected zone with {conf}% confidence.",
                        'source': 'model'
                    }
                    store.alerts.insert(0, alert)
                    store.incidents.insert(0, incident)
            return result
        except RuntimeError as e:
            # Not faking detections; clearly report model unavailable/error
            return JSONResponse(status_code=503, content={
                'status': 'unavailable',
                'source': 'model_unavailable',
                'message': str(e),
                'fileName': file.filename,
                'detections': [],
            })
        finally:
            try:
                os.unlink(tmp_path)
            except Exception:
                pass
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Failed to process upload: {e}')


@router.post('/detect/stream')
def start_stream_detection(payload: StreamRequest):
    # Integration point: actual RTSP processing requires a running worker/FFmpeg+OpenCV loop and reachable camera.
    # We do not fake live AI detection; we report capability/config state.
    try:
        import cv2  # noqa: F401
        from ultralytics import YOLO  # noqa: F401
        deps_ok = True
    except Exception:
        deps_ok = False
    if not deps_ok:
        raise HTTPException(status_code=503, detail='YOLO/OpenCV dependencies are not installed on backend; cannot start actual live stream detection.')
    session_id = str(uuid.uuid4())
    return {
        'status': 'accepted',
        'source': 'api',
        'session_id': session_id,
        'message': 'Stream detection request accepted. Configure a reachable RTSP source and a stream worker to process frames with YOLO/OpenCV for actual live inference.',
    }