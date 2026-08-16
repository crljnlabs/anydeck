"""HTTP surface for the login-item setting. No logic here - it calls a service."""

from __future__ import annotations

from fastapi import APIRouter

from models.autostart import Autostart, AutostartUpdate
from service import autostart as autostart_service

router = APIRouter(prefix="/autostart", tags=["autostart"])


@router.get("", response_model=Autostart)
def read_autostart() -> Autostart:
    return Autostart(
        enabled=autostart_service.is_enabled(),
        supported=autostart_service.is_supported(),
    )


@router.put("", response_model=Autostart)
def write_autostart(change: AutostartUpdate) -> Autostart:
    return Autostart(
        enabled=autostart_service.set_enabled(change.enabled),
        supported=autostart_service.is_supported(),
    )
