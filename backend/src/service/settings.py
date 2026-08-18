"""Business logic for user preferences.

Settings are stored per user as name/value rows, so adding a preference later
is an INSERT rather than a migration. The typed model lives here: the database
holds strings, and this is where they become a validated `Settings` object, so
a value written by an older version cannot crash the interface.
"""

from __future__ import annotations

from db import users as users_repository
from models import Settings, SettingsUpdate
from service.user import ensure_current_user
from utils import Tracking


def get_settings(tracking: Tracking) -> Settings:
    with tracking.step("get-settings"):
        stored = users_repository.get_settings(ensure_current_user(tracking))

        # Defaults come from the model, and anything unrecognised is dropped: a
        # key left over from an older version, or a value that is no longer
        # valid, should fall back rather than take the settings screen down.
        known = {
            name: value
            for name, value in stored.items()
            if name in Settings.model_fields
        }

        dropped = sorted(set(stored) - set(known))
        if dropped:
            tracking.note(
                "dropped stored settings this version does not know",
                values={"names": dropped},
            )

        try:
            return Settings(**known)
        except ValueError as error:
            # One unusable value means the whole record falls back, so this is
            # worth a warning: the user sees defaults where they set something.
            tracking.note(
                f"stored settings could not be read, using defaults: {error}",
                level="warning",
                values={"stored": known},
            )
            return Settings()


def update_settings(tracking: Tracking, change: SettingsUpdate) -> Settings:
    """Apply only the fields that were sent, leave the rest alone."""
    with tracking.step("update-settings"):
        values = change.model_dump(exclude_none=True)
        if values:
            users_repository.set_settings(
                ensure_current_user(tracking),
                {name: str(value) for name, value in values.items()},
            )
            tracking.track(
                "settings.updated", {"names": sorted(values)}, level="success"
            )
        return get_settings(tracking)
