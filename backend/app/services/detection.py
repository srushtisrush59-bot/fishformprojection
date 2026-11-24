import os
import uuid
from datetime import datetime, timezone
from typing import Any

# Supported classes of interest for AquaShield AI fish farm security
PERSON_CLASSES = {"person"}
ANIMAL_CLASSES = {"dog", "cat", "bird", "cow", "sheep", "horse", "bear"}  # dog prioritized

def _now_iso():
    return datetime.now(timezone.utc).isoformat()


def point_in_polygon(x: float, y: float, polygon: list[list[float]]) -> bool:
    # polygon points are [x,y] in percentage space
    inside = False
    n = len(polygon)
    if n < 3:
        return False
    j = n - 1
    for i in range(n):
        xi, yi = polygon[i]
        xj, yj = polygon[j]
        intersect = ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-9) + xi)
        if intersect:
            inside = not inside
        j = i
    return inside


def detection_in_zones(det: dict, zones: list[dict[str, Any]] | None) -> tuple[bool, str | None]:
    if not zones:
        return False, None
    bbox = det.get("bbox") or {}
    cx = bbox.get("x", 0) + bbox.get("w", 0) / 2
    cy = bbox.get("y", 0) + bbox.get("h", 0) / 2
    for zone in zones:
        if not zone.get("enabled", True):
            continue
        pts = zone.get("points") or []
        if point_in_polygon(cx, cy, pts):
            return True, zone.get("name")
    return False, None


def run_yolo_detection(file_path: str, zones: list[dict[str, Any]] | None = None, model_name: str = "yolov8n.pt") -> dict[str, Any]:
    """Run actual YOLO/OpenCV detection. Raises RuntimeError with clear message if unavailable."""
    try:
        import cv2  # type: ignore
        from ultralytics import YOLO  # type: ignore
    except Exception as e:
        raise RuntimeError(f"YOLO/OpenCV dependencies not available: {e}. Install ultralytics and opencv-python.")

    if not os.path.exists(file_path):
        raise RuntimeError("Uploaded file not found.")

    try:
        model = YOLO(model_name)
    except Exception as e:
        raise RuntimeError(f"Failed to load YOLO model '{model_name}': {e}")

    ext = os.path.splitext(file_path)[1].lower()
    is_video = ext in {".mp4", ".avi", ".mov", ".mkv", ".webm"}
    detections: list[dict[str, Any]] = []
    processed_frames = 0

    def collect(result, frame_idx=None):
        nonlocal detections
        h, w = result.orig_shape[:2]
        names = result.names or {}
        for box in getattr(result, "boxes", []) or []:
            cls_id = int(box.cls[0]) if box.cls is not None else -1
            label = names.get(cls_id, str(cls_id))
            conf = float(box.conf[0]) if box.conf is not None else 0.0
            if label not in PERSON_CLASSES and label not in ANIMAL_CLASSES:
                continue
            x1, y1, x2, y2 = [float(v) for v in box.xyxy[0].tolist()]
            det = {
                "label": "Person" if label == "person" else label.capitalize(),
                "confidence": round(conf, 4),
                "timestamp": _now_iso(),
                "frame": frame_idx,
                "bbox": {
                    "x": round((x1 / w) * 100, 2),
                    "y": round((y1 / h) * 100, 2),
                    "w": round(((x2 - x1) / w) * 100, 2),
                    "h": round(((y2 - y1) / h) * 100, 2),
                },
            }
            in_zone, zone_name = detection_in_zones(det, zones)
            det["inZone"] = in_zone
            if zone_name:
                det["zone"] = zone_name
            detections.append(det)

    if is_video:
        cap = cv2.VideoCapture(file_path)
        if not cap.isOpened():
            raise RuntimeError("Unable to open uploaded video file.")
        frame_idx = 0
        sample_every = 10
        max_frames = 120
        while cap.isOpened() and processed_frames < max_frames:
            ok, frame = cap.read()
            if not ok:
                break
            if frame_idx % sample_every == 0:
                results = model.predict(frame, verbose=False)
                for r in results:
                    collect(r, frame_idx=frame_idx)
                processed_frames += 1
            frame_idx += 1
        cap.release()
    else:
        img = cv2.imread(file_path)
        if img is None:
            raise RuntimeError("Unable to read uploaded image file.")
        results = model.predict(img, verbose=False)
        for r in results:
            collect(r, frame_idx=0)
        processed_frames = 1

    # dedupe-ish summary by keeping best confidences, but retain list for UI
    detections_sorted = sorted(detections, key=lambda d: d.get("confidence", 0), reverse=True)
    return {
        "status": "ok",
        "source": "model",
        "message": "Actual YOLO/OpenCV model output.",
        "processedFrames": processed_frames,
        "detections": detections_sorted[:50],
        "counts": {
            "people": sum(1 for d in detections if d.get("label") == "Person"),
            "animals": sum(1 for d in detections if d.get("label") != "Person"),
        },
    }