"""
database.py
-----------
Sets up the database connection and session management for the Leave Management System.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback to SQLite if DATABASE_URL not set (for local quick testing)
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./leave_management.db"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},  # Only for SQLite
        echo=True  # Set True to log SQL statements
    )
    logger.info("Using local SQLite database at './leave_management.db'")
else:
    # For PostgreSQL / MySQL / other SQL DBs
    engine = create_engine(DATABASE_URL, echo=True)
    logger.info(f"Using database: {DATABASE_URL}")

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
