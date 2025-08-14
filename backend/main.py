# backend/main.py

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend import models, database
from backend.routers import users, leaves, auth
from backend.create_admin import create_admin as create_admin_script
from backend.models import User

# Create database tables on startup
models.Base.metadata.create_all(bind=database.engine)

# Initialize FastAPI app
app = FastAPI(
    title="Leave Management System API",
    version="1.0.0",
    description="Backend API for managing employee leave requests with admin approval"
)

# ===== CORS Middleware =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Routers =====
app.include_router(users.router, tags=["Users"])
app.include_router(leaves.router, tags=["Leaves"])
app.include_router(auth.router, tags=["Authentication"])

# ===== Root Endpoint =====
@app.get("/", tags=["Health Check"])
def root():
    return {"message": "Leave Management API is running"}

# ===== SAFE ADMIN SETUP ENDPOINT =====
@app.post("/setup-admin", tags=["Admin Setup"])
def setup_admin(db: Session = Depends(database.get_db)):
    """
    Creates a default admin account ONLY if no admin exists.
    Uses the same function as create_admin.py to avoid code duplication.
    """
    existing_admin = db.query(User).filter(User.role == "admin").first()
    if existing_admin:
        return {"message": "Admin already exists. Nothing to do."}

    create_admin_script()

    return {
        "message": "Admin created successfully using create_admin.py!",
        "login_email": "admin@example.com",
        "login_password": "Admin@123"
    }
