"""HTTP surface for user preferences. No logic here - every route calls a service."""

from __future__ import annotations

from fastapi import APIRouter

from models import Settings, SettingsUpdate
from service import get_settings, update_settings

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=Settings)
def read_settings() -> Settings:
    return get_settings()


@router.patch("", response_model=Settings)
def write_settings(change: SettingsUpdate) -> Settings:
    return update_settings(change)
