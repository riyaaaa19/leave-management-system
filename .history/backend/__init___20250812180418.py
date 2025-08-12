"""
Backend package initializer.

This file makes 'backend' a Python package and also exposes
the FastAPI application instance so it can be imported directly.

Example usage:
    from backend import app
"""

from fastapi import FastAPI

# Create a FastAPI instance
app = FastAPI(
    title="Leave Management System API",
    description="Backend API for managing employee leaves with Admin and Employee functionality",
    version="1.0.0"
)

# Root endpoint for testing
@app.get("/")
def read_root():
    """
    Root endpoint to verify that the API is running.
    Returns a simple welcome message.
    """
    return {"message": "Welcome to the Leave Management System API"}

# You can import and include routers here when you create them.
# Example:
# from .routes import leave_routes, auth_routes
# app.include_router(leave_routes.router)
# app.include_router(auth_routes.router)
