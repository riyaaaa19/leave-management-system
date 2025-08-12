# backend/create_admin.py

"""
Script to create an initial admin user in the database.

Run this once to create the admin with your chosen credentials.
Make sure your backend is properly configured and the database
tables are created before running this script.

Usage:
    python -m backend.create_admin
"""

from backend.models import User
from backend.database import get_db
from backend.routers.auth import get_password_hash
from sqlalchemy.orm import Session

def create_admin():
    """
    Creates an admin user with preset email, username, and password.

    Uses the get_db dependency generator to get a DB session,
    checks if admin already exists to avoid duplicates,
    and adds the admin user if not found.
    """
    # Create a database session instance
    db_gen = get_db()
    db: Session = next(db_gen)

    # Define admin credentials here (change as needed)
    admin_email = "admin@example.com"
    admin_username = "admin"
    admin_password = "Admin@123"  # Change this to a secure password before production

    # Check if an admin user with this email already exists
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    if existing_admin:
        print(f"Admin user with email '{admin_email}' already exists.")
        return

    # Hash the admin password securely
    hashed_password = get_password_hash(admin_password)

    # Create the admin user object
    admin_user = User(
        username=admin_username,
        email=admin_email,
        hashed_password=hashed_password,
        role="admin"  # Role is set to admin
    )

    # Add and commit the new admin user to the database
    db.add(admin_user)
    db.commit()

    print(f"Admin user created successfully!")
    print(f"Email: {admin_email}")
    print(f"Username: {admin_username}")
    print(f"Password: {admin_password}")  # For your reference — change it ASAP!

if __name__ == "__main__":
    create_admin()
