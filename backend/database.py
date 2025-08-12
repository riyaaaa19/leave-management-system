"""
database.py
-----------
Sets up the SQLite database connection and session management for the Leave Management System.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite database URL — file located in project root
SQLALCHEMY_DATABASE_URL = "sqlite:///./leave_management.db"

# Create the SQLAlchemy engine with SQLite-specific argument
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # Needed for SQLite with multithreading
)

# SessionLocal class to create session objects for DB operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models to inherit
Base = declarative_base()

def get_db():
    """
    Dependency function for FastAPI routes.
    Creates and yields a DB session, then closes it after request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
