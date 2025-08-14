# backend/create_admin.py

from backend.models import User
from backend.database import get_db
from backend.routers.auth import get_password_hash
from sqlalchemy.orm import Session

def create_admin():
    """
    Creates an admin user or updates the password if it already exists.
    """
    db_gen = get_db()
    db: Session = next(db_gen)

    admin_email = "admin@example.com"
    admin_username = "admin"
    admin_password = "Admin@123"  # Change to a secure password before production
    hashed_password = get_password_hash(admin_password)

    existing_admin = db.query(User).filter(User.email == admin_email).first()

    if existing_admin:
        # Update password and role if needed
        existing_admin.hashed_password = hashed_password
        existing_admin.role = "admin"
        db.commit()
        print(f"Admin already exists. Password and role updated for {admin_email}.")
    else:
        # Create new admin
        admin_user = User(
            username=admin_username,
            email=admin_email,
            hashed_password=hashed_password,
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        print(f"Admin created successfully!")
        print(f"Email: {admin_email}")
        print(f"Username: {admin_username}")
        print(f"Password: {admin_password}")

if __name__ == "__main__":
    create_admin()
