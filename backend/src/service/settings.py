"""Business logic for user preferences.

Simulated for now: the values live in memory and reset when the program stops.
Swapping this for the database means replacing the two functions below with
repository calls - the API layer above does not change.
"""

from __future__ import annotations

from models.settings import Settings, SettingsUpdate

# TODO: replace with a settings repository once the schema exists.
_settings = Settings()


def get_settings() -> Settings:
    return _settings


def update_settings(change: SettingsUpdate) -> Settings:
    """Apply only the fields that were sent, leave the rest alone."""
    global _settings
    _settings = _settings.model_copy(update=change.model_dump(exclude_none=True))
    return _settings
