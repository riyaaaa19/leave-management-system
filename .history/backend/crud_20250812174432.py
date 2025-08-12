# backend/crud.py
"""
crud.py
-------
CRUD operations for interacting with database models.
"""

from sqlalchemy.orm import Session
from backend import models, schemas  # ✅ fixed import
from typing import Optional, cast, List

# =====================================================
# USER CRUD FUNCTIONS
# =====================================================
def create_user(db: Session, user: schemas.UserCreate, hashed_password: str) -> models.User:
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()

# =====================================================
# LEAVE CRUD FUNCTIONS
# =====================================================
def create_leave(db: Session, leave: schemas.LeaveCreate, user_id: int) -> models.Leave:
    db_leave = models.Leave(**leave.dict(), owner_id=user_id)
    db.add(db_leave)
    db.commit()
    db.refresh(db_leave)
    return db_leave


def get_user_leaves(db: Session, user_id: int) -> List[models.Leave]:
    return db.query(models.Leave).filter(models.Leave.owner_id == user_id).all()

def approve_leave(db: Session, leave_id: int) -> Optional[models.Leave]:
    leave = db.query(models.Leave).filter(models.Leave.id == leave_id).first()
    if leave:
        leave = cast(models.Leave, leave)
        leave.status = "approved"
        db.commit()
        db.refresh(leave)
    return leave

def reject_leave(db: Session, leave_id: int) -> Optional[models.Leave]:
    leave = db.query(models.Leave).filter(models.Leave.id == leave_id).first()
    if leave:
        leave = cast(models.Leave, leave)
        leave.status = "rejected"
        db.commit()
        db.refresh(leave)
    return leave
