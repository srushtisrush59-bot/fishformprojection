from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field


class CameraIn(BaseModel):
    name: str
    location: str
    rtspUrl: str = Field(alias="rtspUrl")
    status: str = "Offline"
    zone: Optional[str] = None


class CameraOut(CameraIn):
    id: str


class AlertOut(BaseModel):
    id: str
    type: str
    camera: str
    dateTime: datetime | str
    confidence: Optional[float] = None
    status: str
    snapshot: Optional[str] = None
    description: Optional[str] = None
    source: str = "demo"


class IncidentOut(BaseModel):
    id: str
    eventType: str
    object: str
    camera: str
    dateTime: datetime | str
    confidence: Optional[float] = None
    zone: Optional[str] = None
    snapshot: Optional[str] = None
    details: Optional[str] = None
    source: str = "demo"


class ZoneIn(BaseModel):
    name: str
    cameraId: str
    cameraName: str
    points: list[list[float]]
    enabled: bool = True


class ZoneOut(ZoneIn):
    id: str


class Detection(BaseModel):
    label: str
    confidence: float
    timestamp: str
    bbox: Optional[dict[str, float]] = None
    inZone: bool = False


class StreamRequest(BaseModel):
    rtsp_url: str
    camera_name: Optional[str] = None
    zones: Optional[list[dict[str, Any]]] = None


class StreamResponse(BaseModel):
    status: str
    message: str
    session_id: Optional[str] = None
    source: str = "api"