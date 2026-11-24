import uuid
from datetime import datetime
from copy import deepcopy

# In-memory demo store used when PostgreSQL is unavailable.
cameras = [
    {"id": "cam-1", "name": "Pond 1", "location": "North Pond Perimeter", "rtspUrl": "rtsp://demo.aquashield.local/pond1", "status": "Online", "zone": "Pond 1 Protected Zone"},
    {"id": "cam-2", "name": "Pond 2", "location": "East Pond Walkway", "rtspUrl": "rtsp://demo.aquashield.local/pond2", "status": "Online", "zone": "Pond 2 Protected Zone"},
    {"id": "cam-3", "name": "Storage Area", "location": "Feed & Equipment Storage", "rtspUrl": "rtsp://demo.aquashield.local/storage", "status": "Offline", "zone": "Storage Perimeter"},
    {"id": "cam-4", "name": "Main Entrance", "location": "Farm Gate", "rtspUrl": "rtsp://demo.aquashield.local/entrance", "status": "Online", "zone": "Entrance Watch Zone"},
]

alerts = [
    {"id": "al-1", "type": "Unauthorized zone entry", "camera": "Pond 1", "dateTime": "2026-11-24T20:42:00+05:30", "confidence": 97.0, "status": "Open", "snapshot": "person-pond1", "description": "Person entered Pond 1 protected zone.", "source": "demo"},
    {"id": "al-2", "type": "Person detected near Pond 1", "camera": "Pond 1", "dateTime": "2026-11-24T19:18:00+05:30", "confidence": 94.0, "status": "Acknowledged", "snapshot": "person-pond1", "description": "Person detected close to pond boundary.", "source": "demo"},
    {"id": "al-3", "type": "Dog detected near Pond 2", "camera": "Pond 2", "dateTime": "2026-11-24T17:05:00+05:30", "confidence": 91.0, "status": "Resolved", "snapshot": "dog-pond2", "description": "Dog detected near feeding edge.", "source": "demo"},
]

incidents = [
    {"id": "in-1", "eventType": "Person intrusion", "object": "Person", "camera": "Pond 1", "dateTime": "2026-11-24T20:42:00+05:30", "confidence": 97.0, "zone": "Pond 1 Protected Zone", "snapshot": "person-pond1", "details": "Detected person crossed protected zone boundary; alert generated and operator notified.", "source": "demo"},
    {"id": "in-2", "eventType": "Animal intrusion", "object": "Dog", "camera": "Pond 2", "dateTime": "2026-11-24T17:05:00+05:30", "confidence": 91.0, "zone": "Pond 2 Protected Zone", "snapshot": "dog-pond2", "details": "Dog detected and entered marked protected area.", "source": "demo"},
]

zones = [
    {"id": "zone-1", "name": "Pond 1 Protected Zone", "cameraId": "cam-1", "cameraName": "Pond 1", "points": [[12,18],[58,16],[62,62],[10,66]], "enabled": True},
    {"id": "zone-2", "name": "Pond 2 Protected Zone", "cameraId": "cam-2", "cameraName": "Pond 2", "points": [[20,22],[70,20],[74,70],[18,72]], "enabled": True},
]


def new_id(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:8]}"


def snapshot():
    return {
        "cameras": deepcopy(cameras),
        "alerts": deepcopy(alerts),
        "incidents": deepcopy(incidents),
        "zones": deepcopy(zones),
    }