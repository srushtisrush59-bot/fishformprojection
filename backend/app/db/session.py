from contextlib import contextmanager
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

Base = declarative_base()
engine = None
SessionLocal = None
db_available = False


def init_db():
    global engine, SessionLocal, db_available
    try:
        engine = create_engine(settings.database_url, pool_pre_ping=True, future=True)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
        db_available = True
        import app.models.entities  # noqa: F401
        Base.metadata.create_all(bind=engine)
    except Exception:
        engine = None
        SessionLocal = None
        db_available = False
    return db_available


def get_db():
    if not db_available or SessionLocal is None:
        raise RuntimeError("Database not available")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()