# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend import models, database
from backend.routers import users, leaves, auth

# Create database tables on startup
models.Base.metadata.create_all(bind=database.engine)

# Initialize FastAPI app
app = FastAPI(title="Leave Management System API", version="1.0.0")

# ===== CORS Middleware =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust for your frontend
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
