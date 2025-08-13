from pydantic import BaseModel, EmailStr
from datetime import date

# ==============================
# USER SCHEMAS
# ==============================
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: str = "employee"

    model_config = {
        "from_attributes": True
    }

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ==============================
# LEAVE SCHEMAS
# ==============================
class LeaveBase(BaseModel):
    leave_type: str
    start_date: date
    end_date: date
    reason: str

class LeaveCreate(LeaveBase):
    pass

class LeaveUser(BaseModel):
    id: int
    username: str

    model_config = {
        "from_attributes": True
    }

class Leave(LeaveBase):
    id: int
    status: str
    owner_id: int
    owner: LeaveUser  # Nested user info

    model_config = {
        "from_attributes": True
    }
