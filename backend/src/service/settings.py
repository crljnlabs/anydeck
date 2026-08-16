"""Business logic for user preferences.

Settings are stored per user as name/value rows, so adding a preference later
is an INSERT rather than a migration. The typed model lives here: the database
holds strings, and this is where they become a validated `Settings` object, so
a value written by an older version cannot crash the interface.
"""

from __future__ import annotations

from db import users as users_repository
from models.settings import Settings, SettingsUpdate
from service.user import ensure_current_user


def get_settings() -> Settings:
    stored = users_repository.get_settings(ensure_current_user())

    # Defaults come from the model, and anything unrecognised is dropped: a key
    # left over from an older version, or a value that is no longer valid,
    # should fall back rather than take the settings screen down.
    known = {
        name: value for name, value in stored.items() if name in Settings.model_fields
    }
    try:
        return Settings(**known)
    except ValueError:
        return Settings()


def update_settings(change: SettingsUpdate) -> Settings:
    """Apply only the fields that were sent, leave the rest alone."""
    values = change.model_dump(exclude_none=True)
    if values:
        users_repository.set_settings(
            ensure_current_user(), {name: str(value) for name, value in values.items()}
        )
    return get_settings()
