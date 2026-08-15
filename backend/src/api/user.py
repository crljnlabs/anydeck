"""HTTP surface for the current user. No logic here - every route calls a service."""

from __future__ import annotations

from fastapi import APIRouter

from models.user import User
from service import user as user_service

router = APIRouter(prefix="/user", tags=["user"])


@router.get("", response_model=User)
def read_current_user() -> User:
    return user_service.current_user()
