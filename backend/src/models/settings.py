"""Data layer: what a settings record looks like."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

Theme = Literal["system", "light", "dark"]
Language = Literal["de", "en"]


class Settings(BaseModel):
    """User-facing preferences. One record per operating-system user."""

    theme: Theme = "system"
    accent: str = Field(default="orange", description="Key of an accent set")
    language: Language = "en"


class SettingsUpdate(BaseModel):
    """A partial change - only the fields the user actually touched."""

    theme: Theme | None = None
    accent: str | None = None
    language: Language | None = None
