"""HTTP surface for the login-item setting. No logic here - it calls a service."""

from __future__ import annotations

from fastapi import APIRouter

from api.dependencies import Tracked
from models import Autostart, AutostartUpdate
from service import get_autostart, set_autostart

router = APIRouter(prefix="/autostart", tags=["autostart"])


@router.get("", response_model=Autostart)
def read_autostart(tracking: Tracked) -> Autostart:
    return get_autostart(tracking)


@router.put("", response_model=Autostart)
def write_autostart(change: AutostartUpdate, tracking: Tracked) -> Autostart:
    return set_autostart(tracking, change)
