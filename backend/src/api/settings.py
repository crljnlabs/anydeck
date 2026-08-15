"""HTTP surface for user preferences. No logic here - every route calls a service."""

from __future__ import annotations

from fastapi import APIRouter

from models.settings import Settings, SettingsUpdate
from service import settings as settings_service

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=Settings)
def read_settings() -> Settings:
    return settings_service.get_settings()


@router.patch("", response_model=Settings)
def write_settings(change: SettingsUpdate) -> Settings:
    return settings_service.update_settings(change)
