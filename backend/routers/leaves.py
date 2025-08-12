from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session, joinedload
from typing import cast

from backend import models, schemas, database
from backend.routers.auth import get_current_user

router = APIRouter(
    prefix="/leaves",
    tags=["Leaves"]
)

@router.post("/", response_model=schemas.Leave)
async def request_leave(
    request: Request,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    raw = await request.json()
    print("📥 RAW REQUEST BODY:", raw)

    # Convert camelCase keys from frontend to snake_case expected by Pydantic
    leave_data = {
        "leave_type": raw.get("leaveType"),
        "start_date": raw.get("startDate"),
        "end_date": raw.get("endDate"),
        "reason": raw.get("reason")
    }

    # Validate with Pydantic schema
    leave = schemas.LeaveCreate(**leave_data)

    new_leave = models.Leave(**leave.dict(), owner_id=current_user.id)
    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)
    return new_leave

@router.get("/", response_model=list[schemas.Leave])
def get_all_leaves(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    leaves = db.query(models.Leave).options(joinedload(models.Leave.owner)).all()
    return leaves

@router.get("/me", response_model=list[schemas.Leave])
def get_my_leaves(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Leave).filter(models.Leave.owner_id == current_user.id).all()

@router.put("/{leave_id}/status", response_model=schemas.Leave)
def update_leave_status(
    leave_id: int,
    status: str = Query(..., regex="^(approved|rejected)$"),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    leave = db.query(models.Leave).filter(models.Leave.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")

    leave = cast(models.Leave, leave)
    leave.status = status
    db.commit()
    db.refresh(leave)
    return leave
