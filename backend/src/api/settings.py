"""HTTP surface for user preferences. No logic here - every route calls a service."""

from __future__ import annotations

from fastapi import APIRouter

from api.dependencies import Tracked
from models import Settings, SettingsUpdate
from service import get_settings, update_settings

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=Settings)
def read_settings(tracking: Tracked) -> Settings:
    return get_settings(tracking)


@router.patch("", response_model=Settings)
def write_settings(change: SettingsUpdate, tracking: Tracked) -> Settings:
    return update_settings(tracking, change)
