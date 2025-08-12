# backend/models.py
"""
models.py
---------
Defines the database models (tables) for the Leave Management System.
"""

from sqlalchemy import Integer, String, ForeignKey, Date, Text
from sqlalchemy.orm import relationship, Mapped, mapped_column
from backend.database import Base  # ✅ fixed import

# ==============================
# USER TABLE
# ==============================
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[str] = mapped_column(String, default="employee")

    leaves: Mapped[list["Leave"]] = relationship("Leave", back_populates="owner")


# ==============================
# LEAVE REQUEST TABLE
# ==============================
class Leave(Base):
    __tablename__ = "leave_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    leave_type: Mapped[str] = mapped_column(String, nullable=False)  # NEW
    start_date: Mapped[Date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Date] = mapped_column(Date, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String, default="pending")
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    owner: Mapped["User"] = relationship("User", back_populates="leaves")