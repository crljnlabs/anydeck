"""Table definitions and migrations.

Centrally, not per repository, for three reasons: order matters (a foreign key
needs its target table first), it has to happen exactly once before anything
queries rather than at whichever repository is used first, and a column added
later needs a record of what has already been applied.

`PRAGMA user_version` is that record - an integer SQLite stores in the database
file itself. Each migration below is applied once, in order, and the version is
bumped. Never edit a migration that has shipped; add the next one.
"""

from __future__ import annotations

from db.connection import database

# Each entry is one step. The index is the version it produces, so MIGRATIONS[0]
# takes a fresh database from version 0 to version 1.
MIGRATIONS: list[str] = [
    # 1: users and their settings.
    """
    CREATE TABLE users (
        id            INTEGER PRIMARY KEY,
        username      TEXT NOT NULL UNIQUE,
        display_name  TEXT NOT NULL,
        created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Settings are per user and open-ended: one row per key, rather than one
    -- column per setting. A new preference is then an INSERT rather than a
    -- migration, which matters because settings are exactly the kind of thing
    -- that keeps growing.
    CREATE TABLE settings (
        user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name     TEXT NOT NULL,
        value    TEXT NOT NULL,
        PRIMARY KEY (user_id, name)
    );
    """,
]


def migrate() -> int:
    """Apply every migration the database has not seen. Returns the new version.

    Safe to call on every start: a database already at the newest version does
    nothing but one PRAGMA read.
    """
    with database.cursor() as cursor:
        version = cursor.execute("PRAGMA user_version").fetchone()[0]

        for index in range(version, len(MIGRATIONS)):
            cursor.executescript(MIGRATIONS[index])
            # PRAGMA does not take a bound parameter, and the value is an int
            # from range(), not from anything a user typed.
            cursor.execute(f"PRAGMA user_version = {index + 1}")

        return len(MIGRATIONS)


def current_version() -> int:
    with database.cursor() as cursor:
        return cursor.execute("PRAGMA user_version").fetchone()[0]
