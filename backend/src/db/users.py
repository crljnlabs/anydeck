"""Users and their settings.

One repository, not two, because they are one unit: a settings row is
meaningless without the user it belongs to, and every settings query starts by
knowing which user is asking. Splitting them would push the join into the
service layer, where it would then be repeated.
"""

from __future__ import annotations

from db.connection import database


def ensure_user(username: str, display_name: str) -> int:
    """Return the id of this user, creating the row on first sight.

    Called on every start rather than at install time: an install is shared,
    and a user who has never opened the app yet has no row.
    """
    with database.cursor() as cursor:
        row = cursor.execute(
            "SELECT id FROM users WHERE username = ?", (username,)
        ).fetchone()
        if row is not None:
            return row["id"]

        cursor.execute(
            "INSERT INTO users (username, display_name) VALUES (?, ?)",
            (username, display_name),
        )
        return cursor.lastrowid


def get_settings(user_id: int) -> dict[str, str]:
    """Every stored preference for a user, as name -> value."""
    with database.cursor() as cursor:
        rows = cursor.execute(
            "SELECT name, value FROM settings WHERE user_id = ?", (user_id,)
        ).fetchall()
        return {row["name"]: row["value"] for row in rows}


def set_settings(user_id: int, values: dict[str, str]) -> None:
    """Write preferences, replacing any that already exist.

    One transaction for the whole batch, so a screen that changes two settings
    at once cannot end up with one of them applied.
    """
    with database.cursor() as cursor:
        cursor.executemany(
            """
            INSERT INTO settings (user_id, name, value) VALUES (?, ?, ?)
            ON CONFLICT (user_id, name) DO UPDATE SET value = excluded.value
            """,
            [(user_id, name, value) for name, value in values.items()],
        )
