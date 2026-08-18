"""HTTP surface for the current user. No logic here - every route calls a service."""

from __future__ import annotations

from fastapi import APIRouter

from api.dependencies import Tracked
from models import User
from service import current_user

router = APIRouter(prefix="/user", tags=["user"])


@router.get("", response_model=User)
def read_current_user(tracking: Tracked) -> User:
    return current_user(tracking)
