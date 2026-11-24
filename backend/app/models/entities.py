from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Float, Boolean, Text, JSON
from app.db.session import Base


class Camera(Base):
    __tablename__ = "cameras"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    rtsp_url = Column(String, nullable=False)
    status = Column(String, default="Offline")
    zone = Column(String, nullable=True)


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(String, primary_key=True, index=True)
    type = Column(String, nullable=False)
    camera = Column(String, nullable=False)
    date_time = Column(DateTime, default=datetime.utcnow)
    confidence = Column(Float, nullable=True)
    status = Column(String, default="Open")
    snapshot = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    source = Column(String, default="demo")


class Incident(Base):
    __tablename__ = "incidents"
    id = Column(String, primary_key=True, index=True)
    event_type = Column(String, nullable=False)
    object = Column(String, nullable=False)
    camera = Column(String, nullable=False)
    date_time = Column(DateTime, default=datetime.utcnow)
    confidence = Column(Float, nullable=True)
    zone = Column(String, nullable=True)
    snapshot = Column(String, nullable=True)
    details = Column(Text, nullable=True)
    source = Column(String, default="demo")


class ProtectedZone(Base):
    __tablename__ = "zones"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    camera_id = Column(String, nullable=False)
    camera_name = Column(String, nullable=False)
    points = Column(JSON, nullable=False)
    enabled = Column(Boolean, default=True)